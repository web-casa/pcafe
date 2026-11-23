import { useState } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot } from '../../shared'
import { Dot } from './parts'

export interface SlateSeries {
  /** ≤ 6 字. */
  label: string
  /** Current value as shown, ≤ 8 个字符. */
  value: string
  /** e.g. "+18%", ≤ 6 个字符. */
  delta?: string
  /** 6–14 points, any scale. */
  points: number[]
}

export interface SlateTrendProps {
  dot?: string
  /** 1 line ≤ 12 字. */
  title: string
  /** 3–4 metrics in the list; click one to draw it. */
  series: SlateSeries[]
  /** 6–14 short x-axis labels, e.g. months, each ≤ 4 个字符. */
  xs: string[]
  /** Callout on the last point, ≤ 12 字. */
  note?: string
  source?: string
  hint?: string
}

const W = 1000
const H = 440

/** A report view: a list of metrics on the left; clicking one redraws the area chart on the right, with the last point called out. */
export function SlateTrend({ dot, title, series, xs, note, source, hint }: SlateTrendProps) {
  const list = series.slice(0, 4)
  const [on, setOn] = useState(0)
  const s = list[on]
  const pts = s.points.slice(0, 14)
  const lo = Math.min(...pts) * 0.85
  const hi = Math.max(...pts) * 1.05
  const xy = pts.map((v, i) => [(i / (pts.length - 1)) * W, H - ((v - lo) / (hi - lo)) * H] as const)
  const line = xy.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const area = `${line} L${W} ${H} L0 ${H} Z`
  const [lx, ly] = xy[xy.length - 1]
  return (
    <section className="slide sl">
      <Hint id="slatetrend">{hint}</Hint>
      <div className="sl-trend__head">
        {dot && (
          <Reveal i={0}>
            <Dot>{dot}</Dot>
          </Reveal>
        )}
        <Reveal i={0.5}>
          <h2 className="sl-h2 is-left is-one">{title}</h2>
        </Reveal>
      </div>
      <div className="sl-trend">
        <ul className="sl-metrics">
          {list.map((m, i) => (
            <Reveal i={1 + i * 0.4} y={12} key={m.label}>
              <li className={i === on ? 'is-on' : ''} onClick={() => setOn(i)}>
                <small>{m.label}</small>
                <b>{m.value}</b>
                {m.delta && <em>{m.delta}</em>}
              </li>
            </Reveal>
          ))}
        </ul>
        <Reveal i={1.5} className="sl-plot">
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
            {[0.25, 0.5, 0.75].map((g) => (
              <line key={g} x1="0" x2={W} y1={H * g} y2={H * g} className="sl-plot__grid" />
            ))}
            <path key={`a${on}`} d={area} className="sl-plot__area" />
            <path key={`l${on}`} d={line} className="sl-plot__line" pathLength={1} />
          </svg>
          <div className="sl-plot__layer" aria-hidden="true">
            <i className="sl-plot__dot" style={{ left: `${(lx / W) * 100}%`, top: `${(ly / H) * 100}%` }} key={`d${on}`} />
            <div className="sl-plot__tip" style={{ top: `${(ly / H) * 100}%` }} key={`t${on}`}>
              <b>{s.value}</b>
              <small>{s.label}</small>
            </div>
          </div>
          <div className="sl-plot__xs">
            {xs.slice(0, 14).map((x) => (
              <span key={x}>{x}</span>
            ))}
          </div>
        </Reveal>
      </div>
      <div className="sl-foot is-left">
        {note && <p className="sl-note">{note}</p>}
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
