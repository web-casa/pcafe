import { proVirtual } from './vite.pro'
import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import { emoji } from './vite.emoji.mjs'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { designUnit, engineResolve, forbidRemote } from './vite.config'

// Display screens: one offline HTML file per screen.
//   SCREEN=apollo11 npx vite build -c vite.screen.config.ts   writes dist/screen/apollo11.html
// The screen is chosen by aliasing active.ts, so parallel builds never rewrite a source file.
const name = process.env.SCREEN ?? 'apollo11'
const entry = resolve(__dirname, 'src/screens', name, 'index.tsx')

const renameOutput = (): Plugin => ({
  name: 'screen-output-name',
  enforce: 'post',
  generateBundle(_opts, bundle) {
    const html = bundle['screen.html']
    if (html) {
      html.fileName = `${name}.html`
    }
  },
})

export default defineConfig({
  plugins: [proVirtual(), 
    {
      name: 'screen-active',
      enforce: 'pre',
      resolveId(id, importer) {
        if (id.endsWith('screens/active') && importer?.includes('/src/screen/')) return entry
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
    outDir: 'dist/screen',
    emptyOutDir: false,
    target: 'es2022',
    cssCodeSplit: false,
    assetsInlineLimit: () => true,
    reportCompressedSize: false,
    rollupOptions: { input: 'screen.html' },
  },
})
