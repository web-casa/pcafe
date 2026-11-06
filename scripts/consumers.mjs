#!/usr/bin/env node
// Install the packed package into fresh projects, the way a user does, and run
// the four consumer cases. Every child command writes a log; only case lines
// reach stdout. See PHASE1-BATCH4-REPORT.md.
import { spawn, spawnSync } from 'node:child_process'
import { createServer } from 'node:net'
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync, openSync, closeSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { launchChromium } from './playwright.mjs'

const ROOT = resolve(import.meta.dirname, '..')
const B4 = process.env.PCAFE_B4 || resolve(ROOT, '..', '.pcafe-tmp', 'b4')
const LOGS = join(B4, 'logs')
const NPM_CACHE = join(B4, 'npm-cache')
const CASES = join(B4, 'cases')
const TMP = join(B4, 'tmp')
// The private Pro source is never in this repo; point PCAFE_PRO_DIR at a checkout to run the Pro case.
const PRO_SOURCE = process.env.PCAFE_PRO_DIR || ''
const ENV = {
  ...process.env,
  TMPDIR: B4,
  npm_config_cache: NPM_CACHE,
  npm_config_audit: 'false',
  npm_config_fund: 'false',
  CI: '1',
}
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
let failures = 0

function sh(command, args, { cwd = ROOT, label, allowFail = false, timeout = 600_000 } = {}) {
  const name = label || `${command}-${Date.now()}`
  const log = join(LOGS, `${name}.log`)
  const result = spawnSync(command, args, { cwd, env: ENV, encoding: 'utf8', timeout, maxBuffer: 64 * 1024 * 1024 })
  const body = `${result.stdout || ''}${result.stderr || ''}\nexit ${result.status ?? 'signal'}\n`
  mkdirSync(LOGS, { recursive: true })
  writeFileSync(log, body)
  if (!allowFail && result.status !== 0) {
    const lines = body.trim().split('\n')
    const key = lines.find((line) => /Cannot find module|ERR_MODULE_NOT_FOUND|Failed to resolve|No such file|EACCES|ENOENT/.test(line))
    const tail = (key ? [key, ...lines.slice(-3)] : lines.slice(-8)).join('\n')
    throw new Error(`${label || command} failed (${result.status}); ${tail}`)
  }
  return result
}

function tail(file, lines = 8) {
  try { return readFileSync(file, 'utf8').trim().split('\n').slice(-lines).join('\n') } catch { return '' }
}

function pass(name, detail = '') {
  console.log(`CASE ${name}: PASS${detail ? ` — ${detail}` : ''}`)
}

function fail(name, error) {
  failures++
  console.log(`CASE ${name}: FAIL — ${String(error?.message ?? error).split('\n')[0]}`)
}

function resetDir(path) {
  rmSync(path, { recursive: true, force: true })
  mkdirSync(path, { recursive: true })
}

function write(path, text) {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, text)
}

function packageVersions() {
  const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'))
  return {
    vite: pkg.peerDependencies?.vite || pkg.devDependencies?.vite,
    react: pkg.peerDependencies?.react || pkg.devDependencies?.react,
    reactDom: pkg.peerDependencies?.['react-dom'] || pkg.devDependencies?.['react-dom'],
    pluginReact: pkg.peerDependencies?.['@vitejs/plugin-react'] || pkg.devDependencies?.['@vitejs/plugin-react'],
  }
}

function auditTarball(meta) {
  const files = meta.files ?? []
  const bad = []
  const banned = [
    [/(^|\/)(?:site|plans|qa|dist)(\/|$)/, 'site/plans/qa/dist'],
    [/(^|\/)PHASE\d*-.*REPORT\.md$/i, 'PHASE report'],
    [/(^|\/)\.env(?:\.|$)/, '.env'],
    [/(^|\/)\.npmrc$/, '.npmrc'],
    [/(^|\/)\.check-cache\.json$/, '.check-cache.json'],
    [/@pcafe\/pro/, '@pcafe/pro'],
  ]
  for (const file of files) {
    const path = file.path || ''
    for (const [re, label] of banned) if (re.test(path)) bad.push(`${label}: ${path}`)
    if ((file.size ?? 0) > 5 * 1024 * 1024) bad.push(`>5 MB: ${path} (${file.size})`)
  }
  console.log(`TARBALL ${meta.filename}: ${files.length} files, ${(meta.unpackedSize ?? 0)} bytes unpacked`)
  if (bad.length) throw new Error(`tarball contents: ${bad.slice(0, 6).join('; ')}`)
}

