import { createPublicKey, verify } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

/**
 * PCafe Pro licence file: what lets a work drop the "Made with PCafe" credit
 * (LICENSE, Exhibit B, additional permission). The account page at app.p.cafe
 * issues it, signed with PCafe's Ed25519 key; it is checked here, at build time,
 * offline. Nothing is sent anywhere and exported decks never check a licence.
 *
 *   {
 *     "v": 1,
 *     "id": "PCL-7Q2M-K8XD",            licence number, also printed on the certificate
 *     "org": "Example Studio Ltd.",      licensee as entered on the account page
 *     "plan": "pro_yearly",              or "founder_lifetime"
 *     "issued": "2026-11-10T00:00:00.000Z",
 *     "until": "2027-11-10T00:00:00.000Z", end of the paid period; null for lifetime
 *     "sig": "<base64 Ed25519 signature of the payload line below>"
 *   }
 *
 * The signed payload is `pcafe-licence:v1\n` followed by the fields joined with
 * `\n` in this order: id, org, plan, issued, until ('' when null).
 *
 * Where it is looked for, first match wins:
 *   1. the file named by PCAFE_LICENCE (a path)
 *   2. pcafe-licence.json in the project root
 *   3. ~/.config/pcafe/licence.json
 */

/** PCafe's licence-signing public key (Ed25519, SPKI DER, base64). */
export const LICENCE_PUBLIC_KEY = 'MCowBQYDK2VwAyEAZV1UUfYuTUCidy3Ume/+ql6vaVXmvXkeIm7jCnw5Zv0='

export type LicencePlan = 'pro_yearly' | 'founder_lifetime'

export interface LicenceFile {
  v: 1
  id: string
  org: string
  plan: LicencePlan
  issued: string
  until: string | null
  sig: string
}

export type LicenceResult =
  | { ok: true; id: string; org: string; plan: LicencePlan; until: string | null; file: string }
  | { ok: false; reason: 'missing' | 'unreadable' | 'malformed' | 'signature' | 'expired'; file?: string; until?: string }

export const licencePayload = (l: Omit<LicenceFile, 'v' | 'sig'>) =>
  ['pcafe-licence:v1', l.id, l.org, l.plan, l.issued, l.until ?? ''].join('\n')

const isIso = (s: unknown): s is string => typeof s === 'string' && !Number.isNaN(Date.parse(s))

/** Checks one licence file's text. `publicKey` is the base64 SPKI key; tests pass their own. */
export function checkLicenceText(text: string, publicKey = LICENCE_PUBLIC_KEY, now = new Date()): LicenceResult {
  let l: Partial<LicenceFile>
  try {
    l = JSON.parse(text)
  } catch {
    return { ok: false, reason: 'malformed' }
  }
  if (
    l?.v !== 1 ||
    typeof l.id !== 'string' || !/^PCL-[A-Z0-9-]{4,40}$/.test(l.id) ||
    typeof l.org !== 'string' || l.org.length > 200 ||
    (l.plan !== 'pro_yearly' && l.plan !== 'founder_lifetime') ||
    !isIso(l.issued) ||
    !(l.until === null || isIso(l.until)) ||
    typeof l.sig !== 'string'
  ) return { ok: false, reason: 'malformed' }
  let good = false
  try {
    const key = createPublicKey({ key: Buffer.from(publicKey, 'base64'), format: 'der', type: 'spki' })
    good = verify(null, Buffer.from(licencePayload(l as LicenceFile), 'utf8'), key, Buffer.from(l.sig, 'base64'))
  } catch {
    good = false
  }
  if (!good) return { ok: false, reason: 'signature' }
  if (l.until && Date.parse(l.until) < now.getTime()) return { ok: false, reason: 'expired', until: l.until }
  return { ok: true, id: l.id, org: l.org, plan: l.plan, until: l.until ?? null, file: '' }
}

/** Finds and checks the licence for a project. */
export function findLicence(root: string, env: NodeJS.ProcessEnv = process.env): LicenceResult {
  const candidates = [env.PCAFE_LICENCE, join(root, 'pcafe-licence.json'), join(env.HOME || homedir(), '.config', 'pcafe', 'licence.json')]
  const file = candidates.find((f): f is string => Boolean(f) && existsSync(f!))
  if (!file) return { ok: false, reason: 'missing' }
  let text: string
  try {
    text = readFileSync(file, 'utf8')
  } catch {
    return { ok: false, reason: 'unreadable', file }
  }
  const r = checkLicenceText(text)
  return { ...r, file }
}

/** One line for the build log when attribution: false cannot take effect. */
export function licenceProblem(r: LicenceResult): string | null {
  if (r.ok) return null
  const where = r.file ? ` (${r.file})` : ''
  switch (r.reason) {
    case 'missing': return 'no PCafe Pro licence file found. Download pcafe-licence.json from your account page at https://app.p.cafe and put it in the project root or ~/.config/pcafe/licence.json.'
    case 'expired': return `the PCafe Pro licence${where} ended on ${r.until?.slice(0, 10)}. Download the renewed file from https://app.p.cafe.`
    case 'signature': return `the PCafe Pro licence${where} is not signed by PCafe. Download it again from https://app.p.cafe.`
    default: return `the PCafe Pro licence${where} cannot be read. Download it again from https://app.p.cafe.`
  }
}
