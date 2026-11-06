// Audit of a rendered video. The last line is PASS or FAIL; exit code 1 on FAIL.
// usage: node scripts/video-qa.mjs <name> [--file other.mp4]
// reads dist/video/<name>.mp4 and .frames.json, writes qa/video/<name>/
import { spawnSync } from 'node:child_process'
import { closeSync, existsSync, mkdirSync, openSync, readFileSync, readSync, rmSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { ROOT, openVideo } from './video-lib.mjs'
import { missingCjk } from './font-coverage.mjs'

const args = process.argv.slice(2)
const name = args[0]
if (!name) {
  console.error('usage: video-qa <name> [--file other.mp4]')
  process.exit(2)
}
const fileArg = args.indexOf('--file')
const FILE = fileArg > 0 ? resolve(args[fileArg + 1]) : join(ROOT, 'dist', 'video', `${name}.mp4`)
const MANIFEST = join(ROOT, 'dist', 'video', `${name}.frames.json`)
const OUT = join(ROOT, 'qa', 'video', name)

const failures = []
const notes = []
const fail = (m) => failures.push(m)
// A folder named with a leading underscore is a negative test fixture. It can never pass.
if (name.startsWith('_')) fail(`${name} is a negative test fixture, not a video to publish`)
function finish() {
  for (const n of notes) console.log(`  ${n}`)
  for (const f of failures) console.log(`FAIL  ${f}`)
  console.log(failures.length ? 'FAIL' : 'PASS')
  process.exit(failures.length ? 1 : 0)
}

if (!existsSync(FILE)) {
  fail(`no file at ${FILE}; run video-render first`)
  finish()
}
if (!existsSync(MANIFEST)) {
  fail(`no manifest at ${MANIFEST}; run video-render first`)
  finish()
}
const m = JSON.parse(readFileSync(MANIFEST, 'utf8'))
const { def, scenes } = m
const missingGlyphs = missingCjk(JSON.stringify(m))
if (missingGlyphs.length) {
  notes.push(`characters missing from the committed font subsets: ${missingGlyphs.join(' ')}. The render falls back to a system font; maintainers can add them with npm run fonts, then run npm run fonts:verify.`)
}
const fps = def.fps
if (m.from !== 0 || m.to !== def.frames) fail(`manifest covers frames ${m.from}–${m.to} of ${def.frames}: this is a partial render`)
for (const p of m.problems) fail(`during render: ${p}`)

// ---- container and streams ----
const probe = JSON.parse(
  spawnSync('ffprobe', ['-v', 'error', '-count_frames', '-show_streams', '-show_format', '-of', 'json', FILE], { encoding: 'utf8', maxBuffer: 1 << 26 }).stdout || '{}',
)
const video = probe.streams?.find((s) => s.codec_type === 'video')
const audio = probe.streams?.find((s) => s.codec_type === 'audio')
if (!video) {
  fail('no video stream')
  finish()
}
const expectEq = (label, got, want) => {
  if (got !== want) fail(`${label}: ${got}, expected ${want}`)
}
expectEq('codec', video.codec_name, 'h264')
expectEq('pix_fmt', video.pix_fmt, 'yuv420p')
expectEq('width', video.width, def.width)
expectEq('height', video.height, def.height)
expectEq('frame rate', video.r_frame_rate, `${fps}/1`)
expectEq('average frame rate', video.avg_frame_rate, `${fps}/1`)
expectEq('frame count', Number(video.nb_read_frames), def.frames)
expectEq('colour matrix', video.color_space, 'bt709')
expectEq('colour primaries', video.color_primaries, 'bt709')
expectEq('colour transfer', video.color_transfer, 'bt709')
expectEq('colour range', video.color_range, 'tv')
if (video.profile !== 'High') fail(`H.264 profile: ${video.profile}, expected High`)
const duration = Number(probe.format.duration)
const wantDuration = def.frames / fps
if (Math.abs(duration - wantDuration) > 1 / fps + 0.001) fail(`duration ${duration.toFixed(3)}s, expected ${wantDuration.toFixed(3)}s`)
if (m.audio && audio?.codec_name !== 'aac') fail(`audio: ${audio?.codec_name ?? 'none'}, expected aac`)
if (!m.audio && audio) fail('unexpected audio stream')
const mbps = (Number(probe.format.size) * 8) / duration / 1e6
if (mbps > 20) fail(`average bitrate ${mbps.toFixed(1)} Mbps is above the 20 Mbps ceiling`)

// +faststart: the moov box must come before mdat.
function topBoxes(file) {
  const fd = openSync(file, 'r')
  const size = statSync(file).size
  const buf = Buffer.alloc(16)
  const order = []
  for (let pos = 0; pos < size; ) {
    readSync(fd, buf, 0, 16, pos)
    let len = buf.readUInt32BE(0)
    const type = buf.toString('latin1', 4, 8)
    if (len === 1) len = Number(buf.readBigUInt64BE(8))
    if (len === 0) len = size - pos
    order.push(type)
    pos += len
  }
  closeSync(fd)
  return order
}
const boxes = topBoxes(FILE)
if (boxes.indexOf('moov') > boxes.indexOf('mdat')) fail(`moov after mdat, not +faststart (${boxes.join(' ')})`)

// ---- the encoded file itself: blank stretches and freezes ----
const LOW_W = 320
const LOW_H = Math.round((LOW_W * def.height) / def.width / 2) * 2
const raw = spawnSync('ffmpeg', ['-v', 'error', '-i', FILE, '-vf', `scale=${LOW_W}:${LOW_H},format=gray`, '-f', 'rawvideo', '-'], { maxBuffer: 2 ** 31 }).stdout
const frameBytes = LOW_W * LOW_H
const decoded = Math.floor(raw.length / frameBytes)
const stdev = []
const luma = []
const visibleChange = []
for (let i = 0; i < decoded; i++) {
  const a = raw.subarray(i * frameBytes, (i + 1) * frameBytes)
  if (i > 0) {
    const prev = raw.subarray((i - 1) * frameBytes, i * frameBytes)
    let n = 0
    for (let k = 0; k < frameBytes; k++) if (Math.abs(a[k] - prev[k]) > 10) n++
    visibleChange[i] = n >= 4
  }
  let sum = 0
  for (const v of a) sum += v
  const mean = sum / frameBytes
  luma.push(mean)
  let sq = 0
  for (const v of a) sq += (v - mean) ** 2
  stdev.push(Math.sqrt(sq / frameBytes))
}
const BLANK = 2.5
let blankRun = 0
let worstBlank = 0
let blankAt = 0
stdev.forEach((s, i) => {
  blankRun = s < BLANK ? blankRun + 1 : 0
  if (blankRun > worstBlank) {
    worstBlank = blankRun
    blankAt = i - blankRun + 1
  }
})
if (worstBlank / fps > 0.5) fail(`blank picture for ${(worstBlank / fps).toFixed(2)}s from ${(blankAt / fps).toFixed(2)}s`)
if (stdev[0] < BLANK) fail('first frame is blank; platforms may use it as the cover (set VideoDef.preroll)')
if (stdev.at(-1) < BLANK) fail('last frame is blank')

// A transition must stay between the brightness of the two scenes it joins. A dip through the wrong colour is a flash.
const FLASH = 25
for (const s of scenes) {
  if (s.start === 0) continue
  const lastFrame = Math.min(decoded - 1, s.inEnd + 1)
  const edges = [luma[Math.max(0, s.start - 1)], luma[lastFrame]]
  const hi = Math.max(...edges) + FLASH
  const lo = Math.min(...edges) - FLASH
  const window = luma.slice(s.start, lastFrame)
  if (Math.max(...window) > hi) fail(`scene ${s.id}: flash in the transition, brightness reaches ${Math.max(...window).toFixed(0)} between scenes at ${edges.map((v) => v.toFixed(0)).join(' and ')}`)
  if (Math.min(...window) < lo) fail(`scene ${s.id}: dark flash in the transition, brightness falls to ${Math.min(...window).toFixed(0)} between scenes at ${edges.map((v) => v.toFixed(0)).join(' and ')}`)
}

const longestAllowed = Math.max(...scenes.map((s) => s.maxHold))
const freeze = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'info', '-i', FILE, '-vf', `freezedetect=n=0.0005:d=${longestAllowed + 0.5}`, '-an', '-f', 'null', '-'], { encoding: 'utf8', maxBuffer: 1 << 26 }).stderr
for (const hit of freeze.matchAll(/freeze_start: ([\d.]+)[\s\S]*?freeze_duration: ([\d.]+)/g)) {
  fail(`encoded file is frozen for ${Number(hit[2]).toFixed(2)}s from ${Number(hit[1]).toFixed(2)}s`)
}