function freePort() {
  return new Promise((resolvePort, reject) => {
    const server = createServer()
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port
      server.close(() => resolvePort(port))
    })
  })
}

async function waitForHttp(url, timeout = 20_000) {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(url)
      if (res.ok) return res
    } catch {}
    await new Promise((r) => setTimeout(r, 150))
  }
  throw new Error(`server did not answer ${url}`)
}

async function startVite(project, label) {
  const port = await freePort()
  const log = join(LOGS, `${label}-vite.log`)
  const fd = openSync(log, 'w')
  const proc = spawn('npx', ['--no-install', 'vite', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], {
    cwd: project,
    env: ENV,
    stdio: ['ignore', fd, fd],
    detached: true,
  })
  closeSync(fd)
  try {
    await waitForHttp(`http://127.0.0.1:${port}/`)
  } catch (error) {
    proc.kill('SIGTERM')
    throw new Error(`${label}: ${error.message}; ${tail(log)}`)
  }
  return {
    port,
    origin: `http://127.0.0.1:${port}`,
    async stop() {
      const signal = (sig) => {
        try { process.kill(-proc.pid, sig) } catch { try { proc.kill(sig) } catch {} }
      }
      signal('SIGTERM')
      await new Promise((r) => {
        const timer = setTimeout(() => { signal('SIGKILL'); r() }, 3000)
        proc.once('exit', () => { clearTimeout(timer); r() })
      })
    },
  }
}

async function browserPage(url, action) {
  const browser = await launchChromium()
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
    const fonts = []
    page.on('response', (res) => {
      const u = res.url()
      if (/\.woff2?($|\?)/.test(u)) fonts.push({ url: u, status: res.status() })
    })
    await page.goto(url, { waitUntil: 'load', timeout: 30_000 })
    await action(page, fonts)
    return fonts
  } finally {
    await browser.close()
  }
}

function initProject(unpacked, dir, label) {
  resetDir(dir)
  const cli = join(unpacked, 'package', 'cli', 'pcafe.mjs')
  sh(process.execPath, [cli, 'init', dir], { cwd: B4, label: `${label}-init` })
}

function installProject(dir, label, extra = []) {
  sh(npm, ['install', '--no-audit', '--no-fund', '--prefer-offline', ...extra], { cwd: dir, label: `${label}-install` })
}

function setActive(project, name) {
  write(join(project, 'src', 'decks', 'active.ts'), `export { deck } from './${name}'\n`)
}

function patchAttribution(project, name, value = 'false') {
  const file = join(project, 'src', 'decks', name, 'index.tsx')
  const src = readFileSync(file, 'utf8')
  const marker = 'export const deck: DeckDef = {'
  if (!src.includes(marker)) throw new Error(`${name}: DeckDef marker not found`)
  write(file, src.replace(marker, `${marker}\n  attribution: ${value},`))
}

async function assertCredit(file, expected) {
  const browser = await launchChromium()
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
    await page.goto(pathToFileURL(file).href, { waitUntil: 'load', timeout: 30_000 })
    await page.waitForSelector('.slide-frame', { timeout: 20_000 })
    await page.waitForTimeout(600)
    const tags = page.locator('[data-pcafe-credit]')
    const count = await tags.count()
    if (expected && count === 0) throw new Error(`${file}: missing rendered data-pcafe-credit`)
    if (!expected && count > 0) throw new Error(`${file}: unexpected rendered data-pcafe-credit`)
    if (expected) {
      const first = tags.first()
      const href = await first.getAttribute('href')
      const rel = (await first.getAttribute('rel')) || ''
      if (href !== 'https://p.cafe') throw new Error(`${file}: credit href is ${href}`)
      if (/nofollow/.test(rel)) throw new Error(`${file}: credit link has nofollow`)
    }
  } finally {
    await browser.close()
  }
}

async function caseInit(unpacked) {
  const name = 'init'
  const project = join(CASES, 'init')
  initProject(unpacked, project, name)
  installProject(project, name)
  sh(npm, ['run', 'build'], { cwd: project, label: `${name}-build` })
  await assertCredit(join(project, 'dist', 'index.html'), true)
  sh(npm, ['run', 'check'], { cwd: project, label: `${name}-check` })
  const explain = sh('npx', ['--no-install', 'pcafe', 'check', 'launch', '--changed', '--explain'], { cwd: project, label: `${name}-explain` })
  if (!/no slides would run/.test(explain.stdout)) throw new Error('explain did not report no slides would run')
  return 'build/check PASS; explain says no slides would run'
}

