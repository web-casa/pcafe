// Generates docs/zh-CN/components.md from src/kit/catalog.ts (the same data the
// #/kit gallery renders), copies it to docs/de/components.md with a
// language note, and writes the lookup tables of the pcafe skill in
// skills/pcafe/references. usage: npm run docs (or `pcafe docs`)
import { readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { freeCatalog } from '../src/kit/catalog.ts'
import { catalogEn, groupNames, sharedPropNotes, hanExceptions } from '../src/kit/catalog.en.ts'
import { existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs'

// Pro is optional. @pcafe/pro is a built package whose catalog is plain
// JavaScript with no imports, so Node reads it directly. The engine repo (which
// has no @pcafe/pro) never touches Pro code.
const proRoot = resolve(import.meta.dirname, '..', 'node_modules', '@pcafe', 'pro')
let proCatalog = []
if (existsSync(resolve(proRoot, 'package.json'))) {
  const file = resolve(proRoot, 'dist', 'catalog.js')
  try {
    if (!existsSync(file)) throw new Error('dist/catalog.js is missing (is the package built?)')
    const mod = await import(pathToFileURL(file).href)
    proCatalog = Array.isArray(mod.proCatalog) ? mod.proCatalog : []
  } catch (err) {
    console.warn(`docs: @pcafe/pro is installed but its catalog could not be read: ${err.message}`)
  }
}
const proIds = new Set(proCatalog.map((c) => c.id))
const catalog = [...freeCatalog, ...proCatalog.map((c) => ({ ...c, deck: c.pack }))]

// English catalog validation. This runs before any file is written, so
// `npm run docs` fails without producing half-English docs.
const BASE_PROPS = ['kicker', 'title', 'lead', 'source', 'hint']
const BASE_CN_NOTES = {
  kicker: '标题上方的小节名，2–8 字',
  title: '页面标题；传数组可手动断行，每项一行',
  lead: '一到两句导语，≤ 60 字',
  source: '事实出处；页面上有任何数据或事实时必填',
  hint: '页眉中间的操作提示，可用 <kbd>',
}
const isBaseProp = (name) => BASE_PROPS.includes(name)
const isCombinedBase = (name) => name.split(' / ').every(isBaseProp)
const isSharedProp = (name) => isBaseProp(name) || isCombinedBase(name)
const specificBaseProps = (c) => c.props.filter((p) => isBaseProp(p.name) && p.note !== BASE_CN_NOTES[p.name])
const ownPropNames = (c) => {
  const specific = new Set(specificBaseProps(c).map((p) => p.name))
  return [...new Set(c.props.map((p) => p.name).filter((n) => !isSharedProp(n) || specific.has(n)))]
}
const roleGroup = (role) => role.split(' · ')[0]
const sourceGroups = [...new Set(freeCatalog.map((c) => roleGroup(c.role)))]
if (sourceGroups.some((g) => !groupNames[g])) {
  throw new Error(`gen-docs: English catalog is missing group names: ${sourceGroups.filter((g) => !groupNames[g]).join(', ')}`)
}
if (new Set(Object.values(groupNames)).size !== Object.values(groupNames).length) {
  throw new Error('gen-docs: English group names must be unique')
}
{
  const errors = []
  const usedExceptions = []
  const stripExceptions = (text) => {
    let out = String(text)
    for (const ex of hanExceptions) {
      if (!ex) continue
      if (out.includes(ex)) usedExceptions.push(ex)
      out = out.split(ex).join('')
    }
    return out
  }
  const englishStrings = (e) => [
    e.name, e.role, e.summary,
    ...e.useWhen, ...e.avoidWhen, ...e.limits,
    ...Object.values(e.props),
    ...(e.interaction ? [e.interaction] : []),
  ]
  for (const c of freeCatalog) {
    const e = catalogEn[c.id]
    if (!e) { errors.push(`${c.id}: missing English entry`); continue }
    if (!groupNames[roleGroup(c.role)]) errors.push(`${c.id}: no English group for "${roleGroup(c.role)}"`)
    else if (!e.role.startsWith(`${groupNames[roleGroup(c.role)]} · `)) {
      errors.push(`${c.id}.role: expected group "${groupNames[roleGroup(c.role)]}", got "${e.role}"`)
    }
    for (const field of ['useWhen', 'avoidWhen', 'limits']) {
      if (!Array.isArray(e[field]) || e[field].length !== c[field].length) {
        errors.push(`${c.id}.${field}: ${e[field]?.length ?? 'missing'} entries, Chinese has ${c[field].length}`)
      }
    }
    for (const p of specificBaseProps(c)) {
      if (!e.props?.[p.name]) errors.push(`${c.id}.props.${p.name}: entry-specific note missing`)
    }
    const expected = ownPropNames(c)
    const actual = Object.keys(e.props ?? {})
    for (const name of expected) if (!actual.includes(name)) errors.push(`${c.id}.props: missing "${name}"`)
    for (const name of actual) if (!expected.includes(name)) errors.push(`${c.id}.props: extra "${name}"`)
    if (!!c.interaction !== !!e.interaction) errors.push(`${c.id}.interaction: presence differs`)
    for (const text of englishStrings(e)) {
      if (/\p{Script=Han}/u.test(stripExceptions(text))) errors.push(`${c.id}: Han characters remain in "${text}"`)
    }
  }
  for (const id of Object.keys(catalogEn)) {
    if (!freeCatalog.some((c) => c.id === id)) errors.push(`${id}: English id has no Chinese entry`)
  }
  for (const [name, note] of Object.entries(sharedPropNotes)) {
    if (!isBaseProp(name)) errors.push(`sharedPropNotes: "${name}" is not a base prop`)
    if (/\p{Script=Han}/u.test(stripExceptions(note))) errors.push(`sharedPropNotes.${name}: Han characters remain`)
  }
  for (const name of BASE_PROPS) if (!sharedPropNotes[name]) errors.push(`sharedPropNotes: missing "${name}"`)
  if (errors.length) throw new Error(`gen-docs: invalid English catalog:\n- ${errors.join('\n- ')}`)
  console.log(`validated ${freeCatalog.length} English entries and ${sourceGroups.length} groups` +
    (hanExceptions.length ? `; ${usedExceptions.length}/${hanExceptions.length} Han exceptions used` : '; no Han characters'))
}

// Style presets are read from source text: theme.ts imports its style files
// without extensions, which node can't load. Parse the literal `BASE_STYLES`
// block (`export const STYLES` is only an alias to it), then stop before any
// file is written if a preset is missing, so styles.md cannot lose built-ins
// without the command failing.
const kitDir = resolve(import.meta.dirname, '..', 'src', 'kit')
const themeSrc = readFileSync(resolve(kitDir, 'theme.ts'), 'utf8')
const field = (src, f) => src.match(new RegExp(`${f}:\\s*'([^']*)'`))?.[1]
const STYLES = {}
const baseStart = themeSrc.indexOf('const BASE_STYLES = {')
const baseEnd = themeSrc.indexOf('} satisfies Record<string, StylePreset>', baseStart)
if (baseStart < 0 || baseEnd < 0)
  throw new Error('gen-docs: could not delimit the BASE_STYLES block in src/kit/theme.ts')
const baseSrc = themeSrc.slice(baseStart, baseEnd)
const baseKeys = [...baseSrc.matchAll(/^  '?([\w-]+)'?:/gm)].map((m) => m[1])
for (const m of baseSrc.matchAll(/^  '?([\w-]+)'?: \{([^\n]*)\},$|^  '?([\w-]+)'?: \{$([\s\S]*?)^  \}/gm)) {
  const body = m[2] ?? m[4]
  STYLES[m[1] ?? m[3]] = { label: field(body, 'label'), note: field(body, 'note'), tone: field(body, 'tone') }
}
for (const f of readdirSync(resolve(kitDir, 'styles'))) {
  const src = readFileSync(resolve(kitDir, 'styles', f), 'utf8')
  STYLES[f.replace(/\.ts$/, '')] = { label: field(src, 'label'), note: field(src, 'note'), tone: field(src, 'tone') }
}
const unresolvedBuiltin = baseKeys.filter((k) => !(k in STYLES))
const standardMissing = !('standard' in STYLES)
if (unresolvedBuiltin.length || standardMissing)
  throw new Error(
    `gen-docs: ${unresolvedBuiltin.length} of ${baseKeys.length} built-in styles declared by BASE_STYLES could not be resolved` +
      (unresolvedBuiltin.length ? ` (missing: ${unresolvedBuiltin.join(', ')})` : '') +
      (standardMissing ? '; the default style `standard` is missing' : ''),
  )

const out = resolve(import.meta.dirname, '..', 'docs', 'zh-CN', 'components.md')
const cell = (s) => String(s).replaceAll('|', '\\|')

const lines = [
  '# 组件目录',
  '',
  '> 本文件由 `npm run docs` 从 `src/kit/catalog.ts` 生成，请勿手改。',
  '> 浏览器里打开 `#/kit` 可以看到每个模板的实时预览。写作流程见 [README.md](README.md)。',
  '',
  '**长度怎么数**：“字”指一个汉字；两个英文字母、数字或空格算一个字。“个字符”指每个字符都算一个，用于数字、代号、命令等字段。上限是硬限制，超出就会破版；有下限的字段低于下限时页面会显得空。',
  '',
  '## 速查：我要表达什么 → 用哪个模板',
  '',
  '| 模板 | 位置 | 一句话 |',
  '| --- | --- | --- |',
  ...catalog.map((c) => `| [\`${c.component}\`](#${c.id}) ${c.name} | ${c.role} | ${cell(c.summary)} |`),
  '',
  '免费模板都从 `src/kit` 导入：',
  '',
  '```tsx',
  `import { ${freeCatalog.map((c) => c.component).join(', ')} } from '../../kit'`,
  '```',
  '',
  ...(proCatalog.length
    ? [
        'Pro 模板每个单独导入，导出的演示只带用到的模板和样式。风格的导入写法见参考页：',
        '',
        '```tsx',
        ...proCatalog.map((c) => `import { ${c.component} } from '@pcafe/pro/${c.id}'`),
        '```',
        '',
      ]
    : []),
]

for (const [i, c] of catalog.entries()) {
  lines.push(
    `<a id="${c.id}"></a>`,
    '',
    `## ${String(i + 1).padStart(2, '0')} · ${c.name} \`<${c.component} />\``,
    '',
    `**位置**：${c.role}　**参考页**：\`${proIds.has(c.id) ? '@pcafe/pro/decks/' + c.deck : 'src/decks/' + (c.deck ?? 'release')}\` 中的 \`${c.demo}\`${proIds.has(c.id) ? `　**导入**：\`import { ${c.component} } from '@pcafe/pro/${c.id}'\`` : ''}`,
    '',
    c.summary,
    '',
    '**适合**',
    '',
    ...c.useWhen.map((t) => `- ${t}`),
    '',
    '**避免**',
    '',
    ...c.avoidWhen.map((t) => `- ${t}`),
    '',
    '**内容上限**（超出会破版，`npm run qa` 会报出来）',
    '',
    ...c.limits.map((t) => `- ${t}`),
    '',
  )
  if (c.interaction) lines.push(`**交互**：${c.interaction}`, '')
  lines.push(
    '**Props**',
    '',
    '| 名称 | 类型 | 必填 | 说明 |',
    '| --- | --- | --- | --- |',
    ...c.props.map((p) => `| \`${p.name}\` | \`${cell(p.type)}\` | ${p.required ? '是' : ''} | ${cell(p.note)} |`),
    '',
  )
  if (c.example) lines.push('**示例**', '', '```tsx', c.example, '```', '')
}

