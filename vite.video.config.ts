import { proVirtual } from './vite.pro.ts'
import { defineConfig } from 'vite'
import { emoji } from './vite.emoji.mjs'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { designUnit, engineOptimizeDeps, engineResolve, forbidRemote } from './vite.config.ts'

// Video scenes in one offline HTML file. The renderer opens it from disk, so no dev server,
// HMR socket or network request can touch a frame. Writes only to dist/video/.
export default defineConfig({
  plugins: [proVirtual(), ...emoji(), viteSingleFile({ removeViteModuleLoader: true }), forbidRemote()],
  css: { postcss: { plugins: [designUnit] } },
  resolve: engineResolve,
  optimizeDeps: engineOptimizeDeps,
  build: {
    outDir: 'dist/video',
    emptyOutDir: false,
    target: 'es2022',
    cssCodeSplit: false,
    assetsInlineLimit: () => true,
    reportCompressedSize: false,
    rollupOptions: { input: 'video.html' },
  },
})
