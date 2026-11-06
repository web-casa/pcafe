// Moving parts of a résumé. They repeat what a screener looks at first (titles, employers,
// dates) and show results as changes, in the kit's visual language. Text is real text at print size.
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { StaticSlide } from '../deck/features/presenter'
import { DESIGN_W } from '../deck/Stage'
import type { SlideDef } from '../deck/Deck'
import { Lanyard } from '../kit/v2/p3/Lanyard'
import { Terminal } from '../kit/Terminal'
import { themeVars, type DeckStyle, type ThemeName } from '../kit/theme'
import type { ResumeBadge, ResumeHighlight, ResumeImpactRow, ResumeTerminal, ResumeWork } from './types'

const motionOk = () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches && !window.matchMedia('print').matches

/* ---------- a real kit component, cropped to one of its parts ---------- */

function layoutBox(el: HTMLElement, stage: Element) {
  let x = 0
  let y = 0
  let n: HTMLElement | null = el
  while (n && n !== stage) {
    x += n.offsetLeft
    y += n.offsetTop
    n = n.offsetParent as HTMLElement | null
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight }
}

/** Renders a whole slide template, hides everything but `part` and scales it to `width` px. */
export function KitPart({ children, part, width, className = '', label }: { children: ReactNode; part: string; width: number; className?: string; label: string }) {
  const host = useRef<HTMLDivElement>(null)
  const u0 = width / DESIGN_W
  const [view, setView] = useState<{ u: number; x: number; y: number; h: number } | null>(null)
  useLayoutEffect(() => {
    const stage = host.current?.querySelector('.stage')
    const el = stage?.querySelector<HTMLElement>(part)
    if (!stage || !el) return
    for (let n: HTMLElement | null = el; n && n !== stage; n = n.parentElement) {
      for (const sib of n.parentElement?.children ?? []) if (sib !== n) sib.setAttribute('data-part-off', '')
    }
    const b = layoutBox(el, stage)
    const u = width / (b.w / u0)
    setView({ u, x: (-b.x / u0) * u, y: (-b.y / u0) * u, h: (b.h / u0) * u })
  }, [part, width, u0])
  // Print-size text does not scale with u, so the part has to be measured again at its final scale.
  const passes = useRef(0)
  useLayoutEffect(() => {
    const stage = host.current?.querySelector('.stage')
    const el = stage?.querySelector<HTMLElement>(part)
    if (!stage || !el || !view || passes.current >= 5) return
    const b = layoutBox(el, stage)
    const same = Math.abs(b.w - width) < 1 && Math.abs(b.h - view.h) < 1 && Math.abs(b.x + view.x) < 1 && Math.abs(b.y + view.y) < 1
    if (same) return
    passes.current += 1
    setView({ u: view.u * (width / b.w), x: -b.x, y: -b.y, h: b.h })
  }, [part, view, width])
  const u = view?.u ?? u0
  const slide: SlideDef = { id: 'part', label, render: () => children }
  return (
    <div ref={host} className={`kit-part ${className}`} style={{ width, height: view?.h ?? 1 }}>
      <div style={{ position: 'absolute', left: view?.x ?? 0, top: view?.y ?? 0, width: u * DESIGN_W, height: u * 1080 }}>
        <StaticSlide slide={slide} style="standard" u={u} index={0} total={1} />
      </div>
    </div>
  )
}

export const BadgePart = ({ badge, name, width }: { badge: ResumeBadge; name: string; width: number }) => (
  <KitPart part=".c3lan__swing" width={width} className="kit-part--badge" label="badge">
    <Lanyard kicker="" title="" points={[]} strap={badge.strap} badge={{ event: badge.event, initials: badge.initials, name, role: badge.role, code: badge.code }} />
  </KitPart>
)

export const TerminalPart = ({ terminal, width }: { terminal: ResumeTerminal; width: number }) => (
  <KitPart part=".term" width={width} className="kit-part--term" label="terminal">
    <Terminal kicker="" title="" window={terminal.window} prompt={terminal.prompt ?? '$'} steps={terminal.steps.map((s) => ({ ...s, note: '' }))} />
  </KitPart>
)

