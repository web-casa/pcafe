// Blocks of a report. Sizes are real print sizes: nothing here depends on the slide
// canvas, because a page is read at arm's length and a slide across a room.
import { Fragment, useState, type ReactElement, type ReactNode } from 'react'
import { usePaper } from './context'
import { StaticSlide } from '../deck/features/presenter'
import { DESIGN_W } from '../deck/Stage'
import type { SlideDef } from '../deck/Deck'
import { DEFAULT_STYLE, type DeckStyle } from '../kit/theme'
import { useBoxWidth } from './charts'

/* ---------- inline text: **bold**, `code`, [^source], [label](url) ---------- */

export type Run =
  | { t: 'text'; s: string }
  | { t: 'b'; s: string }
  | { t: 'code'; s: string }
  | { t: 'link'; s: string; url: string }
  | { t: 'cite'; key: string }

const INLINE = /\*\*(.+?)\*\*|`(.+?)`|\[\^([\w-]+)\]|\[([^\]]+)\]\((https?:[^)]+)\)/g

export function parseInline(text: string): Run[] {
  const out: Run[] = []
  let at = 0
  for (const m of text.matchAll(INLINE)) {
    if (m.index > at) out.push({ t: 'text', s: text.slice(at, m.index) })
    if (m[1]) out.push({ t: 'b', s: m[1] })
    else if (m[2]) out.push({ t: 'code', s: m[2] })
    else if (m[3]) out.push({ t: 'cite', key: m[3] })
    else out.push({ t: 'link', s: m[4], url: m[5] })
    at = m.index + m[0].length
  }
  if (at < text.length) out.push({ t: 'text', s: text.slice(at) })
  return out
}

export const runsLength = (runs: Run[]) => runs.reduce((n, r) => n + (r.t === 'cite' ? 1 : r.s.length), 0)

/** Cuts a run list at a character offset; a citation stays with the text before it. */
export function sliceRuns(runs: Run[], k: number): [Run[], Run[]] {
  const a: Run[] = []
  const b: Run[] = []
  let left = k
  for (const r of runs) {
    if (r.t === 'cite') {
      ;(left > 0 ? a : b).push(r)
      left -= 1
    } else if (left <= 0) b.push(r)
    else if (left >= r.s.length) {
      a.push(r)
      left -= r.s.length
    } else {
      a.push({ ...r, s: r.s.slice(0, left) })
      b.push({ ...r, s: r.s.slice(left) })
      left = 0
    }
  }
  return [a, b]
}

export const plainText = (runs: Run[]) => runs.map((r) => (r.t === 'cite' ? '\u0001' : r.s)).join('')

function Runs({ runs }: { runs: Run[] }) {
  const { cites, sources } = usePaper()
  return (
    <>
      {runs.map((r, i) => {
        if (r.t === 'b') return <strong key={i}>{r.s}</strong>
        if (r.t === 'code') return <code key={i}>{r.s}</code>
        if (r.t === 'link') return <a key={i} href={r.url}>{r.s}</a>
        if (r.t === 'cite') {
          const n = cites.get(r.key)
          return <sup key={i} className="doc-cite" data-missing={sources[r.key] ? undefined : r.key}><a href={`#src-${n}`}>[{n ?? '?'}]</a></sup>
        }
        return <Fragment key={i}>{r.s}</Fragment>
      })}
    </>
  )
}

export const Inline = ({ text }: { text: string }) => <Runs runs={parseInline(text)} />

/* ---------- headings ---------- */

export interface HeadingProps {
  /** ≤ 24 CJK characters. */
  children: string
  /** Set by prepare(). */
  id?: string
  no?: string
}

/** Section heading, numbered automatically. Never left alone at the foot of a page. */
export function H1({ children, id, no }: HeadingProps) {
  return <div className="b b-h1"><h2 id={id}><span>{no}</span>{children}</h2></div>
}

/** Sub-heading, numbered automatically. */
export function H2({ children, id, no }: HeadingProps) {
  return <div className="b b-h2"><h3 id={id}><span>{no}</span>{children}</h3></div>
}

/* ---------- running text ---------- */

export interface PProps {
  /** Body text with **bold**, `code`, [^source] and [label](url). Paragraphs split across pages. */
  children?: string
  /** Set by the paginator. */
  runs?: Run[]
  cut?: boolean
  cont?: boolean
  /** Larger opening paragraph. Use once, at the top. */
  lead?: boolean
}

export function P({ children, runs, cut, cont, lead }: PProps) {
  return (
    <div className={`b b-p${cut ? ' is-cut' : ''}${cont ? ' is-cont' : ''}${lead ? ' is-lead' : ''}`}>
      <p><Runs runs={runs ?? parseInline(children ?? '')} /></p>
    </div>
  )
}

