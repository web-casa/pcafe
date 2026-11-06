import { existsSync, realpathSync, renameSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import { deckStyle, filterStyleFonts } from './src/engine/style-fonts'
import { emoji } from './vite.emoji.mjs'
import { proVirtual } from './vite.pro'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Third-party packages import the engine as 'pcafe'. Deep Pro imports resolve
// inside the project so an installed @pcafe/pro works without an extra config.
const proRoot = resolve('node_modules/@pcafe/pro')
// npm installs a `file:` dependency as a symlink, and Vite resolves the real
// path, so the dev server must allow that path too or Pro fonts and styles 403.
const proRealRoot = existsSync(proRoot) ? realpathSync(proRoot) : proRoot
export const engineResolve = {
  alias: [
    { find: /^pcafe$/, replacement: resolve(import.meta.dirname, 'src/engine/public.ts') },
    { find: /^@pcafe\/pro$/, replacement: resolve(proRoot, 'src/index.ts') },
    { find: /^@pcafe\/pro\/(.*)$/, replacement: `${proRoot}/$1` },
  ],
  dedupe: ['react', 'react-dom', 'motion'],
}

// `120u` in CSS becomes calc(120 * var(--u)). 1u is one pixel of the 1920×1080
// design canvas; Stage sets --u from the viewport, so nothing is ever scaled
// with a CSS transform (which would break shared-layout measurements).
export const designUnit = {
  postcssPlugin: 'design-unit',
  Declaration(decl: { value: string }) {
    if (!/\du\b/.test(decl.value)) return
    decl.value = decl.value.replace(
      /(^|[\s(,/*+])(-?\d*\.?\d+)u\b/g,
      (_m, lead: string, n: string) => `${lead}calc(${n} * var(--u))`,
    )
  },
}

// The deck must open from file:// with no network at all.
export const forbidRemote = (): Plugin => ({
  name: 'forbid-remote-urls',
  enforce: 'post',
  generateBundle(_opts, bundle) {
    for (const file of Object.values(bundle)) {
      const text = file.type === 'chunk' ? file.code : String(file.source)
      const hit = text.match(/(?:src|href)=["']https?:\/\/|@import\s+url\(["']?https?:|fonts\.googleapis/)
      if (hit) this.error(`${file.fileName} references a remote resource: ${hit[0]}`)
    }
  },
})

// Ported styles bring their own display faces. A deck build keeps only the faces
// tagged with the style that deck uses, so each file carries one style's fonts.
// When the style cannot be read, keep every face and warn: never prune silently.
export const styleFonts = (): Plugin => {
  let pending: Promise<string | undefined> | undefined
  let warned = false
  return {
    name: 'style-fonts',
    apply: 'build',
    async transform(code, id) {
      if (!id.endsWith('/style-fonts.css')) return
      pending ??= deckStyle(process.cwd(), engineResolve)
      const style = await pending
      if (!style) {
        if (!warned) {
          warned = true
          this.warn('style-fonts: could not read DeckDef.style from src/decks/active.ts; keeping every style font.')
        }
        return
      }
      return filterStyleFonts(code, style)
    },
  }
}

/** Vite names the output after the input HTML; the deck must be dist/index.html. */
const presentationOutput = (): Plugin => ({
  name: 'presentation-output',
  apply: 'build',
  closeBundle() {
    const from = resolve('dist', 'presentation.html')
    if (existsSync(from)) renameSync(from, resolve('dist', 'index.html'))
  },
})

export default defineConfig({
  plugins: [styleFonts(), proVirtual(), ...emoji(), viteSingleFile({ removeViteModuleLoader: true }), forbidRemote(), presentationOutput()],
  css: { postcss: { plugins: [designUnit] } },
  resolve: engineResolve,
  server: { fs: { allow: [...new Set([process.cwd(), proRoot, proRealRoot])] } },
  build: {
    target: 'es2022',
    cssCodeSplit: false,
    assetsInlineLimit: () => true,
    reportCompressedSize: false,
    rollupOptions: { input: 'presentation.html' },
  },
})
