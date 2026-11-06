import { createServer, type Plugin, type ResolveOptions } from 'vite'

/** Keep only @font-face blocks tagged with the deck's style. */
export const filterStyleFonts = (css: string, style: string): string =>
  css.replace(/\/\* styles: ([^*]+) \*\/\s*@font-face \{[^}]*\}/g, (block, tags: string) =>
    tags.trim().split(/\s+/).includes(style) ? block : '')

/** The deck imports the emoji module for its templates; rendering never runs here. */
const emojiStub: Plugin = {
  name: 'style-fonts-emoji-stub',
  resolveId(id) {
    return id === 'virtual:emoji-table' ? '\0virtual:emoji-table' : null
  },
  load(id) {
    return id === '\0virtual:emoji-table' ? 'export default \'{"fluent":{},"flat":{},"noto":{}}\'' : null
  },
}

/**
 * Load the active deck through Vite's SSR pipeline and read the style it
 * actually sets. This also works when active.ts re-exports a deck from a
 * package, where a source regex cannot follow the import.
 */
export async function deckStyle(root: string, resolveOptions: ResolveOptions = {}): Promise<string | undefined> {
  const server = await createServer({
    root,
    configFile: false,
    logLevel: 'silent',
    appType: 'custom',
    plugins: [emojiStub],
    resolve: resolveOptions,
    server: { middlewareMode: true, hmr: false },
  })
  try {
    const mod = (await server.ssrLoadModule('/src/decks/active.ts')) as { deck?: { style?: unknown } }
    if (!mod.deck) return undefined
    // Deck renders with DEFAULT_STYLE when style is omitted; match that here.
    return typeof mod.deck.style === 'string' ? mod.deck.style : 'standard'
  } catch {
    return undefined
  } finally {
    await server.close()
  }
}
