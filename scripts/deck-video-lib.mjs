// Core library for `pcafe export-video`: Deck HTML → narrated MP4 + SRT.
// Plain Node ESM (>= 20.11), zero extra npm dependencies beyond ffmpeg/ffprobe + Playwright.
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, mkdtempSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { isIP } from 'node:net'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { findLiveLicence } from './licence-util.mjs'

export const SUPPORTED_TTS = new Set(['openai', 'edge', 'none'])
export const SUPPORTED_TRANSITIONS = new Set(['fade', 'none'])

const VOICE_RE = /^[A-Za-z0-9][A-Za-z0-9._-]{1,79}$/
const MAX_TTS_RESPONSE_BYTES = 50 * 1024 * 1024 // 50 MiB ceiling per slide audio
const FFPROBE_TIMEOUT_MS = 30_000
const FFMPEG_TIMEOUT_MS = 180_000
const EDGE_TTS_TIMEOUT_MS = 60_000

const SAFE_CHILD_ENV_KEYS = [
  'PATH',
  'HOME',
  'USER',
  'LOGNAME',
  'SHELL',
  'LANG',
  'LC_ALL',
  'LC_CTYPE',
  'TMPDIR',
  'TEMP',
  'TMP',
  'XDG_CACHE_HOME',
  'XDG_CONFIG_HOME',
  'SystemRoot',
  'WINDIR',
  'COMSPEC',
  'PATHEXT',
  'LOCALAPPDATA',
  'APPDATA',
  'USERPROFILE',
  'PYTHONUTF8',
  'SSL_CERT_FILE',
  'SSL_CERT_DIR',
  'HTTP_PROXY',
  'HTTPS_PROXY',
  'NO_PROXY',
  'http_proxy',
  'https_proxy',
  'no_proxy',
]

export const DEFAULTS = {
  tts: 'none',
  voice: null,
  model: 'tts-1',
  rate: 1.0,
  slideDuration: null, // auto-estimated when null in --tts none mode
  emptyDuration: 4.0,
  padBefore: 0.35,
  padAfter: 0.55,
  transition: 'fade',
  transitionDuration: 0.35,
  subtitles: false,
  fps: 30,
  width: 1920,
  height: 1080,
  crf: 18,
  cache: true,
  dryRun: false,
}

export class DeckVideoError extends Error {
  constructor(message, code = 'deck_video_error', exitCode = 1) {
    super(message)
    this.name = 'DeckVideoError'
    this.code = code
    this.exitCode = exitCode
  }
}

/** Builds a minimal child process env so secrets like OPENAI_API_KEY never leak to ffmpeg/edge-tts. */
export function sanitizedChildEnv(env = process.env) {
  const out = {}
  for (const k of SAFE_CHILD_ENV_KEYS) {
    if (env[k] !== undefined) out[k] = env[k]
  }
  return out
}

/** Enforces an active PCafe Pro or Founder Lifetime licence offline. */
export function assertProLicence(root, env = process.env) {
  const status = findLiveLicence(root, env)
  if (!status.ok) {
    throw new DeckVideoError(
      `Deck-to-Video export requires PCafe Pro or Founder Lifetime.\n${status.problem}`,
      'pro_licence_required',
      1,
    )
  }
  return status
}

function isBlockedPrivateOrMetadataHost(hostname) {
  const clean = hostname.replace(/^\[|\]$/g, '').toLowerCase()
  if (clean === '0.0.0.0' || clean === '::' || clean === 'metadata.google.internal') {
    return true
  }
  const ipKind = isIP(clean)
  if (ipKind === 4) {
    const [a, b] = clean.split('.').map(Number)
    if (a === 0 || a === 10 || a === 127) return true
    if (a === 169 && b === 254) return true // cloud metadata & link-local
    if (a === 172 && b >= 16 && b <= 31) return true
    if (a === 192 && b === 168) return true
    if (a === 100 && b >= 64 && b <= 127) return true // CGNAT
  }
  if (ipKind === 6) {
    if (
      clean === '::1' ||
      clean.startsWith('fe80:') ||
      clean.startsWith('fc') ||
      clean.startsWith('fd') ||
      clean.startsWith('::ffff:127.') ||
      clean.startsWith('::ffff:169.254.') ||
      clean.startsWith('::ffff:10.') ||
      clean.startsWith('::ffff:192.168.')
    ) {
      return true
    }
  }
  return false
}

