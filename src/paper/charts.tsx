// Charts for the page. Text is drawn at its real size at any width, so a chart in the
// article view on a phone stays readable. No animation: the same chart goes to print.
import { useLayoutEffect, useMemo, useRef, useState, type RefCallback } from 'react'
import { fmt } from '../kit/chart-util'
import { usePaper } from './context'

/** Width of a box in the article view; on a sheet it is fixed, so pagination is repeatable. */
export function useBoxWidth(): [RefCallback<HTMLDivElement>, number] {
  const { mode, bodyW } = usePaper()
  const [w, setW] = useState(bodyW)
  const ro = useRef<ResizeObserver | null>(null)
  const ref: RefCallback<HTMLDivElement> = (el) => {
    ro.current?.disconnect()
    ro.current = null
    if (!el || mode !== 'read') return
    ro.current = new ResizeObserver(() => setW(el.clientWidth))
    ro.current.observe(el)
  }
  useLayoutEffect(() => () => ro.current?.disconnect(), [])
  return [ref, mode === 'read' ? w : bodyW]
}

const FS = 11
const SHADES = [72, 54, 38, 25, 14].map((n) => `color-mix(in srgb, var(--ink) ${n}%, var(--doc-paper))`)

/** Round axis top close to the data, so a chart does not waste its upper half. */
function niceTop(v: number) {
  if (v <= 0) return 1
  const p = 10 ** Math.floor(Math.log10(v))
  for (const m of [1, 1.2, 1.6, 2, 2.4, 3, 4, 5, 6, 8, 10]) if (m * p >= v) return m * p
  return 10 * p
}

export interface LineSeries {
  /** ≤ 8 CJK characters. */
  name: string
  values: number[]
  focus?: boolean
}

export interface DocLineProps {
  /** Category labels; about every sixth is printed. */
  x: string[]
  /** 1–4 series. */
  series: LineSeries[]
  /** Printed after values, ≤ 4 characters. */
  unit?: string
  height?: number
  /** Mark one point: `at` indexes x, text ≤ 16 CJK characters. */
  note?: { at: number; text: string }
}

/** Line chart labelled at the line ends. In the article view, hovering shows each year's value. */
export function DocLine({ x, series, unit = '', height = 220, note }: DocLineProps) {
  const [ref, w] = useBoxWidth()
  const [hover, setHover] = useState<number | null>(null)
  const { mode } = usePaper()
  const pad = { l: 42, r: series.length > 1 ? 74 : 54, t: 16, b: 24 }
  const iw = Math.max(w - pad.l - pad.r, 40)
  const ih = height - pad.t - pad.b
  const max = niceTop(Math.max(...series.flatMap((s) => s.values)))
  const px = (i: number) => pad.l + (x.length > 1 ? (i / (x.length - 1)) * iw : 0)
  const py = (v: number) => pad.t + ih - (v / max) * ih
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * max)
  const every = Math.ceil(x.length / (w < 420 ? 4 : 6))
  const move = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    setHover(Math.max(0, Math.min(x.length - 1, Math.round(((e.clientX - r.left - pad.l) / iw) * (x.length - 1)))))
  }
  return (
    <div className="doc-chart" ref={ref}>
      <svg width={w} height={height} role="img" aria-label={series.map((s) => s.name).join('、')} onPointerMove={mode === 'read' ? move : undefined} onPointerLeave={() => setHover(null)}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={pad.l + iw} y1={py(t)} y2={py(t)} className="doc-grid" />
            <text x={pad.l - 7} y={py(t) + 4} textAnchor="end" fontSize={FS} className="doc-tick">{fmt(t)}</text>
          </g>
        ))}
        {x.map((l, i) => (i % every === 0 || i === x.length - 1) && (x.length - 1 - i >= every / 2 || i === x.length - 1) ? <text key={i} x={px(i)} y={height - 7} textAnchor="middle" fontSize={FS} className="doc-tick">{l}</text> : null)}
        {series.map((s, k) => (
          <g key={s.name}>
            <polyline fill="none" stroke={s.focus || series.length === 1 ? 'var(--accent)' : SHADES[k + 1]} strokeWidth={s.focus || series.length === 1 ? 2.25 : 1.5} points={s.values.map((v, i) => `${px(i)},${py(v)}`).join(' ')} />
            <circle cx={px(s.values.length - 1)} cy={py(s.values.at(-1)!)} r={3} fill={s.focus || series.length === 1 ? 'var(--accent)' : SHADES[k + 1]} />
            <text x={px(s.values.length - 1) + 7} y={py(s.values.at(-1)!) + 4} fontSize={FS} fontWeight={600} className="doc-value">
              {series.length > 1 ? `${s.name} ` : ''}{fmt(s.values.at(-1)!)}
            </text>
          </g>
        ))}
        {note && <text x={px(note.at) - 8} y={py(series[0].values[note.at]) + 2} textAnchor="end" fontSize={FS} className="doc-note">{note.text}</text>}
        {hover !== null && (
          <g>
            <line x1={px(hover)} x2={px(hover)} y1={pad.t} y2={pad.t + ih} className="doc-cross" />
            {series.map((s, k) => <circle key={s.name} cx={px(hover)} cy={py(s.values[hover])} r={3.5} fill={s.focus || series.length === 1 ? 'var(--accent)' : SHADES[k + 1]} />)}
          </g>
        )}
      </svg>
      {hover !== null && (
        <div className="doc-tip" style={{ left: Math.min(px(hover) + 10, w - 150), top: 8 }}>
          <b>{x[hover]}</b>
          {series.map((s) => <span key={s.name}>{series.length > 1 ? `${s.name} ` : ''}{fmt(s.values[hover])}{unit}</span>)}
        </div>
      )}
    </div>
  )
}