/** A real slide as a project thumbnail. Decorative: the project's text sits beside it. */
export function SlideThumb({ render, theme, style = 'standard', width }: { render: () => ReactNode; theme?: ThemeName; style?: DeckStyle; width: number }) {
  const u = width / DESIGN_W
  const slide: SlideDef = { id: 'thumb', label: 'thumbnail', render }
  return (
    <div className="r-thumb" aria-hidden style={{ ...(themeVars(theme, style) as CSSProperties), '--u': `${u}px`, width, height: u * 1080 } as CSSProperties} data-style={style}>
      <StaticSlide slide={slide} style={style} u={u} index={0} total={1} />
    </div>
  )
}

/* ---------- key numbers with a trend ---------- */

function CountUp({ value }: { value: string }) {
  const [text, setText] = useState(value)
  useEffect(() => {
    const m = value.match(/^([^\d]*)(\d[\d,]*(?:\.\d+)?)(.*)$/)
    if (!m || !motionOk()) return
    const target = Number(m[2].replace(/,/g, ''))
    const decimals = m[2].split('.')[1]?.length ?? 0
    const start = performance.now()
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1100)
      const eased = 1 - (1 - p) ** 3
      setText(`${m[1]}${(target * eased).toFixed(decimals)}${m[3]}`)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    const done = () => { cancelAnimationFrame(raf); setText(value) }
    window.addEventListener('beforeprint', done)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('beforeprint', done) }
  }, [value])
  return <>{text}</>
}

function Spark({ values }: { values: number[] }) {
  const max = Math.max(...values)
  const min = Math.min(...values)
  const pts = values.map((v, i) => [(i / (values.length - 1)) * 100, 24 - ((v - min) / (max - min || 1)) * 20] as const)
  const line = pts.map(([x, y]) => `${x},${y}`).join(' ')
  const [ex, ey] = pts.at(-1)!
  return (
    <svg className="r-spark" viewBox="0 0 104 28" preserveAspectRatio="none" aria-hidden>
      <polygon points={`0,28 ${line} 100,28`} className="r-spark__area" />
      <polyline points={line} pathLength={1} className="r-spark__line" vectorEffect="non-scaling-stroke" />
      <circle cx={ex} cy={ey} r={2.5} className="r-spark__dot" />
    </svg>
  )
}

export function Metrics({ items }: { items: ResumeHighlight[] }) {
  return (
    <dl className="r-metrics" style={{ '--n': items.length } as CSSProperties}>
      {items.map((h) => (
        <div key={h.label}>
          <dd><CountUp value={h.value} /></dd>
          <dt>{h.label}</dt>
          {h.trend && <Spark values={h.trend} />}
        </div>
      ))}
    </dl>
  )
}

/* ---------- career track: titles, employers and dates on one axis ---------- */

const NOW = /至今|今|present|now/i
const toYear = (s: string) => {
  const m = s.match(/(\d{4})(?:[.\-/年](\d{1,2}))?/)
  return m ? Number(m[1]) + (Number(m[2] ?? 1) - 1) / 12 : null
}

export function parsePeriod(period: string, asOf: number) {
  const [a, b] = period.split(/[–—~-]/).map((s) => s.trim())
  const from = toYear(a)
  if (from === null) return null
  const to = b && !NOW.test(b) ? (toYear(b) ?? from + 1 / 12) : b ? asOf : from + 1 / 12
  return { from, to }
}

