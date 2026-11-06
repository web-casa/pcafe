// Plain JavaScript on purpose: this file is published as the `pcafe/vite`
// export, and Node refuses to strip TypeScript types inside node_modules, so a
// consumer's vite.config could not load a .ts file. Types live in
// vite.emoji.d.ts. The engine's own configs import this file too.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { gunzipSync } from 'node:zlib'
import react from '@vitejs/plugin-react'

const VIRTUAL = 'virtual:emoji-table'
const PLACEHOLDER = '__EMOJI_TABLE__'
const STYLES = ['fluent', 'flat', 'noto']
const RGI = /\p{RGI_Emoji}/gv
/** Goes into every build that has emoji: the licences ask for the notice to travel with copies. */
const NOTICE = 'Fluent Emoji (c) Microsoft Corporation, MIT License. Noto Emoji by Google, Apache License 2.0. See THIRD_PARTY_LICENSES.md in PCafe.'

let cache
const sets = (assets) => (cache ??= Object.fromEntries(STYLES.map((s) => [s, JSON.parse(gunzipSync(readFileSync(join(assets, `${s}.json.gz`))).toString())])))

/** Only the emoji a build really uses are embedded, in all three styles. */
function tableFor(chars, assets) {
  const all = sets(assets)
  return Object.fromEntries(STYLES.map((s) => [s, Object.fromEntries([...new Set(chars)].filter((c) => all[s][c]).map((c) => [c, all[s][c]]))]))
}

function sourceFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return name === 'assets' ? [] : sourceFiles(path)
    return /\.(tsx?|json)$/.test(name) ? [path] : []
  })
}
const scan = (text) => text.match(RGI) ?? []

/** Keeps text inside any template, in every format, drawn by one emoji set on every machine. */
export function emoji({ root = import.meta.dirname } = {}) {
  let dev = false
  let known = []
  const assets = join(root, 'src', 'assets', 'emoji')
  const source = resolve(root, 'src')
  const table = {
    name: 'emoji-table',
    configResolved(config) { dev = config.command === 'serve' },
    resolveId(id) { return id === VIRTUAL ? `\0${VIRTUAL}` : null },
    load(id) {
      if (id !== `\0${VIRTUAL}`) return null
      if (!dev) return `export default ${JSON.stringify(PLACEHOLDER)}`
      known = [...new Set(sourceFiles(source).flatMap((f) => scan(readFileSync(f, 'utf8'))))]
      return `export default ${JSON.stringify(JSON.stringify(tableFor(known, assets)))}`
    },
    renderChunk(code) {
      if (!code.includes(PLACEHOLDER)) return null
      const used = [...new Set(scan(code))]
      const unknown = used.filter((c) => !sets(assets).fluent[c])
      if (unknown.length) this.error(`emoji not in the bundled set: ${unknown.join(' ')}. Flags and skin tones are not included; the list is at #/kit/emoji.`)
      const literal = JSON.stringify(JSON.stringify({ notice: NOTICE, ...tableFor(used, assets) }))
      return { code: code.replace(new RegExp(`(["'\`])${PLACEHOLDER}\\1`, 'g'), () => literal), map: null }
    },
    handleHotUpdate({ file, server, read }) {
      if (!file.startsWith(source) || !/\.(tsx?|json)$/.test(file)) return
      return Promise.resolve(read()).then((text) => {
        if (scan(text).every((c) => known.includes(c))) return
        const mod = server.moduleGraph.getModuleById(`\0${VIRTUAL}`)
        if (mod) server.moduleGraph.invalidateModule(mod)
        server.ws.send({ type: 'full-reload' })
      })
    },
    configureServer(server) {
      // The gallery at #/kit/emoji reads the whole set from here. Nothing in a build uses these.
      server.middlewares.use('/@emoji', (req, res) => {
        const [, style, hex] = (req.url ?? '').split('/')
        if (style === 'index.json') {
          res.setHeader('content-type', 'application/json')
          res.end(readFileSync(join(assets, 'index.json')))
          return
        }
        const char = String.fromCodePoint(...(hex ?? '').replace('.svg', '').split('-').map((h) => parseInt(h, 16)))
        const svg = sets()[style]?.[char]
        res.statusCode = svg ? 200 : 404
        res.setHeader('content-type', 'image/svg+xml')
        res.end(svg ?? '')
      })
    },
  }
  return [react({ jsxImportSource: '/src/emoji' }), table]
}
