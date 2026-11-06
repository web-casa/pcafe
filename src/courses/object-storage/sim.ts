// A very small model of the S3 object API, in memory, for teaching. It sends nothing anywhere.
// Behaviours follow the S3 API Reference: keys sort by UTF-8 bytes, LIST groups on the delimiter
// into CommonPrefixes, GET of a missing key is 404 NoSuchKey, DELETE answers 204.
// Not modelled: auth, versioning, multipart, storage classes, zero-byte console folders.

export interface SimObject {
  key: string
  body: string
  etag: string
}

export type Verb = 'PUT' | 'GET' | 'LIST' | 'DELETE'

export interface SimRequest {
  verb: Verb
  key: string
  body: string
  prefix: string
  delimiter: boolean
}

export interface SimResponse {
  status: number
  text: string
  /** Request line as it would be sent. */
  line: string
  etag?: string
  body?: string
  code?: string
  contents?: string[]
  commonPrefixes?: string[]
  overwrote?: boolean
  existed?: boolean
}

const enc = new TextEncoder()
export const byteLength = (s: string) => enc.encode(s).length

/** Lexicographic by UTF-8 bytes, as S3 lists keys. */
export function compareKeys(a: string, b: string) {
  const x = enc.encode(a)
  const y = enc.encode(b)
  for (let i = 0; i < Math.min(x.length, y.length); i++) if (x[i] !== y[i]) return x[i] - y[i]
  return x.length - y.length
}

/** Not an MD5: only a stand-in, so that changed content visibly changes the ETag. */
export function fakeEtag(body: string) {
  let h = 2166136261
  for (const c of enc.encode(body)) {
    h ^= c
    h = Math.imul(h, 16777619)
  }
  return `"${(h >>> 0).toString(16).padStart(8, '0')}"`
}

export function listKeys(objects: SimObject[], prefix: string, delimiter: boolean) {
  const contents: string[] = []
  const common = new Set<string>()
  for (const { key } of objects) {
    if (!key.startsWith(prefix)) continue
    const rest = key.slice(prefix.length)
    const at = delimiter ? rest.indexOf('/') : -1
    if (at >= 0) common.add(prefix + rest.slice(0, at + 1))
    else contents.push(key)
  }
  return { contents, commonPrefixes: [...common].sort(compareKeys) }
}

export function requestLine(r: SimRequest) {
  if (r.verb === 'LIST') {
    const q = ['list-type=2']
    if (r.prefix) q.push(`prefix=${r.prefix}`)
    if (r.delimiter) q.push('delimiter=/')
    return `GET /?${q.join('&')}`
  }
  return `${r.verb} /${r.key}`
}

export function send(objects: SimObject[], r: SimRequest): { objects: SimObject[]; res: SimResponse } {
  const line = requestLine(r)
  const found = objects.find((o) => o.key === r.key)
  switch (r.verb) {
    case 'PUT': {
      const etag = fakeEtag(r.body)
      const next = [...objects.filter((o) => o.key !== r.key), { key: r.key, body: r.body, etag }].sort((a, b) => compareKeys(a.key, b.key))
      return { objects: next, res: { status: 200, text: 'OK', line, etag, overwrote: !!found && found.body !== r.body, existed: !!found } }
    }
    case 'GET':
      if (!found) return { objects, res: { status: 404, text: 'Not Found', line, code: 'NoSuchKey' } }
      return { objects, res: { status: 200, text: 'OK', line, etag: found.etag, body: found.body, existed: true } }
    case 'DELETE':
      return { objects: objects.filter((o) => o.key !== r.key), res: { status: 204, text: 'No Content', line, existed: !!found } }
    case 'LIST':
      return { objects, res: { status: 200, text: 'OK', line, ...listKeys(objects, r.prefix, r.delimiter) } }
  }
}