export function normalizeOpenAiBaseUrl(raw, env = process.env) {
  const input = (raw || 'https://api.openai.com/v1').trim().replace(/\/+$/, '')
  let u
  try {
    u = new URL(input)
  } catch {
    throw new DeckVideoError(`invalid OPENAI_BASE_URL "${input}".`, 'invalid_config', 2)
  }
  if (u.username || u.password) {
    throw new DeckVideoError('OPENAI_BASE_URL must not embed credentials.', 'invalid_config', 2)
  }
  if (u.search || u.hash) {
    throw new DeckVideoError('OPENAI_BASE_URL must not include query parameters or hash fragments.', 'invalid_config', 2)
  }
  const isLocalLoopback = u.hostname === 'localhost' || u.hostname === '127.0.0.1' || u.hostname === '[::1]'
  if (u.protocol !== 'https:' && !(isLocalLoopback && u.protocol === 'http:')) {
    throw new DeckVideoError(
      `refusing insecure OPENAI_BASE_URL "${input}": HTTPS is required (except localhost/127.0.0.1).`,
      'insecure_url',
      2,
    )
  }
  const allowPrivate = env.PCAFE_ALLOW_PRIVATE_TTS_URL === '1'
  if (!isLocalLoopback && !allowPrivate && isBlockedPrivateOrMetadataHost(u.hostname)) {
    throw new DeckVideoError(
      `refusing private or link-local OPENAI_BASE_URL "${input}". Set PCAFE_ALLOW_PRIVATE_TTS_URL=1 to override intentionally.`,
      'insecure_url',
      2,
    )
  }
  return `${u.origin}${u.pathname}`.replace(/\/+$/, '')
}

export function validateExportOptions(raw) {
  const opts = { ...DEFAULTS, ...raw }
  if (!SUPPORTED_TTS.has(opts.tts)) {
    throw new DeckVideoError(
      `invalid --tts "${opts.tts}": expected one of openai, edge, none.`,
      'invalid_option',
      2,
    )
  }
  if (!SUPPORTED_TRANSITIONS.has(opts.transition)) {
    throw new DeckVideoError(
      `invalid --transition "${opts.transition}": expected fade or none.`,
      'invalid_option',
      2,
    )
  }
  if (opts.voice !== null && opts.voice !== undefined) {
    const v = String(opts.voice).trim()
    if (!VOICE_RE.test(v)) {
      throw new DeckVideoError(
        `invalid --voice "${opts.voice}": expected 2-80 alphanumeric, dot, underscore, or dash characters.`,
        'invalid_option',
        2,
      )
    }
    opts.voice = v
  } else {
    opts.voice = null
  }
  const numCheck = (val, name, min, max, integer = false) => {
    const n = Number(val)
    if (!Number.isFinite(n) || n < min || n > max || (integer && !Number.isInteger(n))) {
      throw new DeckVideoError(
        `invalid --${name} "${val}": expected ${integer ? 'an integer' : 'a number'} between ${min} and ${max}.`,
        'invalid_option',
        2,
      )
    }
    return n
  }
  opts.rate = numCheck(opts.rate, 'rate', 0.5, 2.0, false)
  opts.fps = numCheck(opts.fps, 'fps', 1, 60, true)
  opts.width = numCheck(opts.width, 'width', 320, 3840, true)
  opts.height = numCheck(opts.height, 'height', 240, 2160, true)
  if (opts.width % 2 !== 0 || opts.height % 2 !== 0) {
    throw new DeckVideoError('--width and --height must be even integers for H.264 yuv420p encoding.', 'invalid_option', 2)
  }
  opts.crf = numCheck(opts.crf, 'crf', 10, 35, true)
  if (opts.slideDuration !== null && opts.slideDuration !== undefined) {
    opts.slideDuration = numCheck(opts.slideDuration, 'slide-duration', 1, 120, false)
  } else {
    opts.slideDuration = null
  }
  opts.emptyDuration = numCheck(opts.emptyDuration, 'empty-duration', 1, 120, false)
  opts.padBefore = numCheck(opts.padBefore, 'pad-before', 0, 5, false)
  opts.padAfter = numCheck(opts.padAfter, 'pad-after', 0, 5, false)
  return opts
}

