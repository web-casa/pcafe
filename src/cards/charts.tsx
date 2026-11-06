// Charts drawn in design units, so their text keeps its size on every card. Direct labels only:
// no legends, and no axis a reader has to trace from a thumbnail-sized phone screen.
import { useLayoutEffect, useRef, useState } from 'react'
import { fmt } from '../kit/chart-util'
import { useCard } from './context'
import type { CardChart } from './types'

/** The box a chart may fill, in u. Measured as a share of the card, so gallery zoom cannot skew it. */
function useBox() {
  const { m } = useCard()
  const ref = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState({ w: 0, h: 0 })
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const read = () => {
      const card = el.closest('.cd') as HTMLElement | null
      if (!card) return
      const a = el.getBoundingClientRect()
      const b = card.getBoundingClientRect()
      if (!b.width) return
      setBox({ w: Math.round((a.width / b.width) * m.unitW), h: Math.round((a.height / b.height) * m.unitH) })
    }
    read()
    const ro = new ResizeObserver(read)
    ro.observe(el)
    return () => ro.disconnect()
  }, [m.unitW, m.unitH])
  return [ref, box] as const
}

/** Round axis top close to the data, so a chart does not waste its upper half. */
function niceTop(v: number) {
  if (v <= 0) return 1
  const p = 10 ** Math.floor(Math.log10(v))
  for (const m of [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) if (m * p >= v) return m * p
  return 10 * p
}

const Svg = ({ w, h, label, children }: { w: number; h: number; label: string; children: React.ReactNode }) => (
  <svg className="cd-svg" viewBox={`0 0 ${w} ${h}`} role="img" aria-label={label} style={{ width: `calc(${w} * var(--u))`, height: `calc(${h} * var(--u))` }}>
    {children}
  </svg>
)

function LineChart({ chart, w, h }: { chart: Extract<CardChart, { type: 'line' }>; w: number; h: number }) {
  const FS = 34
  const named = chart.series.length > 1
  const pad = { l: 8, r: 184, t: FS * 1.8, b: FS * 1.8 }
  const iw = w - pad.l - pad.r
  const ih = h - pad.t - pad.b
  const max = niceTop(Math.max(...chart.series.flatMap((s) => s.values)))
  const px = (i: number) => pad.l + (i / (chart.x.length - 1)) * iw
  const py = (v: number) => pad.t + ih - (v / max) * ih
  const base = py(0)
  return (
    <Svg w={w} h={h} label={chart.series.map((s) => s.name).join('、')}>
      <line x1={pad.l} x2={pad.l + iw} y1={base} y2={base} className="cd-axis" />
      {chart.series.map((s) => {
        const d = s.values.map((v, i) => `${i ? 'L' : 'M'}${px(i).toFixed(1)} ${py(v).toFixed(1)}`).join(' ')
        const end = s.values.length - 1
        return (
          <g key={s.name} className={s.focus ? 'is-focus' : 'is-back'}>
            {s.focus && <path d={`${d} L${px(end)} ${base} L${px(0)} ${base} Z`} className="cd-area" />}
            <path d={d} className="cd-line" />
            <circle cx={px(end)} cy={py(s.values[end])} r={s.focus ? 13 : 10} className="cd-dot" />
            {s.labels !== false && <text x={px(0)} y={py(s.values[0]) - 34} fontSize={FS} className="cd-val">{fmt(s.values[0])}</text>}
            {s.labels !== false && <text x={px(end) + 26} y={py(s.values[end]) + (named ? 2 : 14)} fontSize={FS + 10} className="cd-val is-end">{fmt(s.values[end])}</text>}
            {named && <text x={px(end) + 26} y={py(s.values[end]) + 46} fontSize={FS + 2} className="cd-name">{s.name}</text>}
          </g>
        )
      })}
      <text x={pad.l} y={h - 8} fontSize={FS - 2} className="cd-tick">{chart.x[0]}</text>
      <text x={pad.l + iw} y={h - 8} fontSize={FS - 2} textAnchor="end" className="cd-tick">{chart.x[chart.x.length - 1]}</text>
      {chart.unit && <text x={(pad.l + pad.l + iw) / 2} y={h - 8} fontSize={FS - 2} textAnchor="middle" className="cd-tick">{chart.unit}</text>}
    </Svg>
  )
}

function BarChart({ chart, w, h }: { chart: Extract<CardChart, { type: 'bars' }>; w: number; h: number }) {
  const FS = 34
  const pad = { t: FS * 1.7, b: FS * 1.7 }
  const max = Math.max(...chart.values)
  const n = chart.values.length
  const gap = Math.max(6, (w / n) * 0.14)
  const bw = (w - gap * (n - 1)) / n
  const ih = h - pad.t - pad.b
  const focus = chart.focus ?? n - 1
  return (
    <Svg w={w} h={h} label={chart.x.join('、')}>
      {chart.values.map((v, i) => {
        const bh = Math.max(4, (v / max) * ih)
        const x = i * (bw + gap)
        const every = chart.every ?? n - 1
        const labelled = i === focus || i === 0
        const anchor = i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'
        const tx = i === 0 ? x : i === n - 1 ? x + bw : x + bw / 2
        return (
          <g key={i} className={i === focus ? 'is-focus' : 'is-back'}>
            <rect x={x} y={pad.t + ih - bh} width={bw} height={bh} rx={Math.min(8, bw / 4)} className="cd-bar" />
            {labelled && <text x={tx} y={pad.t + ih - bh - 18} fontSize={i === focus ? FS + 10 : FS} textAnchor={anchor} className="cd-val">{fmt(v)}</text>}
            {(i === 0 || i === n - 1 || i % every === 0) && <text x={tx} y={h - 8} fontSize={FS - 2} textAnchor={anchor} className="cd-tick">{chart.x[i]}</text>}
          </g>
        )
      })}
      {chart.unit && <text x={w / 2} y={h - 8} fontSize={FS - 2} textAnchor="middle" className="cd-tick">{chart.unit}</text>}
    </Svg>
  )
}

function RankChart({ chart }: { chart: Extract<CardChart, { type: 'rank' }> }) {
  const max = Math.max(...chart.rows.map((r) => r.value))
  const decimals = chart.decimals ?? 0
  // One value column for every row, or the tracks end at different places.
  const longest = Math.max(...chart.rows.map((r) => (fmt(r.value, decimals) + (chart.unit ?? '')).length))
  return (
    <ol className="cd-rank" style={{ '--rv': `calc(${longest * 27 + 6} * var(--u))` } as React.CSSProperties}>
      {chart.rows.map((r, i) => (
        <li key={r.name} className={`${r.focus ? 'is-focus' : ''}${chart.gapBefore === i ? ' is-gap' : ''}`}>
          <span className="cd-rank__name">{r.name}</span>
          <span className="cd-rank__track"><i style={{ width: `${Math.max(1.2, (r.value / max) * 100)}%` }} /></span>
          <b className="cd-rank__val">{fmt(r.value, decimals)}{chart.unit}</b>
        </li>
      ))}
    </ol>
  )
}

export function Chart({ chart }: { chart: CardChart }) {
  const [ref, box] = useBox()
  if (chart.type === 'rank') return <RankChart chart={chart} />
  return (
    <div className="cd-chart" ref={ref}>
      {box.w > 80 && box.h > 80 && (chart.type === 'line' ? <LineChart chart={chart} w={box.w} h={box.h} /> : <BarChart chart={chart} w={box.w} h={box.h} />)}
    </div>
  )
}

/** Bars as the art of a cover. Real data only, so the picture is also the evidence. */
export function MotifBars({ values, ends, split }: { values: number[]; ends?: [string, string]; split?: boolean }) {
  const max = Math.max(...values)
  const pct = (v: number) => `${Math.max(1.5, (v / max) * 100)}%`
  if (split) {
    // A banner keeps the centre free: the series climbs along both flanks and meets at full height outside the crop.
    const half = Math.ceil(values.length / 2)
    return (
      <div className="cd-flank" aria-hidden>
        <div>{values.slice(0, half).map((v, i) => <i key={i} style={{ height: pct(v) }} />)}</div>
        <div>{values.slice(half).map((v, i) => <i key={i} className={i === values.length - half - 1 ? 'is-focus' : ''} style={{ height: pct(v) }} />)}</div>
      </div>
    )
  }
  return (
    <div className="cd-motif-bars">
      <div className="cd-motif-bars__row" aria-hidden>
        {values.map((v, i) => <i key={i} className={i === values.length - 1 ? 'is-focus' : ''} style={{ height: pct(v) }} />)}
      </div>
      {ends && <div className="cd-motif-bars__ends"><span>{ends[0]}</span><span>{ends[1]}</span></div>}
    </div>
  )
}