export interface ListProps {
  /** 2–8 items, each ≤ 80 CJK characters. Lists split between items. */
  items: string[]
  ordered?: boolean
  /** Set by the paginator when a numbered list continues on the next page. */
  start?: number
}

export function List({ items, ordered, start }: ListProps) {
  const Tag = ordered ? 'ol' : 'ul'
  return (
    <div className="b b-list">
      <Tag start={start}>{items.map((x, i) => <li key={i}><Inline text={x} /></li>)}</Tag>
    </div>
  )
}

export interface CalloutProps {
  /** ≤ 12 CJK characters. */
  title: string
  /** ≤ 120 CJK characters. */
  children: string
  tone?: 'key' | 'note'
}

/** A boxed takeaway. At most one a page. */
export function Callout({ title, children, tone = 'key' }: CalloutProps) {
  return (
    <div className={`b b-callout is-${tone}`}>
      <aside><b>{title}</b><p><Inline text={children} /></p></aside>
    </div>
  )
}

export interface StatsProps {
  /** 2–4 numbers. value ≤ 8 characters, label ≤ 14 CJK characters. */
  items: { value: string; label: string; note?: string }[]
  /** Required: where the numbers come from. */
  source: string
}

export function Stats({ items, source }: StatsProps) {
  return (
    <div className="b b-stats" data-source>
      <dl style={{ '--n': items.length } as React.CSSProperties}>
        {items.map((s) => <div key={s.label}><dd>{s.value}</dd><dt>{s.label}</dt>{s.note && <small>{s.note}</small>}</div>)}
      </dl>
      <p className="doc-source"><Inline text={source} /></p>
    </div>
  )
}

/* ---------- figures and tables ---------- */

export interface FigureProps {
  /** ≤ 30 CJK characters. Say what the figure shows. */
  caption: string
  /** Required. Mark estimates and illustrations here. */
  source: string
  children: ReactNode
  no?: number
}

export function Figure({ caption, source, children, no }: FigureProps) {
  const { lang } = usePaper()
  return (
    <div className="b b-figure" data-source>
      <figure>
        <figcaption><b>{lang === 'en' ? `Figure ${no}` : `图 ${no}`}</b>{caption}</figcaption>
        {children}
        <p className="doc-source"><Inline text={source} /></p>
      </figure>
    </div>
  )
}

export interface TableProps {
  /** ≤ 30 CJK characters. */
  caption: string
  /** Required. */
  source: string
  /** 2–7 columns. `num` right-aligns in tabular figures. */
  columns: { label: string; num?: boolean; width?: string }[]
  /** Rows split across pages, and the header repeats. */
  rows: (string | number)[][]
  /** Row indices to tint. */
  focus?: number[]
  no?: number
  /** Set by the paginator. */
  cont?: boolean
  noSource?: boolean
  offset?: number
}