export function CareerTrack({ items, asOf }: { items: ResumeWork[]; asOf: string }) {
  const end = toYear(asOf) ?? new Date().getFullYear()
  const spans = items.map((w) => ({ w, span: parsePeriod(w.period, end) })).filter((x): x is { w: ResumeWork; span: { from: number; to: number } } => !!x.span)
  if (!spans.length) return null
  const start = Math.floor(Math.min(...spans.map((s) => s.span.from)))
  const stop = Math.ceil(Math.max(...spans.map((s) => s.span.to)))
  const pct = (y: number) => ((y - start) / (stop - start)) * 100
  const orgs = [...new Set(spans.map((s) => s.w.org))]
  const years = Array.from({ length: stop - start + 1 }, (_, i) => start + i)
  const step = years.length > 9 ? 2 : 1
  // A short stint has no room for its title, and half a title reads worse than none. The work section names it anyway.
  const box = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    for (const bar of box.current?.querySelectorAll<HTMLElement>('.r-track__lane b') ?? []) bar.toggleAttribute('data-tight', bar.scrollWidth > bar.clientWidth)
  })
  return (
    <div className="r-track" ref={box}>
      <div className="r-track__axis">
        {years.map((y, i) => i % step === 0 && <span key={y} style={{ left: `${pct(y)}%` }}>{y}</span>)}
      </div>
      {orgs.map((org) => (
        <div key={org} className="r-track__row">
          <span className="r-track__org">{org}</span>
          <div className="r-track__lane">
            {years.map((y) => <i key={y} style={{ left: `${pct(y)}%` }} />)}
            {spans.filter((s) => s.w.org === org).map(({ w, span }, k) => (
              <b key={w.role} className={NOW.test(w.period) ? 'is-now' : undefined} style={{ left: `${pct(span.from)}%`, width: `${pct(span.to) - pct(span.from)}%`, '--k': k } as CSSProperties}>
                <span>{w.role}</span>
              </b>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ---------- results as changes ---------- */

export function ImpactRows({ rows }: { rows: ResumeImpactRow[] }) {
  return (
    <ul className="r-impact">
      {rows.map((r) => {
        const max = Math.max(r.before, r.after)
        const a = (r.before / max) * 100
        const b = (r.after / max) * 100
        return (
          <li key={r.label}>
            <span className="r-impact__label">{r.label}</span>
            <span className="r-impact__nums"><s>{r.before}</s><i aria-hidden>→</i><b>{r.after}</b><small>{r.unit}</small></span>
            <span className="r-impact__bar" aria-hidden>
              <i style={{ left: `${Math.min(a, b)}%`, width: `${Math.abs(a - b)}%` }} />
              <u style={{ left: `${a}%` }} />
              <em style={{ left: `${b}%` }} />
            </span>
          </li>
        )
      })}
    </ul>
  )
}

/* ---------- which tools, in which years ---------- */

export function HeatGrid({ years, rows, legend }: { years: string[]; rows: { label: string; levels: number[] }[]; legend?: string }) {
  return (
    <div className="r-heat" style={{ '--n': years.length } as CSSProperties}>
      <div className="r-heat__row r-heat__head"><span />{years.map((y) => <small key={y}>{y}</small>)}</div>
      {rows.map((r) => (
        <div key={r.label} className="r-heat__row">
          <span>{r.label}</span>
          {r.levels.map((l, i) => <i key={i} data-l={l} title={`${r.label} ${years[i]}`} />)}
        </div>
      ))}
      {legend && <p>{legend}</p>}
    </div>
  )
}

/* ---------- service-level dials ---------- */

const SWEEP = 240
const R = 34
const polar = (deg: number) => {
  const a = ((deg - 90) * Math.PI) / 180
  return [44 + R * Math.cos(a), 42 + R * Math.sin(a)] as const
}
const ARC = (() => {
  const [x0, y0] = polar(-SWEEP / 2)
  const [x1, y1] = polar(SWEEP / 2)
  return `M ${x0} ${y0} A ${R} ${R} 0 1 1 ${x1} ${y1}`
})()

export function Gauges({ items }: { items: { value: number; max: number; text: string; label: string }[] }) {
  return (
    <div className="r-gauges" style={{ '--n': items.length } as CSSProperties}>
      {items.map((g) => (
        <figure key={g.label}>
          <svg viewBox="0 0 88 72" aria-hidden>
            <path d={ARC} className="r-gauge__track" pathLength={1} />
            <path d={ARC} className="r-gauge__fill" pathLength={1} style={{ strokeDasharray: `${Math.min(1, g.value / g.max)} 1` }} />
          </svg>
          <b>{g.text}</b>
          <figcaption>{g.label}</figcaption>
        </figure>
      ))}
    </div>
  )
}
