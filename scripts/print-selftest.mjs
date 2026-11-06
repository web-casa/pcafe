// Proves each QA rule can fail: builds pieces broken on purpose and checks that QA rejects them with the
// right message, and that the starters pass. usage: node scripts/print-selftest.mjs [name ...]
import { spawnSync } from 'node:child_process'
import { rmSync } from 'node:fs'
import { join, resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
const CASES = [
  ['_bad-safe', /outside the safe zone|runs off the trim/, 'text outside the safe zone'],
  ['_bad-overflow', /too tall|past the live area/, 'content overflow'],
  ['_bad-overlap', /text overlaps text/, 'overlap'],
  ['_bad-fold', /crosses the fold/, 'text across a fold'],
  ['_bad-hidden', /hidden bottom/, 'roll-up cassette zone'],
  ['_bad-slice', /cannot fit an xhs slice/, 'section too tall for xhs'],
  ['_bad-slice', /over 3000 px/, 'section too tall for wechat'],
  ['_bad-emoji', /raster .* under the 600 ppi.*fluent emoji/, 'low-resolution emoji'],
  ['_bad-raster', /under 300 ppi/, 'low-resolution image'],
  ['_bad-contrast', /contrast [\d.]+:1 on/, 'contrast'],
  ['_bad-size', /under [\d.]+ mm/, 'minimum physical text size'],
  ['_bad-source', /no source/, 'number without a source'],
  ['_bad-part', /not found in its template/, 'kit selector that does not exist'],
  ['_bad-font', /system font/, 'font fallback warning', {}, true],
  ['_bad-moving', /still changing/, 'a number that keeps animating'],
  ['_bad-source', /must be exactly/, 'PDF page size, with the box rewrite turned off', { PRINT_TEST_NO_BOXES: '1' }],
  ['starter', null, 'poster starter passes'],
  ['_ok-rollup', null, 'roll-up starter passes'],
  ['_ok-trifold', null, 'tri-fold starter passes'],
  ['_ok-long', null, 'long image starter passes'],
]
const only = process.argv.slice(2)
const cache = new Map()
let bad = 0
for (const [name, expect, what, env = {}, warn = false] of CASES) {
  if (only.length && !only.includes(name)) continue
  const key = `${name} ${JSON.stringify(env)}`
  if (!cache.has(key)) {
    const res = spawnSync('node', ['scripts/print-qa.mjs', name], { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 28, env: { ...process.env, PRINT_FIXTURE: '1', VITE_CONFIG_NATIVE_IGNORE_WARNING: 'true', ...env } })
    cache.set(key, { code: res.status, out: `${res.stdout}\n${res.stderr}`, last: res.stdout.trim().split('\n').at(-1) })
  }
  const r = cache.get(key)
  const full = spawnSync('node', ['-e', `try{const r=require('./qa/print/${name}/report.json');console.log([...(r.failures??[]),...(r.warnings??[])].join('\\n'))}catch{}`], { cwd: ROOT, encoding: 'utf8' }).stdout
  const ok = expect ? (warn ? r.code === 0 && r.last === 'PASS' && expect.test(`${r.out}\n${full}`) : r.code === 1 && r.last === 'FAIL' && expect.test(`${r.out}\n${full}`)) : r.code === 0 && r.last === 'PASS'
  console.log(`${ok ? 'ok  ' : 'BAD '} ${what} (${name})`)
  if (ok && expect) console.log(`     ${`${r.out}\n${full}`.split('\n').find((l) => expect.test(l))?.replace(/^FAIL: /, '').slice(0, 170)}`)
  if (!ok) {
    bad += 1
    console.log(r.out.split('\n').slice(-14).join('\n'))
  }
}
for (const [name] of CASES) if (name.startsWith('_')) {
  rmSync(join(ROOT, 'dist', 'print', name), { recursive: true, force: true })
  rmSync(join(ROOT, 'dist', 'print', `${name}.html`), { force: true })
  rmSync(join(ROOT, 'qa', 'print', name), { recursive: true, force: true })
}
console.log(bad ? 'FAIL' : 'PASS')
process.exit(bad ? 1 : 0)
