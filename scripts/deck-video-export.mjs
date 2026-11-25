// Deck HTML → narrated MP4 video + SRT subtitles exporter (PCafe Pro / Founder).
// Usage:
//   pcafe export-video <deck|file.html>
//     [--tts openai|edge|none] [--voice <name>] [--model <tts-1>] [--rate <1.0>]
//     [--slide-duration <sec>] [--transition fade|none] [--subtitles]
//     [--fps 30] [--width 1920] [--height 1080] [--crf 18]
//     [--out <path.mp4>] [--no-build] [--no-cache] [--dry-run] [--help]
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, realpathSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, dirname, join, relative, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import {
  DeckVideoError,
  assertProLicence,
  buildDeckSrt,
  encodeSlidesToMp4,
  ensureMediaBinaries,
  estimateSlideDuration,
  synthesizeSlideAudio,
  validateExportOptions,
  verifyMp4Output,
} from './deck-video-lib.mjs'

const ROOT = resolve(import.meta.dirname, '..')
const NAME_RE = /^[a-z0-9][a-z0-9-]*$/
const STAGE_W = 1920
const STAGE_H = 1080

const USAGE = `pcafe export-video - export a PCafe deck to narrated 1080p MP4 + SRT (Pro / Founder)

Usage:
  pcafe export-video <deck|file.html> [options]

Options:
  --tts <openai|edge|none>   Narration TTS engine (default: none)
  --voice <name>             TTS voice (OpenAI: alloy/nova/...; Edge: auto by language)
  --model <name>             OpenAI TTS model (default: tts-1)
  --rate <0.5..2.0>          Speech speed multiplier (default: 1.0)
  --slide-duration <sec>     Fixed duration per slide when --tts none (or slides without audio)
  --empty-duration <sec>     Duration for slides without speakerNotes (default: 4)
  --transition <fade|none>   Slide transition effect (default: fade)
  --subtitles                Embed soft subtitles (mov_text) into the MP4 (SRT is always written when notes exist)
  --fps <1..60>              Output frame rate (default: 30)
  --width <320..3840>        Output width, even integer (default: 1920)
  --height <240..2160>       Output height, even integer (default: 1080)
  --crf <10..35>             H.264 quality factor (default: 18)
  --out <path.mp4>           Output MP4 path (default: dist/<name>.mp4)
  --no-build                 Reuse existing dist/<name>.html without calling pcafe build
  --no-cache                 Bypass TTS audio cache (neither read nor write .cache/pcafe-tts)
  --dry-run                  Extract slides & speakerNotes and print timing estimate only
  -h, --help                 Show this help`

function parseCliArgs(argv) {
  if (argv.includes('--help') || argv.includes('-h')) {
    return { help: true }
  }
  const raw = {
    target: null,
    build: true,
    out: null,
    cache: true,
    subtitles: false,
    dryRun: false,
  }
  const valueFlags = new Set([
    '--tts',
    '--voice',
    '--model',
    '--rate',
    '--slide-duration',
    '--empty-duration',
    '--transition',
    '--fps',
    '--width',
    '--height',
    '--crf',
    '--out',
  ])
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--no-build') raw.build = false
    else if (a === '--no-cache') raw.cache = false
    else if (a === '--subtitles') raw.subtitles = true
    else if (a === '--dry-run') raw.dryRun = true
    else if (a.startsWith('--')) {
      const eq = a.indexOf('=')
      const flag = eq >= 0 ? a.slice(0, eq) : a
      if (!valueFlags.has(flag)) {
        throw new DeckVideoError(`unknown option "${flag}". Run \`pcafe export-video --help\` for usage.`, 'invalid_option', 2)
      }
      let val
      if (eq >= 0) {
        val = a.slice(eq + 1)
      } else {
        if (i + 1 >= argv.length || argv[i + 1].startsWith('--')) {
          throw new DeckVideoError(`missing value for ${flag}.`, 'invalid_option', 2)
        }
        val = argv[++i]
      }
      if (!val) {
        throw new DeckVideoError(`empty value for ${flag}.`, 'invalid_option', 2)
      }
      const key = flag.slice(2).replace(/-([a-z])/g, (_, ch) => ch.toUpperCase())
      raw[key] = val
    } else if (!raw.target) {
      raw.target = a
    } else {
      throw new DeckVideoError(`unexpected positional argument "${a}".`, 'invalid_option', 2)
    }
  }
  if (!raw.target) {
    throw new DeckVideoError(`missing deck name or HTML file.\n\n${USAGE}`, 'missing_target', 2)
  }
  const opts = validateExportOptions(raw)
  return { help: false, target: raw.target, build: raw.build, out: raw.out, opts }
}

