import { Reveal } from '../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from './shared'

/** Dates are ISO strings: '2025-08-09'. */
export interface TimelineSegment {
  from: string
  to: string
  /** Text inside the bar. Keep it shorter than the bar: ≤ 6 CJK characters for a one-year bar. */
  label?: string
  /** ink = primary phase, accent = the phase you want to call attention to. */
  tone: 'ink' | 'accent'
}

export interface TimelineRow {
  name: string
  /** Secondary serif-italic name, e.g. a codename. */
  code?: string
  /** Back-to-back phases. Their boundaries are labelled with dates automatically. */
  segments: TimelineSegment[]
  /** Mark every date after the first as "计划" (planned). */
  planned?: boolean
}

export interface TimelineProps extends SlideBase {
  /** Visible range. Pad half a year either side of the earliest/latest date. */
  axis: { from: string; to: string }
  /** 1–3 rows. */
  rows: TimelineRow[]
  /** Legend text per tone. */
  legend: { ink: string; accent: string }
  /** Draw a "today" rule and hatch the past. Defaults to true. */
  today?: boolean
  /** Up to 3 live countdowns under the chart, counted in months from the viewer's clock. Use with ≤ 2 rows. */
  countdowns?: { label: string; until: string; note?: string }[]
}

const t = (iso: string) => Date.parse(`${iso}T00:00:00Z`)
const fmt = (ms: number) => new Date(ms).toISOString().slice(0, 10).replaceAll('-', '.')
const monthsUntil = (until: number, now: number) => Math.floor((until - now) / (30.4375 * 864e5))

/** Phases on a shared calendar axis: support windows, roadmaps, contract terms. */
export function Timeline({ kicker, title, lead, source, hint, axis, rows, legend, today = true, countdowns }: TimelineProps) {
  const a0 = t(axis.from)
  const a1 = t(axis.to)
  const pos = (ms: number) => ((ms - a0) / (a1 - a0)) * 100
  const now = Date.now()
  const nowPos = today && now > a0 && now < a1 ? pos(now) : null

  const y0 = new Date(a0).getUTCFullYear() + (new Date(a0).getUTCMonth() > 0 ? 1 : 0)
  const y1 = new Date(a1).getUTCFullYear()
  const years = Array.from({ length: y1 - y0 + 1 }, (_, k) => y0 + k)

  return (
    <section className="slide">
      <Hint id="timeline">{hint}</Hint>
      <div className="frame s-life">
        <SlideHead
          kicker={kicker}
          title={title}
          lead={lead}
          aside={
            <ul className="legend">
              <li className="is-security">{legend.ink}</li>
              <li className="is-lts">{legend.accent}</li>
              {nowPos !== null && <li className="is-elapsed">已过去的时间</li>}
            </ul>
          }
        />

        <Reveal i={3} className="life__chart">
          <div className="life__years" aria-hidden>
            {years.map((y) => (
              <span key={y} style={vars({ '--f': pos(Date.UTC(y, 0, 1)) / 100 })}>
                {y}
              </span>
            ))}
          </div>
          {rows.map((r, ri) => {
            const marks = [...new Set(r.segments.flatMap((s) => [t(s.from), t(s.to)]))].sort((x, y) => x - y)
            return (
              <div className="life__row" key={r.name}>
                <div className="life__name">
                  <b>{r.name}</b>
                  {r.code && <span>{r.code}</span>}
                </div>
                <div className="life__track">
                  {r.segments.map((s, si) => (
                    <span
                      key={si}
                      className={`life__seg${s.tone === 'accent' ? ' is-lts' : ''}`}
                      style={vars({ '--a': `${pos(t(s.from))}%`, '--b': `${pos(t(s.to))}%`, '--i': ri * 2 + si })}
                    >
                      {s.label}
                    </span>
                  ))}
                  {marks.map((ms, k) => (
                    <span key={ms} className={`life__date${k === marks.length - 1 ? ' is-end' : ''}`} style={vars({ '--x': `${pos(ms)}%` })}>
                      {fmt(ms)}
                      {r.planned && k > 0 ? ' 计划' : ''}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
          {nowPos !== null && (
            <>
              <span className="life__elapsed" style={vars({ '--f': nowPos / 100 })} aria-hidden />
              <div className="life__today" style={vars({ '--f': nowPos / 100 })} aria-label={`今天 ${fmt(now)}`}>
                <span className="life__today-tag">今天 · {fmt(now)}</span>
              </div>
            </>
          )}
        </Reveal>

        {countdowns && (
          <dl className="life__stats">
            {countdowns.map((c, i) => {
              const months = monthsUntil(t(c.until), now)
              return (
                <Reveal key={c.label} build i={i + 4} className="life__stat">
                  <dt>{c.label}</dt>
                  <dd className="life__stat-value">
                    {months > 0 ? (
                      <>
                        {months}
                        <small>个月</small>
                      </>
                    ) : (
                      '已结束'
                    )}
                  </dd>
                  {c.note && <dd className="life__stat-note">{c.note}</dd>}
                </Reveal>
              )
            })}
          </dl>
        )}

        <SlideFoot source={source} i={7} />
      </div>
    </section>
  )
}