export function ensureMediaBinaries() {
  const env = sanitizedChildEnv()
  for (const bin of ['ffmpeg', 'ffprobe']) {
    const r = spawnSync(bin, ['-version'], { stdio: 'ignore', env, timeout: 10_000 })
    if (r.error || r.status !== 0) {
      throw new DeckVideoError(
        `${bin} not found on PATH. Install FFmpeg (includes ffprobe) before exporting video.`,
        'missing_ffmpeg',
        2,
      )
    }
  }
}

export function probeAudioDuration(audioPath) {
  const r = spawnSync(
    'ffprobe',
    ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', audioPath],
    { encoding: 'utf8', env: sanitizedChildEnv(), timeout: FFPROBE_TIMEOUT_MS },
  )
  if (r.error || r.status !== 0) {
    throw new DeckVideoError(
      `ffprobe failed on ${audioPath}: ${(r.stderr || r.error?.message || '').trim()}`,
      'ffprobe_failed',
      1,
    )
  }
  const dur = Number(String(r.stdout || '').trim())
  if (!Number.isFinite(dur) || dur <= 0) {
    throw new DeckVideoError(`invalid audio duration probed from ${audioPath}: "${r.stdout}"`, 'ffprobe_failed', 1)
  }
  return dur
}

export function verifyMp4Output(mp4Path) {
  const r = spawnSync(
    'ffprobe',
    ['-v', 'error', '-show_format', '-show_streams', '-of', 'json', mp4Path],
    { encoding: 'utf8', env: sanitizedChildEnv(), timeout: FFPROBE_TIMEOUT_MS },
  )
  if (r.error || r.status !== 0) {
    throw new DeckVideoError(
      `generated MP4 verification failed: ${(r.stderr || r.error?.message || '').trim()}`,
      'verify_failed',
      1,
    )
  }
  const info = JSON.parse(r.stdout || '{}')
  const hasVideo = Array.isArray(info.streams) && info.streams.some((s) => s.codec_type === 'video')
  const dur = Number(info.format?.duration || 0)
  if (!hasVideo || !Number.isFinite(dur) || dur <= 0) {
    throw new DeckVideoError('generated MP4 is missing a valid video stream or duration.', 'verify_failed', 1)
  }
  return { durationSec: dur, streams: info.streams }
}

export function detectScriptLanguage(text) {
  const s = String(text || '')
  if (/[\u3040-\u30ff]/.test(s)) return 'ja'
  if (/[\uac00-\ud7af\u1100-\u11ff]/.test(s)) return 'ko'
  if (/[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/.test(s)) return 'zh'
  return 'en'
}

export function defaultEdgeVoice(text) {
  switch (detectScriptLanguage(text)) {
    case 'ja':
      return 'ja-JP-NanamiNeural'
    case 'ko':
      return 'ko-KR-SunHiNeural'
    case 'zh':
      return 'zh-CN-XiaoxiaoNeural'
    default:
      return 'en-US-AriaNeural'
  }
}

export function hasCjk(text) {
  return /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uac00-\ud7af]/.test(text)
}

/** Estimates natural reading duration (in seconds) when `--tts none` is used without fixed `--slide-duration`. */
export function estimateSlideDuration(notes, { fixedDuration = null, emptyDuration = 4.0 } = {}) {
  if (fixedDuration !== null && fixedDuration !== undefined) return fixedDuration
  const clean = String(notes || '').trim()
  if (!clean) return emptyDuration
  const cjkChars = (clean.match(/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uac00-\ud7af]/g) || []).length
  const latinWords = (clean.replace(/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uac00-\ud7af]/g, ' ').match(/[A-Za-z0-9]+/g) || []).length
  const est = cjkChars / 4.2 + latinWords / 2.5 + 1.2
  return Math.round(Math.max(3.5, Math.min(25, est)) * 100) / 100
}

export function fmtSrtTime(sec) {
  const ms = Math.max(0, Math.round(sec * 1000))
  const h = String(Math.floor(ms / 3600000)).padStart(2, '0')
  const m = String(Math.floor((ms % 3600000) / 60000)).padStart(2, '0')
  const s = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0')
  const rem = String(ms % 1000).padStart(3, '0')
  return `${h}:${m}:${s},${rem}`
}

