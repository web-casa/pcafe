// Link the project's own CLI into node_modules/.bin so `npx pcafe` works after
// `npm install`, without fetching the package from a registry.
import { chmodSync, existsSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
const TARGET = join(ROOT, 'cli', 'pcafe.mjs')
const BIN = join(ROOT, 'node_modules', '.bin')

if (!existsSync(TARGET)) {
  console.warn('link-cli: cli/pcafe.mjs not found; skipped')
  process.exit(0)
}

mkdirSync(BIN, { recursive: true })
rmSync(join(BIN, 'pcafe'), { force: true })
if (process.platform === 'win32') {
  writeFileSync(join(BIN, 'pcafe.cmd'), '@echo off\r\nnode "%~dp0\\..\\..\\cli\\pcafe.mjs" %*\r\n')
} else {
  chmodSync(TARGET, 0o755)
  symlinkSync('../../cli/pcafe.mjs', join(BIN, 'pcafe'))
}
