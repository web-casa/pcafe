import { proVirtual } from './vite.pro'
import { defineConfig } from 'vite'
import { emoji } from './vite.emoji.mjs'
import { designUnit, engineResolve, forbidRemote } from './vite.config'

// Live slides for the website: shared chunks and one chunk per deck, so many
// iframes on a page download the engine once. Not used for deck builds.
export default defineConfig({
  plugins: [proVirtual(), ...emoji(), forbidRemote()],
  css: { postcss: { plugins: [designUnit] } },
  resolve: engineResolve,
  base: '/embed/',
  build: {
    outDir: 'site/public/embed',
    emptyOutDir: true,
    target: 'es2022',
    cssCodeSplit: false,
    assetsInlineLimit: 0,
    reportCompressedSize: false,
    rollupOptions: { input: 'embed.html' },
  },
})