async function caseVite() {
  const name = 'vite'
  const project = join(CASES, 'vite')
  resetDir(project)
  const v = packageVersions()
  write(join(project, 'package.json'), JSON.stringify({
    name: 'consumer-vite', private: true, type: 'module',
    scripts: { build: 'vite build' },
    dependencies: { '@pcafe/pcafe': `file:${globalThis.__TGZ}` },
    devDependencies: {
      vite: v.vite, '@vitejs/plugin-react': v.pluginReact,
      react: v.react, 'react-dom': v.reactDom,
    },
  }, null, 2) + '\n')
  write(join(project, 'vite.config.mjs'), `import { defineConfig } from 'vite'\nimport { emoji } from '@pcafe/pcafe/vite'\n\nexport default defineConfig({ plugins: [...emoji()] })\n`)
  write(join(project, 'index.html'), '<!doctype html><html><body><div id="app"></div><script type="module" src="/src/main.js"></script></body></html>\n')
  write(join(project, 'src/main.js'), `document.querySelector('#app').textContent = 'consumer vite'\n`)
  installProject(project, name)
  sh('npx', ['--no-install', 'vite', 'build'], { cwd: project, label: `${name}-build` })
  sh(process.execPath, ['-e', "import('@pcafe/pcafe/vite').then(m => { if (typeof m.emoji !== 'function') process.exit(2) })"], { cwd: project, label: `${name}-import` })
  return 'plain Vite build and dynamic import PASS'
}

function makeProProject(unpacked, dir, withPro) {
  initProject(unpacked, dir, withPro ? 'pro' : 'nopro')
  installProject(dir, withPro ? 'pro-base' : 'nopro')
  const pkgFile = join(dir, 'package.json')
  const pkg = JSON.parse(readFileSync(pkgFile, 'utf8'))
  let proDir = ''
  if (withPro) {
    // Install Pro the way a buyer gets it: the built package, packed into a
    // tarball (no source, no symlink into the Pro checkout).
    sh(npm, ['run', 'build'], { cwd: PRO_SOURCE, label: 'pro-package-build' })
    const packDir = join(CASES, 'pro-pack')
    rmSync(packDir, { recursive: true, force: true })
    mkdirSync(packDir, { recursive: true })
    sh(npm, ['pack', '--pack-destination', packDir], { cwd: PRO_SOURCE, label: 'pro-pack' })
    const tgz = readdirSync(packDir).find((f) => f.endsWith('.tgz'))
    if (!tgz) throw new Error('npm pack produced no Pro tarball')
    proDir = join(packDir, tgz)
    pkg.dependencies = { ...(pkg.dependencies || {}), '@pcafe/pro': `file:${proDir}` }
    write(pkgFile, JSON.stringify(pkg, null, 2) + '\n')
  }
  installProject(dir, withPro ? 'pro' : 'nopro', withPro ? ['--legacy-peer-deps'] : [])
  if (withPro) {
    rmSync(join(dir, 'src', 'decks', 'pitch'), { recursive: true, force: true })
    // A user's own deck, written like the Pro sample: per-template imports.
    sh('cp', ['-a', join(PRO_SOURCE, 'decks', 'pitch'), join(dir, 'src', 'decks', 'pitch')], { cwd: dir, label: 'pro-deck-copy' })
    setActive(dir, 'pitch')
  }
  sh(npm, ['run', 'build'], { cwd: dir, label: withPro ? 'pro-build' : 'nopro-build' })
  return pkg
}

