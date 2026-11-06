import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot, SlideHead, type SlideBase } from '../../shared'

export type TrainState = 'eol' | 'supported' | 'current' | 'beta' | 'dev'

export interface TrainRow {
  /** Version name, ≤ 10 个字符. */
  version: string
  /** 'YYYY-MM' the bar starts. */
  from: string
  /** 'YYYY-MM' the bar ends; omit for an open-ended line (development branch). */
  until?: string
  state: TrainState
  /** Second line under the version, e.g. dates, ≤ 20 个字符. */
  note?: string
  /** Mark the end as an estimate (dashed end cap). */
  estimate?: boolean
}

export interface ReleaseTrainProps extends SlideBase {
  /** 3–6 rows, oldest first. Each row is one build step. */
  rows: TrainRow[]
  /** Visible range, 'YYYY-MM'. */
  start: string
  end: string
  /** Vertical “today” line, 'YYYY-MM'. */
  today?: string
  /** ≤ 8 字. Default '今天'. */
  todayLabel?: string
  /** Chip text per state, ≤ 4 字 each. */
  stateLabels?: Partial<Record<TrainState, string>>
}

const LABELS: Record<TrainState, string> = { eol: '已停止', supported: '维护中', current: '最新版', beta: '测试版', dev: '开发中' }
const month = (s: string) => {
  const [y, m] = s.split('-').map(Number)
  return y * 12 + (m - 1)
}

/** Release lifecycle lanes: one bar per version from release to end of life, a “today” line and a state chip per row. */
export function ReleaseTrain({ kicker, title, lead, rows, start, end, today, todayLabel = '今天', stateLabels, source, hint }: ReleaseTrainProps) {
  const a = month(start)
  const b = month(end) + 1
  const pos = (s: string) => ((month(s) - a) / (b - a)) * 100
  const years: number[] = []
  for (let y = Math.ceil(a / 12); y * 12 < b; y++) years.push(y)
  const labels = { ...LABELS, ...stateLabels }
  return (
    <section className="slide">
      <Hint id="releasetrain">{hint}</Hint>
      <div className="frame d1-frame">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className="d1train">
          <div className="d1train__axis">
            <span />
            <div className="d1train__track">
              {years.map((y) => (
                <span key={y} className="d1train__year" style={{ left: `${((y * 12 - a) / (b - a)) * 100}%` }}>
                  {y}
                </span>
              ))}
            </div>
          </div>
          <div className="d1train__rows">
            <div className="d1train__grid" aria-hidden>
              <span />
              <div className="d1train__track">
                {years.map((y) => (
                  <i key={y} style={{ left: `${((y * 12 - a) / (b - a)) * 100}%` }} />
                ))}
                {today && <i className="d1train__today" style={{ left: `${pos(today)}%` }} />}
              </div>
            </div>
            {rows.map((r, i) => {
              const l = Math.max(0, pos(r.from))
              const rgt = r.until ? Math.min(100, ((month(r.until) + 1 - a) / (b - a)) * 100) : 100
              return (
                <div key={i} className={`d1train__row is-${r.state}`} data-build="">
                  <div className="d1train__label">
                    <b>{r.version}</b>
                    <span className="d1train__chip">{labels[r.state]}</span>
                    {r.note && <small>{r.note}</small>}
                  </div>
                  <div className="d1train__track">
                    <span className={`d1train__bar${r.until ? '' : ' is-open'}${r.estimate ? ' is-est' : ''}`} style={{ left: `${l}%`, width: `${rgt - l}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
          {today && (
            <div className="d1train__axis">
              <span />
              <div className="d1train__track">
                <span className="d1train__tlabel" style={{ left: `${pos(today)}%` }}>
                  {todayLabel} · {today}
                </span>
              </div>
            </div>
          )}
        </Reveal>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
