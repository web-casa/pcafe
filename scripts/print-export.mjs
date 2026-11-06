// Builds a print item and writes its PDFs and PNGs.
// usage: node scripts/print-export.mjs <name> [--no-build]   writes dist/print/<name>.html and dist/print/<name>/
//   <name>-print.pdf   trim + bleed + crop marks, with TrimBox and BleedBox set
//   <name>-bleed.pdf   trim + bleed exactly, for shops that add their own marks
//   <name>-proof.pdf   the finished piece, for screens
//   <name>[-side].png  the finished piece as an image
//   long images: <name>.png, <name>.pdf, slices/<profile>-NN.png
import { launchChromium } from './playwright.mjs'
import { spawnSync } from 'node:child_process'
import { closeSync, existsSync, mkdirSync, openSync, readFileSync, readSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

export const ROOT = resolve(import.meta.dirname, '..')
export const htmlPath = (name) => join(ROOT, 'dist', 'print', `${name}.html`)
export const outDir = (name) => join(ROOT, 'dist', 'print', name)
const pad = (n) => String(n).padStart(2, '0')
const PT = 72 / 25.4
const MM_PER_PX = 25.4 / 96

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

export function buildItem(name) {
  if (!existsSync(join(ROOT, 'src', 'prints', name, 'index.tsx'))) throw new Error(`print item "${name}" not found (expected src/prints/${name}/index.tsx)`)
  // `_name` folders are QA fixtures that are broken on purpose. They never become deliverables by accident.
  if (name.startsWith('_') && !process.env.PRINT_FIXTURE) throw new Error(`"${name}" is a QA fixture: set PRINT_FIXTURE=1 to build it, and do not publish the result`)
  const res = spawnSync('npx', ['vite', 'build', '-c', 'vite.print.config.ts', '--logLevel', 'warn'], { cwd: ROOT, stdio: 'inherit', env: { ...process.env, PRINT: name } })
  if (res.status !== 0) throw new Error(`build failed for ${name}`)
}

export async function openItem(browser, name, query, { width = 1600, height = 1200, scale = 1 } = {}) {
  // Paper shows a final state: reduced motion is how every template is asked for one, so nothing counts up mid-way.
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: scale, reducedMotion: 'reduce' })
  const errors = []
  // Kept on the page for QA: a request made while loading would be missed by anything attached afterwards.
  const seen = { page: new Set(), console: new Set(), network: new Set() }
  page.printSeen = seen
  page.on('pageerror', (e) => { errors.push(e.message.slice(0, 300)); seen.page.add(e.message.slice(0, 200)) })
  page.on('console', (m) => { if (m.type() === 'error') seen.console.add(m.text().slice(0, 200)) })
  page.on('request', (r) => { if (/^(https?|wss?):/.test(r.url())) seen.network.add(r.url().slice(0, 120)) })
  await page.goto(`${pathToFileURL(htmlPath(name)).href}?${query}`, { waitUntil: 'load' })
  await page.waitForFunction(() => document.documentElement.dataset.ready === 'true', null, { timeout: 60000 })
  await page.waitForTimeout(300)
  // React unmounts everything after a render error, and an empty page still prints as a valid PDF.
  if (!(await page.locator('.pr-page').count())) throw new Error(`${name} rendered nothing: ${errors.join('; ') || 'no error reported'}`)
  return page
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

const num = (n) => Number(n.toFixed(4))
const rect = ([x0, y0, x1, y1]) => `[${num(x0)} ${num(y0)} ${num(x1)} ${num(y1)}]`

/**
 * Chromium rounds a PDF page to its own grid (up to 0.5 pt off) and writes no TrimBox or BleedBox.
 * So the page is printed slightly larger, anchored top left, and this rewrites each page's boxes
 * in an incremental update: legal PDF, the content is untouched, and the numbers come out exact.
 * `boxes` gives each box in mm from the top left of the page.
 */
