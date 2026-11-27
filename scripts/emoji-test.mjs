// Regression tests for vite.emoji.mjs chunk scanning:
// - binary base64 payloads (fonts/images/large videos >= 8 MB) are skipped in O(N) without stack overflow
// - mixed-case markers, MIME parameters, short payloads, string boundaries and EOF payloads behave safely
// - textual SVG data URIs keep their emoji visible to the scanner
// - ZWJ, keycap, flags and skin-tone variants are all still detected
import assert from 'node:assert/strict'
import { scanChunkEmoji } from '../vite.emoji.mjs'

const bigFont = 'A'.repeat(2_000_000)
const bigVideo = 'C'.repeat(8_500_000)
const sample = [
  `const font = "data:font/woff2;base64,${bigFont}";`,
  `const png = "data:IMAGE/PNG;charset=utf-8;Base64,${'B'.repeat(500_000)}";`,
  `const video = "data:video/mp4;BASE64,${bigVideo}";`,
  `const fake = "data:video/mp4" + "hello;base64,${'D'.repeat(200)}🎯";`,
  `const shortPayload = "data:image/png;base64,AAAA🔥";`,
  `const svg = "data:image/svg+xml,<svg><text>🚀</text></svg>";`,
  `const text = "Hello 😀 1️⃣ 👨‍👩‍👧‍👦 🇨🇳 👍🏽";`,
  `const eof = "data:video/webm;base64,${'E'.repeat(120)}`,
].join('\n')

const t0 = performance.now()
const found = scanChunkEmoji(sample)
const ms = performance.now() - t0

for (const want of ['🚀', '😀', '1️⃣', '👨‍👩‍👧‍👦', '🇨🇳', '👍🏽', '🎯', '🔥']) {
  assert.ok(found.includes(want), `expected emoji ${want} in ${JSON.stringify(found)}`)
}
assert.deepEqual(scanChunkEmoji(`const pure = "data:font/woff2;base64,${bigFont}";`), [])
assert.deepEqual(scanChunkEmoji(`const pureVideo = "data:video/mp4;base64,${bigVideo}";`), [])
assert.deepEqual(scanChunkEmoji(`const eofOnly = "data:video/mp4;base64,${'F'.repeat(1_000_000)}`), [])
assert.ok(ms < 5000, `scanChunkEmoji took ${ms.toFixed(1)}ms, expected < 5000ms`)

console.log(`emoji-test: PASS (${found.length} emoji detected over ~11 MB base64 in ${ms.toFixed(1)}ms)`)
