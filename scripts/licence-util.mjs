// Pure-JS helpers shared by cli/pcafe.mjs, scripts/qa.mjs and scripts/slide-fingerprints.mjs.
// Runs directly on Node >= 20.11 without TypeScript stripping.
import { createHash, createPublicKey, verify } from 'node:crypto'
import { existsSync, lstatSync, readFileSync, readdirSync, realpathSync } from 'node:fs'
import { homedir } from 'node:os'
import { isAbsolute, join, resolve } from 'node:path'

/** PCafe's licence-signing public key (Ed25519, SPKI DER, base64). Mirrors vite.licence.ts. */
export const LICENCE_PUBLIC_KEY = 'MCowBQYDK2VwAyEAZV1UUfYuTUCidy3Ume/+ql6vaVXmvXkeIm7jCnw5Zv0='

const sha = (buf) => createHash('sha256').update(buf).digest('hex')

/**
 * Safely walk a directory tree: skips broken symlinks instead of throwing ENOENT,
 * and tracks visited realpaths so cyclic directory symlinks never overflow the stack.
 */
export function safeWalkFiles(dir, { skipDirs = new Set(['node_modules', 'qa', 'dist', '.git']) } = {}) {
  const out = []
  const visitedDirs = new Set()
  const walk = (current) => {
    if (!existsSync(current)) return
    let realDir
    try {
      realDir = realpathSync(current)
    } catch {
      return
    }
    if (visitedDirs.has(realDir)) return
    visitedDirs.add(realDir)
    let entries
    try {
      entries = readdirSync(current)
    } catch {
      return
    }
    for (const name of entries) {
      if (skipDirs.has(name)) continue
      const full = join(current, name)
      let st
      try {
        st = lstatSync(full)
      } catch {
        continue
      }
      if (st.isSymbolicLink()) {
        // Resolve symlink target safely; ignore broken links.
        let targetSt
        try {
          targetSt = lstatSync(realpathSync(full))
        } catch {
          continue
        }
        if (targetSt.isDirectory()) walk(full)
        else if (targetSt.isFile()) out.push(full)
      } else if (st.isDirectory()) {
        walk(full)
      } else if (st.isFile()) {
        out.push(full)
      }
    }
  }
  walk(dir)
  return out
}

/**
 * Resolve and verify the active PCafe Pro licence offline (mirrors vite.licence.ts).
 * Relative PCAFE_LICENCE paths resolve against `root` so running CLI from a subdir matches Vite.
 */
export function findLiveLicence(root, env = process.env) {
  const envPath = env.PCAFE_LICENCE ? (isAbsolute(env.PCAFE_LICENCE) ? env.PCAFE_LICENCE : resolve(root, env.PCAFE_LICENCE)) : null
  const candidates = [envPath, join(root, 'pcafe-licence.json'), join(env.HOME || homedir(), '.config', 'pcafe', 'licence.json')]
  const file = candidates.find((f) => Boolean(f) && existsSync(f))
  if (!file) {
    return {
      ok: false,
      reason: 'missing',
      id: null,
      until: null,
      stateKey: 'missing',
      problem: 'no PCafe Pro licence file found. Download pcafe-licence.json from your account page at https://app.p.cafe and put it in the project root or ~/.config/pcafe/licence.json.',
    }
  }
  let text = ''
  try {
    text = readFileSync(file, 'utf8')
  } catch {
    return {
      ok: false,
      reason: 'unreadable',
      file,
      id: null,
      until: null,
      stateKey: `unreadable:${file}`,
      problem: `the PCafe Pro licence (${file}) cannot be read. Download it again from https://app.p.cafe.`,
    }
  }
  const fileHash = sha(text)
  let l
  try {
    l = JSON.parse(text)
  } catch {
    return {
      ok: false,
      reason: 'malformed',
      file,
      id: null,
      until: null,
      stateKey: `malformed:${fileHash}`,
      problem: `the PCafe Pro licence (${file}) cannot be read. Download it again from https://app.p.cafe.`,
    }
  }
  const isIso = (s) => typeof s === 'string' && !Number.isNaN(Date.parse(s))
  if (
    l?.v !== 1 ||
    typeof l.id !== 'string' || !/^PCL-[A-Z0-9-]{4,40}$/.test(l.id) ||
    typeof l.org !== 'string' || l.org.length > 200 ||
    (l.plan !== 'pro_yearly' && l.plan !== 'founder_lifetime') ||
    !isIso(l.issued) ||
    !(l.until === null || isIso(l.until)) ||
    typeof l.sig !== 'string'
  ) {
    return {
      ok: false,
      reason: 'malformed',
      file,
      id: null,
      until: null,
      stateKey: `malformed:${fileHash}`,
      problem: `the PCafe Pro licence (${file}) cannot be read. Download it again from https://app.p.cafe.`,
    }
  }
  let validSig = false
  try {
    const key = createPublicKey({ key: Buffer.from(LICENCE_PUBLIC_KEY, 'base64'), format: 'der', type: 'spki' })
    const payload = ['pcafe-licence:v1', l.id, l.org, l.plan, l.issued, l.until ?? ''].join('\n')
    validSig = verify(null, Buffer.from(payload, 'utf8'), key, Buffer.from(l.sig, 'base64'))
  } catch {
    validSig = false
  }
  if (!validSig) {
    return {
      ok: false,
      reason: 'signature',
      file,
      id: null,
      until: null,
      stateKey: `signature:${fileHash}`,
      problem: `the PCafe Pro licence (${file}) is not signed by PCafe. Download it again from https://app.p.cafe.`,
    }
  }
  if (l.until && Date.parse(l.until) < Date.now()) {
    return {
      ok: false,
      reason: 'expired',
      file,
      id: null,
      until: l.until,
      stateKey: `expired:${l.id}:${l.until}:${fileHash}`,
      problem: `the PCafe Pro licence (${file}) ended on ${l.until.slice(0, 10)}. Download the renewed file from https://app.p.cafe.`,
    }
  }
  return {
    ok: true,
    file,
    id: l.id,
    until: l.until ?? null,
    stateKey: `valid:${l.id}:${l.until ?? 'lifetime'}:${fileHash}`,
    problem: null,
  }
}
