// Proves the capture is frame-accurate and repeatable on this machine and this Chromium/Motion.
// Run it after upgrading either. Last line is PASS or FAIL.
//   1. every kind of animation reads its expected value on exact frames
//   2. two renders give byte-identical PNG frames
//   3. a render with the CPU throttled 4× gives the same frames: speed cannot leak into the output
//   4. seeking straight to a frame gives the same frame as playing up to it
//   node scripts/video-selftest.mjs [--video name] [--frames n]
import { createHash } from 'node:crypto'
import { buildHtml, openVideo, shot } from './video-lib.mjs'

const args = process.argv.slice(2)
const pick = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d)
const name = pick('--video', 'clock-selftest')
const limit = Number(pick('--frames', 0))
if (!args.includes('--no-build')) buildHtml()

const failures = []
const fail = (m) => failures.push(m)
const sha = (b) => createHash('sha1').update(b).digest('hex').slice(0, 16)

const read = () => {
  const g = (id) => document.getElementById(id)
  const left = (id) => parseFloat(getComputedStyle(g(id)).left)
  const op = (id) => parseFloat(getComputedStyle(g(id)).opacity)
  return {
    css: left('p-css'),
    loop: left('p-loop'),
    transition: left('p-transition'),
    waapi: left('p-waapi'),
    raf: left('p-raf'),
    motionWaapi: op('p-mo-waapi'),
    motionJs: new DOMMatrix(getComputedStyle(g('p-mo-js')).transform).m41,
    chain: op('p-mo-chain'),
    count: g('p-count').textContent,
    date: Number(g('p-date').textContent),
  }
}

async function conformance() {
  const { browser, page } = await openVideo('clock-selftest', { failOn: fail })
  const clamp = (v) => Math.max(0, Math.min(1, v))
  // Every figure below follows from the fixture: linear ramps of 1000 px over one second.
  const expected = (t) => ({
    css: 1000 * clamp(t - 0.5),
    loop: 1000 * (t % 1),
    transition: t < 0.5 ? 0 : 1000 * clamp(t - 0.5),
    waapi: 1000 * clamp(t - 0.25),
    raf: 1000 * t,
    motionWaapi: clamp(t - 0.5),
    motionJs: 1000 * clamp(t - 0.5),
  })
  const tolerance = { css: 1, loop: 1, transition: 40, waapi: 1, raf: 40, motionWaapi: 0.04, motionJs: 40 }
  for (const f of [0, 5, 10, 15, 20, 25, 30, 36, 40, 45, 50, 60, 75, 89]) {
    await page.evaluate((x) => window.__video.seek(x), f)
    const got = await page.evaluate(read)
    const t = f / 30
    const want = expected(t)
    for (const k of Object.keys(want)) {
      if (Math.abs(got[k] - want[k]) > tolerance[k]) fail(`frame ${f}: ${k} is ${got[k]}, expected ${want[k].toFixed(2)}`)
    }
    // 1000 × (1 − (1 − t)³) over one second
    const count = t >= 1 ? 1000 : 1000 * (1 - (1 - t) ** 3)
    const shown = Number(got.count.replace(/,/g, ''))
    if (Math.abs(shown - count) > 1) fail(`frame ${f}: useCount shows ${shown}, expected ${count.toFixed(0)}`)
    // 0 → 1 over 0.5 s; only its finish event starts 1 → 0.25 over the next 0.5 s.
    const chain = t <= 0.5 ? t / 0.5 : t >= 1 ? 0.25 : 1 - 0.75 * ((t - 0.5) / 0.5)
    if (Math.abs(got.chain - chain) > 0.05) fail(`frame ${f}: chained animation is ${got.chain}, expected ${chain.toFixed(3)}: the finish event did not arrive on time`)
  }
  await browser.close()
}

async function render(throttle = 1, frames) {
  const { browser, page, cdp, info } = await openVideo(name, { failOn: fail })
  if (throttle > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: throttle })
  const n = frames ?? (limit || info.def.frames)
  const hashes = []
  const t0 = Date.now()
  for (let f = 0; f < n; f++) {
    await page.evaluate((x) => window.__video.seek(x), f)
    hashes.push(sha(await shot(cdp)))
  }
  const seconds = (Date.now() - t0) / 1000
  return { hashes, seconds, browser, page, cdp, info }
}

if (name === 'clock-selftest') await conformance()

const a = await render()
await a.browser.close()
console.log(`run 1: ${a.hashes.length} frames, ${new Set(a.hashes).size} distinct, ${(a.hashes.length / a.seconds).toFixed(1)} frames/s`)
const b = await render()
console.log(`run 2: ${(b.hashes.length / b.seconds).toFixed(1)} frames/s`)
const diff = a.hashes.flatMap((h, i) => (h === b.hashes[i] ? [] : [i]))
if (diff.length) fail(`run 2 differs on ${diff.length} frames: ${diff.slice(0, 12).join(', ')}`)
await b.browser.close()

const c = await render(4)
console.log(`run 3, CPU throttled 4×: ${(c.hashes.length / c.seconds).toFixed(1)} frames/s`)
const diffC = a.hashes.flatMap((h, i) => (h === c.hashes[i] ? [] : [i]))
if (diffC.length) fail(`throttled run differs on ${diffC.length} frames: ${diffC.slice(0, 12).join(', ')}`)
await c.browser.close()

// Seek straight to frames, far apart and out of order.
const { browser, page, cdp, info } = await openVideo(name, { failOn: fail })
const total = limit || info.def.frames
const spots = [0.8, 0.2, 0.55, 0.35, 0.95].map((p) => Math.floor(p * total))
for (const f of spots) {
  await page.evaluate((x) => window.__video.seek(x), f)
  const h = sha(await shot(cdp))
  if (h !== a.hashes[f]) fail(`seeking directly to frame ${f} gives a different picture from playing up to it`)
}
for (const e of await page.evaluate(() => window.__video.errors())) fail(`page: ${e}`)
await browser.close()

for (const f of failures) console.log(`FAIL  ${f}`)
console.log(failures.length ? 'FAIL' : 'PASS')
process.exit(failures.length ? 1 : 0)
