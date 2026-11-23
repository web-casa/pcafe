// Shared Vite SSR session for a single presentation build.
// Lets `style-fonts` and `deckOutline` reuse one Vite SSR server and one
// `proVirtual` instance instead of booting two servers per build, while keeping
// independent error boundaries and lazy outline loading.
import { createServer, type Plugin, type ResolveOptions, type ViteDevServer } from 'vite'
import type { Outline } from './outline'

const emojiStub: Plugin = {
  name: 'pcafe-ssr-emoji-stub',
  resolveId(id) {
    return id === 'virtual:emoji-table' ? '\0virtual:emoji-table' : null
  },
  load(id) {
    return id === '\0virtual:emoji-table' ? 'export default \'{"fluent":{},"flat":{},"noto":{}}\'' : null
  },
}

export interface DeckSsrSession {
  setRoot(root: string): void
  getStyle(): Promise<string | undefined>
  getOutline(): Promise<Outline>
  close(): Promise<void>
}

export function createDeckSsrSession(resolve: ResolveOptions = {}, plugins: Plugin[] = []): DeckSsrSession {
  let root = process.cwd()
  let serverPromise: Promise<ViteDevServer> | null = null
  let stylePromise: Promise<string | undefined> | null = null
  let outlinePromise: Promise<Outline> | null = null

  const getServer = () => {
    serverPromise ??= createServer({
      root,
      configFile: false,
      logLevel: 'silent',
      appType: 'custom',
      plugins: [emojiStub, ...plugins],
      resolve,
      // @pcafe/pro ships CSS imports beside its JS; Node cannot load those, Vite can.
      ssr: { noExternal: ['@pcafe/pro'] },
      server: { middlewareMode: true, hmr: false, ws: false },
      optimizeDeps: { noDiscovery: true, include: [] },
    })
    return serverPromise
  }

  return {
    setRoot(nextRoot: string) {
      if (nextRoot && !serverPromise) root = nextRoot
    },
    getStyle() {
      stylePromise ??= (async () => {
        try {
          const server = await getServer()
          const mod = (await server.ssrLoadModule('/src/decks/active.ts')) as { deck?: { style?: unknown } }
          if (!mod.deck) return undefined
          return typeof mod.deck.style === 'string' ? mod.deck.style : 'standard'
        } catch {
          return undefined
        }
      })()
      return stylePromise
    },
    getOutline() {
      outlinePromise ??= (async () => {
        const server = await getServer()
        const mod = (await server.ssrLoadModule('/src/engine/outline.tsx')) as typeof import('./outline')
        return mod.activeOutline()
      })()
      return outlinePromise
    },
    async close() {
      const pending = serverPromise
      serverPromise = null
      stylePromise = null
      outlinePromise = null
      if (pending) {
        try {
          const server = await pending
          await server.close()
        } catch {
          /* ignore close errors */
        }
      }
    },
  }
}