// ---- on-screen audit in a browser ----
const MIN_FONT = def.size === '9:16' ? 24 : 15
const MAX_CHARS_PER_SECOND = 9
const MAX_CAPTION = def.size === '9:16' ? 32 : 34
const cjkLength = (t) => [...t].length
const loopScenes = new Set()
const session = await openVideo(name, { failOn: fail })
try {
  const seek = (f) => session.page.evaluate((x) => window.__video.seek(x), f)
  const audit = () => session.page.evaluate(() => window.__video.audit())
  const report = (s, a, when) => {
    for (const p of a.problems) fail(`scene ${s.id} ${when}: ${p.kind}: ${p.text}`)
  }
  let smallest = 999
  let smallestText = ''
  for (const s of scenes) {
    // Each caption at its midpoint, then the settled end of the scene. Going backwards replays the scene.
    const caps = s.captions.map((c, i, all) => ({ ...c, to: c.to ?? all[i + 1]?.at ?? s.duration }))
    for (const c of caps) {
      const secs = c.to - c.at
      const len = cjkLength(c.text)
      if (len > MAX_CAPTION) fail(`scene ${s.id}: caption is ${len} characters (limit ${MAX_CAPTION}): ${c.text}`)
      if (len / secs > MAX_CHARS_PER_SECOND) fail(`scene ${s.id}: caption asks for ${(len / secs).toFixed(1)} characters per second (limit ${MAX_CHARS_PER_SECOND}): ${c.text}`)
      await seek(Math.min(s.end - 1, s.start + Math.round(((c.at + c.to) / 2) * fps)))
      const a = await audit()
      if (!a.caption) fail(`scene ${s.id}: caption not on screen at its midpoint: ${c.text}`)
      report(s, a, `at caption "${c.text.slice(0, 12)}"`)
    }
    await seek(s.end - 1)
    const a = await audit()
    report(s, a, 'at its last frame')
    if (a.loops) loopScenes.add(s.id)
    if (a.minFont < smallest) {
      smallest = a.minFont
      smallestText = a.minFontText
    }
    if (!s.noFacts && !a.hasSource) fail(`scene ${s.id}: no source on screen (add a source, or noFacts if it states no fact)`)
    if (s.steps && s.steps.length !== a.builds) fail(`scene ${s.id}: ${s.steps.length} steps for ${a.builds} build groups`)
    if (a.pending) fail(`scene ${s.id}: ${a.pending} build items still hidden at the end of the scene`)
  }
  notes.push(`smallest text: ${smallest}px "${smallestText}"`)
  if (smallest < MIN_FONT) fail(`text smaller than ${MIN_FONT}px: ${smallest}px "${smallestText}"`)
  for (const e of await session.page.evaluate(() => window.__video.errors())) fail(`page: ${e}`)
} finally {
  await session.browser.close()
}

