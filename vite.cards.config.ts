import { proVirtual } from './vite.pro'
import { defineConfig, type Plugin } from 'vite'
import { emoji } from './vite.emoji.mjs'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { designUnit, engineResolve, forbidRemote } from './vite.config'

// Social cards: one offline HTML gallery per set. CARDSET picks the set at build time, so two
// builds can run side by side without rewriting active.ts. CARDS_OUT keeps their output apart.
const selectSet = (name: string | undefined): Plugin => ({
  name: 'select-cardset',
  enforce: 'pre',
  load(id) {
    if (name && id.split('?')[0].endsWith('src/cardsets/active.ts')) return `export { set } from './${name}'\n`
  },
})

export default defineConfig({
  plugins: [proVirtual(), selectSet(process.env.CARDSET), ...emoji(), viteSingleFile({ removeViteModuleLoader: true }), forbidRemote()],
  css: { postcss: { plugins: [designUnit] } },
  resolve: engineResolve,
  build: {
    outDir: process.env.CARDS_OUT ?? 'dist/cards/_build',
    emptyOutDir: false,
    target: 'es2022',
    cssCodeSplit: false,
    assetsInlineLimit: () => true,
    reportCompressedSize: false,
    rollupOptions: { input: 'cards.html' },
  },
})
