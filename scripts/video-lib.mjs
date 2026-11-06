// Shared by video-render, video-qa and video-selftest.
import { launchChromium } from './playwright.mjs'
import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

export const ROOT = resolve(import.meta.dirname, '..')
export const HTML = join(ROOT, 'dist', 'video', 'video.html')

export function findChromium() {
  const base = join(homedir(), '.cache', 'ms-playwright')
  const dirs = existsSync(base) ? readdirSync(base).filter((d) => /^chromium-\d+$/.test(d)).sort() : []
  for (const d of dirs.reverse()) {
    for (const sub of ['chrome-linux-arm64/chrome', 'chrome-linux/chrome', 'chrome-linux64/chrome', 'chrome-mac/Chromium.app/Contents/MacOS/Chromium', 'chrome-win/chrome.exe']) {
      const p = join(base, d, sub)
      if (existsSync(p)) return p
    }
  }
  return undefined
}

// Flags that remove the sources of pixel noise this renderer has actually seen or that the research names.
const ARGS = [
  '--force-color-profile=srgb',
  '--font-render-hinting=none',
  '--disable-lcd-text',
  '--disable-partial-raster',
  '--disable-checker-imaging',
  '--disable-threaded-animation',
  '--disable-threaded-scrolling',
  '--disable-new-content-rendering-timeout',
  '--run-all-compositor-stages-before-draw',
  '--disable-image-animation-resync',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-renderer-backgrounding',
  '--hide-scrollbars',
]

export function buildHtml() {
  const r = spawnSync('npx', ['vite', 'build', '--config', 'vite.video.config.ts', '--logLevel', 'warn'], { cwd: ROOT, stdio: 'inherit', env: { ...process.env, VITE_CONFIG_NATIVE_IGNORE_WARNING: 'true' } })
  if (r.status !== 0) throw new Error('vite build failed')
}

/** Opens one video in a page sized to the video. The page is ready for __video.seek(). */
export async function openVideo(name, { failOn } = {}) {
  const browser = await launchChromium({ executablePath: findChromium(), args: ARGS })
  const size = await probeSize(browser, name)
  const context = await browser.newContext({ viewport: size, deviceScaleFactor: 1, reducedMotion: 'no-preference', colorScheme: 'light', locale: 'zh-CN', timezoneId: 'UTC' })
  const page = await context.newPage()
  page.on('pageerror', (e) => failOn?.(`page error: ${e.message.slice(0, 200)}`))
  page.on('console', (m) => { if (m.type() === 'error') failOn?.(`console error: ${m.text().slice(0, 200)}`) })
  page.on('request', (r) => { if (/^https?:/.test(r.url())) failOn?.(`network request: ${r.url()}`) })
  await page.goto(`${pathToFileURL(HTML).href}?video=${encodeURIComponent(name)}&render=1`, { waitUntil: 'load' })
  await untilReady(page, name)
  const cdp = await context.newCDPSession(page)
  return { browser, page, cdp, info: await page.evaluate(() => ({ def: window.__video.def, scenes: window.__video.scenes })) }
}

// Not page.waitForFunction: its polling runs on the page's rAF and timers, which only move when we say so.
async function untilReady(page, name) {
  const deadline = Date.now() + 60000
  while (Date.now() < deadline) {
    if (await page.evaluate(() => document.documentElement.dataset.ready === 'true' || !!document.querySelector('.v-list'))) return
    await new Promise((r) => setTimeout(r, 50))
  }
  throw new Error(`video "${name}" never became ready`)
}

async function probeSize(browser, name) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
  await page.goto(`${pathToFileURL(HTML).href}?video=${encodeURIComponent(name)}&render=1`, { waitUntil: 'load' })
  await untilReady(page, name)
  const def = await page.evaluate(() => window.__video?.def ?? null)
  await page.close()
  if (!def) throw new Error(`no video named "${name}" (src/videos/${name}/index.tsx)`)
  return { width: def.width, height: def.height }
}

export async function shot(cdp) {
  const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', optimizeForSpeed: true, fromSurface: true, captureBeyondViewport: false })
  return Buffer.from(data, 'base64')
}