export function Table({ caption, source, columns, rows, focus = [], no, cont, noSource, offset = 0 }: TableProps) {
  const { mode, lang } = usePaper()
  const [sort, setSort] = useState<{ c: number; dir: 1 | -1 } | null>(null)
  const interactive = mode === 'read'
  const indexed = rows.map((r, i) => ({ r, i: i + offset }))
  if (sort) {
    indexed.sort((a, b) => {
      const x = num(a.r[sort.c])
      const y = num(b.r[sort.c])
      return (x !== null && y !== null ? x - y : String(a.r[sort.c]).localeCompare(String(b.r[sort.c]), 'zh')) * sort.dir
    })
  }
  const label = lang === 'en' ? `Table ${no}` : `表 ${no}`
  return (
    <div className={`b b-table${cont ? ' is-cont' : ''}`} data-source={noSource ? 'continues' : ''}>
      <figure>
        <figcaption><b>{label}{cont ? (lang === 'en' ? ' (cont.)' : '（续）') : ''}</b>{caption}</figcaption>
        <div className="doc-tablewrap">
          <table>
            <colgroup>{columns.map((c, i) => <col key={i} style={c.width ? { width: c.width } : undefined} />)}</colgroup>
            <thead>
              <tr>
                {columns.map((c, i) => (
                  <th key={i} scope="col" className={c.num ? 'is-num' : undefined} aria-sort={sort?.c === i ? (sort.dir > 0 ? 'ascending' : 'descending') : undefined}>
                    {interactive ? (
                      <button type="button" onClick={() => setSort((s) => (s?.c === i ? (s.dir > 0 ? { c: i, dir: -1 } : null) : { c: i, dir: 1 }))}>
                        {c.label}<i aria-hidden>{sort?.c === i ? (sort.dir > 0 ? '↑' : '↓') : ''}</i>
                      </button>
                    ) : c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {indexed.map(({ r, i }) => (
                <tr key={i} className={focus.includes(i) ? 'is-focus' : undefined}>
                  {r.map((v, j) => <td key={j} className={columns[j]?.num ? 'is-num' : undefined}>{v}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!noSource && <p className="doc-source"><Inline text={source} /></p>}
      </figure>
    </div>
  )
}

const num = (v: string | number) => {
  if (typeof v === 'number') return v
  const n = Number(v.replace(/[,%\s]|TWh/g, ''))
  return Number.isFinite(n) && v.trim() !== '' ? n : null
}

/* ---------- whole-page blocks ---------- */

export interface CoverProps {
  /** ≤ 20 CJK characters. */
  kicker: string
  /** 1–3 lines, each ≤ 12 CJK characters. */
  title: string[]
  /** ≤ 40 CJK characters. */
  subtitle?: string
  /** One figure the report is about, ≤ 6 characters. */
  numeral?: string
  /** What the numeral is, ≤ 24 CJK characters. */
  numeralLabel?: string
  /** 2–4 label and value pairs: author, date, version. */
  facts: { label: string; value: string }[]
  /** ≤ 60 CJK characters, e.g. where the numeral comes from. */
  note?: string
}

export function Cover({ kicker, title, subtitle, numeral, numeralLabel, facts, note }: CoverProps) {
  return (
    <div className="doc-cover">
      <p className="doc-cover__kicker"><i />{kicker}</p>
      <h1>{title.map((t, i) => <span key={i}>{t}</span>)}</h1>
      {subtitle && <p className="doc-cover__sub">{subtitle}</p>}
      {numeral && <div className="doc-cover__num"><b>{numeral}</b><span>{numeralLabel}</span></div>}
      <div className="doc-cover__end">
        <dl>{facts.map((f) => <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>)}</dl>
        {note && <p>{note}</p>}
      </div>
    </div>
  )
}

/** Table of contents. Page numbers are filled in after pagination; the article view leaves them out. */
export function Toc({ title = '目录' }: { title?: string }) {
  const { toc, mode } = usePaper()
  return (
    <div className="b b-toc">
      <h2>{title}</h2>
      <ol>
        {toc.map((e) => (
          <li key={e.id} className={`is-l${e.level}`}>
            <a href={`#${e.id}`}><span>{e.no}</span><b>{e.text}</b>{mode !== 'read' && <em>{e.page}</em>}</a>
          </li>
        ))}
      </ol>
    </div>
  )
}

/** Numbered source list. Written automatically from every [^key] the report uses. */
export function SourceList({ first = 0, count }: { first?: number; count?: number }) {
  const { cites, sources } = usePaper()
  const keys = [...cites.keys()].slice(first, count === undefined ? undefined : first + count)
  return (
    <div className="b b-sources">
      <ol start={first + 1}>
        {keys.map((k) => {
          const s = sources[k]
          return (
            <li key={k} id={`src-${cites.get(k)}`}>
              {s ? <>{s.org}.《{s.title}》{s.note ? ` ${s.note}` : ''}{s.url && <> <a href={s.url}>{s.url.replace(/^https?:\/\//, '')}</a></>}</> : <b data-missing={k}>{k}</b>}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export const PageBreak = () => null

export interface SlidePageProps {
  /** Any slide template of the kit, with its normal props. It gets a landscape page of its own. */
  children: ReactElement
  /** ≤ 40 CJK characters. */
  caption: string
  /** Required. */
  source: string
  style?: DeckStyle
  no?: number
}

/** A landscape page holding one slide, for the big diagrams a portrait column cannot carry. */
export function SlidePage({ children, caption, source, style = DEFAULT_STYLE, no }: SlidePageProps) {
  const { lang, mode } = usePaper()
  const [ref, w] = useBoxWidth()
  const u = (mode === 'read' ? Math.max(w, 660) : LAND_W) / DESIGN_W
  const slide: SlideDef = { id: `insert-${no}`, label: caption, render: () => children }
  return (
    <div className="b b-slide" data-source ref={ref}>
      <figure>
        <figcaption><b>{lang === 'en' ? `Figure ${no}` : `图 ${no}`}</b>{caption}</figcaption>
        <div className="doc-slidebox" style={{ height: u * 1080 }}>
          <div style={{ width: u * DESIGN_W, height: u * 1080 }}>
            <StaticSlide slide={slide} style={style} u={u} index={0} total={1} />
          </div>
        </div>
        <p className="doc-source"><Inline text={source} /></p>
      </figure>
    </div>
  )
}

/** Width of a slide on a landscape sheet: 297mm less 12mm margins, in CSS pixels. */
export const LAND_W = ((297 - 24) * 96) / 25.4
