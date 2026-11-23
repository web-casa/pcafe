// Regression tests for vite.emoji.mjs chunk scanning:
// - binary base64 payloads (fonts/images) are skipped quickly
// - textual SVG data URIs keep their emoji visible to the scanner
// - ZWJ, keycap, flags and skin-tone variants are all still detected
import assert from 'node:assert/strict'
import { scanChunkEmoji } from '../vite.emoji.mjs'

const bigFont = 'A'.repeat(2_000_000)
const sample = [
  `const font = "data:font/woff2;base64,${bigFont}";`,
  `const png = "data:image/png;base64,${'B'.repeat(500_000)}";`,
  `const svg = "data:image/svg+xml,<svg><text>🚀</text></svg>";`,
  `const text = "Hello 😀 1️⃣ 👨‍👩‍👧‍👦 🇨🇳 👍🏽";`,
].join('\n')

const t0 = performance.now()
const found = scanChunkEmoji(sample)
const ms = performance.now() - t0

for (const want of ['🚀', '😀', '1️⃣', '👨‍👩‍👧‍👦', '🇨🇳', '👍🏽']) {
  assert.ok(found.includes(want), `expected emoji ${want} in ${JSON.stringify(found)}`)
}
assert.deepEqual(scanChunkEmoji(`const pure = "data:font/woff2;base64,${bigFont}";`), [])
assert.ok(ms < 1000, `scanChunkEmoji took ${ms.toFixed(1)}ms, expected < 1000ms`)

console.log(`emoji-test: PASS (${found.length} emoji detected over 2.5 MB base64 in ${ms.toFixed(1)}ms)`)
