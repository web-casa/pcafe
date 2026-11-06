import { defineConfig } from 'vite'
import { emoji } from './vite.emoji.mjs'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { proVirtual } from './vite.pro'
import { designUnit, engineResolve, forbidRemote, styleFonts } from './vite.config'

// Gallery build: `#/kit` at dist/studio.html, kept beside the deck output.
// styleFonts runs here too so the gallery keeps the same font pruning as before
// the entry split.
export default defineConfig({
  plugins: [styleFonts(), proVirtual(), ...emoji(), viteSingleFile({ removeViteModuleLoader: true }), forbidRemote()],
  css: { postcss: { plugins: [designUnit] } },
  resolve: engineResolve,
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    target: 'es2022',
    cssCodeSplit: false,
    assetsInlineLimit: () => true,
    reportCompressedSize: false,
    rollupOptions: { input: 'studio.html' },
  },
})