export function setBoxes(file, boxes) {
  const data = readFileSync(file)
  const text = data.toString('latin1')
  const re = /(\d+) 0 obj\s*<<\s*\/Type\s*\/Page\b([\s\S]*?)>>\s*endobj/g
  const updates = []
  for (let m = re.exec(text); m; m = re.exec(text)) {
    const media = m[2].match(/\/MediaBox\s*\[\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\]/)
    if (!media) throw new Error('page has no MediaBox')
    const top = Number(media[4])
    const toPdf = (b) => [b.x * PT, top - (b.y + b.h) * PT, (b.x + b.w) * PT, top - b.y * PT]
    let body = m[2].replace(/\/MediaBox\s*\[[^\]]*\]/, '').replace(/\/(CropBox|TrimBox|BleedBox)\s*\[[^\]]*\]/g, '')
    const entries = [`/MediaBox ${rect(toPdf(boxes.media))}`, `/CropBox ${rect(toPdf(boxes.media))}`]
    if (boxes.bleed) entries.push(`/BleedBox ${rect(toPdf(boxes.bleed))}`)
    if (boxes.trim) entries.push(`/TrimBox ${rect(toPdf(boxes.trim))}`)
    body = `${entries.join('\n')}\n${body.trim()}`
    updates.push({ id: Number(m[1]), obj: `${m[1]} 0 obj\n<</Type /Page\n${body}>>\nendobj\n` })
  }
  if (!updates.length) throw new Error(`no page objects found in ${file}`)
  const prev = Number(text.slice(text.lastIndexOf('startxref')).match(/startxref\s+(\d+)/)[1])
  const trailer = text.slice(text.lastIndexOf('trailer'))
  const size = trailer.match(/\/Size\s+(\d+)/)[1]
  const root = trailer.match(/\/Root\s+(\d+ \d+ R)/)[1]
  const info = trailer.match(/\/Info\s+(\d+ \d+ R)/)?.[1]
  let offset = data.length
  let body = ''
  const lines = []
  for (const u of updates) {
    lines.push(`${u.id} 1\n${String(offset).padStart(10, '0')} 00000 n \n`)
    offset += Buffer.byteLength(u.obj, 'latin1')
    body += u.obj
  }
  const xref = `xref\n0 1\n0000000000 65535 f \n${lines.join('')}trailer\n<</Size ${size}\n/Root ${root}${info ? `\n/Info ${info}` : ''}\n/Prev ${prev}>>\nstartxref\n${offset}\n%%EOF\n`
  writeFileSync(file, Buffer.concat([data, Buffer.from(body + xref, 'latin1')]))
}

/** The page is asked for this much larger than it should be, so Chromium's rounding can only add white outside the crop. */
const OVERSHOOT_MM = 1

async function writePdf(page, file, wMm, hMm, boxes) {
  await page.addStyleTag({ content: `@page{size:${wMm + OVERSHOOT_MM}mm ${hMm + OVERSHOOT_MM}mm;margin:0}` })
  await page.pdf({ path: file, preferCSSPageSize: true, printBackground: true, tagged: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } })
  // The selftest turns this off, to prove QA sees what Chromium writes on its own.
  if (!process.env.PRINT_TEST_NO_BOXES) setBoxes(file, boxes)
}

async function exportPhysical(browser, name, def, dir) {
  const off = def.bleed + def.slug
  const out = { pdfs: {}, pngs: [] }
  const trim = (x) => ({ x, y: x, w: def.trimW, h: def.trimH })
  const bl = (x) => ({ x: x - def.bleed, y: x - def.bleed, w: def.trimW + 2 * def.bleed, h: def.trimH + 2 * def.bleed })

  const print = await openItem(browser, name, 'mode=print&export=1')
  out.pdfs.print = join(dir, `${name}-print.pdf`)
  const pw = def.trimW + 2 * off
  const ph = def.trimH + 2 * off
  await writePdf(print, out.pdfs.print, pw, ph, { media: { x: 0, y: 0, w: pw, h: ph }, bleed: bl(off), trim: trim(off) })
  await print.close()

  const bleed = await openItem(browser, name, 'mode=bleed&export=1')
  out.pdfs.bleed = join(dir, `${name}-bleed.pdf`)
  const bw = def.trimW + 2 * def.bleed
  const bh = def.trimH + 2 * def.bleed
  await writePdf(bleed, out.pdfs.bleed, bw, bh, { media: { x: 0, y: 0, w: bw, h: bh }, bleed: { x: 0, y: 0, w: bw, h: bh }, trim: trim(def.bleed) })
  await bleed.close()

  const proof = await openItem(browser, name, 'mode=proof&export=1', { scale: 1 })
  out.pdfs.proof = join(dir, `${name}-proof.pdf`)
  const fw = def.trimW
  const fh = def.format === 'rollup' ? def.visibleH : def.trimH
  await writePdf(proof, out.pdfs.proof, fw, fh, { media: { x: 0, y: 0, w: fw, h: fh }, trim: { x: 0, y: 0, w: fw, h: fh } })
  await proof.close()

  const scale = def.pngDpi / 96
  const shot = await openItem(browser, name, 'mode=proof&export=1', { scale, width: Math.ceil(fw / MM_PER_PX) + 2, height: Math.ceil(fh / MM_PER_PX) + 2 })
  // Pages are stacked at the top left, so each one starts on a whole pixel: a clip at a fractional y
  // would pull in a row of the page above. Nothing changes size, so kit parts do not lay out again.
  // Playwright's clip rounds to whole CSS px, which would lose a few device pixels here, so this goes through CDP.
  const count = await shot.locator('.pr-page').count()
  const clip = { x: 0, y: 0, width: Math.round((fw / 25.4) * def.pngDpi) / scale, height: Math.round((fh / 25.4) * def.pngDpi) / scale, scale }
  const cdp = await shot.context().newCDPSession(shot)
  for (let i = 0; i < count; i++) {
    await shot.evaluate((n) => {
      document.querySelectorAll('.pr-page').forEach((el, k) => {
        el.style.position = 'absolute'
        el.style.left = '0'
        el.style.top = '0'
        el.style.zIndex = k === n ? '2' : '1'
      })
    }, i)
    await shot.waitForTimeout(100)
    const file = join(dir, count > 1 ? `${name}-${def.pages[i].id}.png` : `${name}.png`)
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', clip, captureBeyondViewport: true })
    writeFileSync(file, Buffer.from(data, 'base64'))
    out.pngs.push(file)
  }
  await cdp.detach()
  await shot.close()
  return out
}

