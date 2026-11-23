// Build step: writes the active deck's outline into the built HTML (title,
// description, canonical, link preview, structured data, and the words of every
// slide inside #root). See outline.tsx for what the outline holds. If the deck
// cannot be rendered in Node, the build goes on without it and says so.
import { createServer, type Plugin, type ResolveOptions } from 'vite'
import type { Outline } from './outline'
import type { DeckSsrSession } from './ssr-session'

const emojiStub: Plugin = {
  name: 'pcafe-outline-emoji-stub',
  resolveId(id) {
    return id === 'virtual:emoji-table' ? '\0virtual:emoji-table' : null
  },
  load(id) {
    return id === '\0virtual:emoji-table' ? 'export default \'{"fluent":{},"flat":{},"noto":{}}\'' : null
  },
}

async function loadOutline(root: string, resolve: ResolveOptions, plugins: Plugin[]): Promise<Outline> {
  const server = await createServer({
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
  try {
    const mod = (await server.ssrLoadModule('/src/engine/outline.tsx')) as typeof import('./outline')
    return mod.activeOutline()
  } finally {
    await server.close()
  }
}

/** `plugins`: what the deck needs to load in Node besides emoji (the licence virtual module). */
export const deckOutline = (resolve: ResolveOptions, plugins: Plugin[] = [], session?: DeckSsrSession): Plugin => {
  let root = process.cwd()
  return {
    name: 'pcafe-deck-outline',
    apply: 'build',
    configResolved(config) {
      root = config.root
      session?.setRoot(config.root)
    },
    transformIndexHtml: {
      order: 'post',
      async handler(html) {
        if (process.env.PCAFE_SKIP_OUTLINE === '1') return html
        let o: Outline
        try {
          o = session ? await session.getOutline() : await loadOutline(root, resolve, plugins)
        } catch (e) {
          console.warn(`[pcafe] outline: could not render the deck in Node (${(e as Error).message.split('\n')[0]}); the file is built without the search outline.`)
          return html
        }
        const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
        return html
          .replace(/<html lang="[^"]*">/, `<html lang="${esc(o.lang)}">`)
          .replace(/<title>[^<]*<\/title>/, `<title>${esc(o.title)}</title>\n    ${o.head}`)
          .replace('<div id="root"></div>', () => `<div id="root">${o.body}</div>`)
      },
    },
  }
}