// Icon names, read from the source text (icon-set.ts imports React components).
const iconSrc = readFileSync(resolve(import.meta.dirname, '..', 'src', 'kit', 'icon-set.ts'), 'utf8')
const groups = [...iconSrc.matchAll(/title: '([^']+)',\s*icons: \{([^}]*)\}/g)].map(([, title, body]) => ({
  title,
  names: [...body.matchAll(/^\s*'?([\w-]+)'?:/gm)].map((m) => m[1]),
}))
lines.push(
  '<a id="icons"></a>',
  '',
  `## 图标（${groups.reduce((n, g) => n + g.names.length, 0)} 个）`,
  '',
  '模板的 `icon` 字段只接受下面的名称。整份演示的系列由 `DeckDef.iconStyle` 决定（默认 `line-duotone`），用法见 [README.md 第 12 节](README.md#12-图标)。图标来自 Solar Icons（480 Design，CC BY 4.0）。',
  '',
  ...groups.flatMap((g) => [`**${g.title}**：${g.names.map((n) => `\`${n}\``).join(' ')}`, '']),
)

writeFileSync(out, lines.join('\n'))
console.log(`wrote ${out} (${catalog.length} components)`)

// German gets the same (Chinese) catalog with a note on top. zh-TW is converted
// from zh-CN by scripts/zh-tw.mjs, which `npm run docs` runs next.
const NOTES = {
  de: '> Hinweis: Die deutsche Übersetzung wird derzeit nicht weiter gepflegt. Die Vorlagenbeschreibungen gibt es auf [Englisch](../en/components.md) und Chinesisch.',
}
for (const [lang, note] of Object.entries(NOTES)) {
  const dir = resolve(import.meta.dirname, '..', 'docs', lang)
  mkdirSync(dir, { recursive: true })
  const file = resolve(dir, 'components.md')
  writeFileSync(file, [note, '', ...lines].join('\n'))
  console.log(`wrote ${file}`)
}

// Skill lookup tables: short enough for an AI to read whole before planning a deck.
const skill = resolve(import.meta.dirname, '..', 'skills', 'pcafe', 'references')
mkdirSync(skill, { recursive: true })
const head = '> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。\n'
const byRole = new Map()
for (const c of catalog) {
  const k = c.role.split(' · ')[0]
  byRole.set(k, [...(byRole.get(k) ?? []), c])
}
// Split the 140 KB table by purpose: templates.md is now a small index, one
// file per group holds the full lines. SKILL.md is left to the human editor.
const SLUG = {
  '开场': 'opening', '总览': 'overview', '数据': 'data', '时间': 'timeline', '对比': 'compare',
  '要点': 'key-points', '建议': 'advice', '操作': 'steps', '预告': 'preview', '收尾': 'closing',
  '变化': 'change', '现状': 'status', '机制': 'mechanism', '答疑': 'qa', '规划': 'roadmap',
  '趋势': 'trend', '导航': 'nav', '分隔': 'divider', '概念': 'concept', '辟谣': 'myth',
  '排查': 'troubleshoot', '对照': 'contrast', '并列': 'parallel', '证据': 'evidence', '方法': 'method',
  '计划': 'plan', '背景': 'background', '佐证': 'proof', '实证': 'empirical', '讲解': 'explain',
  '诊断': 'diagnose', '定位': 'position', '客户': 'customer', '定价': 'pricing', '衡量': 'measure',
  '分配': 'allocation', '拆解': 'breakdown', '分工': 'division', '分析': 'analysis', '分布': 'distribution',
  '场景': 'scene', 'AI': 'ai', '技术': 'tech', '展开': 'expand', '选项': 'options', '关系': 'relation',
  '分类': 'classify', '动效': 'motion', '拟真界面': 'realistic-ui',
}
const groupDir = resolve(skill, 'templates')
mkdirSync(groupDir, { recursive: true })
for (const f of readdirSync(groupDir)) if (f.endsWith('.md')) rmSync(join(groupDir, f))

const entry = (c) => [
  `### \`${c.component}\` ${c.name}（${c.role}）`,
  `- 适合：${c.useWhen.join('；')}`,
  `- 不适合：${c.avoidWhen.join('；') || '—'}`,
  `- 上限：${c.limits.join('；')}`,
  `- 参考：${proIds.has(c.id) ? '@pcafe/pro/decks/' + c.deck : 'src/decks/' + (c.deck ?? 'release')} 的 \`${c.demo}\` 页；docs/zh-CN/components.md#${c.id}${c.interaction ? `；交互：${c.interaction}` : ''}`,
  '',
]
const tplGroups = [...byRole.entries()].map(([role, list], i) => ({
  role,
  list,
  slug: SLUG[role] ?? `group-${i + 1}`,
}))
for (const g of tplGroups) {
  const file = join(groupDir, `${g.slug}.md`)
  writeFileSync(file, [`# ${g.role}`, '', head, `共 ${g.list.length} 个模板。返回索引：[../templates.md](../templates.md)。`, '', ...g.list.flatMap(entry)].join('\n'))
}
const index = ['# 模板速查（索引）', '', head]
index.push(`共 ${catalog.length} 个模板，${tplGroups.length} 组。先读本页选组，再读组文件里的“适合 / 不适合 / 上限 / 参考”；完整 props 和示例见 docs/zh-CN/components.md。`, '')
index.push('| 组 | 内容形状 | 模板 |', '| --- | --- | --- |')
for (const g of tplGroups) {
  const shapes = [...new Set(g.list.flatMap((c) => c.useWhen))].slice(0, 3).join('；').replaceAll('|', '\\|')
  const names = g.list.map((c) => `\`${c.component}\``).join('、')
  index.push(`| [${g.role}](templates/${g.slug}.md) | ${shapes} | ${names} |`)
}
index.push('')
writeFileSync(resolve(skill, 'templates.md'), index.join('\n'))
const sty = ['# 风格与配色', '', head, '`DeckDef.style` 选一种风格，`DeckDef.theme` 选一套配色，两者可以任意组合。', '', '| style | 名称 | 适合 | 默认深色 | 参考演示 |', '| --- | --- | --- | --- | --- |']
// Read presets from source text: theme.ts imports its style files without extensions, which node can't load.
const DECK_OF = { standard: 'release', editorial: 'geo', poster: 'gtm', calm: 'launch', 'studio-dark': 'studio', 'mono-studio': 'mono' }
const THEMES = Object.fromEntries([...themeSrc.slice(themeSrc.indexOf('export const THEMES'), themeSrc.indexOf('export type ThemeName')).matchAll(/^  (\w+): \{[\s\S]*?label: '([^']+)'/gm)].map((m) => [m[1], { label: m[2] }]))
for (const [k, v] of Object.entries(STYLES)) {
  const deck = DECK_OF[k] ? `src/decks/${DECK_OF[k]}` : catalog.find((c) => c.deck === k) ? `src/decks/${k}` : '—'
  sty.push(`| \`${k}\` | ${v.label} | ${v.note} | ${v.tone === 'dark' ? '是' : ''} | ${deck} |`)
}
sty.push('', '| theme | 名称 |', '| --- | --- |', ...Object.entries(THEMES).map(([k, v]) => `| \`${k}\` | ${v.label} |`), '')
writeFileSync(resolve(skill, 'styles.md'), sty.join('\n'))
console.log(`wrote ${skill} (templates.md index, ${tplGroups.length} group files, styles.md)`)


// ---------------------------------------------------------------------------
// English outputs: docs/en/components.md and skills/pcafe/references/en.
// The free catalog comes from catalogEn; Pro rows use nameEn/summaryEn and
// fall back to Chinese, marked (zh), for the fields Pro does not translate.

const EN_ICON_GROUPS = {
  '搜索与发现': 'Search and discovery',
  'AI 与对话': 'AI and chat',
  '网络与技术': 'Network and technology',
  '系统与硬件': 'System and hardware',
  '内容与文档': 'Content and documents',
  '数据与度量': 'Data and measurement',
  '安全与合规': 'Security and compliance',
  '时间与流程': 'Time and process',
  '人与商业': 'People and business',
}
const enEntry = (c) => {
  if (proIds.has(c.id)) {
    const zh = (s) => `${s} (zh)`
    return {
      name: c.nameEn || c.name,
      role: zh(c.role),
      summary: c.summaryEn || c.summary,
      useWhen: c.useWhen.map(zh),
      avoidWhen: c.avoidWhen.map(zh),
      limits: c.limits.map(zh),
      props: Object.fromEntries(c.props.map((p) => [p.name, zh(p.note)])),
      interaction: c.interaction ? zh(c.interaction) : undefined,
    }
  }
  return catalogEn[c.id]
}
const enCatalog = catalog.map((c) => ({ ...c, en: enEntry(c) }))
const enCell = (s) => String(s).replaceAll('|', '\\|')

const enLines = [
  '# Template catalog',
  '',
  '> Generated by `npm run docs` from `src/kit/catalog.ts` and `src/kit/catalog.en.ts`. Do not edit by hand.',
  '> Open `#/kit` in a browser for a live preview of every template. For the writing workflow see [README.md](README.md).',
  '',
  '**How lengths are counted**: “chars” means one Han character; two Latin letters, digits or spaces count as one. “characters” counts every character and is used for numbers, codes and commands. Limits are hard: exceeding one breaks the layout. A field with a minimum looks empty below it.',
  '',
  '## Quick reference: what do I want to say → which template',
  '',
  '| Template | Position | One line |',
  '| --- | --- | --- |',
  ...enCatalog.map((c) => `| [\`${c.component}\`](#${c.id}) ${c.en.name} | ${enCell(c.en.role)} | ${enCell(c.en.summary)} |`),
  '',
  'Free templates all come from `src/kit`:',
  '',
  '```tsx',
  `import { ${freeCatalog.map((c) => c.component).join(', ')} } from '../../kit'`,
  '```',
  '',
  ...(proCatalog.length
    ? [
        'Import each Pro template on its own, so an exported deck carries only the templates and styles it uses. The reference deck shows how to import the style:',
        '',
        '```tsx',
        ...proCatalog.map((c) => `import { ${c.component} } from '@pcafe/pro/${c.id}'`),
        '```',
        '',
      ]
    : []),
]
for (const [i, c] of enCatalog.entries()) {
  const e = c.en
  const rows = []
  const seen = new Set()
  for (const p of c.props) {
    if (seen.has(p.name)) continue
    seen.add(p.name)
    const wholeBase = p.name.includes(' / ') && p.name.split(' / ').every((n) => BASE_PROPS.includes(n))
    const note = wholeBase
      ? 'Base header fields: see the shared notes below'
      : BASE_PROPS.includes(p.name) ? (e.props[p.name] ?? sharedPropNotes[p.name]) : (e.props[p.name] ?? `${p.note} (zh)`)
    const typeEn = p.type.replace('[左上, 右上, 左下, 右下]', '[top-left, top-right, bottom-left, bottom-right]')
    rows.push(`| \`${p.name}\` | \`${enCell(typeEn)}\` | ${p.required ? 'yes' : ''} | ${enCell(note)} |`)
  }
  enLines.push(
    `<a id="${c.id}"></a>`,
    '',
    `## ${String(i + 1).padStart(2, '0')} · ${e.name} \`<${c.component} />\``,
    '',
    `**Position**: ${e.role}; **Reference slide**: \`${proIds.has(c.id) ? '@pcafe/pro/decks/' + c.deck : 'src/decks/' + (c.deck ?? 'release')}\` — \`${c.demo}\`${proIds.has(c.id) ? `; **Import**: \`import { ${c.component} } from '@pcafe/pro/${c.id}'\`` : ''}`,
    '',
    e.summary,
    '',
    '**Use when**',
    '',
    ...e.useWhen.map((t) => `- ${t}`),
    '',
    '**Avoid**',
    '',
    ...e.avoidWhen.map((t) => `- ${t}`),
    '',
    '**Content limits** (exceeding them breaks the layout; `npm run qa` reports it)',
    '',
    ...e.limits.map((t) => `- ${t}`),
    '',
  )
  if (e.interaction) enLines.push(`**Interaction**: ${e.interaction}`, '')
  enLines.push(
    '**Props**',
    '',
    '| Name | Type | Required | Notes |',
    '| --- | --- | --- | --- |',
    ...rows,
    '',
  )
  if (c.example) enLines.push('**Example**', '', '```tsx', c.example, '```', '')
}
enLines.push(
  '<a id="icons"></a>',
  '',
  `## Icons (${groups.reduce((n, g) => n + g.names.length, 0)})`,
  '',
  'The `icon` field only accepts the names below. `DeckDef.iconStyle` selects the family for the whole deck (default `line-duotone`); see [README.md](README.md). Icons come from Solar Icons (480 Design, CC BY 4.0).',
  '',
  ...groups.flatMap((g) => [`**${EN_ICON_GROUPS[g.title] ?? g.title}**: ${g.names.map((n) => `\`${n}\``).join(' ')}`, '']),
)
writeFileSync(resolve(import.meta.dirname, '..', 'docs', 'en', 'components.md'), enLines.join('\n'))
console.log(`wrote docs/en/components.md (${enCatalog.length} components, English)`)

// English skill reference tables.
const enSkill = resolve(import.meta.dirname, '..', 'skills', 'pcafe', 'references', 'en')
const enGroupDir = join(enSkill, 'templates')
mkdirSync(enGroupDir, { recursive: true })
for (const f of readdirSync(enGroupDir)) if (f.endsWith('.md')) rmSync(join(enGroupDir, f))
const enHead = '> Generated by `npm run docs` from `src/kit/catalog.ts` and `src/kit/catalog.en.ts`. Do not edit by hand.\n'
const enByRole = new Map()
for (const c of enCatalog) {
  const k = roleGroup(c.role)
  enByRole.set(k, [...(enByRole.get(k) ?? []), c])
}
const enGroups = [...enByRole.entries()].map(([role, list], i) => ({
  role,
  name: groupNames[role] ?? role,
  list,
  slug: SLUG[role] ?? `group-${i + 1}`,
}))
const enEntryLines = (c) => [
  `### \`${c.component}\` ${c.en.name} (${c.en.role.replace(' · ', ' - ')})`,
  `- Use when: ${c.en.useWhen.join('; ')}`,
  `- Avoid: ${c.en.avoidWhen.join('; ') || '—'}`,
  `- Limits: ${c.en.limits.join('; ')}`,
  `- Reference: ${proIds.has(c.id) ? '@pcafe/pro/decks/' + c.deck : 'src/decks/' + (c.deck ?? 'release')} slide \`${c.demo}\`; docs/en/components.md#${c.id}${c.en.interaction ? `; interaction: ${c.en.interaction}` : ''}`,
  '',
]
for (const g of enGroups) {
  const file = join(enGroupDir, `${g.slug}.md`)
  writeFileSync(file, [`# ${g.name}`, '', enHead, `${g.list.length} templates. Back to the index: [../templates.md](../templates.md).`, '', ...g.list.flatMap(enEntryLines)].join('\n'))
}
const enIndex = ['# Template index', '', enHead]
enIndex.push(`${enCatalog.length} templates in ${enGroups.length} groups. Pick a group here, then read its "Use when / Avoid / Limits / Reference" lines; full props and examples are in docs/en/components.md.`, '')
enIndex.push('| Group | Content shapes | Templates |', '| --- | --- | --- |')
for (const g of enGroups) {
  const shapes = [...new Set(g.list.flatMap((c) => c.en.useWhen))].slice(0, 3).join('; ').replaceAll('|', '\\|')
  const names = g.list.map((c) => `\`${c.component}\``).join(', ')
  enIndex.push(`| [${g.name}](templates/${g.slug}.md) | ${shapes} | ${names} |`)
}
enIndex.push('')
writeFileSync(join(enSkill, 'templates.md'), enIndex.join('\n'))
const { STYLE_EN, THEME_EN } = await import('../src/kit/styles.en.ts')
const noStyleEn = Object.keys(STYLES).filter((k) => !STYLE_EN[k])
const noThemeEn = Object.keys(THEMES).filter((k) => !THEME_EN[k])
if (noStyleEn.length || noThemeEn.length) throw new Error(`gen-docs: src/kit/styles.en.ts is missing ${[...noStyleEn.map((k) => `style ${k}`), ...noThemeEn.map((k) => `theme ${k}`)].join(', ')}`)
const enSty = ['# Styles and themes', '', enHead, '`DeckDef.style` picks a style; `DeckDef.theme` picks a theme. Any combination works.', '', '| style | label | suitable for | dark by default | reference deck |', '| --- | --- | --- | --- | --- |']
for (const [k, v] of Object.entries(STYLES)) {
  const deck = DECK_OF[k] ? `src/decks/${DECK_OF[k]}` : catalog.find((c) => c.deck === k) ? `src/decks/${k}` : '—'
  enSty.push(`| \`${k}\` | ${STYLE_EN[k].label} | ${STYLE_EN[k].note.replaceAll('|', '\\|')} | ${v.tone === 'dark' ? 'yes' : ''} | ${deck} |`)
}
enSty.push('', '| theme | label |', '| --- | --- |', ...Object.keys(THEMES).map((k) => `| \`${k}\` | ${THEME_EN[k]} |`), '')
writeFileSync(join(enSkill, 'styles.md'), enSty.join('\n'))
console.log(`wrote skills/pcafe/references/en (templates.md index, ${enGroups.length} group files, styles.md)`)