/** Sanitizes text for SRT cues (removes control/bidi/line-separator chars and escapes `-->`). */
export function sanitizeSrtText(raw) {
  return String(raw || '')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f\u2028\u2029\u202a-\u202e\u2066-\u2069]/g, '')
    .replace(/-->/g, '->')
    .trim()
}

/** Splits speaker notes into readable subtitle segments without breaking decimals, abbreviations, or surrogate pairs. */
export function splitSubtitleSegments(text, maxChars = 44) {
  const normalized = sanitizeSrtText(text)
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .join(' ')
  if (!normalized) return []

  // Split on CJK sentence terminators, or Latin `.!?` followed by whitespace (avoiding decimals like 3.5 and U.S.)
  const rawSentences = normalized
    .split(/(?<=[。！？；;])|(?<=[!?])\s+|(?<![A-Z0-9])(?<=\.)\s+(?=[A-Z\u3040-\u9fff\uac00-\ud7af"“])/u)
    .map((s) => s.trim())
    .filter(Boolean)

  const segments = []
  for (const sentence of rawSentences) {
    if (Array.from(sentence).length <= maxChars) {
      segments.push(sentence)
      continue
    }
    const clauses = sentence
      .split(/(?<=[，,、：:])\s*/u)
      .map((s) => s.trim())
      .filter(Boolean)
    let buf = ''
    for (const clause of clauses) {
      if (!buf) {
        buf = clause
      } else if (Array.from(buf).length + 1 + Array.from(clause).length <= maxChars) {
        buf = hasCjk(buf) ? `${buf}${clause}` : `${buf} ${clause}`
      } else {
        segments.push(buf)
        buf = clause
      }
    }
    if (buf) segments.push(buf)
  }

  // Code-point safe safeguard for very long unpunctuated lines (never splits surrogate pairs)
  const finalSegs = []
  for (const seg of segments) {
    const cps = Array.from(seg)
    if (cps.length <= Math.round(maxChars * 1.5)) {
      finalSegs.push(seg)
      continue
    }
    if (hasCjk(seg)) {
      for (let i = 0; i < cps.length; i += maxChars) {
        finalSegs.push(cps.slice(i, i + maxChars).join('').trim())
      }
    } else {
      const words = seg.split(/\s+/)
      let line = ''
      for (const w of words) {
        if (!line) line = w
        else if (Array.from(line).length + 1 + Array.from(w).length <= maxChars) line += ' ' + w
        else {
          finalSegs.push(line)
          line = w
        }
      }
      if (line) finalSegs.push(line)
    }
  }
  return finalSegs.map(sanitizeSrtText).filter(Boolean)
}

/**
 * Generates a strictly monotonic, sanitized SRT document from timed slide entries.
 */
export function buildDeckSrt(entries) {
  const cues = []
  let globalFloor = 0

  for (const item of entries) {
    const segs = splitSubtitleSegments(item.notes)
    if (!segs.length) continue
    const rawStart = Number.isFinite(item.audioStartSec) ? item.audioStartSec : item.startSec
    const spanStart = Math.max(globalFloor, Math.max(0, rawStart))
    const rawEnd = rawStart + Math.max(0.4, Number(item.audioDurationSec) || 0)
    const spanDur = rawEnd - spanStart
    if (spanDur <= 0.1) continue

    const weights = segs.map((s) => Math.max(1, Array.from(s).length))
    const totalWeight = weights.reduce((a, b) => a + b, 0)
    let cursor = spanStart
    for (let i = 0; i < segs.length; i++) {
      const pieceDur = i === segs.length - 1
        ? rawEnd - cursor
        : (spanDur * weights[i]) / totalWeight
      const end = Math.min(rawEnd, cursor + Math.max(0.2, pieceDur))
      const startMs = Math.round(cursor * 1000)
      const endMs = Math.round(end * 1000)
      if (endMs > startMs) {
        cues.push({ start: startMs / 1000, end: endMs / 1000, text: segs[i] })
        globalFloor = endMs / 1000
      }
      cursor = end
    }
  }
  if (!cues.length) return null
  return cues
    .map((c, idx) => `${idx + 1}\n${fmtSrtTime(c.start)} --> ${fmtSrtTime(c.end)}\n${c.text}\n`)
    .join('\n')
}

function ttsCacheKey({ tts, endpoint, model, voice, rate, text }) {
  return createHash('sha256')
    .update(JSON.stringify({ v: 2, tts, endpoint, model, voice, rate, text }))
    .digest('hex')
    .slice(0, 32)
}

async function readBoundedBuffer(res, maxBytes) {
  const cl = Number(res.headers.get('content-length') || '0')
  if (Number.isFinite(cl) && cl > maxBytes) {
    throw new DeckVideoError(`TTS audio response exceeds ${Math.round(maxBytes / (1024 * 1024))} MiB limit.`, 'tts_failed', 1)
  }
  if (!res.body) return Buffer.alloc(0)
  const reader = res.body.getReader()
  const chunks = []
  let total = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      if (!value) continue
      total += value.byteLength
      if (total > maxBytes) {
        await reader.cancel().catch(() => {})
        throw new DeckVideoError(`TTS audio response exceeds ${Math.round(maxBytes / (1024 * 1024))} MiB limit.`, 'tts_failed', 1)
      }
      chunks.push(Buffer.from(value))
    }
  } finally {
    reader.releaseLock()
  }
  return Buffer.concat(chunks, total)
}

/**
 * Synthesizes narration audio for a single slide's speaker notes.
 * Returns `{ audioPath, durationSec, cached, provider, voice }` or `null` when notes are empty or `tts === 'none'`.
 * When `useCache === false`, writes only to `tempDir` (never reads or writes `cacheDir`).
 */
export async function synthesizeSlideAudio({
  text,
  tts,
  voice = null,
  model = 'tts-1',
  rate = 1.0,
  cacheDir,
  tempDir = null,
  useCache = true,
  env = process.env,
}) {
  const clean = String(text || '').trim()
  if (!clean || tts === 'none') return null

  const resolvedVoice = voice || (tts === 'openai' ? 'alloy' : defaultEdgeVoice(clean))
  if (!VOICE_RE.test(resolvedVoice)) {
    throw new DeckVideoError(`invalid TTS voice "${resolvedVoice}".`, 'invalid_option', 2)
  }

  const endpoint = tts === 'openai' ? normalizeOpenAiBaseUrl(env.OPENAI_BASE_URL, env) : 'edge-tts'
  const key = ttsCacheKey({ tts, endpoint, model, voice: resolvedVoice, rate, text: clean })
  const targetDir = useCache ? cacheDir : (tempDir || cacheDir)
  mkdirSync(targetDir, { recursive: true })
  const outPath = join(targetDir, `${key}.mp3`)

  if (useCache && existsSync(outPath)) {
    try {
      const dur = probeAudioDuration(outPath)
      return { audioPath: outPath, durationSec: dur, cached: true, provider: tts, voice: resolvedVoice }
    } catch {
      // Corrupt/truncated cache entry: evict cleanly and re-synthesize once.
      rmSync(outPath, { force: true })
    }
  }

  if (tts === 'openai') {
    const apiKey = (env.OPENAI_API_KEY || '').trim()
    if (!apiKey) {
      throw new DeckVideoError(
        'OPENAI_API_KEY is required for `--tts openai`. Set OPENAI_API_KEY (and optional OPENAI_BASE_URL), or use `--tts edge` / `--tts none`.',
        'missing_openai_key',
        2,
      )
    }
    const speed = Math.max(0.25, Math.min(4.0, Number(rate) || 1.0))
    const res = await fetch(`${endpoint}/audio/speech`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        voice: resolvedVoice,
        input: clean,
        speed,
        response_format: 'mp3',
      }),
      redirect: 'error',
      signal: AbortSignal.timeout(60_000),
    })
    if (!res.ok) {
      const errText = await res.text().catch(() => '')
      throw new DeckVideoError(
        `OpenAI TTS request failed (${res.status}): ${errText.slice(0, 240)}`,
        'tts_failed',
        1,
      )
    }
    const buf = await readBoundedBuffer(res, MAX_TTS_RESPONSE_BYTES)
    if (buf.byteLength < 128) {
      throw new DeckVideoError('OpenAI TTS returned an empty or truncated audio payload.', 'tts_failed', 1)
    }
    const tmpOut = `${outPath}.${process.pid}.${Date.now()}.tmp.mp3`
    writeFileSync(tmpOut, buf)
    let dur
    try {
      dur = probeAudioDuration(tmpOut)
    } catch (err) {
      rmSync(tmpOut, { force: true })
      throw err
    }
    renameSync(tmpOut, outPath)
    return { audioPath: outPath, durationSec: dur, cached: false, provider: 'openai', voice: resolvedVoice }
  }

  if (tts === 'edge') {
    const childEnv = sanitizedChildEnv(env)
    const check = spawnSync('edge-tts', ['--version'], { stdio: 'ignore', env: childEnv, timeout: 10_000 })
    if (check.error || check.status !== 0) {
      throw new DeckVideoError(
        '`edge-tts` CLI not found on PATH. Install it with `pip install edge-tts` (or `pipx install edge-tts`), or use `--tts openai` / `--tts none`.',
        'missing_edge_tts',
        2,
      )
    }
    const pct = Math.round((Number(rate) - 1) * 100)
    const rateArg = `${pct >= 0 ? '+' : ''}${pct}%`
    const tmpText = `${outPath}.${process.pid}.${Date.now()}.txt`
    const tmpOut = `${outPath}.${process.pid}.${Date.now()}.tmp.mp3`
    writeFileSync(tmpText, clean, 'utf8')
    try {
      // Pass text via `--file` to avoid ARG_MAX limits and leading-dash option parsing issues.
      const runRes = spawnSync(
        'edge-tts',
        ['--voice', resolvedVoice, `--rate=${rateArg}`, '--file', tmpText, '--write-media', tmpOut],
        { encoding: 'utf8', env: childEnv, timeout: EDGE_TTS_TIMEOUT_MS },
      )
      if (runRes.error || runRes.status !== 0 || !existsSync(tmpOut)) {
        rmSync(tmpOut, { force: true })
        throw new DeckVideoError(
          `edge-tts failed: ${(runRes.stderr || runRes.error?.message || `exit ${runRes.status}`).trim()}`,
          'tts_failed',
          1,
        )
      }
      const dur = probeAudioDuration(tmpOut)
      renameSync(tmpOut, outPath)
      return { audioPath: outPath, durationSec: dur, cached: false, provider: 'edge', voice: resolvedVoice }
    } finally {
      rmSync(tmpText, { force: true })
    }
  }

  throw new DeckVideoError(`unsupported TTS provider "${tts}".`, 'invalid_option', 2)
}