// ---- pacing, from the hashes taken before encoding ----
if (m.hashes.length !== def.frames) fail(`manifest has ${m.hashes.length} hashes for ${def.frames} frames`)
const changedAt = (f) => f > 0 && m.hashes[f] !== m.hashes[f - 1]
for (const s of scenes) {
  // A scene with an endless ambient loop never repeats a frame, so read its pacing from visible change in the decoded file.
  const looping = loopScenes.has(s.id)
  const moved = looping ? (f) => visibleChange[f] : changedAt
  let lastChange = s.start
  let run = 1
  let longest = 1
  for (let f = s.start + 1; f < s.end; f++) {
    if (moved(f)) {
      lastChange = f
      run = 1
    } else {
      run++
      if (run > longest) longest = run
    }
  }
  const hold = (s.end - lastChange) / fps
  const moving = (lastChange - s.start) / fps
  notes.push(`${s.id}: ${s.duration}s, moves ${moving.toFixed(2)}s, holds ${hold.toFixed(2)}s${looping ? ' (ambient loop)' : ''}`)
  if (longest / fps > s.maxHold) fail(`scene ${s.id}: nothing moves for ${(longest / fps).toFixed(1)}s (limit ${s.maxHold}s); shorten it or set maxHold`)
  if (hold < s.minHold) fail(`scene ${s.id}: cut only ${hold.toFixed(2)}s after the last change (minimum ${s.minHold}s); the end state is not readable`)
  if (s.start > 0 && m.hashes[s.inEnd] === m.hashes[s.start - 1]) fail(`scene ${s.id}: identical picture across the cut`)
}

// ---- contact sheet: early in the scene, inside the transition, mid-scene, last frame ----
rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })
const picks = []
for (const s of scenes) {
  const a = s.inEnd > s.start ? Math.floor((s.start + s.inEnd) / 2) : s.start
  const b = s.start + Math.round((s.end - s.start) * 0.22)
  const c = s.start + Math.round((s.end - s.start) * 0.5)
  picks.push(a, b, c, s.end - 1)
}
const uniq = [...new Set(picks)].sort((x, y) => x - y)
const select = uniq.map((n) => `eq(n\\,${n})`).join('+')
const cols = def.size === '9:16' ? 8 : 4
const cellW = def.size === '9:16' ? 270 : 480
const rows = Math.ceil(uniq.length / cols)
const r = spawnSync('ffmpeg', ['-y', '-v', 'error', '-i', FILE, '-vf', `select='${select}',scale=${cellW}:-2,tile=${cols}x${rows}:padding=4:color=0x333333`, '-frames:v', '1', '-fps_mode', 'vfr', join(OUT, 'contact.png')])
if (r.status !== 0) fail('could not write the contact sheet')
for (const s of scenes) {
  const n = scenes.indexOf(s) + 1
  spawnSync('ffmpeg', ['-y', '-v', 'error', '-i', FILE, '-vf', `select='eq(n\\,${s.end - 1})'`, '-frames:v', '1', '-fps_mode', 'vfr', join(OUT, `scene-${String(n).padStart(2, '0')}-${s.id}.png`)])
}
notes.push(`${def.width}×${def.height} ${fps}fps ${wantDuration.toFixed(2)}s, ${mbps.toFixed(1)} Mbps, ${(Number(probe.format.size) / 1e6).toFixed(1)} MB`)
notes.push(`render speed: ${m.framesPerSecond.toFixed(1)} frames/s`)
notes.push(`look at ${join(OUT, 'contact.png')}`)
finish()
