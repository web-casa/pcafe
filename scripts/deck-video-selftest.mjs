// Self-test for Phase 4 (#4 Deck -> Video + TTS export).
// Exercises Pro licence gating, option/URL SSRF hardening, PrintView attribution,
// SRT hardening, OpenAI-compatible TTS + corrupt cache self-healing + --no-cache isolation,
// and real 1080p + 720p ffmpeg MP4+SRT encoding verified with ffprobe.
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:http'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import {
  DeckVideoError,
  assertProLicence,
  buildDeckSrt,
  defaultEdgeVoice,
  encodeSlidesToMp4,
  ensureMediaBinaries,
  estimateSlideDuration,
  normalizeOpenAiBaseUrl,
  probeAudioDuration,
  sanitizedChildEnv,
  splitSubtitleSegments,
  synthesizeSlideAudio,
  validateExportOptions,
  verifyMp4Output,
} from './deck-video-lib.mjs'

const ROOT = resolve(import.meta.dirname, '..')
const workDir = mkdtempSync(join(tmpdir(), 'pcafe-deck-video-selftest-'))

try {
  ensureMediaBinaries()

  // 0. PrintView preserves CPAL-1.0 Exhibit B Credit attribution
  const presenterSrc = readFileSync(join(ROOT, 'src', 'deck', 'features', 'presenter.tsx'), 'utf8')
  assert.match(presenterSrc, /creditOn\(deck\.attribution\)/, 'PrintView must check creditOn(deck.attribution)')
  assert.match(presenterSrc, /<Credit\s+className="slide-header__credit"\s+withUrl\s*\/>/, 'PrintView must render Credit withUrl')

  // 1. Pro / Founder licence gate fails closed when missing or forged
  assert.throws(
    () => assertProLicence(workDir, { HOME: workDir, PCAFE_LICENCE: '' }),
    (err) => err instanceof DeckVideoError && err.code === 'pro_licence_required',
  )
  const fakeLic = join(workDir, 'fake-licence.json')
  writeFileSync(
    fakeLic,
    JSON.stringify({
      v: 1,
      id: 'PCL-FAKE-0001',
      org: 'Evil',
      plan: 'founder_lifetime',
      issued: '2026-01-01T00:00:00Z',
      until: null,
      sig: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==',
    }),
  )
  assert.throws(
    () => assertProLicence(workDir, { HOME: workDir, PCAFE_LICENCE: fakeLic }),
    (err) => err instanceof DeckVideoError && err.code === 'pro_licence_required',
  )

  // CLI --help succeeds without licence; real run without valid licence fails
  const cliHelp = spawnSync(
    process.execPath,
    [join(ROOT, 'cli', 'pcafe.mjs'), 'export-video', '--help'],
    { cwd: ROOT, encoding: 'utf8', env: { ...process.env, HOME: workDir, PCAFE_LICENCE: '' } },
  )
  assert.equal(cliHelp.status, 0, `export-video --help failed: ${cliHelp.stderr}`)
  assert.match(cliHelp.stdout, /--tts <openai\|edge\|none>/)

  const cliBlocked = spawnSync(
    process.execPath,
    [join(ROOT, 'cli', 'pcafe.mjs'), 'export-video', 'starter', '--dry-run'],
    { cwd: ROOT, encoding: 'utf8', env: { ...process.env, HOME: workDir, PCAFE_LICENCE: fakeLic } },
  )
  assert.notEqual(cliBlocked.status, 0, 'CLI export-video must fail without valid Pro licence')
  assert.match(cliBlocked.stderr, /PCafe Pro/i)

  // 2. Credential isolation, URL SSRF protection, and option validation
  const cleanEnv = sanitizedChildEnv({
    PATH: '/usr/bin',
    OPENAI_API_KEY: 'sk-secret-must-not-leak',
    PCAFE_VAULT_TOKEN: 'pcev_secret_must_not_leak',
  })
  assert.equal(cleanEnv.PATH, '/usr/bin')
  assert.equal(cleanEnv.OPENAI_API_KEY, undefined)
  assert.equal(cleanEnv.PCAFE_VAULT_TOKEN, undefined)

  assert.equal(normalizeOpenAiBaseUrl('https://api.openai.com/v1/'), 'https://api.openai.com/v1')
  assert.equal(normalizeOpenAiBaseUrl('http://127.0.0.1:8080/v1'), 'http://127.0.0.1:8080/v1')
  assert.throws(
    () => normalizeOpenAiBaseUrl('http://evil.example.com/v1'),
    (err) => err instanceof DeckVideoError && err.code === 'insecure_url',
  )
  assert.throws(
    () => normalizeOpenAiBaseUrl('https://169.254.169.254/latest'),
    (err) => err instanceof DeckVideoError && err.code === 'insecure_url',
  )
  assert.throws(
    () => normalizeOpenAiBaseUrl('https://10.0.0.1/v1'),
    (err) => err instanceof DeckVideoError && err.code === 'insecure_url',
  )
  assert.throws(
    () => normalizeOpenAiBaseUrl('https://api.openai.com/v1?key=1'),
    (err) => err instanceof DeckVideoError && err.code === 'invalid_config',
  )
  assert.throws(() => validateExportOptions({ tts: 'invalid' }), DeckVideoError)
  assert.throws(() => validateExportOptions({ voice: '--inject' }), DeckVideoError)
  assert.throws(() => validateExportOptions({ width: 1921 }), DeckVideoError)
  assert.throws(() => validateExportOptions({ fps: 0 }), DeckVideoError)
  assert.throws(() => validateExportOptions({ rate: 5 }), DeckVideoError)

  // 3. Language voice detection, duration estimation, and SRT hardening
  assert.equal(defaultEdgeVoice('欢迎使用 PCafe'), 'zh-CN-XiaoxiaoNeural')
  assert.equal(defaultEdgeVoice('こんにちは PCafe です'), 'ja-JP-NanamiNeural')
  assert.equal(defaultEdgeVoice('안녕하세요 PCafe 입니다'), 'ko-KR-SunHiNeural')
  assert.equal(defaultEdgeVoice('Welcome to PCafe'), 'en-US-AriaNeural')

  assert.equal(estimateSlideDuration('', { emptyDuration: 4.5 }), 4.5)
  assert.equal(estimateSlideDuration('hello world', { fixedDuration: 7 }), 7)
  assert.ok(estimateSlideDuration('안녕하세요 기업용 프레젠테이션 도구입니다.') >= 3.5)

  // Decimal numbers stay intact, `-->` is escaped, control chars stripped, timestamps monotonic
  const decimalSegs = splitSubtitleSegments('Revenue grew 3.5x in U.S. markets. Next: 2027 plan.')
  assert.ok(decimalSegs[0].includes('3.5x'), `decimal split unexpectedly: ${JSON.stringify(decimalSegs)}`)

  const srt = buildDeckSrt([
    {
      startSec: 0,
      audioStartSec: 0.35,
      audioDurationSec: 2.0,
      notes: 'Step A --> Step B\u0000\u2028 clean text.',
    },
    {
      // Intentionally overlapping start to verify monotonic clamping
      startSec: 1.0,
      audioStartSec: 1.0,
      audioDurationSec: 2.0,
      notes: '我们实现了三倍增长。谢谢大家！',
    },
  ])
  assert.ok(srt && !srt.includes('Step A --> Step B'), 'raw --> in cue text must be escaped')
  assert.ok(srt.includes('Step A -> Step B'))
  assert.ok(srt.includes('我们实现了三倍增长。'))

  // 4. Generate valid sample MP3 + two 1920x1080 PNG slides via ffmpeg
  const sampleMp3 = join(workDir, 'sample-tts.mp3')
  const genAudio = spawnSync(
    'ffmpeg',
    ['-y', '-loglevel', 'error', '-f', 'lavfi', '-i', 'sine=frequency=440:duration=1.2', '-c:a', 'libmp3lame', '-b:a', '128k', sampleMp3],
    { encoding: 'utf8' },
  )
  assert.equal(genAudio.status, 0, `ffmpeg sample mp3 failed: ${genAudio.stderr}`)
  const mp3Bytes = readFileSync(sampleMp3)

  const slide1Png = join(workDir, 'slide-1.png')
  const slide2Png = join(workDir, 'slide-2.png')
  for (const [pngPath, color] of [
    [slide1Png, '0x1e293b'],
    [slide2Png, '0x0f766e'],
  ]) {
    const r = spawnSync(
      'ffmpeg',
      ['-y', '-loglevel', 'error', '-f', 'lavfi', '-i', `color=c=${color}:s=1920x1080:d=1`, '-frames:v', '1', pngPath],
      { encoding: 'utf8' },
    )
    assert.equal(r.status, 0, `ffmpeg png failed: ${r.stderr}`)
  }

  // 5. Local OpenAI-compatible mock TTS server: cache hit, corrupt cache recovery, --no-cache isolation
  let hits = 0
  let lastAuth = ''
  let lastBody = null
  const server = createServer((req, res) => {
    hits += 1
    lastAuth = req.headers.authorization || ''
    const chunks = []
    req.on('data', (c) => chunks.push(c))
    req.on('end', () => {
      lastBody = JSON.parse(Buffer.concat(chunks).toString('utf8'))
      res.writeHead(200, { 'Content-Type': 'audio/mpeg' })
      res.end(mp3Bytes)
    })
  })
  await new Promise((res) => server.listen(0, '127.0.0.1', res))
  const { port } = server.address()

  const cacheDir = join(workDir, 'tts-cache')
  const noCacheTempDir = join(workDir, 'no-cache-temp')
  const ttsEnv = {
    OPENAI_API_KEY: 'sk-test-123',
    OPENAI_BASE_URL: `http://127.0.0.1:${port}/v1`,
  }
  try {
    // `--no-cache` writes only to tempDir and leaves cacheDir untouched
    const noCacheRes = await synthesizeSlideAudio({
      text: 'No cache narration.',
      tts: 'openai',
      voice: 'nova',
      model: 'tts-1',
      rate: 1.0,
      cacheDir,
      tempDir: noCacheTempDir,
      useCache: false,
      env: ttsEnv,
    })
    assert.equal(hits, 1)
    assert.equal(noCacheRes.cached, false)
    assert.equal(existsSync(cacheDir), false, '--no-cache must not create or write global cacheDir')

    // Normal cached call
    const first = await synthesizeSlideAudio({
      text: 'Slide one narration.',
      tts: 'openai',
      voice: 'nova',
      model: 'tts-1-hd',
      rate: 1.1,
      cacheDir,
      env: ttsEnv,
    })
    assert.equal(hits, 2)
    assert.equal(lastAuth, 'Bearer sk-test-123')
    assert.equal(lastBody.voice, 'nova')
    assert.equal(lastBody.model, 'tts-1-hd')
    assert.equal(lastBody.speed, 1.1)
    assert.equal(first.cached, false)

    const dur = probeAudioDuration(first.audioPath)
    assert.ok(dur > 1.0 && dur < 1.5, `unexpected probed duration: ${dur}`)

    // Second call hits cache without contacting server
    const second = await synthesizeSlideAudio({
      text: 'Slide one narration.',
      tts: 'openai',
      voice: 'nova',
      model: 'tts-1-hd',
      rate: 1.1,
      cacheDir,
      env: ttsEnv,
    })
    assert.equal(hits, 2, 'second call should hit TTS cache')
    assert.equal(second.cached, true)

    // Corrupt cached MP3 (> 128 bytes of garbage) auto-heals via ffprobe validation & re-synthesis
    writeFileSync(first.audioPath, Buffer.alloc(1024, 0x58))
    const healed = await synthesizeSlideAudio({
      text: 'Slide one narration.',
      tts: 'openai',
      voice: 'nova',
      model: 'tts-1-hd',
      rate: 1.1,
      cacheDir,
      env: ttsEnv,
    })
    assert.equal(hits, 3, 'corrupt cache entry must be evicted and re-synthesized')
    assert.equal(healed.cached, false)

    // 6. Full 720p MP4 + continuous AAC + embedded SRT encode & ffprobe verification
    const srtPath = join(workDir, 'deck-720p.srt')
    const outMp4 = join(workDir, 'deck-720p.mp4')
    const slideEntries = [
      {
        imagePath: slide1Png,
        audioPath: healed.audioPath,
        padBeforeSec: 0.35,
        durationSec: +(0.35 + dur + 0.55).toFixed(3),
        startSec: 0,
        audioStartSec: 0.35,
        audioDurationSec: dur,
        notes: 'Slide one narration.',
      },
      {
        imagePath: slide2Png,
        audioPath: null,
        padBeforeSec: 0,
        durationSec: 1.5,
        startSec: +(0.35 + dur + 0.55).toFixed(3),
        audioStartSec: +(0.35 + dur + 0.55).toFixed(3),
        audioDurationSec: 1.2,
        notes: 'Slide two silent summary.',
      },
    ]
    writeFileSync(srtPath, buildDeckSrt(slideEntries), 'utf8')
    const opts = validateExportOptions({
      tts: 'openai',
      subtitles: true,
      transition: 'fade',
      fps: 30,
      width: 1280,
      height: 720,
      crf: 20,
    })
    encodeSlidesToMp4({ slides: slideEntries, outPath: outMp4, srtPath, opts })
    assert.ok(existsSync(outMp4))

    const verified = verifyMp4Output(outMp4)
    const vStream = verified.streams.find((s) => s.codec_type === 'video')
    const aStream = verified.streams.find((s) => s.codec_type === 'audio')
    const sStream = verified.streams.find((s) => s.codec_type === 'subtitle')
    assert.equal(vStream.codec_name, 'h264')
    assert.equal(vStream.pix_fmt, 'yuv420p')
    assert.equal(vStream.width, 1280)
    assert.equal(vStream.height, 720)
    assert.equal(aStream.codec_name, 'aac')
    assert.equal(Number(aStream.sample_rate), 48000)
    assert.equal(sStream.codec_name, 'mov_text')
    assert.ok(verified.durationSec > 3.2 && verified.durationSec < 4.5, `unexpected total duration: ${verified.durationSec}`)
    assert.ok(readdirSync(cacheDir).length >= 1)
  } finally {
    await new Promise((res) => server.close(res))
  }

  console.log('deck-video-selftest: PASS')
} finally {
  rmSync(workDir, { recursive: true, force: true })
}