function runFfmpeg(args, label) {
  const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', ...args], {
    encoding: 'utf8',
    env: sanitizedChildEnv(),
    maxBuffer: 10 * 1024 * 1024,
    timeout: FFMPEG_TIMEOUT_MS,
  })
  if (r.error || r.status !== 0) {
    throw new DeckVideoError(
      `ffmpeg (${label}) failed: ${(r.stderr || r.error?.message || `exit ${r.status}`).trim()}`,
      'ffmpeg_failed',
      1,
    )
  }
}

/**
 * Encodes per-slide PNG stills + optional narration MP3s into a single BT.709 H.264/AAC MP4.
 * Video segments are encoded at exact CFR and concatenated losslessly; audio is rendered
 * as one continuous 48kHz stereo AAC timeline to eliminate per-segment AAC priming drift.
 */
export function encodeSlidesToMp4({ slides, outPath, srtPath = null, opts }) {
  if (!slides.length) {
    throw new DeckVideoError('no slides to encode.', 'empty_deck', 1)
  }
  const workDir = mkdtempSync(join(tmpdir(), 'pcafe-deck-video-'))
  try {
    mkdirSync(dirname(resolve(outPath)), { recursive: true })
    const videoSegments = []
    const audioSegments = []
    const baseFade = opts.transition === 'fade' ? opts.transitionDuration : 0

    for (let i = 0; i < slides.length; i++) {
      const s = slides[i]
      const segIdx = String(i + 1).padStart(4, '0')
      const vidSeg = join(workDir, `vid-${segIdx}.mp4`)
      const audSeg = join(workDir, `aud-${segIdx}.wav`)
      const dur = Math.max(0.5, Number(s.durationSec))
      const durStr = dur.toFixed(3)
      // Automatically shorten fade on short slides instead of silently disabling it
      const fadeSec = baseFade > 0 ? Math.min(baseFade, +(dur * 0.2).toFixed(2)) : 0

      const vfParts = [
        `scale=${opts.width}:${opts.height}:force_original_aspect_ratio=decrease`,
        `pad=${opts.width}:${opts.height}:(ow-iw)/2:(oh-ih)/2:color=black`,
        'scale=in_range=full:out_range=tv:out_color_matrix=bt709:flags=lanczos+accurate_rnd+full_chroma_int',
        'format=yuv420p',
        'setparams=color_primaries=bt709:color_trc=bt709:colorspace=bt709:range=tv',
      ]
      if (fadeSec >= 0.08) {
        if (i > 0) vfParts.push(`fade=t=in:st=0:d=${fadeSec.toFixed(2)}`)
        if (i < slides.length - 1) {
          vfParts.push(`fade=t=out:st=${(dur - fadeSec).toFixed(3)}:d=${fadeSec.toFixed(2)}`)
        }
      }

      const keyint = Math.max(1, Math.round(opts.fps / 2))
      runFfmpeg(
        [
          '-loop', '1',
          '-framerate', String(opts.fps),
          '-t', durStr,
          '-i', s.imagePath,
          '-an',
          '-vf', vfParts.join(','),
          '-c:v', 'libx264',
          '-profile:v', 'high',
          '-preset', 'medium',
          '-crf', String(opts.crf),
          '-g', String(keyint),
          '-r', String(opts.fps),
          '-t', durStr,
          '-map_metadata', '-1',
          vidSeg,
        ],
        `video slide ${i + 1}`,
      )
      videoSegments.push(vidSeg)

      // Build sample-exact PCM WAV segment per slide so the final AAC encode is one continuous stream.
      if (s.audioPath) {
        const delayMs = Math.max(0, Math.round((s.padBeforeSec ?? opts.padBefore) * 1000))
        runFfmpeg(
          [
            '-i', s.audioPath,
            '-vn',
            '-af', `aresample=48000,aformat=channel_layouts=stereo,adelay=${delayMs}|${delayMs},apad=whole_dur=${durStr},atrim=0:${durStr}`,
            '-c:a', 'pcm_s16le',
            '-ar', '48000',
            '-ac', '2',
            audSeg,
          ],
          `audio slide ${i + 1}`,
        )
      } else {
        runFfmpeg(
          [
            '-f', 'lavfi',
            '-t', durStr,
            '-i', 'anullsrc=channel_layout=stereo:sample_rate=48000',
            '-c:a', 'pcm_s16le',
            '-ar', '48000',
            '-ac', '2',
            audSeg,
          ],
          `silence slide ${i + 1}`,
        )
      }
      audioSegments.push(audSeg)
    }

    const escapeConcat = (p) => `file '${p.replace(/'/g, "'\\''")}'`
    const vidList = join(workDir, 'vid-concat.txt')
    const audList = join(workDir, 'aud-concat.txt')
    writeFileSync(vidList, videoSegments.map(escapeConcat).join('\n') + '\n', 'utf8')
    writeFileSync(audList, audioSegments.map(escapeConcat).join('\n') + '\n', 'utf8')

    const finalArgs = [
      '-f', 'concat', '-safe', '0', '-i', vidList,
      '-f', 'concat', '-safe', '0', '-i', audList,
    ]
    if (opts.subtitles && srtPath && existsSync(srtPath)) {
      finalArgs.push(
        '-i', srtPath,
        '-map', '0:v:0',
        '-map', '1:a:0',
        '-map', '2:s:0',
        '-c:v', 'copy',
        '-c:a', 'aac',
        '-b:a', '192k',
        '-ar', '48000',
        '-ac', '2',
        '-c:s', 'mov_text',
        '-metadata:s:s:0', 'language=und',
      )
    } else {
      finalArgs.push(
        '-map', '0:v:0',
        '-map', '1:a:0',
        '-c:v', 'copy',
        '-c:a', 'aac',
        '-b:a', '192k',
        '-ar', '48000',
        '-ac', '2',
      )
    }
    finalArgs.push('-movflags', '+faststart', resolve(outPath))
    runFfmpeg(finalArgs, 'mux')
  } finally {
    rmSync(workDir, { recursive: true, force: true })
  }
}
