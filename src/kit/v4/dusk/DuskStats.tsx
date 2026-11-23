import { useId, useState } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot } from '../../shared'
import { Count, Tag, smooth } from './parts'

export interface DuskStat {
  /** e.g. "3.2×", "48%", "1,240"; the number counts up. ≤ 7 个字符. */
  value: string
  /** ≤ 10 字. */
  label: string
  /** ≤ 30 字. */
  note?: string
  /** 6–12 numbers for the sparkline. */
  series?: number[]
}

export interface DuskStatsProps {
  tag?: { icon?: string; label: string }
  /** One line, ≤ 16 字. */
  title: string
  /** Exactly 3 stats. */
  stats: DuskStat[]
  source?: string
  hint?: string
}

/** Three results as tall cards; the one you point at turns into the sunset gradient, numbers count up and sparklines draw in. */
export function DuskStats({ tag, title, stats, source, hint }: DuskStatsProps) {
  const [on, setOn] = useState(0)
  const uid = useId().replace(/:/g, '')
  return (
    <section className="slide du">
      <Hint id="duskstats">{hint}</Hint>
      <div className="du-head">
        {tag && (
          <Reveal i={0}>
            <Tag icon={tag.icon}>{tag.label}</Tag>
          </Reveal>
        )}
        <Reveal i={0.4}>
          <h2 className="du-h2 is-one">{title}</h2>
        </Reveal>
      </div>
      <div className="du-stats">
        {stats.slice(0, 3).map((s, i) => {
          const pts = s.series ?? []
          const lo = Math.min(...pts)
          const hi = Math.max(...pts)
          const d = pts.length > 1 ? smooth(pts.map((v, k) => [(k / (pts.length - 1)) * 400, 110 - ((v - lo) / (hi - lo || 1)) * 100] as [number, number])) : ''
          return (
            <Reveal key={i} i={0.8 + i * 0.3}>
              <div className={`du-stat${i === on ? ' is-on' : ''}`} onPointerEnter={() => setOn(i)}>
                <small>{s.label}</small>
                {d ? (
                  <svg viewBox="0 0 400 120" preserveAspectRatio="none" aria-hidden="true">
                    <defs>
                      <linearGradient id={`${uid}-${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="currentColor" stopOpacity="0.22" />
                        <stop offset="1" stopColor="currentColor" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d={`${d} L400 120 L0 120 Z`} className="du-stat__area" fill={`url(#${uid}-${i})`} />
                    <path d={d} className="du-stat__line" pathLength={1} />
                  </svg>
                ) : (
                  <span className="du-stat__gap" />
                )}
                <b>
                  <Count value={s.value} delay={900 + i * 250} />
                </b>
                {s.note && <p>{s.note}</p>}
              </div>
            </Reveal>
          )
        })}
      </div>
      <div className="du-foot">
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
