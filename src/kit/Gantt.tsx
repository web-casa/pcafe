import { Reveal } from '../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from './shared'

export interface GanttRow {
  /** ≤ 12 CJK characters. */
  label: string
  /** First and last unit, inclusive (e.g. weeks 3–5). */
  from: number
  to: number
  /** Highlight in accent: the milestone or the deliverable. */
  focus?: boolean
}

export interface GanttProps extends SlideBase {
  /** Units on the axis, inclusive, e.g. { from: 1, to: 13, unit: '周' }. 6–16 units. */
  axis: { from: number; to: number; unit: string }
  /** Bands above the axis, e.g. months: { label: '第 1 月', from: 1, to: 4 }. 2–4 bands. */
  groups?: { label: string; from: number; to: number }[]
  /** 3–7 workstreams in start order. Bars may overlap in time. */
  rows: GanttRow[]
  /** One line under the chart: the caveat about timing. ≤ 40 CJK characters. */
  footnote?: string
}

/** A relative plan on a unit axis (weeks, sprints, days). Hover a bar to read its span. */
export function Gantt({ kicker, title, lead, source, hint, axis, groups, rows, footnote }: GanttProps) {
  const n = axis.to - axis.from + 1
  const units = Array.from({ length: n }, (_, k) => axis.from + k)
  const col = (v: number) => v - axis.from + 1
  return (
    <section className="slide">
      <Hint id="gantt">{hint}</Hint>
      <div className="frame s-gantt">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="gantt" style={vars({ '--n': n })}>
          {groups && (
            <Reveal i={3} className="gantt__row gantt__groups">
              <span />
              <span className="gantt__lane">
                {groups.map((g) => (
                  <span key={g.label} style={{ gridColumn: `${col(g.from)} / ${col(g.to) + 1}` }}>
                    {g.label}
                  </span>
                ))}
              </span>
            </Reveal>
          )}
          <Reveal i={3} className="gantt__row gantt__units">
            <span>{axis.unit}</span>
            <span className="gantt__lane">
              {units.map((u) => (
                <span key={u}>{u}</span>
              ))}
            </span>
          </Reveal>
          {rows.map((r, i) => (
            <Reveal key={r.label} build i={i * 0.7 + 4} className={`gantt__row gantt__task${r.focus ? ' is-focus' : ''}`}>
              <span className="gantt__label">{r.label}</span>
              <span className="gantt__lane">
                <span className="gantt__bar" style={{ gridColumn: `${col(r.from)} / ${col(r.to) + 1}`, animationDelay: `${520 + i * 110}ms` }}>
                  {r.from === r.to ? r.from : `${r.from}–${r.to}`}
                </span>
              </span>
            </Reveal>
          ))}
        </div>
        {footnote && (
          <Reveal i={rows.length * 0.7 + 5} className="mx__foot">
            {footnote}
          </Reveal>
        )}
        <SlideFoot source={source} i={rows.length * 0.7 + 6} />
      </div>
    </section>
  )
}