function isSamePhysicalFile(a, b) {
  if (resolve(a) === resolve(b)) return true
  try {
    if (realpathSync(a) === realpathSync(b)) return true
  } catch { /* target may not exist yet */ }
  try {
    const sa = statSync(a)
    const sb = statSync(b)
    return sa.dev === sb.dev && sa.ino === sb.ino
  } catch {
    return false
  }
}

async function launchBrowser() {
  let pw
  try {
    pw = await import('playwright')
  } catch {
    throw new DeckVideoError(
      'Playwright is not installed. Run `npm install playwright && npx playwright install chromium` first.',
      'missing_playwright',
      1,
    )
  }
  try {
    return await pw.chromium.launch()
  } catch (err) {
    const msg = String(err?.message || err)
    if (/executable doesn't exist|browserType\.launch|failed to launch|playwright install/i.test(msg)) {
      throw new DeckVideoError(
        'Playwright Chromium is not installed. Run: npx playwright install chromium',
        'missing_chromium',
        1,
      )
    }
    throw err
  }
}

async function captureDeckSlidesAndNotes(htmlPath, { workDir, requireNotes }) {
  const browser = await launchBrowser()
  try {
    // Always capture the native 1920x1080 PrintView stage; ffmpeg scales cleanly to target --width/--height.
    const context = await browser.newContext({
      viewport: { width: STAGE_W, height: STAGE_H },
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
      acceptDownloads: false,
    })
    await context.setOffline(true)
    const allowedUrl = pathToFileURL(realpathSync(htmlPath)).href
    await context.route('**/*', (route) => {
      const reqUrl = route.request().url()
      if (
        reqUrl.startsWith(allowedUrl) ||
        reqUrl.startsWith('data:') ||
        reqUrl.startsWith('blob:')
      ) {
        return route.continue()
      }
      return route.abort()
    })

    const page = await context.newPage()
    const errors = []
    page.on('pageerror', (e) => errors.push(String(e)))

    await page.goto(`${allowedUrl}#/print`, { waitUntil: 'load' })
    await page.waitForSelector('.pp__page > .stage', { timeout: 30_000 })
    await page.evaluate(async () => {
      await document.fonts.ready
      await Promise.all([...document.images].map((img) => (img.complete ? null : img.decode().catch(() => null))))
    })
    await page.waitForTimeout(300)

    const deckTitle = await page.evaluate(() => document.title)
    const count = await page.locator('.pp__page').count()
    if (count === 0) {
      throw new DeckVideoError('no slides found in deck HTML (#/print rendered 0 .pp__page elements).', 'empty_deck', 1)
    }

    await page.addStyleTag({
      content: `.pp__bar{display:none!important} html,body{margin:0!important;padding:0!important;background:#000!important}
        .pp__page{margin:0!important} body.dv-solo .pp__page:not(.dv-on){display:none!important}`,
    })

    const images = []
    for (let i = 0; i < count; i++) {
      await page.evaluate((idx) => {
        document.body.classList.add('dv-solo')
        document.querySelectorAll('.pp__page').forEach((el, j) => el.classList.toggle('dv-on', j === idx))
        window.scrollTo(0, 0)
      }, i)
      await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))))
      await page.waitForTimeout(80)
      const imgPath = join(workDir, `slide-${String(i + 1).padStart(3, '0')}.png`)
      await page.screenshot({
        path: imgPath,
        type: 'png',
        clip: { x: 0, y: 0, width: STAGE_W, height: STAGE_H },
        animations: 'disabled',
        caret: 'hide',
      })
      images.push(imgPath)
    }
    await page.close()

    // Extract speaker notes from #/presenter (mirrors scripts/pptx-export.mjs)
    let notes = Array(count).fill('')
    const pv = await context.newPage()
    try {
      await pv.goto(`${allowedUrl}#/presenter`, { waitUntil: 'load' })
      await pv.waitForSelector('.pv__notes', { timeout: 15_000 })
      const presenterTitle = await pv.evaluate(() => document.title || '')
      const channelTitle = presenterTitle || deckTitle
      notes = []
      for (let i = 0; i < count; i++) {
        await pv.evaluate(
          ({ idx, title }) => {
            window.postMessage(
              { tag: 'pcafe-presenter', title, id: `dv-${idx}-${Math.random()}`, msg: { kind: 'state', index: idx, step: null, builds: 0 } },
              '*',
            )
          },
          { idx: i, title: channelTitle },
        )
        await pv.waitForFunction(
          (idx) => document.querySelector('.pv__page')?.textContent?.trim().startsWith(String(idx + 1).padStart(2, '0')),
          i,
          { timeout: 5000 },
        )
        const noteText = await pv.evaluate(() => {
          const p = document.querySelector('.pv__notes:not(.pv__notes--table) p:not(.pv__empty)')
          if (!p) return ''
          const c = p.cloneNode(true)
          c.querySelectorAll('img[alt]').forEach((img) => img.replaceWith(img.alt))
          return c.textContent.trim()
        })
        notes.push(noteText)
      }
    } catch (err) {
      if (requireNotes) {
        throw new DeckVideoError(
          `failed to extract speakerNotes from #/presenter (${err.message.split('\n')[0]}). Aborting instead of generating silent narration.`,
          'notes_extraction_failed',
          1,
        )
      }
      console.warn(`export-video: could not read speaker notes from #/presenter (${err.message.split('\n')[0]}); continuing without notes.`)
    } finally {
      await pv.close()
    }

    await context.close()
    return { title: deckTitle, count, images, notes, pageErrors: errors }
  } finally {
    await browser.close()
  }
}

