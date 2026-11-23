import { useState } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint } from '../../shared'
import { Panel, Tag, Widget, smooth } from './parts'

export interface DuskSeries {
  /** ≤ 4 字. */
  label: string
  /** 6–14 numbers, same length for every series. */
  points: number[]
  /** Draw dashed (for a minor series). */
  dashed?: boolean
}

export interface DuskFeatureProps {
  /** Small tag: a one-character mark and a word ≤ 4 字. */
  tag?: { icon?: string; label: string }
  /** 2 lines × ≤ 9 字. */
  title: string[]
  /** ≤ 64 字. */
  body?: string
  /** 2–4 checked points, each ≤ 14 字. */
  points?: string[]
  /** Soft button, ≤ 8 字. */
  more?: string
  /** The widget on the pink panel. */
  chart: {
    /** Big number and the words after it, e.g. "37" + "个问题 · 最近 14 天". */
    stat: string
    unit: string
    /** 2–3 lines. */
    series: DuskSeries[]
    /** Labels for the points under the scrubber, e.g. dates; same length as points. */
    xs?: string[]
    /** File-style name under the widget, ≤ 12 字. */
    name?: string
  }
  hint?: string
}

const COLORS = ['#ef4444', '#f5b84b', '#a39d93']
const W = 600
const H = 240

/** A feature with its own instrument: copy and checked points on the left, and on a pink panel a dark chart whose cursor follows the pointer and reads out every line. */
export function DuskFeature({ tag, title, body, points = [], more, chart, hint }: DuskFeatureProps) {
  const series = chart.series.slice(0, 3)
  const len = Math.max(...series.map((s) => s.points.length))
  const all = series.flatMap((s) => s.points)
  const lo = Math.min(...all)
  const hi = Math.max(...all)
  const xy = (v: number, i: number): [number, number] => [(i / (len - 1)) * W, H - 16 - ((v - lo) / (hi - lo || 1)) * (H - 32)]
  const [at, setAt] = useState(Math.round(len * 0.5))
  return (
    <section className="slide du">
      <Hint id="duskfeature">{hint}</Hint>
      <div className="du-ft">
        {tag && (
          <Reveal i={0}>
            <Tag icon={tag.icon}>{tag.label}</Tag>
          </Reveal>
        )}
        <Reveal i={0.4}>
          <h2 className="du-h2">
            {title.slice(0, 2).map((l, i) => (
              <span key={i}>{l}</span>
            ))}
          </h2>
        </Reveal>
        {body && (
          <Reveal i={0.8}>
            <p className="du-body">{body}</p>
          </Reveal>
        )}
        {points.length > 0 && (
          <Reveal i={1.1}>
            <ul className="du-pts">
              {points.slice(0, 4).map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </Reveal>
        )}
        {more && (
          <Reveal i={1.4}>
            <span className="du-btn is-soft">{more} →</span>
          </Reveal>
        )}
      </div>
      <Reveal i={0.9} className="du-ft__panel">
        <Panel tone="pink">
          <Widget name={chart.name} className="du-ft__wd">
            <div className="du-wd__stat">
              <b>{chart.stat}</b> {chart.unit}
            </div>
            <svg
              className="du-scrub"
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="none"
              onPointerMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect()
                setAt(Math.max(0, Math.min(len - 1, Math.round(((e.clientX - r.left) / r.width) * (len - 1)))))
              }}
              role="img"
              aria-label={series.map((s) => s.label).join(' / ')}
            >
              {series.map((s, k) => (
                <path key={s.label} d={smooth(s.points.map(xy))} stroke={COLORS[k]} strokeDasharray={s.dashed ? '5 6' : undefined} className="du-scrub__line" pathLength={1} />
              ))}
              <line x1={(at / (len - 1)) * W} x2={(at / (len - 1)) * W} y1="0" y2={H} className="du-scrub__rule" />
              {series.map((s, k) => {
                const [x, y] = xy(s.points[at] ?? 0, at)
                return <circle key={s.label} cx={x} cy={y} r="6" fill={COLORS[k]} className="du-scrub__dot" />
              })}
            </svg>
            <div className="du-scrub__read">
              {chart.xs?.[at] && <em>{chart.xs[at]}</em>}
              {series.map((s, k) => (
                <span key={s.label} style={{ ['--c' as string]: COLORS[k] }}>
                  {s.label} <b>{s.points[at]}</b>
                </span>
              ))}
            </div>
          </Widget>
        </Panel>
      </Reveal>
    </section>
  )
}
