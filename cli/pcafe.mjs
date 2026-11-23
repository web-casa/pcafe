#!/usr/bin/env node
// pcafe CLI. Plain Node ESM, no dependencies beyond what the project template installs.
import { spawn, spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, realpathSync, renameSync, rmSync, statSync, writeFileSync, copyFileSync, symlinkSync } from 'node:fs'
import { basename, dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { findLiveLicence, safeWalkFiles } from '../scripts/licence-util.mjs'

const PKG_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const NAME_RE = /^[a-z0-9][a-z0-9-]*$/

// A new project must not inherit secrets, build output, VCS metadata, or local settings.
const INIT_EXCLUDES = [
  /(^|\/)\.env(?:\.|$)/,
  /(^|\/)\.dev\.vars(?:\.|$)/,
  /(^|\/)\.npmrc$/,
  /\.pem$/i,
  /\.key$/i,
  /(^|\/)(?:node_modules|dist|qa|\.git)$/,
  /(^|\/)\.pcafe\.lock$/,
  /(^|\/)\.claude\/settings\.local\.json$/,
  /(^|\/)\.agents$/,
  /(^|\/)\.aws$/,
  /(^|\/)\.codex$/,
  /(^|\/)OPEN-SOURCE-PLAN\.md$/,
  /(^|\/)PHASE1-.*-REPORT\.md$/,
  /(^|\/)site$/,
  /(^|\/)plans$/,
  /(^|\/)photo-[^/]*\.webp$/,
]
const isExcluded = (path) => {
  const rel = relative(PKG_ROOT, path).split('\\').join('/')
  return INIT_EXCLUDES.some((re) => re.test(rel))
}

const HELP = `pcafe - fixed-template HTML slide decks

Usage:
  pcafe init <dir>       Copy the project template into <dir>
  pcafe new <name> [--modular]
                             Create src/decks/<name>/ from the starter deck
                             (--modular splits slides into src/decks/<name>/slides/)
  pcafe dev [name]       Start the Vite dev server (opens ?deck=<name>)
  pcafe check <name> [--slides 3,5] [--changed] [--full-engine] [--explain] [--json]
                             Typecheck + deck build + QA; last line is PASS or FAIL.
                             --slides checks only those slides; --changed checks
                             slides whose content changed since the last passing run.
                             --full-engine adds 4-viewport & shell regression tests.
                             --explain prints the selection and exits without checks.
                             --json prints only a JSON report (issues with stable
                             codes and the next step); the output goes to qa/reports/
  pcafe status [format] <name> [--json]
                             What to do next, from the last check: run it, fix the
                             listed issues, or look at the screenshots
  pcafe build <name> [--force]
                             Build dist/<name>.html (single offline file); reuses an
                             up-to-date verified deck build unless --force is passed
  pcafe spec <TemplateName...> [--json]
  pcafe spec --search <query> [--json]
                             Look up template props, limits, import path and examples
                             offline (covers free templates and installed @pcafe/pro)
  pcafe pptx <name>      Write dist/<name>.pptx: editable text boxes over a
                             picture of each slide, notes included (builds first
                             if needed); dist/<name>.pptx.json lists what stayed
                             in the picture
  pcafe paper new <name> [--resume]
                             Create src/papers/<name>/: a report, or a résumé
  pcafe paper dev <name> Preview it (sheets, article view, Save as PDF)
  pcafe paper check <name>
                             Typecheck + build + QA + PDF; last line is PASS or FAIL
  pcafe paper build <name>
                             Write dist/<name>.html and dist/<name>.pdf
  pcafe cards <new|dev|check|build> <name>
                             Social cards and carousels: PNGs for each platform
  pcafe video <new|dev|check|build> <name>
                             Animated video: a real MP4, rendered frame by frame
  pcafe course <new|dev|check|build> <name>
                             Interactive courseware in one offline file
  pcafe screen <new|dev|check|build> <name>
                             Looping display for a hall, shop window or event
  pcafe print <new|dev|check|build> <name>
                             Posters, roll-ups, tri-folds and long infographics
  pcafe docs             Regenerate docs/*/components.md and skill references
  pcafe photos [cat:n ...]
                             Download optional Unsplash mood photos into
                             src/assets/photos/ (needs UNSPLASH_ACCESS_KEY)
  pcafe help             Show this help

Deck names: lowercase letters, digits and dashes.`

class CliError extends Error {}
const fail = (msg) => { throw new CliError(msg) }

/** The user's project: nearest ancestor of cwd that contains src/decks. */
function projectRoot() {
  let dir = process.cwd()
  for (;;) {
    if (existsSync(join(dir, 'src', 'decks')) && existsSync(join(dir, 'package.json'))) return dir
    const up = dirname(dir)
    if (up === dir) fail('not inside a pcafe project (no src/decks found). Run `pcafe init <dir>` first.')
    dir = up
  }
}

/** Warn, never fail, when the local PCafe package is not the engine this project was created with. */
function warnEngineVersion(root) {
  const marker = join(root, '.pcafe-engine-version')
  const installed = join(root, 'node_modules', '@pcafe', 'pcafe', 'package.json')
  if (!existsSync(marker) || !existsSync(installed)) return
  const expected = readFileSync(marker, 'utf8').trim()
  let actual = ''
  try { actual = JSON.parse(readFileSync(installed, 'utf8')).version ?? '' } catch { return }
  if (expected && actual && actual !== expected) console.warn(`warning: installed pcafe ${actual} differs from this project's engine version ${expected} (.pcafe-engine-version). Run npm install again.`)
}

function deckName(name, root, mustExist = true) {
  if (!name) fail('missing deck name.')
  if (!NAME_RE.test(name)) fail(`invalid deck name "${name}": use lowercase letters, digits and dashes.`)
  const dir = join(root, 'src', 'decks', name)
  if (mustExist && !existsSync(join(dir, 'index.tsx'))) fail(`deck "${name}" not found (expected ${relative(root, join(dir, 'index.tsx'))}).`)
  return name
}

function run(cmd, args, cwd, env = {}) {
  const r = spawnSync(cmd, args, { cwd, stdio: 'inherit', env: { ...process.env, ...env }, shell: process.platform === 'win32' })
  if (r.error) fail(`could not run ${cmd}: ${r.error.message}`)
  return r.status ?? 1
}

/** Wording hints for the copy under src/<dir>/<name>; printed, never a failure. */
async function copyHints(root, dir, name) {
  const lint = join(root, 'scripts', 'copy-lint.mjs')
  if (!existsSync(lint)) return []
  const { copyLint, printHints } = await import(pathToFileURL(lint).href)
  printHintsOnly = printHints
  const hints = copyLint([join(root, 'src', dir, name)], root)
  // Long decks also get whole-deck structure hints (agenda, chapters, repeats, builds).
  const deck = join(root, 'scripts', 'deck-lint.mjs')
  if (dir === 'decks' && existsSync(deck)) hints.push(...(await import(pathToFileURL(deck).href)).deckLint(join(root, 'src', dir, name), root))
  return hints
}
let printHintsOnly = () => {}

/** Set while a check runs: every step's output is kept for the report (and hidden with --json). */
let capture = null

/** Like run(), but keeps the output for the check report. Streams it unless --json. */
function runKept(cmd, args, cwd, env = {}) {
  if (!capture) return Promise.resolve(run(cmd, args, cwd, env))
  return new Promise((done) => {
    const child = spawn(cmd, args, { cwd, env: { ...process.env, ...env, FORCE_COLOR: '0' }, shell: process.platform === 'win32', stdio: ['inherit', 'pipe', 'pipe'] })
    const keep = (out) => (chunk) => { capture.output += chunk; if (!capture.quiet) out.write(chunk) }
    child.stdout.on('data', keep(process.stdout))
    child.stderr.on('data', keep(process.stderr))
    child.on('error', (e) => { capture.output += `Error: could not run ${cmd}: ${e.message}\n`; done(1) })
    child.on('close', (code) => done(code ?? 1))
  })
}

/** Run a check, then write qa/reports/<format>-<name>.json (+ .log) and print PASS/FAIL or the JSON. */
async function checked(root, format, name, flags, steps) {
  const lib = await import(pathToFileURL(join(root, 'scripts', 'check-report.mjs')).href)
  capture = { output: '', quiet: flags.includes('--json') }
  const startedAt = Date.now()
  let code
  try { code = await steps() } catch (e) { capture = null; throw e }
  const output = capture.output
  capture = null
  const hints = await copyHints(root, lib.FORMATS[format].dir, name, true)
  const issues = [...lib.parseOutput(format, output, root, name, startedAt), ...hints.map((h) => ({ level: 'hint', code: h.code ?? `copy.${h.id}`, message: h.text, file: `${h.file}:${h.line}`, fix: h.hint }))]
  if (code !== 0 && !issues.some((i) => i.level === 'fail')) issues.push({ level: 'fail', code: 'check.exit', message: `a step exited with code ${code}; see the log` })
  let partial
  let checkedSlides
  let grids = []
  if (format === 'deck') {
    const qaFile = join(root, 'qa', 'report.json')
    if (existsSync(qaFile) && statSync(qaFile).mtimeMs >= startedAt) {
      try {
        const qa = JSON.parse(readFileSync(qaFile, 'utf8'))
        if (qa.partial) partial = qa.partial
        if (Array.isArray(qa.checked)) checkedSlides = qa.checked
        if (Array.isArray(qa.grids)) grids = qa.grids
      } catch {}
    }
  }
  const shots = lib.screenshots(root, format, name, partial && checkedSlides ? { checked: checkedSlides } : {})
  const report = {
    format,
    name,
    ok: code === 0,
    startedAt,
    finishedAt: Date.now(),
    issues,
    screenshots: shots,
    ...(grids.length && !partial ? { grids } : {}),
    log: `qa/reports/${format}-${name}.log`,
    ...(partial ? { partial } : {}),
  }
  mkdirSync(join(root, 'qa', 'reports'), { recursive: true })
  writeFileSync(join(root, report.log), output)
  writeFileSync(join(root, 'qa', 'reports', `${format}-${name}.json`), JSON.stringify(report, null, 2))
  const next = lib.nextStep(root, format, name, report)
  if (flags.includes('--json')) console.log(JSON.stringify({ ...report, next }, null, 2))
  else {
    printHintsOnly(hints)
    console.log(code === 0 ? 'PASS' : 'FAIL')
  }
  return code
}

const sha = (buf) => createHash('sha256').update(buf).digest('hex')

/** Strict input fingerprint for deck HTML build reuse: covers all src (except active.ts), config, lockfiles, full Pro dist realpath, live licence & env. */
function computeDeckBuildInputHash(root, name) {
  const files = safeWalkFiles(join(root, 'src')).filter((f) => basename(f) !== 'active.ts')
  for (const rel of [
    'presentation.html', 'index.html', 'vite.config.ts', 'vite.emoji.mjs', 'vite.pro.ts',
    'vite.licence.ts', 'vite.unit.mjs', 'tsconfig.json', 'package.json', 'package-lock.json', 'pnpm-lock.yaml',
  ]) {
    const f = join(root, rel)
    if (existsSync(f)) files.push(f)
  }
  const unique = [...new Set(files)].sort()
  const parts = [`deck=${name}`, ...unique.map((f) => `${relative(root, f)}=${sha(readFileSync(f))}`)]
  const proLink = join(root, 'node_modules', '@pcafe', 'pro')
  if (existsSync(proLink)) {
    const proReal = realpathSync(proLink)
    const pkgFile = join(proReal, 'package.json')
    if (existsSync(pkgFile)) parts.push(`@pcafe/pro/package.json=${sha(readFileSync(pkgFile))}`)
    for (const f of safeWalkFiles(join(proReal, 'dist'), { skipDirs: new Set() }).sort()) {
      parts.push(`@pcafe/pro/${relative(proReal, f)}=${sha(readFileSync(f))}`)
    }
  } else {
    parts.push('@pcafe/pro=none')
  }
  parts.push(`licence=${findLiveLicence(root).stateKey}`)
  const envKeys = ['NODE_ENV', 'PCAFE_LICENCE', 'HOME', ...Object.keys(process.env).filter((k) => k.startsWith('VITE_')).sort()]
  for (const k of envKeys) parts.push(`env:${k}=${process.env[k] ?? ''}`)
  return sha(parts.join('\n'))
}

function buildMetaFile(root) {
  return join(root, 'dist', '.pcafe-build-meta.json')
}

function recordDeckBuildMeta(root, name, expectedInputHash) {
  const htmlPath = join(root, 'dist', 'index.html')
  if (!existsSync(htmlPath)) return
  const buf = readFileSync(htmlPath)
  const hasOutline = buf.includes('<article class="pcafe-outline"')
  if (!hasOutline) return
  // Guard against TOCTOU edits during the build/QA window: only cache when inputs stayed unchanged.
  const postHash = computeDeckBuildInputHash(root, name)
  if (expectedInputHash && postHash !== expectedInputHash) return
  const meta = {
    version: 1,
    deck: name,
    hasOutline: true,
    inputHash: postHash,
    outputSha256: sha(buf),
    builtAt: Date.now(),
  }
  const target = buildMetaFile(root)
  const tmp = `${target}.${process.pid}.tmp`
  writeFileSync(tmp, JSON.stringify(meta, null, 2) + '\n')
  renameSync(tmp, target)
}

function canReuseDeckBuild(root, name) {
  const htmlPath = join(root, 'dist', 'index.html')
  const metaPath = buildMetaFile(root)
  if (!existsSync(htmlPath) || !existsSync(metaPath)) return false
  let meta
  try { meta = JSON.parse(readFileSync(metaPath, 'utf8')) } catch { return false }
  if (meta?.version !== 1 || meta.deck !== name || meta.hasOutline !== true) return false
  const buf = readFileSync(htmlPath)
  if (!buf.includes('<article class="pcafe-outline"')) return false
  if (sha(buf) !== meta.outputSha256) return false
  return computeDeckBuildInputHash(root, name) === meta.inputHash
}

function needDeps(root) {
  if (!existsSync(join(root, 'node_modules', 'vite'))) fail('dependencies not installed. Run `npm install` first.')
}

/** Select a deck or paper for check/build: lock, rewrite active.ts, restore afterwards. */
async function withDeck(root, name, fn, dir = 'decks', line = `export { deck } from './${name}'\n`) {
  const lock = join(root, '.pcafe.lock')
  if (existsSync(lock)) {
    let info = ''
    try { info = readFileSync(lock, 'utf8').trim() } catch {}
    let alive = false
    const pid = Number(info.split(' ')[0])
    if (pid) try { process.kill(pid, 0); alive = true } catch {}
    if (alive) fail(`another check/build is running (${info}). Wait for it, or delete .pcafe.lock if it is stale.`)
    rmSync(lock, { force: true })
  }
  try { writeFileSync(lock, `${process.pid} ${name} ${new Date().toISOString()}`, { flag: 'wx' }) } catch { fail('could not acquire .pcafe.lock (concurrent run?).') }
  const active = join(root, 'src', dir, 'active.ts')
  const original = existsSync(active) ? readFileSync(active, 'utf8') : null
  const restore = () => {
    if (original !== null) writeFileSync(active, original)
    rmSync(lock, { force: true })
  }
  const onSignal = (sig) => { restore(); process.exit(sig === 'SIGINT' ? 130 : 143) }
  process.once('SIGINT', onSignal)
  process.once('SIGTERM', onSignal)
  try {
    writeFileSync(active, line)
    return await fn()
  } finally {
    restore()
    process.off('SIGINT', onSignal)
    process.off('SIGTERM', onSignal)
  }
}

const commands = {
  help() { console.log(HELP); return 0 },

  init(dir) {
    if (!dir) fail('usage: pcafe init <dir>')
    const target = resolve(dir)
    if (existsSync(target) && readdirSync(target).length) fail(`${target} exists and is not empty.`)
    mkdirSync(target, { recursive: true })
    for (const entry of readdirSync(PKG_ROOT)) {
      const source = join(PKG_ROOT, entry)
      if (isExcluded(source)) continue
      cpSync(source, join(target, entry), {
        recursive: true,
        verbatimSymlinks: true,
        filter: (src) => !isExcluded(src),
      })
    }
    // npm renames .gitignore on publish; restore it if needed.
    if (!existsSync(join(target, '.gitignore')) && existsSync(join(target, 'gitignore'))) renameSync(join(target, 'gitignore'), join(target, '.gitignore'))
    // npm drops symlinks from the tarball, so recreate Claude Code's skill links.
    const skillsDir = join(target, 'skills')
    if (existsSync(skillsDir)) {
      const links = join(target, '.claude', 'skills')
      mkdirSync(links, { recursive: true })
      for (const s of readdirSync(skillsDir)) {
        const link = join(links, s)
        if (!existsSync(link)) symlinkSync(join('..', '..', 'skills', s), link, 'junction')
      }
    }
    const pkgFile = join(target, 'package.json')
    const pkg = JSON.parse(readFileSync(pkgFile, 'utf8'))
    pkg.name = basename(target).toLowerCase().replace(/[^a-z0-9-]/g, '-')
    pkg.private = true
    pkg.version = '0.1.0'
    for (const k of ['bin', 'files', 'keywords', 'repository', 'publishConfig']) delete pkg[k]
    // The copied project carries the CLI, so link it locally instead of
    // installing `pcafe` from a registry that may not have it yet.
    pkg.scripts = { ...pkg.scripts, postinstall: 'node scripts/link-cli.mjs' }
    writeFileSync(pkgFile, JSON.stringify(pkg, null, 2) + '\n')
    const engineVersion = JSON.parse(readFileSync(join(PKG_ROOT, 'package.json'), 'utf8')).version
    writeFileSync(join(target, '.pcafe-engine-version'), `${engineVersion}\n`)
    console.log(`Created ${target}\n\nNext:\n  cd ${relative(process.cwd(), target) || '.'}\n  npm install\n  npx pcafe new my-deck\n  npx pcafe dev my-deck`)
    return 0
  },

  new(name, ...flags) {
    const root = projectRoot()
    deckName(name, root, false)
    for (const f of flags) {
      if (f !== '--modular') {
        console.error(`pcafe new: unknown option "${f}"`)
        return 2
      }
    }
    const dir = join(root, 'src', 'decks', name)
    if (existsSync(dir)) fail(`src/decks/${name} already exists.`)
    if (flags.includes('--modular')) {
      mkdirSync(join(dir, 'slides'), { recursive: true })
      writeFileSync(
        join(dir, 'slides', '01-cover.tsx'),
        `import type { SlideDef } from '../../../kit'\nimport { Cover } from '../../../kit'\n\nexport const coverSlides: SlideDef[] = [\n  {\n    id: 'cover',\n    label: '封面',\n    render: () => (\n      <Cover\n        kicker="Briefing · 主题简报"\n        title="主题名称"\n        subtitle="codename"\n        lead="一句话说明这份演示讲什么、给谁看、看完能做什么。"\n        facts={[\n          { label: '日期', value: '2026.11' },\n          { label: '页数', value: '3 页' },\n          { label: '用时', value: '5 分钟' },\n        ]}\n        numeral="01"\n        hint={<>按 <kbd>→</kbd> 或 <kbd>Space</kbd> 翻页</>}\n      />\n    ),\n  },\n]\n`,
      )
      writeFileSync(
        join(dir, 'slides', '02-points.tsx'),
        `import type { SlideDef } from '../../../kit'\nimport { NumberedColumns } from '../../../kit'\n\nexport const pointSlides: SlideDef[] = [\n  {\n    id: 'points',\n    label: '要点',\n    render: () => (\n      <NumberedColumns\n        kicker="要点"\n        title="标题写观点，不写话题"\n        lead="导语给出背景或证据，一到两句。"\n        items={[\n          { tag: 'keyword-one', title: '第一个要点', body: '用一到两句话说明这个要点，写具体的名词和数字，不写空话。' },\n          { tag: 'keyword-two', title: '第二个要点', body: '三个要点的分量相当，长度也尽量接近，这样三列的底边才整齐。' },\n          { tag: 'keyword-three', title: '第三个要点', body: '有先后顺序的内容改用 StepTrack，有轻重之分的改用 SpotlightList。' },\n        ]}\n        source="docs/zh-CN/README.md"\n      />\n    ),\n  },\n]\n`,
      )
      writeFileSync(
        join(dir, 'slides', '03-closing.tsx'),
        `import type { SlideDef } from '../../../kit'\nimport { Closing } from '../../../kit'\n\nexport const closingSlides: SlideDef[] = [\n  {\n    id: 'closing',\n    label: '结论',\n    render: () => (\n      <Closing\n        kicker="结论"\n        mark="01"\n        statement="一句话写出要让听众记住的结论。"\n        follow="第二句写行动：接下来谁做什么。"\n        takeaways={['第一条要点，对应前面某一页。', '第二条要点，对应前面某一页。', '第三条要点，对应前面某一页。']}\n        refs={['docs/zh-CN/README.md', 'docs/zh-CN/components.md']}\n      />\n    ),\n  },\n]\n`,
      )
      writeFileSync(
        join(dir, 'index.tsx'),
        `// Modular deck manifest: keep chapters/slides in ./slides/ and assemble in order here.\nimport type { DeckDef } from '../../kit'\nimport { coverSlides } from './slides/01-cover'\nimport { pointSlides } from './slides/02-points'\nimport { closingSlides } from './slides/03-closing'\n\nexport const deck: DeckDef = {\n  title: 'Modular Deck',\n  slides: [\n    ...coverSlides,\n    ...pointSlides,\n    ...closingSlides,\n  ],\n}\n`,
      )
      console.log(`Created modular deck at src/decks/${name}/ (index.tsx + slides/)\n\nNext:\n  npx pcafe dev ${name}\n  npx pcafe check ${name}`)
      return 0
    }
    const starter = join(root, 'src', 'decks', 'starter')
    if (!existsSync(join(starter, 'index.tsx'))) fail('starter deck missing (src/decks/starter/index.tsx).')
    cpSync(starter, dir, { recursive: true })
    console.log(`Created src/decks/${name}/index.tsx\n\nNext:\n  npx pcafe dev ${name}\n  npx pcafe check ${name}`)
    return 0
  },

  dev(name) {
    const root = projectRoot()
    needDeps(root)
    const args = ['vite']
    if (name) {
      deckName(name, root)
      args.push('--open', `/?deck=${name}`)
    }
    return run('npx', args, root)
  },

  async check(name, ...flags) {
    const root = projectRoot()
    deckName(name, root)
    needDeps(root)
    warnEngineVersion(root)
    const qaFlags = []
    for (let i = 0; i < flags.length; i++) {
      const f = flags[i]
      if (f === '--slides') {
        const val = flags[i + 1]
        if (!val || val.startsWith('-')) {
          console.error('pcafe check: --slides requires a slide list, e.g. --slides 3,5')
          return 2
        }
        qaFlags.push('--slides', val)
        i++
      } else if (f.startsWith('--slides=')) {
        const val = f.slice('--slides='.length)
        if (!val || val.startsWith('-')) {
          console.error('pcafe check: --slides requires a slide list, e.g. --slides=3,5')
          return 2
        }
        qaFlags.push('--slides', val)
      } else if (f === '--changed' || f === '--full-engine' || f === '--explain') {
        qaFlags.push(f)
      } else if (f === '--json') {
        // handled by checked()
      } else {
        console.error(`pcafe check: unknown option "${f}"`)
        return 2
      }
    }
    if (qaFlags.includes('--full-engine') && (qaFlags.includes('--changed') || qaFlags.includes('--slides'))) {
      console.error('pcafe check: --full-engine always runs a full check; it cannot be combined with --changed or --slides.')
      return 2
    }
    const isPartialRequest = qaFlags.includes('--changed') || qaFlags.includes('--slides')
    const env = {
      PCAFE_DECK_NAME: name,
      PCAFE_SKIP_OUTLINE: isPartialRequest ? '1' : '',
    }
    if (flags.includes('--explain')) {
      // Debug path: print the selection without typecheck/build/audit.
      return withDeck(root, name, () => runKept('node', ['scripts/qa.mjs', ...qaFlags], root, env))
    }
    return checked(root, 'deck', name, flags, () =>
      withDeck(root, name, async () => {
        const preHash = isPartialRequest ? null : computeDeckBuildInputHash(root, name)
        const code = await runKept('npm', ['run', 'check', ...(qaFlags.length ? ['--', ...qaFlags] : [])], root, env)
        // Record reusable build metadata only for full builds (with outline) whose inputs did not change mid-run.
        if (code === 0 && !isPartialRequest) recordDeckBuildMeta(root, name, preHash)
        return code
      }),
    )
  },

  async status(a, b, ...flags) {
    const root = projectRoot()
    const lib = await import(pathToFileURL(join(root, 'scripts', 'check-report.mjs')).href)
    if (b && b.startsWith('--')) { flags.unshift(b); b = undefined }
    const [format, name] = b ? [a, b] : ['deck', a]
    if (!name || !lib.FORMATS[format]) fail('usage: pcafe status [deck|paper|cards|video|course|screen|print] <name> [--json]')
    if (!existsSync(join(root, 'src', lib.FORMATS[format].dir, name, 'index.tsx'))) fail(`${format} "${name}" not found (expected src/${lib.FORMATS[format].dir}/${name}/index.tsx).`)
    const file = join(root, 'qa', 'reports', `${format}-${name}.json`)
    const report = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : null
    const next = lib.nextStep(root, format, name, report)
    if (flags.includes('--json')) { console.log(JSON.stringify({ format, name, last: report && { ok: report.ok, finishedAt: new Date(report.finishedAt).toISOString(), issues: report.issues.length }, next }, null, 2)); return 0 }
    console.log(`${format} ${name}: ${report ? `last check ${report.ok ? 'PASS' : 'FAIL'} at ${new Date(report.finishedAt).toLocaleString()}` : 'never checked'}`)
    if (next.action === 'run_check') console.log(`next: run ${next.command} (${next.reason})`)
    if (next.action === 'fix') {
      console.log(`next: fix these in ${next.path}, then run ${next.rerun}`)
      for (const [c, msgs] of Object.entries(next.issues)) msgs.forEach((m) => console.log(`  ${c}  ${m}`))
    }
    if (next.action === 'review') {
      if (next.grids?.length) {
        console.log(`next: look at qa/contact-sheet.png and ${next.grids.length} review grids (2x2), then open full-size slides for any WARN or edited pages`)
        next.grids.forEach((p) => console.log(`  ${p}`))
      } else {
        console.log(`next: look at ${next.screenshots.length} screenshots, then show the user`)
        next.screenshots.forEach((p) => console.log(`  ${p}`))
      }
      next.hints.forEach((h) => console.log(`  ${h.level}  ${h.code}  ${h.file ?? ''}  ${h.message}`))
    }
    return 0
  },

  async build(name, ...flags) {
    const root = projectRoot()
    deckName(name, root)
    needDeps(root)
    for (const f of flags) {
      if (f !== '--force' && f !== '--no-cache') {
        console.error(`pcafe build: unknown option "${f}"`)
        return 2
      }
    }
    const force = flags.includes('--force') || flags.includes('--no-cache')
    const out = join(root, 'dist', `${name}.html`)
    return withDeck(root, name, () => {
      if (!force && canReuseDeckBuild(root, name)) {
        copyFileSync(join(root, 'dist', 'index.html'), out)
        console.log(`wrote ${relative(root, out)} (reused up-to-date build)`)
        return 0
      }
      const preHash = computeDeckBuildInputHash(root, name)
      const code = run('npm', ['run', 'build:deck'], root, { PCAFE_DECK_NAME: name, PCAFE_SKIP_OUTLINE: '' })
      if (code !== 0) { console.error('build failed.'); return code }
      recordDeckBuildMeta(root, name, preHash)
      copyFileSync(join(root, 'dist', 'index.html'), out)
      console.log(`wrote ${relative(root, out)}`)
      return 0
    })
  },

  spec(...args) {
    const root = projectRoot()
    return run('node', [join(root, 'scripts', 'spec.mjs'), ...args], root)
  },

  pptx(name, ...flags) {
    const root = projectRoot()
    deckName(name, root)
    needDeps(root)
    if (!existsSync(join(root, 'node_modules', 'pptxgenjs'))) fail('pptxgenjs is not installed. Run `npm install` first.')
    return run('node', [join(root, 'scripts', 'pptx-export.mjs'), name, ...flags], root)
  },

  async paper(action, name, ...flags) {
    const flag = flags[0]
    const root = projectRoot()
    const usage = 'usage: pcafe paper <new|dev|check|build> <name> [--resume]'
    if (!action || !name) fail(usage)
    if (!NAME_RE.test(name)) fail(`invalid name "${name}": use lowercase letters, digits and dashes.`)
    const dir = join(root, 'src', 'papers', name)
    if (action === 'new') {
      if (existsSync(dir)) fail(`src/papers/${name} already exists.`)
      const starter = join(root, 'src', 'papers', flag === '--resume' ? 'starter-resume' : 'starter-report')
      if (!existsSync(join(starter, 'index.tsx'))) fail(`starter missing (${relative(root, starter)}/index.tsx).`)
      cpSync(starter, dir, { recursive: true })
      console.log(`Created src/papers/${name}/index.tsx\n\nNext:\n  npx pcafe paper dev ${name}\n  npx pcafe paper check ${name}`)
      return 0
    }
    if (!existsSync(join(dir, 'index.tsx'))) fail(`paper "${name}" not found (expected src/papers/${name}/index.tsx).`)
    needDeps(root)
    if (action === 'dev') return run('npx', ['vite', '--open', `/paper.html?paper=${name}`], root)
    if (action !== 'check' && action !== 'build') fail(usage)
    const build = async () => {
      if (action === 'check') {
        const types = await runKept('npm', ['run', 'typecheck'], root)
        if (types) return types
      }
      const built = await runKept('npx', ['vite', 'build', '-c', 'vite.paper.config.ts'], root)
      if (built) return built
      copyFileSync(join(root, 'dist', 'paper', 'paper.html'), join(root, 'dist', `${name}.html`))
      return runKept('node', [join(root, 'scripts', 'paper-qa.mjs'), name], root)
    }
    const line = `export { paper } from './${name}'\n`
    if (action === 'check') return checked(root, 'paper', name, flags, () => withDeck(root, name, build, 'papers', line))
    const code = await withDeck(root, name, build, 'papers', line)
    if (code === 0) console.log(`wrote dist/${name}.html and dist/${name}.pdf`)
    return code
  },

  cards: (...args) => runFormat('cards', ...args),
  video: (...args) => runFormat('video', ...args),
  course: (...args) => runFormat('course', ...args),
  screen: (...args) => runFormat('screen', ...args),
  print: (...args) => runFormat('print', ...args),

  docs() {
    const root = projectRoot()
    return run('node', [join(root, 'scripts', 'gen-docs.mjs')], root)
  },

  photos(...args) {
    const root = projectRoot()
    return run('node', [join(root, 'scripts', 'fetch-photos.mjs'), ...args], root)
  },
}

/** Formats beside decks and papers. Each one builds per name, so none of them touches an active.ts. */
const FORMATS = {
  print: {
    dir: 'prints',
    page: (n) => `/print.html?print=${n}`,
    build: (root, n) => runKept('node', [join(root, 'scripts', 'print-export.mjs'), n], root),
    qa: (root, n) => runKept('node', [join(root, 'scripts', 'print-qa.mjs'), n, '--no-build'], root),
    wrote: (n) => `dist/print/${n}.html and the PDFs and PNGs in dist/print/${n}/`,
  },
  cards: {
    dir: 'cardsets',
    page: (n) => `/cards.html?set=${n}`,
    build: (root, n) => runKept('node', [join(root, 'scripts', 'cards-export.mjs'), n], root),
    qa: (root, n) => runKept('node', [join(root, 'scripts', 'cards-qa.mjs'), n, '--no-build'], root),
    wrote: (n) => `dist/cards/${n}.html and the PNGs in dist/cards/${n}/`,
  },
  video: {
    dir: 'videos',
    page: (n) => `/video.html?video=${n}`,
    build: (root, n) => runKept('node', [join(root, 'scripts', 'video-render.mjs'), n], root),
    qa: (root, n) => runKept('node', [join(root, 'scripts', 'video-qa.mjs'), n], root),
    wrote: (n) => `dist/video/${n}.mp4`,
  },
  course: {
    dir: 'courses',
    page: (n) => `/course.html?course=${n}`,
    build: (root, n) => runKept('npx', ['vite', 'build', '-c', 'vite.course.config.ts'], root, { COURSE: n }),
    qa: (root, n) => runKept('node', [join(root, 'scripts', 'course-qa.mjs'), n], root),
    wrote: (n) => `dist/course/${n}.html`,
  },
  screen: {
    dir: 'screens',
    page: (n) => `/screen.html?screen=${n}`,
    build: (root, n) => runKept('npx', ['vite', 'build', '-c', 'vite.screen.config.ts'], root, { SCREEN: n }),
    qa: (root, n) => runKept('node', [join(root, 'scripts', 'screen-qa.mjs'), n], root),
    wrote: (n) => `dist/screen/${n}.html`,
  },
}

async function runFormat(kind, action, name, ...flags) {
  const root = projectRoot()
  const format = FORMATS[kind]
  const usage = `usage: pcafe ${kind} <new|dev|check|build> <name>`
  if (!action || !name) fail(usage)
  if (!NAME_RE.test(name)) fail(`invalid name "${name}": use lowercase letters, digits and dashes.`)
  const dir = join(root, 'src', format.dir, name)
  if (action === 'new') {
    if (existsSync(dir)) fail(`src/${format.dir}/${name} already exists.`)
    const starter = join(root, 'src', format.dir, 'starter')
    if (!existsSync(join(starter, 'index.tsx'))) fail(`starter missing (${relative(root, starter)}/index.tsx).`)
    cpSync(starter, dir, { recursive: true })
    // A course's id is its progress key, so a copy must not share the starter's.
    if (kind === 'course') {
      const file = join(dir, 'index.tsx')
      writeFileSync(file, readFileSync(file, 'utf8').replace("id: 'starter'", `id: '${name}'`))
    }
    console.log(`Created src/${format.dir}/${name}/index.tsx\n\nNext:\n  npx pcafe ${kind} dev ${name}\n  npx pcafe ${kind} check ${name}`)
    return 0
  }
  if (!existsSync(join(dir, 'index.tsx'))) fail(`${kind} "${name}" not found (expected src/${format.dir}/${name}/index.tsx).`)
  needDeps(root)
  if (action === 'dev') return run('npx', ['vite', '--open', format.page(name)], root)
  if (action === 'build') {
    const code = await format.build(root, name)
    if (code === 0) console.log(`wrote ${format.wrote(name)}`)
    return code
  }
  if (action !== 'check') fail(usage)
  return checked(root, kind, name, flags, async () =>
    (await runKept('npm', ['run', 'typecheck'], root)) || (await format.build(root, name)) || format.qa(root, name))
}

const [cmd = 'help', ...rest] = process.argv.slice(2)
const alias = { '-h': 'help', '--help': 'help' }
const fn = commands[alias[cmd] ?? cmd]
if (!fn) {
  console.error(`pcafe: unknown command "${cmd}"\n\n${HELP}`)
  process.exit(2)
}
try {
  process.exit(await fn(...rest))
} catch (e) {
  if (e instanceof CliError) {
    console.error(`pcafe: ${e.message}`)
    process.exit(1)
  }
  throw e
}