async function casePro(unpacked) {
  const name = 'pro'
  const project = join(CASES, 'pro')
  makeProProject(unpacked, project, true)
  patchAttribution(project, 'pitch')
  sh('npx', ['--no-install', 'pcafe', 'build', 'pitch'], { cwd: project, label: `${name}-build-deck` })
  await assertCredit(join(project, 'dist', 'pitch.html'), false)
  // Only the Pro CSS the deck uses: the pitch deck must not carry the proposal
  // pack (its classes start with .sp-), and no Pro source may leak in.
  const html = readFileSync(join(project, 'dist', 'pitch.html'), 'utf8')
  if (/\.sp-[a-z]/.test(html)) throw new Error('pitch.html contains proposal-pack CSS (.sp-*)')
  if (!/calc\([^)]*var\(--u\)/.test(html)) throw new Error('pitch.html has no converted u units')
  if (/\.tsx\b|sourceMappingURL/.test(html)) throw new Error('pitch.html references Pro source or sourcemaps')
  setActive(project, 'pitch')
  const server = await startVite(project, name)
  try {
    const outside = join(B4, 'outside', 'secret.txt')
    write(outside, 'outside the allow list\n')
    let fontUrl = ''
    let fontStatus = 0
    await browserPage(`${server.origin}/?deck=pitch`, async (page, fonts) => {
      await page.waitForSelector('.slide-frame', { timeout: 20_000 })
      await page.waitForTimeout(1200)
      const found = fonts.find((f) => f.status === 200 && /source-serif|vendor\/pro|@pcafe\/pro/.test(f.url))
      if (!found) throw new Error(`page did not request a Pro font successfully: ${fonts.map((f) => `${f.status} ${f.url}`).join(', ')}`)
      fontUrl = found.url
      fontStatus = found.status
    })
    if (fontStatus !== 200) throw new Error(`font status ${fontStatus}`)
    const fontRes = await fetch(fontUrl)
    if (fontRes.status !== 200) throw new Error(`font fetch ${fontRes.status}`)
    const blocked = await fetch(`${server.origin}/@fs${outside}`)
    if (blocked.status !== 403) throw new Error(`outside file expected 403, got ${blocked.status}`)
    sh('npx', ['--no-install', 'pcafe', 'check', 'pitch'], { cwd: project, label: `${name}-check` })
    return `font 200, outside 403, build/check PASS (${fontUrl.replace(server.origin, '')})`
  } finally {
    await server.stop()
  }
}

async function caseProAbsent(unpacked) {
  const name = 'nopro'
  const project = join(CASES, 'nopro')
  makeProProject(unpacked, project, false)
  patchAttribution(project, 'launch')
  sh(npm, ['run', 'build'], { cwd: project, label: `${name}-build-attribution` })
  await assertCredit(join(project, 'dist', 'index.html'), true)
  const server = await startVite(project, name)
  try {
    let proGroups = 0
    await browserPage(`${server.origin}/#/kit`, async (page) => {
      await page.waitForTimeout(1500)
      proGroups = await page.evaluate(() => (document.body.innerText.match(/Pro ·/g) || []).length)
    })
    if (proGroups !== 0) throw new Error(`#/kit reported ${proGroups} Pro entries`)
    return '#/kit reports 0 Pro entries; build PASS'
  } finally {
    await server.stop()
  }
}

async function main() {
  mkdirSync(LOGS, { recursive: true })
  mkdirSync(CASES, { recursive: true })
  mkdirSync(TMP, { recursive: true })
  const pack = sh(npm, ['pack', '--json', '--pack-destination', B4], { cwd: ROOT, label: 'pack' })
  const json = JSON.parse(pack.stdout.slice(pack.stdout.indexOf('[')))
  const meta = json[0]
  const tgz = join(B4, meta.filename)
  globalThis.__TGZ = tgz
  auditTarball(meta)
  const unpack = join(B4, 'unpacked')
  resetDir(unpack)
  sh('tar', ['-xzf', tgz, '-C', unpack], { cwd: B4, label: 'unpack' })
  const skipPro = process.env.PCAFE_SKIP_PRO === '1' || !PRO_SOURCE
  if (skipPro) console.log(`CASE pro: SKIP — ${PRO_SOURCE ? 'PCAFE_SKIP_PRO=1' : 'set PCAFE_PRO_DIR to a Pro checkout to run it'}`)
  const cases = [
    ['init', () => caseInit(unpack)],
    ['vite', () => caseVite()],
    ['pro', () => casePro(unpack)],
    ['nopro', () => caseProAbsent(unpack)],
  ]
  const only = process.env.PCAFE_CASES ? new Set(process.env.PCAFE_CASES.split(',').map((x) => x.trim()).filter(Boolean)) : null
  for (const [name, fn] of cases.filter(([n]) => (n === 'pro' ? !skipPro : true)).filter(([n]) => !only || only.has(n))) {
    try {
      const detail = await fn()
      pass(name, detail)
    } catch (error) {
      fail(name, error)
    }
  }
  if (failures) {
    console.error(`${failures} consumer case(s) failed; logs: ${LOGS}`)
    process.exit(1)
  }
}

main().catch((error) => {
  console.error(`CASE pack/setup: FAIL — ${String(error?.message ?? error).split('\n')[0]}`)
  process.exit(1)
})
