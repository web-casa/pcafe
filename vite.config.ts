import { existsSync, realpathSync, renameSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import { deckStyle, filterStyleFonts } from './src/engine/style-fonts'
import { deckOutline } from './src/engine/outline-plugin'
import { createDeckSsrSession, type DeckSsrSession } from './src/engine/ssr-session'
import { emoji } from './vite.emoji.mjs'
import { proVirtual } from './vite.pro'
import { designUnit } from './vite.unit.mjs'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Third-party packages import the engine as 'pcafe'. @pcafe/pro is a built
// package and resolves through its own `exports` (no alias).
const proRoot = resolve('node_modules/@pcafe/pro')
// npm installs a `file:` dependency as a symlink, and Vite resolves the real
// path, so the dev server must allow that path too or Pro fonts and styles 403.
const proRealRoot = existsSync(proRoot) ? realpathSync(proRoot) : proRoot
export const engineResolve = {
  alias: [
    { find: /^pcafe$/, replacement: resolve(import.meta.dirname, 'src/engine/public.ts') },
  ],
  dedupe: ['react', 'react-dom', 'motion'],
}

export { designUnit } from './vite.unit.mjs'

// @pcafe/pro imports the engine as 'pcafe'. Pre-bundling it in dev would inline
// a second copy of the engine, so registerStyle() from Pro would fill a registry
// the deck never reads ("unknown style"). Every config that serves Pro uses this.
export const engineOptimizeDeps = { exclude: ['@pcafe/pro'] }

// The deck must open from file:// with no network at all.
export const forbidRemote = (): Plugin => ({
  name: 'forbid-remote-urls',
  enforce: 'post',
  generateBundle(_opts, bundle) {
    for (const file of Object.values(bundle)) {
      // Links (<a href>, rel=canonical) point elsewhere but load nothing; only resources count.
      const text = (file.type === 'chunk' ? file.code : String(file.source)).replace(/<a\s[^>]*>|<link rel="canonical"[^>]*>/g, '')
      const hit = text.match(/(?:src|href)=["']https?:\/\/|@import\s+url\(["']?https?:|fonts\.googleapis/)
      if (hit) this.error(`${file.fileName} references a remote resource: ${hit[0]}`)
    }
  },
})

// Ported styles bring their own display faces. A presentation build keeps only the
// faces tagged with the style that deck uses; Studio builds pass { prune: false }
// so switching across every style in #/kit retains all style faces.
export const styleFonts = (session?: DeckSsrSession, options: { prune?: boolean; strict?: boolean } = {}): Plugin => {
  const { prune = true, strict = false } = options
  let root = process.cwd()
  let pending: Promise<string | undefined> | undefined
  let warned = false
  return {
    name: 'style-fonts',
    apply: 'build',
    configResolved(config) {
      root = config.root
      session?.setRoot(config.root)
    },
    buildStart() {
      pending = undefined
      warned = false
    },
    transform: {
      filter: { id: /style-fonts\.css(?:\?.*)?$/ },
      async handler(code, id) {
        if (!prune) return
        const file = id.split('?')[0].replaceAll('\\', '/')
        if (!file.endsWith('/style-fonts.css')) return
        pending ??= session ? session.getStyle() : deckStyle(root, engineResolve, [proVirtual()])
        const style = await pending
        if (!style) {
          const msg = 'style-fonts: could not read DeckDef.style from src/decks/active.ts.'
          if (strict) this.error(msg)
          if (!warned) {
            warned = true
            this.warn(`${msg} Keeping every style font.`)
          }
          return
        }
        return filterStyleFonts(code, style)
      },
    },
  }
}

/** Vite names the output after the input HTML; the deck must be dist/index.html. */
const presentationOutput = (session?: DeckSsrSession): Plugin => ({
  name: 'presentation-output',
  apply: 'build',
  async buildEnd(err) {
    if (err && session) await session.close()
  },
  async closeBundle() {
    if (session) await session.close()
    const from = resolve('dist', 'presentation.html')
    if (existsSync(from)) renameSync(from, resolve('dist', 'index.html'))
  },
})

export default defineConfig(() => {
  const mainPro = proVirtual()
  const ssrPro = proVirtual()
  const sharedSsr = createDeckSsrSession(engineResolve, [ssrPro])
  return {
    plugins: [styleFonts(sharedSsr, { prune: true, strict: true }), mainPro, ...emoji(), deckOutline(engineResolve, [ssrPro], sharedSsr), viteSingleFile({ removeViteModuleLoader: true }), forbidRemote(), presentationOutput(sharedSsr)],
    css: { postcss: { plugins: [designUnit] } },
    resolve: engineResolve,
    optimizeDeps: engineOptimizeDeps,
    server: { fs: { allow: [...new Set([process.cwd(), proRoot, proRealRoot])] } },
    build: {
      target: 'es2022',
      cssCodeSplit: false,
      assetsInlineLimit: () => true,
      reportCompressedSize: false,
      rollupOptions: { input: 'presentation.html' },
    },
  }
})