async function main() {
  const parsed = parseCliArgs(process.argv.slice(2))
  if (parsed.help) {
    console.log(USAGE)
    return
  }
  const { target, build, out, opts } = parsed

  // 1. Pro / Founder licence check (offline Ed25519)
  assertProLicence(ROOT)

  // 2. Resolve input HTML (deck name or direct .html file)
  let htmlPath
  let stemName
  const resolvedCandidate = resolve(target)
  if (existsSync(resolvedCandidate) && target.toLowerCase().endsWith('.html')) {
    htmlPath = resolvedCandidate
    stemName = basename(htmlPath, '.html')
  } else {
    if (!NAME_RE.test(target)) {
      throw new DeckVideoError(
        `invalid deck name "${target}": use lowercase letters, digits and dashes, or pass an existing .html file.`,
        'invalid_target',
        2,
      )
    }
    stemName = target
    htmlPath = join(ROOT, 'dist', `${target}.html`)
    if (build) {
      // Delegate directly to `pcafe build` which performs strict input-hash reuse across all shared sources.
      const r = spawnSync(process.execPath, [join(ROOT, 'cli', 'pcafe.mjs'), 'build', target], {
        cwd: ROOT,
        stdio: 'inherit',
      })
      if (r.status !== 0 || !existsSync(htmlPath)) {
        throw new DeckVideoError('deck build failed.', 'build_failed', r.status || 1)
      }
    }
    if (!existsSync(htmlPath)) {
      throw new DeckVideoError(`built deck HTML not found: ${htmlPath}`, 'missing_html', 1)
    }
  }

  const outPath = resolve(out || join(ROOT, 'dist', `${stemName}.mp4`))
  if (!outPath.toLowerCase().endsWith('.mp4')) {
    throw new DeckVideoError(`--out must end with .mp4 (got "${outPath}").`, 'invalid_option', 2)
  }
  const stemOut = outPath.replace(/\.mp4$/i, '')
  const srtPath = `${stemOut}.srt`
  const manifestPath = `${stemOut}.video.json`
  for (const dest of [outPath, srtPath, manifestPath]) {
    if (isSamePhysicalFile(dest, htmlPath)) {
      throw new DeckVideoError(`refusing to overwrite input HTML file (${dest}).`, 'invalid_option', 2)
    }
  }

  if (!opts.dryRun) {
    ensureMediaBinaries()
  }

  const t0 = Date.now()
  const workDir = mkdtempSync(join(tmpdir(), 'pcafe-dv-shots-'))
  const cacheDir = join(ROOT, '.cache', 'pcafe-tts')
  const tmpMp4 = `${outPath}.${process.pid}.tmp.mp4`
  const tmpSrt = `${srtPath}.${process.pid}.tmp`
  const tmpManifest = `${manifestPath}.${process.pid}.tmp`

  try {
    const captured = await captureDeckSlidesAndNotes(htmlPath, {
      workDir,
      requireNotes: opts.tts !== 'none',
    })

    const timeline = []
    let cursorSec = 0

    for (let i = 0; i < captured.count; i++) {
      const note = captured.notes[i] || ''
      let audioPath = null
      let audioDurationSec = 0
      let cached = false
      let voiceUsed = null

      if (!opts.dryRun && opts.tts !== 'none' && note) {
        const synth = await synthesizeSlideAudio({
          text: note,
          tts: opts.tts,
          voice: opts.voice,
          model: opts.model,
          rate: opts.rate,
          cacheDir,
          tempDir: workDir,
          useCache: opts.cache,
        })
        if (synth) {
          audioPath = synth.audioPath
          audioDurationSec = synth.durationSec
          cached = synth.cached
          voiceUsed = synth.voice
        }
      }

      const padBeforeSec = audioPath ? opts.padBefore : 0
      const padAfterSec = audioPath ? opts.padAfter : 0
      const durationSec = audioPath
        ? Math.round((padBeforeSec + audioDurationSec + padAfterSec) * 1000) / 1000
        : estimateSlideDuration(note, {
            fixedDuration: opts.slideDuration,
            emptyDuration: opts.emptyDuration,
          })

      timeline.push({
        slide: i + 1,
        imagePath: captured.images[i],
        notes: note,
        audioPath,
        audioDurationSec: audioPath ? audioDurationSec : Math.max(0.5, durationSec - 0.4),
        padBeforeSec,
        durationSec,
        startSec: cursorSec,
        audioStartSec: cursorSec + padBeforeSec,
        cached,
        voice: voiceUsed,
      })
      cursorSec += durationSec
    }

    const totalSec = Math.round(cursorSec * 100) / 100
    const missingNoteSlides = timeline.filter((s) => !s.notes).map((s) => s.slide)

    if (opts.dryRun) {
      console.log(
        JSON.stringify(
          {
            dryRun: true,
            title: captured.title,
            slides: captured.count,
            slidesWithNotes: captured.count - missingNoteSlides.length,
            missingNoteSlides,
            tts: opts.tts,
            width: opts.width,
            height: opts.height,
            estimatedTotalSeconds: totalSec,
            outPath,
            timeline: timeline.map((s) => ({
              slide: s.slide,
              startSec: +s.startSec.toFixed(2),
              durationSec: +s.durationSec.toFixed(2),
              chars: s.notes.length,
              notesPreview: s.notes.slice(0, 80),
            })),
          },
          null,
          2,
        ),
      )
      return
    }

    if (opts.tts !== 'none' && missingNoteSlides.length) {
      console.warn(
        `export-video: slide(s) ${missingNoteSlides.join(', ')} have no speakerNotes and will play silently (${opts.emptyDuration}s each).`,
      )
    }

    // Stage all outputs in sibling temp files, verify MP4, then commit atomically.
    mkdirSync(dirname(outPath), { recursive: true })
    const srtContent = buildDeckSrt(timeline)
    if (srtContent) {
      writeFileSync(tmpSrt, srtContent, 'utf8')
    }

    encodeSlidesToMp4({
      slides: timeline,
      outPath: tmpMp4,
      srtPath: srtContent ? tmpSrt : null,
      opts,
    })

    const verified = verifyMp4Output(tmpMp4)

    const elapsedSec = +((Date.now() - t0) / 1000).toFixed(2)
    const manifest = {
      title: captured.title,
      sourceHtml: relative(ROOT, htmlPath),
      outputMp4: relative(ROOT, outPath),
      outputSrt: srtContent ? relative(ROOT, srtPath) : null,
      tts: opts.tts,
      width: opts.width,
      height: opts.height,
      fps: opts.fps,
      subtitlesEmbedded: Boolean(opts.subtitles && srtContent),
      totalDurationSec: +verified.durationSec.toFixed(3),
      renderSeconds: elapsedSec,
      missingNoteSlides,
      slides: timeline.map((s) => ({
        slide: s.slide,
        startSec: +s.startSec.toFixed(3),
        durationSec: +s.durationSec.toFixed(3),
        hasAudio: Boolean(s.audioPath),
        cachedAudio: s.cached,
        voice: s.voice,
        notesChars: s.notes.length,
      })),
      pageErrors: captured.pageErrors,
    }
    writeFileSync(tmpManifest, JSON.stringify(manifest, null, 2) + '\n', 'utf8')

    // Atomic commit after MP4 verification succeeds
    renameSync(tmpMp4, outPath)
    if (srtContent) {
      renameSync(tmpSrt, srtPath)
    } else if (existsSync(srtPath)) {
      rmSync(srtPath, { force: true })
    }
    renameSync(tmpManifest, manifestPath)

    console.log(
      `wrote ${relative(ROOT, outPath)}${srtContent ? ` + ${relative(ROOT, srtPath)}` : ''} (${captured.count} slides, ${verified.durationSec.toFixed(1)}s, ${opts.width}x${opts.height}, tts=${opts.tts}, rendered in ${elapsedSec}s)`,
    )
    if (captured.pageErrors.length) {
      for (const e of captured.pageErrors) console.warn(`export-video pageerror: ${e}`)
    }
  } finally {
    rmSync(tmpMp4, { force: true })
    rmSync(tmpSrt, { force: true })
    rmSync(tmpManifest, { force: true })
    rmSync(workDir, { recursive: true, force: true })
  }
}

try {
  await main()
} catch (err) {
  if (err instanceof DeckVideoError) {
    console.error(`pcafe export-video: ${err.message}`)
    process.exit(err.exitCode)
  }
  console.error(err)
  process.exit(1)
}
