// Renders a video frame by frame on a virtual clock, then encodes it. Nothing is recorded in real
// time: the page only moves when this script asks for the next frame, so a slow machine gives the
// same frames as a fast one.
//
//   node scripts/video-render.mjs <name>                       dist/video/<name>.mp4 + .frames.json
//     --from 12 --to 18     a range, in seconds, written to dist/video/<name>.part.mp4
//     --still 1.5,3,7.25    PNG stills at those times in qa/video/<name>/, no encode
//     --audio track.m4a     mux a track you have the rights to (AAC 48 kHz, fades out at the end)
//     --out path.mp4        output path
//     --no-build            reuse dist/video/video.html
//     --crf 17              x264 quality
import { spawn, spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { ROOT, buildHtml, openVideo, shot } from './video-lib.mjs'

function parseArgs(argv) {
  const opts = { name: null, build: true, crf: 17 }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--no-build') opts.build = false
    else if (a.startsWith('--')) opts[a.slice(2)] = argv[++i]
    else opts.name = a
  }
  return opts
}

const opts = parseArgs(process.argv.slice(2))
if (!opts.name) {
  console.error('usage: video-render <name> [--from s --to s] [--still t1,t2] [--audio file] [--out file] [--no-build] [--crf n]')
  process.exit(2)
}
if (opts.audio && !existsSync(opts.audio)) {
  console.error(`audio file not found: ${opts.audio}`)
  process.exit(2)
}
if (spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' }).status !== 0) {
  console.error('ffmpeg not found on PATH')
  process.exit(2)
}

if (opts.build) buildHtml()

const problems = []
const { browser, page, cdp, info } = await openVideo(opts.name, { failOn: (m) => problems.push(m) })
const { def, scenes } = info
const seek = (f) => page.evaluate((x) => window.__video.seek(x), f)

function encoder(file, fps, seconds) {
  mkdirSync(dirname(file), { recursive: true })
  const keyint = Math.max(1, Math.round(fps / 2)) // YouTube: closed GOP, half the frame rate
  const args = ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-c:v', 'png', '-framerate', String(fps), '-i', '-']
  if (opts.audio) args.push('-i', opts.audio)
  args.push(
    '-map', '0:v:0',
    '-vf', 'scale=in_range=full:out_range=tv:out_color_matrix=bt709:flags=lanczos+accurate_rnd+full_chroma_int,format=yuv420p,setparams=color_primaries=bt709:color_trc=bt709:colorspace=bt709:range=tv',
    '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'medium', '-crf', String(opts.crf),
    '-maxrate', '20M', '-bufsize', '40M',
    '-g', String(keyint), '-bf', '2', '-flags', '+cgop',
    '-r', String(fps),
    // No encoder version or creation time in the file, so identical frames give an identical file.
    '-map_metadata', '-1', '-fflags', '+bitexact', '-flags:v', '+bitexact',
  )
  // Audio plugs in here. The track is cut to the video and fades out over the last second.
  if (opts.audio) args.push('-map', '1:a:0', '-af', `apad,atrim=0:${seconds},afade=t=out:st=${Math.max(0, seconds - 1)}:d=1`, '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2')
  args.push('-movflags', '+faststart', file)
  const proc = spawn('ffmpeg', args, { stdio: ['pipe', 'inherit', 'inherit'] })
  const done = new Promise((res, rej) => proc.on('close', (c) => (c === 0 ? res() : rej(new Error(`ffmpeg exited ${c}`)))))
  return {
    write: (buf) => new Promise((res, rej) => proc.stdin.write(buf, (e) => (e ? rej(e) : res()))),
    close: () => {
      proc.stdin.end()
      return done
    },
  }
}

try {
  if (opts.still) {
    const dir = join(ROOT, 'qa', 'video', opts.name)
    mkdirSync(dir, { recursive: true })
    const times = String(opts.still).split(',').map(Number).sort((a, b) => a - b)
    for (const t of times) {
      await seek(Math.round(t * def.fps))
      const png = await shot(cdp)
      const f = join(dir, `still-${t.toFixed(2).padStart(6, '0')}.png`)
      writeFileSync(f, png)
      console.log(f)
    }
  } else {
    const fromF = opts.from !== undefined ? Math.round(Number(opts.from) * def.fps) : 0
    const toF = opts.to !== undefined ? Math.min(def.frames, Math.round(Number(opts.to) * def.fps)) : def.frames
    const isPart = fromF !== 0 || toF !== def.frames
    const out = resolve(opts.out ?? join(ROOT, 'dist', 'video', `${opts.name}${isPart ? '.part' : ''}.mp4`))
    const enc = encoder(out, def.fps, (toF - fromF) / def.fps)
    const hashes = []
    const t0 = Date.now()
    for (let f = fromF; f < toF; f++) {
      await seek(f)
      const png = await shot(cdp)
      hashes.push(createHash('sha1').update(png).digest('hex').slice(0, 16))
      await enc.write(png)
      if ((f - fromF) % (def.fps * 5) === 0 && f > fromF) {
        const rate = (f - fromF) / ((Date.now() - t0) / 1000)
        console.log(`frame ${f}/${toF}  ${rate.toFixed(1)} fps`)
      }
    }
    problems.push(...(await page.evaluate(() => window.__video.errors())))
    await enc.close()
    const seconds = (Date.now() - t0) / 1000
    const manifest = { name: opts.name, def, scenes, from: fromF, to: toF, audio: !!opts.audio, renderSeconds: seconds, framesPerSecond: (toF - fromF) / seconds, hashes, problems }
    const jsonFile = out.replace(/\.mp4$/, '.frames.json')
    writeFileSync(jsonFile, JSON.stringify(manifest))
    const all = createHash('sha1').update(hashes.join('')).digest('hex').slice(0, 16)
    console.log(`${out}\n${toF - fromF} frames in ${seconds.toFixed(1)}s (${manifest.framesPerSecond.toFixed(1)} fps, ${(((toF - fromF) / def.fps) / seconds).toFixed(2)}× real time)  frames ${all}`)
  }
  for (const p of problems) console.error(`problem: ${p}`)
} finally {
  await browser.close()
}
process.exit(problems.length ? 1 : 0)
