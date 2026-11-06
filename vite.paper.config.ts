import { proVirtual } from './vite.pro'
import { defineConfig } from 'vite'
import { emoji } from './vite.emoji.mjs'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { designUnit, engineResolve, forbidRemote } from './vite.config'

// Reports and résumés: one offline HTML file, like a deck.
export default defineConfig({
  plugins: [proVirtual(), ...emoji(), viteSingleFile({ removeViteModuleLoader: true }), forbidRemote()],
  css: { postcss: { plugins: [designUnit] } },
  resolve: engineResolve,
  build: {
    outDir: 'dist/paper',
    target: 'es2022',
    cssCodeSplit: false,
    assetsInlineLimit: () => true,
    reportCompressedSize: false,
    rollupOptions: { input: 'paper.html' },
  },
})
