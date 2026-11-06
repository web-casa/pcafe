import { existsSync, readdirSync, realpathSync } from 'node:fs'
import { join } from 'node:path'
import type { Plugin } from 'vite'

const VIRTUAL = 'virtual:pcafe-pro'
const RESOLVED = `\0${VIRTUAL}`
const LICENCE = 'virtual:pcafe-licence'
const LICENCE_RESOLVED = `\0${LICENCE}`

/**
 * Exposes an optional @pcafe/pro installation to the gallery. Resolution happens
 * here, in Node, so the browser never probes for packages and nothing imports
 * @pcafe/pro unless the project actually installed it.
 *
 * Expected layout of @pcafe/pro (the engine reads these paths directly):
 *   package.json
 *   src/catalog.ts          exports `proCatalog`
 *   src/index.ts            registers the Pro styles and templates
 *   decks/<name>/index.tsx  one folder per demo deck
 * A package that is installed but does not match that layout is reported once
 * instead of silently emptying #/kit.
 */
export const proVirtual = (): Plugin => {
  let root = process.cwd()
  let warned = false
  const warnLayout = (pkg: string, problem: string) => {
    if (warned) return
    warned = true
    console.warn(
      `[pcafe] @pcafe/pro is installed at ${pkg}, but ${problem}, so #/kit shows no Pro templates. ` +
        'Expected src/catalog.ts (exporting proCatalog), src/index.ts and decks/<name>/index.tsx in that package.',
    )
  }
  return {
    name: 'pcafe-pro-virtual',
    configResolved(config) {
      root = config.root
    },
    resolveId(id) {
      if (id === LICENCE) return LICENCE_RESOLVED
      return id === VIRTUAL ? RESOLVED : null
    },
    load(id) {
      // Only a flag: whether @pcafe/pro is installed. Builds read this instead of
      // virtual:pcafe-pro so they never pull in the Pro demo decks.
      if (id === LICENCE_RESOLVED) return `export const pro = ${existsSync(join(root, 'node_modules', '@pcafe', 'pro', 'package.json'))}\n`
      if (id !== RESOLVED) return null
      const installed = join(root, 'node_modules', '@pcafe', 'pro')
      // npm installs a `file:` dependency as a symlink; read the real package.
      const pkg = existsSync(installed) ? realpathSync(installed) : installed
      if (!existsSync(join(pkg, 'package.json'))) return 'export const proCatalog = []\nexport const proDecks = {}\n'
      if (!existsSync(join(pkg, 'src', 'catalog.ts'))) {
        warnLayout(pkg, 'src/catalog.ts is missing')
        return 'export const proCatalog = []\nexport const proDecks = {}\n'
      }
      const decksDir = join(pkg, 'decks')
      if (!existsSync(decksDir)) warnLayout(pkg, 'the decks/ folder is missing')
      const names = existsSync(decksDir)
        ? readdirSync(decksDir, { withFileTypes: true })
            .filter((entry) => entry.isDirectory() && existsSync(join(decksDir, entry.name, 'index.tsx')))
            .map((entry) => entry.name)
            .sort()
        : []
      const imports = names.map((name, i) => `import { deck as deck${i} } from '@pcafe/pro/decks/${name}'`).join('\n')
      const decks = names.map((name, i) => `${JSON.stringify(name)}: deck${i}`).join(', ')
      return `${imports}\nexport { proCatalog } from '@pcafe/pro/src/catalog'\nexport const proDecks = { ${decks} }\n`
    },
  }
}
