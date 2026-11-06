// Splits a report into A4 sheets at the React level. Blocks are measured at their real
// size off-screen, then placed one by one. Text and tables split; figures do not. Every
// sheet is a real element, so what you see on screen is what the PDF prints.
import { cloneElement, type ReactElement } from 'react'
import { createRoot } from 'react-dom/client'
import { flushSync } from 'react-dom'
import { Cover, Figure, H1, H2, List, P, PageBreak, SlidePage, SourceList, Table, parseInline, plainText, runsLength, sliceRuns, type ListProps, type PProps, type TableProps } from './blocks'
import { PaperContext, type PaperState, type TocEntry } from './context'
import type { ReportDef } from './types'

export type Sheet =
  | { kind: 'cover'; el: ReactElement }
  | { kind: 'land'; el: ReactElement; section: string }
  | { kind: 'flow'; items: ReactElement[]; section: string }

export interface Plan {
  sheets: Sheet[]
  state: PaperState
  /** Blocks with numbers filled in, for the article view. */
  blocks: ReactElement[]
}

/** Numbers headings, figures and tables, collects citations. Pure: no DOM. */
export function prepare(def: ReportDef) {
  const cites = new Map<string, number>()
  const scan = (v: unknown) => {
    if (Array.isArray(v)) v.forEach(scan)
    else if (typeof v === 'string') {
      for (const m of v.matchAll(/\[\^([\w-]+)\]/g)) if (!cites.has(m[1])) cites.set(m[1], cites.size + 1)
    }
  }
  const toc: TocEntry[] = []
  let h1 = 0
  let h2 = 0
  let fig = 0
  let tbl = 0
  const blocks = def.blocks.map((el, i) => {
    const props = el.props as Record<string, unknown>
    if (el.type !== SlidePage) Object.values(props).forEach(scan)
    else scan(props.source)
    if (el.type === H1 || el.type === H2) {
      const lvl = el.type === H1 ? 1 : 2
      if (lvl === 1) { h1 += 1; h2 = 0 } else h2 += 1
      const no = lvl === 1 ? String(h1) : `${h1}.${h2}`
      const id = `s-${no.replace('.', '-')}`
      toc.push({ id, level: lvl, no, text: props.children as string, page: 0 })
      return cloneElement(el as ReactElement<{ id: string; no: string }>, { id, no, key: i })
    }
    if (el.type === Figure || el.type === SlidePage) { fig += 1; return cloneElement(el as ReactElement<{ no: number }>, { no: fig, key: i }) }
    if (el.type === Table) { tbl += 1; return cloneElement(el as ReactElement<{ no: number }>, { no: tbl, key: i }) }
    return cloneElement(el, { key: i })
  })
  return { blocks, toc, cites }
}

type Measure = (el: ReactElement) => { h: number; gap: number }

const KEEP_ROWS = 12
const isHeading = (el: ReactElement) => el.type === H1 || el.type === H2
const LATIN = /[A-Za-z0-9]/
const NO_START = /[，。、；：！？）》」』】”’,.;:!?)]/

/** Moves a cut back so it never lands inside a Latin word or before closing punctuation. */
function safeCut(text: string, k: number) {
  let i = k
  while (i > 1 && LATIN.test(text[i - 1] ?? '') && LATIN.test(text[i] ?? '')) i -= 1
  while (i > 1 && NO_START.test(text[i] ?? '')) i -= 1
  return i
}

function splitP(el: ReactElement<PProps>, avail: number, m: Measure, lh: number): [ReactElement, ReactElement] | null {
  const runs = el.props.runs ?? parseInline(el.props.children ?? '')
  const total = runsLength(runs)
  const { h, gap } = m(el)
  const lines = Math.round((h - gap) / lh)
  let fit = Math.floor((avail - gap) / lh + 0.02)
  if (fit < 2) return null
  if (lines - fit < 2) fit = lines - 2
  if (fit < 2) return null
  let lo = 1
  let hi = total
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2)
    const part = m(cloneElement(el, { children: undefined, runs: sliceRuns(runs, mid)[0] }))
    if (Math.round((part.h - part.gap) / lh) <= fit) lo = mid
    else hi = mid - 1
  }
  const [a, b] = sliceRuns(runs, safeCut(plainText(runs), lo))
  return [cloneElement(el, { children: undefined, runs: a, cut: true }), cloneElement(el, { children: undefined, runs: b, cont: true, lead: el.props.lead })]
}

function splitList(el: ReactElement<ListProps>, avail: number, m: Measure): [ReactElement, ReactElement] | null {
  const { items, start = 1 } = el.props
  for (let k = items.length - 1; k >= 1; k--) {
    if (m(cloneElement(el, { items: items.slice(0, k) })).h <= avail) {
      return [cloneElement(el, { items: items.slice(0, k) }), cloneElement(el, { items: items.slice(k), start: start + k })]
    }
  }
  return null
}

function splitTable(el: ReactElement<TableProps>, avail: number, m: Measure): [ReactElement, ReactElement] | null {
  const { rows, offset = 0 } = el.props
  // Short tables stay whole: splitting one is worse than a gap at the foot of a page.
  if (rows.length <= KEEP_ROWS && !el.props.cont) return null
  for (let k = rows.length - 2; k >= 2; k--) {
    const a = cloneElement(el, { rows: rows.slice(0, k), noSource: true })
    if (m(a).h <= avail) return [a, cloneElement(el, { rows: rows.slice(k), cont: true, offset: offset + k })]
  }
  return null
}

