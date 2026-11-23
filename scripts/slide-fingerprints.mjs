// Fast Node-side per-slide static fingerprint probe for `scripts/qa.mjs --changed`.
// Reuses Vite SSR (handling TSX + @pcafe/pro CSS imports on Node 20/22/24).
import { resolve } from 'node:path'
import { createServer } from 'vite'
import { findLiveLicence } from './licence-util.mjs'

const emojiStub = {
  name: 'pcafe-probe-emoji-stub',
  resolveId(id) {
    return id === 'virtual:emoji-table' ? '\0virtual:emoji-table' : null
  },
  load(id) {
    return id === '\0virtual:emoji-table' ? 'export default \'{"fluent":{},"flat":{},"noto":{}}\'' : null
  },
}

function createLicencePlugin(root) {
  return {
    name: 'pcafe-probe-licence',
    resolveId(id) {
      return id === 'virtual:pcafe-licence' ? '\0virtual:pcafe-licence' : null
    },
    load(id) {
      if (id !== '\0virtual:pcafe-licence') return null
      const l = findLiveLicence(root)
      return `export const pro = ${l.ok}\nexport const licenceId = ${JSON.stringify(l.ok ? l.id : null)}\nexport const licenceProblem = ${JSON.stringify(l.problem)}\n`
    },
  }
}

/**
 * Probe the active deck in Node via Vite SSR without booting Chromium.
 * Returns null if SSR fails so QA transparently falls back to browser probing.
 */
export async function probeSlidesInNode(root) {
  const server = await createServer({
    root,
    configFile: false,
    logLevel: 'silent',
    appType: 'custom',
    plugins: [emojiStub, createLicencePlugin(root)],
    resolve: {
      alias: [
        { find: /^pcafe$/, replacement: resolve(root, 'src', 'engine', 'public.ts') },
      ],
      dedupe: ['react', 'react-dom', 'motion'],
    },
    ssr: { noExternal: ['@pcafe/pro'] },
    server: { middlewareMode: true, hmr: false, ws: false },
    optimizeDeps: { noDiscovery: true, include: [] },
  })
  try {
    const mod = await server.ssrLoadModule('/src/engine/slide-probe.tsx')
    return mod.probeActiveDeck()
  } catch {
    return null
  } finally {
    await server.close()
  }
}
