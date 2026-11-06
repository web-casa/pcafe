#!/usr/bin/env node
// Lint the packed package, not the repository: the tarball is what users get.
import { spawnSync } from 'node:child_process'
import { mkdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
const OUT = process.env.PCAFE_LINT_DIR || join(ROOT, '..', '.pcafe-tmp', 'b4', 'lint')
mkdirSync(OUT, { recursive: true })
const env = { ...process.env, npm_config_cache: join(ROOT, '..', '.pcafe-tmp', 'b4', 'npm-cache') }
const pack = spawnSync('npm', ['pack', '--json', '--pack-destination', OUT], { cwd: ROOT, env, encoding: 'utf8' })
if (pack.status !== 0) {
  process.stderr.write(pack.stderr || pack.stdout)
  process.exit(pack.status ?? 1)
}
const meta = JSON.parse(pack.stdout.slice(pack.stdout.indexOf('[')))[0]
const tgz = join(OUT, meta.filename)
console.log(`package: ${tgz}`)

let bad = 0
console.log('\n=== publint')
{
  const res = spawnSync('npx', ['--no-install', 'publint', 'run', tgz, '--level', 'warning'], { cwd: ROOT, env, encoding: 'utf8' })
  process.stdout.write(`${res.stdout || ''}${res.stderr || ''}`)
  if (res.status !== 0) bad = 1
}

console.log('\n=== attw')
{
  const res = spawnSync('npx', ['--no-install', 'attw', tgz, '--format', 'json'], { cwd: ROOT, env, encoding: 'utf8' })
  let data
  try {
    data = JSON.parse(res.stdout)
  } catch {
    process.stdout.write(`${res.stdout || ''}${res.stderr || ''}`)
    bad = 1
  }
  if (data) {
    const allowed = new Set(['CJSResolvesToESM', 'InternalResolutionError', 'NoResolution'])
    const counts = {}
    const unexpected = []
    for (const [kind, items] of Object.entries(data.problems || {})) {
      counts[kind] = items.length
      if (!allowed.has(kind)) unexpected.push(`${kind}: ${items.length}`)
    }
    const summary = Object.entries(counts).map(([k, n]) => `${k}=${n}`).join(', ') || 'none'
    console.log(`attw findings: ${summary}`)
    console.log('accepted: `.` is TypeScript source for Vite; `./vite` is ESM-only and has no node10 fallback.')
    if (unexpected.length) {
      console.log(`unexpected: ${unexpected.join(', ')}`)
      bad = 1
    }
  }
}
process.exit(bad)
