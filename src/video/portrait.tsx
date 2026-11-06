// Portrait scenes. The 1920×1080 kit templates do not reflow to 1080×1920, and squeezing one into a
// tall frame leaves text too small to read on a phone. These are built for the tall frame instead:
// kit tokens, kit number formatting and the theme palette, with every value computed from the frame,
// so a chart is fully defined at any time. Text stays inside PORTRAIT_SAFE; only unlabelled
// decoration runs past it.
import type { CSSProperties, ReactNode } from 'react'
import { fmt } from '../kit/chart-util'
import { clamp01, easeInOut, easeOut, enter, expoOut, lerp, span } from './anim'
import { useSceneTime } from './context'
import { PORTRAIT_SAFE } from './types'

const WIDTH = 1080 - PORTRAIT_SAFE.right - 72

/** Page furniture for a tall scene: kicker and title. The player draws the caption and SceneDef.source. */
export function Tall({ kicker, title, children }: { kicker: string; title?: ReactNode; children: ReactNode }) {
  const t = useSceneTime()
  return (
    <div className="vt">
      <div className="vt__glow" aria-hidden style={{ opacity: 0.55 + 0.45 * span(t, 0, 2) }} />
      <header className="vt__head">
        <p className="vt__kicker" style={enter(t, 0.05)}>{kicker}</p>
        {title && <h2 className="vt__title" style={enter(t, 0.12)}>{title}</h2>}
      </header>
      <div className="vt__body">{children}</div>
    </div>
  )
}

/** A number that counts between two values over a stretch of the scene. */
export function Count({ from = 0, to, at = 0.3, dur = 1.6, decimals = 0, unit, className, style }: { from?: number; to: number; at?: number; dur?: number; decimals?: number; unit?: string; className?: string; style?: CSSProperties }) {
  const t = useSceneTime()
  const v = lerp(from, to, easeOut(span(t, at, dur)))
  return (
    <span className={`vt-num numeral ${className ?? ''}`} style={style}>
      {fmt(v, decimals)}
      {unit && <small>{unit}</small>}
    </span>
  )
}

/** One huge figure and the sentence under it. */
export function HeroNumber({ from = 0, to, decimals = 0, unit, lines, detail, detailAt = 1.3 }: { from?: number; to: number; decimals?: number; unit?: string; lines: string[]; detail?: ReactNode; detailAt?: number }) {
  const t = useSceneTime()
  return (
    <div className="vt-hero">
      <div style={enter(t, 0.1, 0.6, 40)}>
        <Count from={from} to={to} decimals={decimals} unit={unit} at={0.15} dur={1.5} className="vt-hero__num" />
      </div>
      <h1 className="vt-hero__text">
        {lines.map((l, i) => (
          <span key={l} style={{ ...enter(t, 0.7 + i * 0.16), display: 'block' }}>{l}</span>
        ))}
      </h1>
      {detail && <p className="vt-hero__detail" style={enter(t, detailAt)}>{detail}</p>}
    </div>
  )
}

/** A line that draws itself left to right while a large readout follows its head. */
export function DrawnLine({ x, values, unit, at = 0.4, dur = 3, callout }: { x: string[]; values: number[]; unit: string; at?: number; dur?: number; callout?: string }) {
  const t = useSceneTime()
  const W = 1080
  const H = 620
  const x0 = 72
  const x1 = 72 + WIDTH - 16
  const top = 24
  const base = H - 56
  const max = Math.max(...values)
  const nice = Math.ceil(max / 1000) * 1000
  const px = (i: number) => x0 + (i * (x1 - x0)) / (values.length - 1)
  const py = (v: number) => base - ((v / nice) * (base - top))
  const p = easeInOut(span(t, at, dur))
  const head = p * (values.length - 1)
  const i0 = Math.min(values.length - 2, Math.floor(head))
  const frac = head - i0
  const hv = lerp(values[i0], values[i0 + 1], frac)
  const hx = lerp(px(i0), px(i0 + 1), frac)
  const hy = py(hv)
  const pts = values.slice(0, i0 + 1).map((v, i) => `${px(i)},${py(v)}`)
  pts.push(`${hx},${hy}`)
  const area = `${x0},${base} ${pts.join(' ')} ${hx},${base}`
  const year = x[Math.round(head)]
  const ticks = [0, nice / 3, (2 * nice) / 3, nice]
  return (
    <div className="vt-line">
      <div className="vt-line__read" style={enter(t, 0.15)}>
        <span className="vt-num numeral vt-line__num">{fmt(values[Math.round(head)], 0)}<small>{unit}</small></span>
        <span className="vt-line__year">{year}</span>
      </div>
      <svg className="vt-line__svg" viewBox={`0 0 ${W} ${H}`} style={{ width: W, height: H }} aria-hidden={false}>
        {ticks.map((v) => (
          <line key={v} x1={0} x2={W} y1={py(v)} y2={py(v)} className="vt-line__grid" style={{ opacity: span(t, 0.1, 0.5) }} />
        ))}
        <polygon points={area} className="vt-line__area" />
        <polyline points={pts.join(' ')} className="vt-line__path" />
        <circle cx={hx} cy={hy} r={13} className="vt-line__dot" />
        {[0, 5, 10].map((i) => (
          <text key={i} x={px(i)} y={H - 8} textAnchor={i === 0 ? 'start' : i === 10 ? 'end' : 'middle'} className="vt-line__tick" style={{ opacity: span(t, 0.1, 0.5) }}>{x[i]}</text>
        ))}
      </svg>
      {callout && <p className="vt-line__callout" style={enter(t, at + dur - 0.2)}>{callout}</p>}
    </div>
  )
}