async function exportLong(browser, name, def, dir) {
  const out = { pdfs: {}, pngs: [], slices: {} }
  const page = await openItem(browser, name, 'export=1', { width: Math.ceil(def.trimW / MM_PER_PX), height: 1400 })
  const groups = {}
  for (const s of def.slices) groups[s] = await page.evaluate((n) => window.__print.sliceGroups(n), s)
  const heightPx = await page.evaluate(() => window.__print.longH())
  const hMm = heightPx * MM_PER_PX
  out.pdfs.long = join(dir, `${name}.pdf`)
  await writePdf(page, out.pdfs.long, def.trimW, hMm, { media: { x: 0, y: 0, w: def.trimW, h: hMm }, trim: { x: 0, y: 0, w: def.trimW, h: hMm } })
  const full = join(dir, `${name}.png`)
  await page.locator('.pr-long').screenshot({ path: full, animations: 'disabled' })
  out.pngs.push(full)
  if (def.slices.length) mkdirSync(join(dir, 'slices'), { recursive: true })
  // A ceiling profile cuts the full image at section boundaries. An exact profile lays each group out at its slice size.
  if (groups.wechat) {
    out.slices.wechat = []
    const tops = await page.evaluate(() => Object.fromEntries([...document.querySelectorAll('.pr-sec')].map((s) => {
      const r = s.getBoundingClientRect()
      const o = document.querySelector('.pr-long').getBoundingClientRect()
      return [s.dataset.sec, r.top - o.top]
    })))
    const box = await page.locator('.pr-long').boundingBox()
    for (const [i, g] of groups.wechat.entries()) {
      const file = join(dir, 'slices', `wechat-${pad(i + 1)}.png`)
      await page.screenshot({ path: file, fullPage: true, clip: { x: box.x, y: box.y + tops[g.ids[0]], width: box.width, height: g.h } })
      out.slices.wechat.push({ file, ids: g.ids })
    }
  }
  await page.close()
  if (groups.xhs) {
    out.slices.xhs = []
    const p = await openItem(browser, name, 'export=1', { width: Math.ceil(def.trimW / MM_PER_PX), height: 1440 })
    for (const [i, g] of groups.xhs.entries()) {
      await p.evaluate((ids) => window.__print.showSlice(ids, 1440), g.ids)
      await p.waitForTimeout(120)
      const file = join(dir, 'slices', `xhs-${pad(i + 1)}.png`)
      await p.locator('.pr-long').screenshot({ path: file, animations: 'disabled' })
      out.slices.xhs.push({ file, ids: g.ids, h: g.h })
    }
    await p.close()
  }
  return out
}

/** Writes everything and returns what it wrote. */
export async function exportItem(browser, name) {
  const dir = outDir(name)
  rmSync(dir, { recursive: true, force: true })
  mkdirSync(dir, { recursive: true })
  const probe = await openItem(browser, name, 'export=1')
  const def = await probe.evaluate(() => window.__print.describe())
  await probe.close()
  const out = def.format === 'long' ? await exportLong(browser, name, def, dir) : await exportPhysical(browser, name, def, dir)
  return { ...out, def, dir }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [name, ...flags] = process.argv.slice(2)
  if (!name) {
    console.error('usage: print-export <name> [--no-build]')
    process.exit(2)
  }
  if (!flags.includes('--no-build')) buildItem(name)
  const browser = await launch()
  const res = await exportItem(browser, name)
  await browser.close()
  for (const f of Object.values(res.pdfs)) console.log(f)
  for (const f of res.pngs) console.log(f)
  for (const s of Object.values(res.slices ?? {})) for (const x of s) console.log(x.file)
}
