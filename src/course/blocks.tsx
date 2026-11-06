// Blocks of an explanation step. All at real reading size: a lesson is read at arm's length on a
// phone, so nothing here depends on the 1920 slide canvas (except SlideFigure, which guards for it).
import { Fragment, useLayoutEffect, useRef, useState, type ReactElement, type ReactNode } from 'react'
import { StaticSlide } from '../deck/features/presenter'
import { DESIGN_W } from '../deck/Stage'
import type { SlideDef } from '../deck/Deck'
import { DEFAULT_STYLE, type DeckStyle } from '../kit/theme'
import { useUi } from './i18n'

/* ---------- inline text: **bold**, `code` ---------- */

const INLINE = /\*\*(.+?)\*\*|`(.+?)`/g

export function Rich({ text }: { text: string }) {
  const out: ReactNode[] = []
  let at = 0
  let k = 0
  for (const m of text.matchAll(INLINE)) {
    if (m.index > at) out.push(text.slice(at, m.index))
    if (m[1]) out.push(<strong key={k++}>{m[1]}</strong>)
    else out.push(<code key={k++}>{m[2]}</code>)
    at = m.index + m[0].length
  }
  if (at < text.length) out.push(text.slice(at))
  return <Fragment>{out}</Fragment>
}

export function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [w, setW] = useState(0)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    setW(el.clientWidth)
    const ro = new ResizeObserver(() => setW(el.clientWidth))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, w] as const
}

/* ---------- text ---------- */

/** One short paragraph. ≤ 120 CJK characters. */
export const P = ({ children }: { children: string }) => (
  <p className="c-p">
    <Rich text={children} />
  </p>
)

/** Larger opening sentence. ≤ 60 CJK characters. */
export const Lead = ({ children }: { children: string }) => (
  <p className="c-lead">
    <Rich text={children} />
  </p>
)

/** Bulleted list. 2–5 items, each ≤ 50 CJK characters. */
export const Bullets = ({ items }: { items: string[] }) => (
  <ul className="c-bullets">
    {items.map((t) => (
      <li key={t}>
        <Rich text={t} />
      </li>
    ))}
  </ul>
)

/** A side remark that changes how to read the rest. ≤ 90 CJK characters. */
export const Note = ({ label, children }: { label?: string; children: string }) => (
  <aside className="c-note">
    {label && <b>{label}</b>}
    <p>
      <Rich text={children} />
    </p>
  </aside>
)

/** Monospace lines: a request, a key, a command. Lines wrap at any width instead of scrolling. */
export const Code = ({ lines, caption }: { lines: string[]; caption?: string }) => (
  <figure className="c-code">
    {caption && <figcaption>{caption}</figcaption>}
    <pre>{lines.join('\n')}</pre>
  </figure>
)