/** 100 cells, one per cent. Cells fill in order as the year ticks; the last one fills partly. */
export function Waffle({ years, shares, at = 0.4, dur = 3, label, compare }: { years: string[]; shares: number[]; at?: number; dur?: number; label: string; compare?: { label: string; value: number; unit: string } }) {
  const t = useSceneTime()
  const p = easeInOut(span(t, at, dur)) * (shares.length - 1)
  const i0 = Math.min(shares.length - 2, Math.floor(p))
  const v = lerp(shares[i0], shares[i0 + 1], p - i0)
  return (
    <div className="vt-waffle">
      <div className="vt-waffle__read" style={enter(t, 0.15)}>
        <span className="vt-num numeral vt-waffle__num">{fmt(shares[Math.round(p)], 1)}<small>%</small></span>
        <span className="vt-waffle__year">{years[Math.round(p)]}</span>
      </div>
      <p className="vt-waffle__label" style={enter(t, 0.25)}>{label}</p>
      <div className="vt-waffle__grid" style={{ opacity: span(t, 0.1, 0.4) }} aria-hidden>
        {Array.from({ length: 100 }, (_, i) => (
          <i key={i}>
            <b style={{ width: `${clamp01(v - i) * 100}%` }} />
          </i>
        ))}
      </div>
      {compare && (
        <div className="vt-waffle__compare" style={enter(t, at + dur - 0.1)}>
          <p>{compare.label}</p>
          <span className="vt-num numeral">{fmt(compare.value, 1)}<small>{compare.unit}</small></span>
        </div>
      )}
    </div>
  )
}

/** Ranked bars growing one after another; the focus row is the accent. */
export function RankBars({ items, unit, focus, at = 0.5, headline }: { items: { name: string; value: number }[]; unit: string; focus: string; at?: number; headline?: { value: number; unit: string; label: string; at?: number } }) {
  const t = useSceneTime()
  const max = items[0].value
  return (
    <div className="vt-bars">
      {headline && (
        <div className="vt-bars__head" style={enter(t, 0.15)}>
          <Count to={headline.value} unit={headline.unit} at={at} dur={1.6} className="vt-bars__num" />
          <span>{headline.label}</span>
        </div>
      )}
      <ul>
        {items.map((it, i) => {
          const start = at + i * 0.22
          const p = expoOut(span(t, start, 1.1))
          return (
            <li key={it.name} className={it.name === focus ? 'is-focus' : undefined} style={{ opacity: span(t, start - 0.1, 0.25) }}>
              <span className="vt-bars__name">{it.name}</span>
              <span className="vt-bars__track">
                <i style={{ width: `${(it.value / max) * p * 72}%` }} />
                <b>{fmt(it.value * p, 0)}<small>{unit}</small></b>
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/** Before and after for a few rows on one axis: each dot slides from its old value to its new one. */
export function Slides({ rows, max, unit, fromLabel, toLabel, at = 0.5 }: { rows: { name: string; from: number; to: number }[]; max: number; unit: string; fromLabel: string; toLabel: string; at?: number }) {
  const t = useSceneTime()
  return (
    <div className="vt-slide">
      {rows.map((r, i) => {
        const start = at + i * 0.3
        const p = easeInOut(span(t, start, 1.5))
        const v = lerp(r.from, r.to, p)
        const left = (x: number) => `${(x / max) * 100}%`
        return (
          <div key={r.name} className="vt-slide__row" style={enter(t, start - 0.25)}>
            <div className="vt-slide__top">
              <span>{r.name}</span>
              <span className="vt-num numeral vt-slide__num">{fmt(v, 1)}<small>{unit}</small></span>
            </div>
            <div className="vt-slide__axis">
              <i className="vt-slide__fill" style={{ left: left(r.from), width: left(v - r.from) }} />
              <b className="vt-slide__from" style={{ left: left(r.from) }} />
              <b className="vt-slide__dot" style={{ left: left(v) }} />
            </div>
            <div className="vt-slide__ends">
              <span>{fromLabel} {fmt(r.from, 1)}{unit}</span>
              <span style={{ opacity: span(t, start + 1.2, 0.3) }}>{toLabel} {fmt(r.to, 1)}{unit}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/** Closing card: one figure, three short lines. */
export function TallClose({ lines }: { lines: { key: string; value: string }[] }) {
  const t = useSceneTime()
  return (
    <ol className="vt-close">
      {lines.map((l, i) => (
        <li key={l.key} style={enter(t, 0.2 + i * 0.24)}>
          <span>{l.key}</span>
          <b className="numeral">{l.value}</b>
        </li>
      ))}
    </ol>
  )
}
