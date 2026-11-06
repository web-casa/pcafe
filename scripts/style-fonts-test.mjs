// Regression test: the deck's style must be read even when active.ts re-exports
// a deck from outside src/decks/, so styleFonts keeps that style's fonts.
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { deckStyle, filterStyleFonts } from '../src/engine/style-fonts.ts'

const root = mkdtempSync(join(tmpdir(), 'pcafe-style-fonts-'))
try {
  const pkg = join(root, 'engine-pkg')
  mkdirSync(join(root, 'src', 'decks'), { recursive: true })
  mkdirSync(pkg, { recursive: true })
  writeFileSync(join(root, 'package.json'), '{"type":"module","private":true}\n')
  writeFileSync(join(root, 'tsconfig.json'), '{"compilerOptions":{"jsx":"react-jsx"}}\n')
  writeFileSync(join(pkg, 'index.tsx'), "export const deck = { title: 'Outside', style: 'forest', slides: [] }\n")
  writeFileSync(join(root, 'src', 'decks', 'active.ts'), "export { deck } from '../../engine-pkg/index'\n")

  const style = await deckStyle(root)
  assert.equal(style, 'forest', 'deckStyle must follow a re-export outside src/decks/')

  const css = [
    '/* styles: forest */',
    '@font-face { font-family: "Forest"; src: url(forest.woff2); }',
    '/* styles: emerald */',
    '@font-face { font-family: "Emerald"; src: url(emerald.woff2); }',
  ].join('\n')
  const kept = filterStyleFonts(css, style)
  assert.match(kept, /Forest/, 'the active style font must stay')
  assert.doesNotMatch(kept, /Emerald/, 'unused style fonts must be removed')

  console.log('style-fonts: PASS (external re-export keeps style "forest" and drops "emerald")')
} finally {
  rmSync(root, { recursive: true, force: true })
}
