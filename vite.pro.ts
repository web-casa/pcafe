import { existsSync, readFileSync, realpathSync } from 'node:fs'
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
 * @pcafe/pro is a built package. The engine relies only on:
 *   package.json `pcafe.decks`  names of the sample decks
 *   `@pcafe/pro/catalog`        exports `proCatalog`
 *   `@pcafe/pro/decks/<name>`   exports `deck`
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
        'Expected a built package with a `pcafe.decks` list and the `catalog` and `decks/*` exports (run `npm run build` in @pcafe/pro).',
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
      let manifest: { pcafe?: { decks?: unknown }; exports?: Record<string, unknown> }
      try {
        manifest = JSON.parse(readFileSync(join(pkg, 'package.json'), 'utf8'))
      } catch {
        warnLayout(pkg, 'its package.json cannot be read')
        return 'export const proCatalog = []\nexport const proDecks = {}\n'
      }
      if (!manifest.exports?.['./catalog'] || !existsSync(join(pkg, 'dist', 'catalog.js'))) {
        warnLayout(pkg, 'it is not built (no `catalog` export or dist/catalog.js)')
        return 'export const proCatalog = []\nexport const proDecks = {}\n'
      }
      const listed = manifest.pcafe?.decks
      const names = Array.isArray(listed) ? listed.filter((n): n is string => typeof n === 'string' && /^[a-z0-9-]+$/.test(n)).sort() : []
      if (!Array.isArray(listed)) warnLayout(pkg, 'package.json has no `pcafe.decks` list')
      const imports = names.map((name, i) => `import { deck as deck${i} } from '@pcafe/pro/decks/${name}'`).join('\n')
      const decks = names.map((name, i) => `${JSON.stringify(name)}: deck${i}`).join(', ')
      return `${imports}\nexport { proCatalog } from '@pcafe/pro/catalog'\nexport const proDecks = { ${decks} }\n`
    },
  }
}