function splitSources(el: ReactElement<{ first?: number; count?: number }>, avail: number, m: Measure, total: number): [ReactElement, ReactElement] | null {
  const { first = 0, count = total - first } = el.props
  for (let k = count - 1; k >= 1; k--) {
    const a = cloneElement(el, { first, count: k })
    if (m(a).h <= avail) return [a, cloneElement(el, { first: first + k, count: count - k })]
  }
  return null
}

/** Fonts load only when used, so `document.fonts.ready` alone resolves too early to measure anything. */
export async function loadFaces() {
  await Promise.all(['400 14px "Deck Sans SC"', '500 14px "Deck Sans SC"', '600 26px "Deck Serif SC"'].map((f) => document.fonts.load(f, '汉字'))
    .concat(['400 14px Geist', '600 14px Geist', '500 12px "Geist Mono"'].map((f) => document.fonts.load(f, 'Aa1'))))
  await document.fonts.ready
}

/** Runs off-screen. Call it before React mounts the page: it renders synchronously. */
export async function paginate(def: ReportDef): Promise<Plan> {
  const { blocks, toc, cites } = prepare(def)
  const lang = def.lang ?? 'zh'
  const state: PaperState = { mode: 'measure', bodyW: 642, toc, cites, sources: def.sources ?? {}, title: def.title, lang }

  const host = document.createElement('div')
  host.className = 'doc-measure'
  host.setAttribute('aria-hidden', 'true')
  host.innerHTML = '<article class="sheet"><div class="sheet-flow"><div data-box></div></div></article>'
  document.body.append(host)
  const box = host.querySelector<HTMLElement>('[data-box]')!
  const flow = host.querySelector<HTMLElement>('.sheet-flow')!
  state.bodyW = flow.clientWidth

  await loadFaces()

  const root = createRoot(box)
  const cache = new WeakMap<ReactElement, { h: number; gap: number }>()
  const measure: Measure = (el) => {
    const hit = cache.get(el)
    if (hit) return hit
    flushSync(() => root.render(<PaperContext.Provider value={state}>{el}</PaperContext.Provider>))
    const first = box.firstElementChild as HTMLElement | null
    const r = first ? { h: first.getBoundingClientRect().height, gap: parseFloat(getComputedStyle(first).paddingTop) } : { h: 0, gap: 0 }
    cache.set(el, r)
    return r
  }
  const one = measure(<P>汉</P>)
  const lh = one.h - one.gap
  const H = flow.clientHeight

  const sheets: Sheet[] = []
  let items: ReactElement[] = []
  let used = 0
  let section = ''
  let first = ''
  const flush = () => {
    if (items.length) sheets.push({ kind: 'flow', items, section: first })
    items = []
    used = 0
    first = section
  }
  const place = (el: ReactElement) => {
    const { h, gap } = measure(el)
    used += items.length ? h : h - gap
    items.push(el)
    if (isHeading(el)) {
      const e = toc.find((t) => t.id === (el.props as { id: string }).id)
      if (e) e.page = sheets.length + 1
    }
  }
  const room = () => H - used
  /** Height a block needs when it opens a page's last stretch: a heading must keep some of what follows. */
  const minOf = (el: ReactElement): number => {
    const { h, gap } = measure(el)
    if (el.type === P) return Math.min(h, gap + lh * 2)
    if (el.type === List) return measure(cloneElement(el as ReactElement<ListProps>, { items: (el.props as ListProps).items.slice(0, 1) })).h
    if (el.type === Table) {
      const t = el as ReactElement<TableProps>
      return t.props.rows.length > KEEP_ROWS ? measure(cloneElement(t, { rows: t.props.rows.slice(0, 2), noSource: true })).h : h
    }
    return h
  }

  for (let i = 0; i < blocks.length; i++) {
    const el = blocks[i]
    if (el.type === Cover) {
      flush()
      sheets.push({ kind: 'cover', el })
      continue
    }
    if (el.type === PageBreak) {
      flush()
      continue
    }
    if (el.type === SlidePage) {
      flush()
      sheets.push({ kind: 'land', el, section })
      continue
    }
    if (el.type === H1) {
      section = (el.props as { children: string }).children
      if (!items.length) first = section
    }
    if (isHeading(el)) {
      let need = measure(el).h
      let j = i + 1
      while (j < blocks.length && isHeading(blocks[j])) need += measure(blocks[j++]).h
      if (j < blocks.length) need += minOf(blocks[j])
      if (items.length && need > room()) flush()
      if (!items.length) first = section
      place(el)
      continue
    }

    let cur: ReactElement | null = el
    while (cur) {
      const { h, gap } = measure(cur)
      const need = items.length ? h : h - gap
      if (need <= room() + 0.5) {
        place(cur)
        cur = null
        continue
      }
      const avail = room() + (items.length ? 0 : gap)
      let parts: [ReactElement, ReactElement] | null = null
      if (cur.type === P) parts = splitP(cur as ReactElement<PProps>, avail, measure, lh)
      else if (cur.type === List) parts = splitList(cur as ReactElement<ListProps>, avail, measure)
      else if (cur.type === Table) parts = splitTable(cur as ReactElement<TableProps>, avail, measure)
      else if (cur.type === SourceList) parts = splitSources(cur as ReactElement<{ first?: number; count?: number }>, avail, measure, cites.size)
      if (parts) {
        place(parts[0])
        flush()
        cur = parts[1]
      } else if (items.length) {
        flush()
      } else {
        // Taller than a whole page: place it anyway and let QA report the overflow.
        place(cur)
        cur = null
      }
    }
  }
  flush()

  root.unmount()
  host.remove()
  return { sheets, blocks, state: { ...state, mode: 'paper' } }
}