/** A figure that explains. `illustrative` labels a made-up example as one. */
export function Figure({ caption, illustrative, children }: { caption?: string; illustrative?: boolean; children: ReactElement | ReactElement[] }) {
  const ui = useUi()
  return (
    <figure className="c-figure">
      {children}
      {(caption || illustrative) && (
        <figcaption>
          {illustrative && <span className="c-tag">{ui.figureIllustrative}</span>}
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

/* ---------- structures ---------- */

export interface FactItem {
  /** ≤ 8 characters: the number itself. */
  value: string
  /** ≤ 18 CJK characters. */
  label: string
}

/** 2–4 numbers worth remembering. */
export const Facts = ({ items }: { items: FactItem[] }) => (
  <dl className="c-facts">
    {items.map((f) => (
      <div key={f.label}>
        <dd>{f.value}</dd>
        <dt>{f.label}</dt>
      </div>
    ))}
  </dl>
)

export interface CompareColumn {
  name: string
  tagline: string
  rows: { label: string; value: string }[]
  focus?: boolean
}

/** 2–3 things side by side; they stack on a phone. */
export const Compare = ({ columns }: { columns: CompareColumn[] }) => (
  <div className="c-compare" data-n={columns.length}>
    {columns.map((c) => (
      <section key={c.name} className={c.focus ? 'is-focus' : ''}>
        <h3>{c.name}</h3>
        <p>{c.tagline}</p>
        <dl>
          {c.rows.map((r) => (
            <div key={r.label}>
              <dt>{r.label}</dt>
              <dd>{r.value}</dd>
            </div>
          ))}
        </dl>
      </section>
    ))}
  </div>
)

export interface LadderRow {
  name: string
  tag: string
  specs: { label: string; value: string }[]
}

/** An ordered scale, e.g. hot to cold storage. 3–6 rows. */
export const Ladder = ({ rows, ends }: { rows: LadderRow[]; ends: [string, string] }) => (
  <div className="c-ladder">
    <p className="c-ladder__end">{ends[0]}</p>
    <ol>
      {rows.map((r, i) => (
        <li key={r.name} style={{ '--heat': 1 - i / Math.max(1, rows.length - 1) } as React.CSSProperties}>
          <div>
            <b>{r.name}</b>
            <span>{r.tag}</span>
          </div>
          <dl>
            {r.specs.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        </li>
      ))}
    </ol>
    <p className="c-ladder__end">{ends[1]}</p>
  </div>
)

export interface TimelineStop {
  at: string
  title: string
  body: string
}

/** Something that happens in order over time. 3–5 stops. */
export const Timeline = ({ stops }: { stops: TimelineStop[] }) => (
  <ol className="c-timeline" data-n={stops.length}>
    {stops.map((s) => (
      <li key={s.at}>
        <em>{s.at}</em>
        <b>{s.title}</b>
        <p>{s.body}</p>
      </li>
    ))}
  </ol>
)

export interface WorkedStep {
  /** The question a learner should ask themselves. ≤ 30 CJK characters. */
  ask: string
  /** The reasoning. ≤ 70 CJK characters. */
  answer: string
}

/**
 * A worked example the learner explains to themselves: each reason stays hidden until asked for,
 * so there is a moment to think first. Follow it with a faded exercise using `given`.
 */
export function Worked({ scenario, steps, conclusion, showLabel }: { scenario: string; steps: WorkedStep[]; conclusion: string; showLabel: string }) {
  const [open, setOpen] = useState(0)
  const done = open >= steps.length
  return (
    <div className="c-worked" data-worked>
      <p className="c-worked__scenario">
        <Rich text={scenario} />
      </p>
      <ol>
        {steps.map((s, i) => (
          <li key={s.ask} hidden={i > open} className={i < open ? 'is-open' : ''}>
            <span aria-hidden="true">{i + 1}</span>
            <div>
              <b>{s.ask}</b>
              {i < open ? (
                <p>
                  <Rich text={s.answer} />
                </p>
              ) : (
                <button type="button" className="c-btn c-btn--ghost" data-reveal onClick={() => setOpen(i + 1)}>
                  {showLabel}
                </button>
              )}
            </div>
          </li>
        ))}
      </ol>
      <p className="c-worked__end" role="status" data-conclusion={done ? 'shown' : undefined}>
        {done ? <Rich text={conclusion} /> : null}
      </p>
    </div>
  )
}

/* ---------- a slide from the kit ---------- */

export interface SlideFigureProps {
  /** Any slide template, with its normal props. */
  children: ReactElement
  /** What a phone shows instead: a 1920 slide in a 350px column is unreadable. Required. */
  narrow: ReactElement
  /** Text alternative for the slide. */
  alt: string
  caption?: string
  /** Below this column width the narrow version is used. */
  minWidth?: number
  style?: DeckStyle
}

/** A live slide where it helps, on any screen wide enough to read it. */
export function SlideFigure({ children, narrow, alt, caption, minWidth = 700, style = DEFAULT_STYLE }: SlideFigureProps) {
  const [ref, w] = useWidth<HTMLDivElement>()
  const wide = w >= minWidth
  const slide: SlideDef = { id: 'figure', label: alt, render: () => children }
  const u = w / DESIGN_W
  return (
    <figure className="c-figure c-slidefig" data-slide-figure={wide ? 'slide' : 'narrow'}>
      <div ref={ref}>
        {w > 0 &&
          (wide ? (
            <div className="c-slidefig__box" role="img" aria-label={alt} style={{ height: u * 1080 }}>
              <div style={{ width: w, height: u * 1080 }}>
                <StaticSlide slide={slide} style={style} u={u} index={0} total={1} />
              </div>
            </div>
          ) : (
            narrow
          ))}
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}
