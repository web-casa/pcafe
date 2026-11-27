// Plain JavaScript on purpose: this file is published as the `pcafe/vite`
// export, and Node refuses to strip TypeScript types inside node_modules, so a
// consumer's vite.config could not load a .ts file. Types live in
// vite.emoji.d.ts. The engine's own configs import this file too.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { gunzipSync } from 'node:zlib'
import react from '@vitejs/plugin-react'

export { designUnit } from './vite.unit.mjs'

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

function isBase64CharCode(c) {
  return (
    (c >= 65 && c <= 90) || // A-Z
    (c >= 97 && c <= 122) || // a-z
    (c >= 48 && c <= 57) || // 0-9
    c === 43 || // +
    c === 47 || // /
    c === 61 // =
  )
}

function isUriBoundaryCharCode(c) {
  return (
    c <= 32 || // whitespace & control
    c === 34 || // "
    c === 39 || // '
    c === 96 || // `
    c === 40 || // (
    c === 41 || // )
    c === 60 || // <
    c === 62 // >
  )
}

/** Case-insensitive ASCII search for `;base64,` starting at `from`, without allocating a lowercased copy. */
function findBase64Marker(code, from) {
  const len = code.length
  let pos = from
  while (pos + 8 <= len) {
    const semi = code.indexOf(';', pos)
    if (semi < 0 || semi + 8 > len) return -1
    if (
      (code.charCodeAt(semi + 1) | 32) === 98 && // b
      (code.charCodeAt(semi + 2) | 32) === 97 && // a
      (code.charCodeAt(semi + 3) | 32) === 115 && // s
      (code.charCodeAt(semi + 4) | 32) === 101 && // e
      code.charCodeAt(semi + 5) === 54 && // 6
      code.charCodeAt(semi + 6) === 52 && // 4
      code.charCodeAt(semi + 7) === 44 // ,
    ) {
      return semi
    }
    pos = semi + 1
  }
  return -1
}

function isBinaryMime(mime) {
  if (!/^[a-z0-9.+-]+\/[a-z0-9.+-]+$/.test(mime)) return false
  if (mime === 'image/svg+xml') return false
  return (
    mime.startsWith('image/') ||
    mime.startsWith('font/') ||
    mime.startsWith('audio/') ||
    mime.startsWith('video/') ||
    mime.startsWith('application/')
  )
}

/**
 * Strip only binary base64 data URIs (fonts, raster images, media) in O(N) time
 * and O(1) stack space before scanning a bundled chunk for emoji. Textual SVG
 * data URIs (`image/svg+xml`) are preserved so inline SVG emoji is still caught.
 */
function stripBinaryBase64Uris(code) {
  const len = code.length
  const out = []
  let keepFrom = 0
  let cursor = 0

  while (cursor < len) {
    const semi = findBase64Marker(code, cursor)
    if (semi < 0) break

    const payloadStart = semi + 8
    let payloadEnd = payloadStart
    while (payloadEnd < len && isBase64CharCode(code.charCodeAt(payloadEnd))) {
      payloadEnd++
    }

    if (payloadEnd - payloadStart >= 64) {
      let tokStart = semi
      while (tokStart > keepFrom && !isUriBoundaryCharCode(code.charCodeAt(tokStart - 1))) {
        tokStart--
      }
      if (tokStart + 5 <= semi && code.slice(tokStart, tokStart + 5).toLowerCase() === 'data:') {
        const header = code.slice(tokStart + 5, semi).toLowerCase()
        const mime = header.split(';')[0].trim()
        if (isBinaryMime(mime)) {
          out.push(code.slice(keepFrom, tokStart))
          keepFrom = payloadEnd
        }
      }
    }

    cursor = payloadEnd
  }

  if (keepFrom === 0) return code
  out.push(code.slice(keepFrom))
  return out.join('')
}

/** Fast scan for RGI emoji in a bundled chunk without running Unicode regex over megabytes of base64 font/image payloads. */
export function scanChunkEmoji(code) {
  const scrubbed = stripBinaryBase64Uris(code)
  if (!/[^\x00-\x7F]/.test(scrubbed)) return []
  return [...new Set(scan(scrubbed))]
}

/** Keeps text inside any template, in every format, drawn by one emoji set on every machine. */
export function emoji({ root } = {}) {
  let dev = false
  let known = []
  const pkgRoot = root ?? import.meta.dirname
  const assets = join(pkgRoot, 'src', 'assets', 'emoji')
  let source = resolve(root ?? process.cwd(), 'src')
  const jsxImportSource = existsSync(join(source, 'emoji')) ? '/src/emoji' : undefined
  const table = {
    name: 'emoji-table',
    configResolved(config) {
      dev = config.command === 'serve'
      if (!root && config.root) source = resolve(config.root, 'src')
    },
    resolveId(id) { return id === VIRTUAL ? `\0${VIRTUAL}` : null },
    load(id) {
      if (id !== `\0${VIRTUAL}`) return null
      if (!dev) return `export default ${JSON.stringify(PLACEHOLDER)}`
      known = existsSync(source) ? [...new Set(sourceFiles(source).flatMap((f) => scan(readFileSync(f, 'utf8'))))] : []
      return `export default ${JSON.stringify(JSON.stringify(tableFor(known, assets)))}`
    },
    renderChunk(code) {
      if (!code.includes(PLACEHOLDER)) return null
      const used = scanChunkEmoji(code)
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
        try {
          const pathOnly = (req.url ?? '').split('?')[0]
          const [, style, hex] = pathOnly.split('/')
          if (style === 'index.json') {
            res.setHeader('content-type', 'application/json')
            res.end(readFileSync(join(assets, 'index.json')))
            return
          }
          if (!STYLES.includes(style) || !hex) {
            res.statusCode = 400
            res.end('')
            return
          }
          const rawHex = hex.endsWith('.svg') ? hex.slice(0, -4) : hex
          if (!/^[0-9a-f]{1,6}(-[0-9a-f]{1,6})*$/i.test(rawHex)) {
            res.statusCode = 400
            res.end('')
            return
          }
          const cps = rawHex.split('-').map((h) => parseInt(h, 16))
          if (cps.some((cp) => !Number.isInteger(cp) || cp < 0 || cp > 0x10ffff)) {
            res.statusCode = 400
            res.end('')
            return
          }
          const char = String.fromCodePoint(...cps)
          const svg = sets(assets)[style]?.[char]
          res.statusCode = svg ? 200 : 404
          res.setHeader('content-type', 'image/svg+xml')
          res.end(svg ?? '')
        } catch {
          res.statusCode = 500
          res.end('')
        }
      })
    },
  }
  return [react(jsxImportSource ? { jsxImportSource } : undefined), table]
}
