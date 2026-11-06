// Exports a card set to PNG at exact pixels, and to PDF for presets that upload as PDF.
// usage: node scripts/cards-export.mjs <name> [--no-build]   writes dist/cards/<name>.html and dist/cards/<name>/
import { launchChromium } from './playwright.mjs'
import { spawnSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, openSync, readSync, closeSync, readdirSync, rmSync } from 'node:fs'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

export const ROOT = resolve(import.meta.dirname, '..')
export const htmlPath = (name) => join(ROOT, 'dist', 'cards', `${name}.html`)
export const outDir = (name) => join(ROOT, 'dist', 'cards', name)
const pad = (n) => String(n).padStart(2, '0')
export const pngName = (card) => `${pad(card.index + 1)}-${card.preset}.png`

function findChromium() {
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

export const launch = () => launchChromium({ executablePath: findChromium() })

/** One offline HTML per set. A private output folder lets several builds run at once. */
export function buildSet(name) {
  if (!existsSync(join(ROOT, 'src', 'cardsets', name, 'index.tsx'))) throw new Error(`card set "${name}" not found (expected src/cardsets/${name}/index.tsx)`)
  // `_name` folders are QA fixtures that are broken on purpose. They never become deliverables by accident.
  if (name.startsWith('_') && !process.env.CARDS_FIXTURE) throw new Error(`"${name}" is a QA fixture: set CARDS_FIXTURE=1 to build it, and do not publish the result`)
  const tmp = join(ROOT, 'dist', 'cards', `.build-${name}`)
  const res = spawnSync('npx', ['vite', 'build', '-c', 'vite.cards.config.ts', '--logLevel', 'warn'], { cwd: ROOT, stdio: 'inherit', env: { ...process.env, CARDSET: name, CARDS_OUT: tmp } })
  if (res.status !== 0) throw new Error(`build failed for ${name}`)
  copyFileSync(join(tmp, 'cards.html'), htmlPath(name))
  rmSync(tmp, { recursive: true, force: true })
}

/** Reads width and height straight from the PNG header, so nothing can round them. */
export function pngSize(file) {
  const buf = Buffer.alloc(24)
  const fd = openSync(file, 'r')
  readSync(fd, buf, 0, 24, 0)
  closeSync(fd)
  if (buf.toString('latin1', 1, 4) !== 'PNG') throw new Error(`${file} is not a PNG`)
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) }
}

export async function openExport(browser, name, query = '') {
  const page = await browser.newPage({ viewport: { width: 2600, height: 2000 }, deviceScaleFactor: 1 })
  await page.goto(`${pathToFileURL(htmlPath(name)).href}?export${query}`, { waitUntil: 'load' })
  await page.waitForFunction(() => document.documentElement.dataset.ready === 'true', null, { timeout: 30000 })
  await page.waitForTimeout(300)
  return page
}

/** Writes every card and returns the set's manifest. */
export async function exportSet(browser, name, page) {
  const dir = outDir(name)
  rmSync(dir, { recursive: true, force: true })
  mkdirSync(dir, { recursive: true })
  const own = !page
  const p = page ?? (await openExport(browser, name))
  const set = await p.evaluate(() => window.__cards)
  const els = await p.locator('.cd').all()
  for (const [i, el] of els.entries()) await el.screenshot({ path: join(dir, pngName(set.cards[i])), animations: 'disabled' })
  if (own) await p.close()
  // LinkedIn documents go up as one PDF, and every page must be the same size.
  const pdfs = [...new Set(set.cards.filter((c) => c.pdf).map((c) => c.preset))]
  for (const preset of pdfs) {
    const { w, h } = set.cards.find((c) => c.preset === preset)
    const doc = await openExport(browser, name, `&only=${preset}`)
    await doc.pdf({ path: join(dir, `${name}-${preset}.pdf`), width: `${w}px`, height: `${h}px`, printBackground: true, tagged: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } })
    await doc.close()
  }
  return { ...set, dir, pdfs }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [name, ...flags] = process.argv.slice(2)
  if (!name) {
    console.error('usage: cards-export <name> [--no-build]')
    process.exit(2)
  }
  if (!flags.includes('--no-build')) buildSet(name)
  const browser = await launch()
  const set = await exportSet(browser, name)
  await browser.close()
  for (const c of set.cards) console.log(join(set.dir, pngName(c)))
  for (const p of set.pdfs) console.log(join(set.dir, `${name}-${p}.pdf`))
}
