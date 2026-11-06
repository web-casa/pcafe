// Downloads optional Unsplash mood photos into src/assets/photos/ using YOUR
// access key (env UNSPLASH_ACCESS_KEY, never stored). Photos are not shipped
// with pcafe: the Unsplash license forbids redistributing a collection.
//
// usage: UNSPLASH_ACCESS_KEY=... node scripts/fetch-photos.mjs [category[:count] ...]
//   e.g. node scripts/fetch-photos.mjs office:4 city:3 nature
// Default: office:3 city:3 nature:3 abstract:3 technology:3
//
// Follows the Unsplash API guidelines: hotlink-style image URLs (ixid kept),
// a request to links.download_location for every downloaded photo, and author
// credit recorded in credits.json. Stays under the demo limit of 50 req/h.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const KEY = process.env.UNSPLASH_ACCESS_KEY
const DIR = resolve(import.meta.dirname, '..', 'src', 'assets', 'photos')
const CREDITS = join(DIR, 'credits.json')
const API = 'https://api.unsplash.com'
const MAX_REQ = 50
const MAX_PER_CAT = 30

if (!KEY) {
  console.error('UNSPLASH_ACCESS_KEY is not set.\nCreate a free app at https://unsplash.com/developers and run:\n  UNSPLASH_ACCESS_KEY=your-key npx pcafe photos office:3 city:3')
  process.exit(1)
}

const args = process.argv.slice(2)
const wanted = (args.length ? args : ['office:3', 'city:3', 'nature:3', 'abstract:3', 'technology:3']).map((a) => {
  const [cat, n = '3'] = a.split(':')
  const count = Number(n)
  if (!/^[a-z0-9-]+$/.test(cat) || !Number.isInteger(count) || count < 1 || count > MAX_PER_CAT) {
    console.error(`invalid argument "${a}": use category[:count], category in [a-z0-9-], count 1-${MAX_PER_CAT}`)
    process.exit(2)
  }
  return { cat, count }
})

// Cost: 1 search + per photo (1 image + 1 download_location). Images come from
// images.unsplash.com which does not count, but we budget conservatively for API calls only.
const apiCalls = wanted.reduce((s, w) => s + 1 + w.count, 0)
if (apiCalls > MAX_REQ) {
  console.error(`this run needs ${apiCalls} API requests; Unsplash demo apps allow ${MAX_REQ}/hour. Ask for fewer photos.`)
  process.exit(2)
}

mkdirSync(DIR, { recursive: true })
let credits = []
try { credits = JSON.parse(readFileSync(CREDITS, 'utf8')) } catch {}

let used = 0
async function api(path) {
  if (used >= MAX_REQ) throw new Error('reached 50 requests this run (Unsplash hourly limit)')
  used++
  const res = await fetch(path.startsWith('http') ? path : API + path, { headers: { Authorization: `Client-ID ${KEY}`, 'Accept-Version': 'v1' } })
  if (res.status === 401) throw new Error('Unsplash rejected the access key (401).')
  if (res.status === 403) throw new Error('Unsplash rate limit reached (403). Try again in an hour.')
  if (!res.ok) throw new Error(`Unsplash API ${res.status} for ${path}`)
  const left = res.headers.get('x-ratelimit-remaining')
  if (left !== null && Number(left) <= 0) used = MAX_REQ
  return res.json()
}

let failed = 0
for (const { cat, count } of wanted) {
  let data
  try {
    data = await api(`/search/photos?query=${encodeURIComponent(cat)}&orientation=landscape&per_page=${count}&content_filter=high`)
  } catch (e) {
    console.error(`${cat}: ${e.message}`)
    failed++
    if (used >= MAX_REQ) break
    continue
  }
  const results = data.results ?? []
  if (!results.length) console.warn(`${cat}: no results`)
  let n = credits.filter((c) => c.category === cat).length
  for (const p of results) {
    if (credits.some((c) => c.id === p.id)) continue
    const file = `photo-${cat}-${String(++n).padStart(2, '0')}.webp`
    const url = `${p.urls.raw}&w=1920&h=1080&fit=crop&fm=webp&q=80`
    try {
      const img = await fetch(url)
      if (!img.ok) throw new Error(`image HTTP ${img.status}`)
      writeFileSync(join(DIR, file), Buffer.from(await img.arrayBuffer()))
      await api(p.links.download_location) // required by the Unsplash API guidelines
    } catch (e) {
      console.error(`${file}: ${e.message}`)
      n--
      failed++
      continue
    }
    credits.push({
      file,
      category: cat,
      id: p.id,
      author: p.user?.name ?? '',
      author_url: `${p.user?.links?.html ?? 'https://unsplash.com'}?utm_source=pcafe&utm_medium=referral`,
      photo_url: `${p.links.html}?utm_source=pcafe&utm_medium=referral`,
      description: p.alt_description ?? p.description ?? '',
      downloaded: new Date().toISOString().slice(0, 10),
    })
    writeFileSync(CREDITS, JSON.stringify(credits, null, 2) + '\n')
    console.log(`${file}  by ${p.user?.name}`)
  }
}

console.log(`\n${credits.length} photos in ${DIR} (credits.json). ${used} API requests used.`)
console.log('Credit in the slide source: "图：Unsplash / <author>" or "Photo: Unsplash / <author>".')
if (!existsSync(CREDITS)) writeFileSync(CREDITS, '[]\n')
process.exit(failed ? 1 : 0)
