import { proVirtual } from './vite.pro'
import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import { emoji } from './vite.emoji.mjs'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { designUnit, engineResolve, forbidRemote } from './vite.config'

// Posters, roll-up banners, tri-folds and long images: one offline HTML file per item.
//   PRINT=apollo-poster npx vite build -c vite.print.config.ts   writes dist/print/apollo-poster.html
// The item is chosen by aliasing active.ts, so parallel builds never rewrite a source file.
const name = process.env.PRINT ?? 'starter'
const entry = resolve(__dirname, 'src/prints', name, 'index.tsx')

const renameOutput = (): Plugin => ({
  name: 'print-output-name',
  enforce: 'post',
  generateBundle(_opts, bundle) {
    const html = bundle['print.html']
    if (html) html.fileName = `${name}.html`
  },
})

export default defineConfig({
  plugins: [proVirtual(), 
    {
      name: 'print-active',
      enforce: 'pre',
      resolveId(id, importer) {
        if (id.endsWith('prints/active') && importer?.includes('/src/print/')) return entry
        return null
      },
    },
    ...emoji(),
    viteSingleFile({ removeViteModuleLoader: true }),
    forbidRemote(),
    renameOutput(),
  ],
  css: { postcss: { plugins: [designUnit] } },
  resolve: engineResolve,
  build: {
    outDir: 'dist/print',
    emptyOutDir: false,
    target: 'es2022',
    cssCodeSplit: false,
    assetsInlineLimit: () => true,
    reportCompressedSize: false,
    rollupOptions: { input: 'print.html' },
  },
})
