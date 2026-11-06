import { proVirtual } from './vite.pro'
import { renameSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import { emoji } from './vite.emoji.mjs'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { designUnit, engineResolve, forbidRemote } from './vite.config'

// Interactive lessons: one offline HTML file, like a deck.
// COURSE=<folder> builds src/courses/<folder> to dist/course/<folder>.html without touching active.ts.
const name = process.env.COURSE
const outDir = 'dist/course'

const nameOutput = (): Plugin => ({
  name: 'course-output-name',
  apply: 'build',
  closeBundle() {
    if (name) renameSync(resolve(outDir, 'course.html'), resolve(outDir, `${name}.html`))
  },
})

export default defineConfig({
  plugins: [proVirtual(), ...emoji(), viteSingleFile({ removeViteModuleLoader: true }), forbidRemote(), nameOutput()],
  css: { postcss: { plugins: [designUnit] } },
  resolve: {
    ...engineResolve,
    alias: [...engineResolve.alias, ...(name ? [{ find: /^.*\/courses\/active$/, replacement: resolve(`src/courses/${name}/index.tsx`) }] : [])],
  },
  build: {
    outDir,
    emptyOutDir: false,
    target: 'es2022',
    cssCodeSplit: false,
    assetsInlineLimit: () => true,
    reportCompressedSize: false,
    rollupOptions: { input: 'course.html' },
  },
})