export interface DocBarsProps {
  /** 2–12 rows. name ≤ 6 CJK characters. */
  items: { name: string; value: number; focus?: boolean }[]
  unit?: string
  decimals?: number
}

/** Ranked horizontal bars with the value printed on every row. */
export function DocBars({ items, unit = '', decimals = 0 }: DocBarsProps) {
  const max = Math.max(...items.map((i) => i.value))
  return (
    <div className="doc-bars">
      {items.map((i) => (
        <div key={i.name} className={i.focus ? 'is-focus' : undefined}>
          <span>{i.name}</span>
          <i><b style={{ width: `${(i.value / max) * 100}%` }} /></i>
          <em>{fmt(i.value, decimals)}{unit}</em>
        </div>
      ))}
    </div>
  )
}

export interface DocStackProps {
  /** 2–5 parts. Each ≤ 6 CJK characters. */
  parts: string[]
  /** 1–6 rows; each row has one value per part. */
  rows: { name: string; values: number[] }[]
  /** Part to draw in the accent colour. */
  focus?: string
  unit?: string
}

/** Horizontal 100% bars with one shared legend. */
export function DocStack({ parts, rows, focus, unit = '%' }: DocStackProps) {
  const color = (p: string, k: number) => (p === focus ? 'var(--accent)' : SHADES[Math.min(k, SHADES.length - 1)])
  return (
    <div className="doc-stack">
      <ul>{parts.map((p, k) => <li key={p}><i style={{ background: color(p, k) }} />{p}</li>)}</ul>
      {rows.map((r) => {
        const total = r.values.reduce((a, b) => a + b, 0)
        return (
          <div key={r.name}>
            <span>{r.name}</span>
            <p>
              {r.values.map((v, k) => (
                <b key={k} title={`${parts[k]} ${v}${unit}`} style={{ width: `${(v / total) * 100}%`, background: color(parts[k], k), color: k < 2 || parts[k] === focus ? 'var(--doc-paper)' : 'var(--ink)' }}>
                  {v / total > 0.07 ? v : ''}
                </b>
              ))}
            </p>
          </div>
        )
      })}
    </div>
  )
}

export interface DocAreaProps {
  x: string[]
  /** 2–6 series, bottom to top, summing to the whole. */
  series: { name: string; values: number[] }[]
  /** Series drawn in the accent colour. */
  focus?: string
  height?: number
}

/** Stacked 100% area, labelled on the right edge. */
export function DocArea({ x, series, focus, height = 250 }: DocAreaProps) {
  const [ref, w] = useBoxWidth()
  const pad = { l: 34, r: 96, t: 8, b: 24 }
  const iw = Math.max(w - pad.l - pad.r, 40)
  const ih = height - pad.t - pad.b
  const totals = useMemo(() => x.map((_, i) => series.reduce((a, s) => a + s.values[i], 0)), [x, series])
  const px = (i: number) => pad.l + (i / (x.length - 1)) * iw
  const py = (share: number) => pad.t + ih - share * ih
  const every = Math.ceil(x.length / (w < 420 ? 3 : 5))
  let base = x.map(() => 0)
  return (
    <div className="doc-chart" ref={ref}>
      <svg width={w} height={height} role="img" aria-label={series.map((s) => s.name).join('、')}>
        {series.map((s, k) => {
          const low = base
          const high = base.map((b, i) => b + s.values[i] / totals[i])
          base = high
          const d = high.map((h, i) => `${px(i)},${py(h)}`).concat(low.map((l, i) => `${px(i)},${py(l)}`).reverse()).join(' ')
          const mid = (high.at(-1)! + low.at(-1)!) / 2
          const share = (high.at(-1)! - low.at(-1)!) * 100
          return (
            <g key={s.name}>
              <polygon points={d} fill={s.name === focus ? 'var(--accent)' : SHADES[Math.min(k, SHADES.length - 1)]} stroke="var(--doc-paper)" strokeWidth={0.75} />
              <text x={pad.l + iw + 8} y={py(mid) + 4} fontSize={FS} fontWeight={s.name === focus ? 600 : 400} className={s.name === focus ? 'doc-value is-accent' : 'doc-value'}>{s.name} {share.toFixed(1)}%</text>
            </g>
          )
        })}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => <text key={t} x={pad.l - 6} y={py(t) + 4} textAnchor="end" fontSize={FS} className="doc-tick">{t * 100}</text>)}
        {x.map((l, i) => (i % every === 0 || i === x.length - 1) && (x.length - 1 - i >= every / 2 || i === x.length - 1) ? <text key={i} x={px(i)} y={height - 7} textAnchor="middle" fontSize={FS} className="doc-tick">{l}</text> : null)}
      </svg>
    </div>
  )
}
