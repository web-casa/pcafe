#!/usr/bin/env node
// Fast offline template lookup for humans and AI harnesses.
// Reads the pre-generated JSON catalog (Node 20.11+ safe, no TS stripping needed)
// and merges @pcafe/pro/dist/catalog.js when installed.
//
// Usage:
//   npx pcafe spec Cover StatRow CompareTable [--json]
//   npx pcafe spec --search 对比 [--json]
//   node scripts/spec.mjs --self-test
import { existsSync, readFileSync, realpathSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = resolve(import.meta.dirname, '..')
const USAGE = `usage:
  npx pcafe spec <TemplateName...> [--json]
  npx pcafe spec --search <query> [--json]`

async function loadCatalog(root = ROOT) {
  const jsonFile = join(root, 'skills', 'pcafe', 'references', 'catalog.json')
  if (!existsSync(jsonFile)) {
    throw new Error('skills/pcafe/references/catalog.json not found. Run `npx pcafe docs` first.')
  }
  const free = JSON.parse(readFileSync(jsonFile, 'utf8')).map((c) => ({ ...c, source: 'free' }))
  const pro = []
  const proLink = join(root, 'node_modules', '@pcafe', 'pro')
  if (existsSync(join(proLink, 'package.json'))) {
    const proReal = realpathSync(proLink)
    const file = join(proReal, 'dist', 'catalog.js')
    try {
      if (!existsSync(file)) throw new Error('dist/catalog.js is missing (is @pcafe/pro built?)')
      const mod = await import(pathToFileURL(file).href)
      if (Array.isArray(mod.proCatalog)) {
        for (const c of mod.proCatalog) {
          pro.push({
            id: c.id,
            component: c.component,
            name: c.name,
            nameEn: c.nameEn || c.name,
            role: c.role,
            roleEn: c.roleEn || c.role,
            summary: c.summary,
            summaryEn: c.summaryEn || c.summary,
            deck: c.pack,
            demo: c.demo,
            pack: c.pack,
            importFrom: `@pcafe/pro/${c.id}`,
            useWhen: c.useWhen ?? [],
            useWhenEn: c.useWhenEn ?? [],
            avoidWhen: c.avoidWhen ?? [],
            avoidWhenEn: c.avoidWhenEn ?? [],
            limits: c.limits ?? [],
            limitsEn: c.limitsEn ?? [],
            ...(c.interaction ? { interaction: c.interaction } : {}),
            props: c.props ?? [],
            ...(c.example ? { example: c.example } : {}),
            source: 'pro',
          })
        }
      }
    } catch (err) {
      console.warn(`spec: @pcafe/pro is installed but its catalog could not be read (${err.message}); listing free templates only.`)
    }
  }
  return [...free, ...pro]
}

function formatOne(t) {
  const imp = t.source === 'pro'
    ? `import { ${t.component} } from '@pcafe/pro/${t.id}'`
    : `import { ${t.component} } from '../../kit'  // in slides/*.tsx use '../../../kit'`
  const ref = t.source === 'pro'
    ? `@pcafe/pro/decks/${t.deck} (${t.demo})`
    : `src/decks/${t.deck} (${t.demo})`
  const lines = [
    `## ${t.component} — ${t.name} (${t.role})${t.source === 'pro' ? ` [Pro · ${t.pack}]` : ''}`,
    `Import: \`${imp}\``,
    `Summary: ${t.summary}`,
    `Use when: ${t.useWhen.join('；') || '—'}`,
    `Avoid: ${t.avoidWhen.join('；') || '—'}`,
    `Limits: ${t.limits.join('；') || '—'}`,
    `Reference: ${ref}`,
  ]
  if (t.interaction) lines.push(`Interaction: ${t.interaction}`)
  if (t.props?.length) {
    lines.push('', 'Props:')
    for (const p of t.props) {
      lines.push(`- \`${p.name}\`${p.required ? ' (required)' : ''}: \`${p.type}\` — ${p.note}`)
    }
  }
  if (t.example) {
    lines.push('', 'Example:', '```tsx', t.example, '```')
  }
  return lines.join('\n')
}

function searchCatalog(catalog, query) {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const tokens = q.split(/\s+/).filter(Boolean)
  return catalog.filter((t) => {
    const hay = [
      t.id, t.component, t.name, t.nameEn, t.role, t.roleEn,
      t.summary, t.summaryEn, t.pack ?? '',
      ...(t.useWhen ?? []), ...(t.useWhenEn ?? []),
    ].join('\n').toLowerCase()
    return tokens.every((tok) => hay.includes(tok))
  })
}

async function selfTest() {
  const catalog = await loadCatalog(ROOT)
  if (!catalog.length) throw new Error('catalog is empty')
  const cover = catalog.find((t) => t.component.toLowerCase() === 'cover')
  if (!cover || !Array.isArray(cover.props) || !cover.limits.length) throw new Error('Cover entry malformed')
  const zhHits = searchCatalog(catalog, '对比')
  if (!zhHits.length) throw new Error('Chinese search "对比" returned 0 hits')
  const enHits = searchCatalog(catalog, 'compare')
  if (!enHits.length) throw new Error('English search "compare" returned 0 hits')
  const miss = searchCatalog(catalog, 'zzz-nonexistent-template-xyz')
  if (miss.length !== 0) throw new Error('Expected 0 hits for nonexistent query')
  const rendered = formatOne(cover)
  if (!rendered.includes("import { Cover } from '../../kit'") || !rendered.includes('Limits:')) {
    throw new Error('formatOne output missing import or limits')
  }
  console.log(`PASS  spec self-test (${catalog.length} templates, zh=${zhHits.length}, en=${enHits.length})`)
  return 0
}

async function main() {
  const args = process.argv.slice(2)
  if (args.includes('--help') || args.includes('-h')) {
    console.log(USAGE)
    return 0
  }
  if (args.includes('--self-test')) return selfTest()
  const asJson = args.includes('--json')
  let searchMode = false
  let searchParts = []
  const names = []

  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (a === '--json') continue
    if (a === '--search') {
      const next = args[i + 1]
      if (!next || next.startsWith('-')) {
        console.error('pcafe spec: --search requires a query')
        return 2
      }
      searchMode = true
      searchParts.push(next)
      i++
      continue
    }
    if (a.startsWith('--search=')) {
      const val = a.slice('--search='.length)
      if (!val || val.startsWith('-')) {
        console.error('pcafe spec: --search requires a query')
        return 2
      }
      searchMode = true
      searchParts.push(val)
      continue
    }
    if (a.startsWith('-')) {
      console.error(`pcafe spec: unknown option "${a}"`)
      return 2
    }
    if (searchMode) searchParts.push(a)
    else names.push(a)
  }

  if (searchMode && names.length) {
    console.error('pcafe spec: cannot combine --search with template names')
    return 2
  }
  const searchQuery = searchMode ? searchParts.join(' ').trim() : null

  if (!searchQuery && !names.length) {
    console.error(USAGE)
    return 2
  }

  const catalog = await loadCatalog(ROOT)

  if (searchQuery !== null) {
    const hits = searchCatalog(catalog, searchQuery)
    if (asJson) {
      console.log(JSON.stringify({
        query: searchQuery,
        count: hits.length,
        results: hits.map((t) => ({
          id: t.id,
          component: t.component,
          name: t.name,
          role: t.role,
          summary: t.summary,
          source: t.source,
          ...(t.pack ? { pack: t.pack } : {}),
          importFrom: t.importFrom,
        })),
      }, null, 2))
      return 0
    }
    if (!hits.length) {
      console.log(`no matching templates for "${searchQuery}"`)
      return 0
    }
    console.log(`Matched ${hits.length} template${hits.length === 1 ? '' : 's'} for "${searchQuery}":\n`)
    for (const t of hits) {
      console.log(`- \`${t.component}\` (${t.name} · ${t.role})${t.source === 'pro' ? ` [Pro:${t.pack}]` : ''} — ${t.summary}`)
    }
    console.log(`\nRun \`npx pcafe spec ${hits.slice(0, 3).map((t) => t.component).join(' ')}\` for full props & limits.`)
    return 0
  }

  const found = []
  const missing = []
  for (const raw of names) {
    const key = raw.toLowerCase()
    const match = catalog.find((t) => t.component.toLowerCase() === key || t.id.toLowerCase() === key)
    if (match) found.push(match)
    else missing.push(raw)
  }

  if (missing.length) {
    console.error(`pcafe spec: unknown template(s): ${missing.join(', ')}`)
    return 1
  }

  if (asJson) {
    console.log(JSON.stringify({ templates: found }, null, 2))
    return 0
  }

  console.log(found.map(formatOne).join('\n\n---\n\n'))
  return 0
}

function isDirectEntry() {
  if (!process.argv[1]) return false
  try {
    return realpathSync(fileURLToPath(import.meta.url)) === realpathSync(process.argv[1])
  } catch {
    return import.meta.url === pathToFileURL(process.argv[1]).href
  }
}

if (isDirectEntry()) {
  main().then((code) => process.exit(code)).catch((err) => {
    console.error(`pcafe spec: ${err.message}`)
    process.exit(1)
  })
}
