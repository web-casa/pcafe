// Unit test for vite.licence.ts with a throwaway key pair: a good file passes, and a
// forged, edited, expired or malformed one does not. Run: node scripts/licence-test.mjs
import { generateKeyPairSync, sign } from 'node:crypto'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { checkLicenceText, findLicence, licencePayload, licenceProblem } from '../vite.licence.ts'

const pair = () => {
  const { publicKey, privateKey } = generateKeyPairSync('ed25519')
  return { pub: publicKey.export({ type: 'spki', format: 'der' }).toString('base64'), privateKey }
}
const ours = pair()
const theirs = pair()
const make = (key, over = {}) => {
  const l = { v: 1, id: 'PCL-TEST-0001', org: 'Example Studio', plan: 'pro_yearly', issued: '2026-11-10T00:00:00.000Z', until: '2027-11-10T00:00:00.000Z', ...over }
  return { ...l, sig: sign(null, Buffer.from(licencePayload(l)), key.privateKey).toString('base64') }
}
const now = new Date('2027-01-01T00:00:00Z')
let failed = 0
const expect = (name, got, want) => {
  const ok = got === want
  if (!ok) failed++
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}: ${got}`)
}
const reason = (r) => (r.ok ? 'ok' : r.reason)

expect('valid yearly', reason(checkLicenceText(JSON.stringify(make(ours)), ours.pub, now)), 'ok')
expect('valid lifetime', reason(checkLicenceText(JSON.stringify(make(ours, { plan: 'founder_lifetime', until: null })), ours.pub, new Date('2099-01-01'))), 'ok')
expect('signed by someone else', reason(checkLicenceText(JSON.stringify(make(theirs)), ours.pub, now)), 'signature')
expect('org edited after signing', reason(checkLicenceText(JSON.stringify({ ...make(ours), org: 'Someone Else' }), ours.pub, now)), 'signature')
expect('until extended after signing', reason(checkLicenceText(JSON.stringify({ ...make(ours), until: '2099-01-01T00:00:00.000Z' }), ours.pub, now)), 'signature')
expect('plan changed after signing', reason(checkLicenceText(JSON.stringify({ ...make(ours), plan: 'founder_lifetime', until: null }), ours.pub, now)), 'signature')
expect('expired', reason(checkLicenceText(JSON.stringify(make(ours)), ours.pub, new Date('2028-01-01'))), 'expired')
expect('not JSON', reason(checkLicenceText('{', ours.pub, now)), 'malformed')
expect('missing signature', reason(checkLicenceText(JSON.stringify({ ...make(ours), sig: undefined }), ours.pub, now)), 'malformed')
expect('built-in key rejects a test licence', reason(checkLicenceText(JSON.stringify(make(ours)), undefined, now)), 'signature')

const dir = mkdtempSync(join(tmpdir(), 'pcafe-licence-'))
const empty = mkdtempSync(join(tmpdir(), 'pcafe-licence-home-'))
expect('no file anywhere', reason(findLicence(dir, { HOME: empty })), 'missing')
writeFileSync(join(dir, 'pcafe-licence.json'), JSON.stringify(make(ours)))
expect('project file found (signature checked with built-in key)', reason(findLicence(dir, {})), 'signature')
expect('problem text names the file', /pcafe-licence\.json/.test(licenceProblem(findLicence(dir, {}))), true)

if (failed) {
  console.error(`${failed} licence check(s) failed`)
  process.exit(1)
}
console.log('licence checks PASS')
