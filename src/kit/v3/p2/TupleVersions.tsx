import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from '../../shared'

export interface TupleVersion {
  /** Row contents, ≤ 20 characters, e.g. "balance = 100". */
  value: string
  /** Transaction that created this version. */
  xmin: number
  /** Transaction that deleted or replaced it; omit while it is live. */
  xmax?: number
}

export interface TupleSnapshot {
  /** Position on the transaction axis. */
  at: number
  /** ≤ 10 CJK characters, e.g. "事务 105 的快照". */
  label: string
}

export interface TupleVersionsProps extends SlideBase {
  /** 2–4 versions of one row, oldest first; each is a build step. */
  versions: TupleVersion[]
  /** 0–2 snapshots drawn as vertical lines; the versions they see are marked. Last build steps. */
  snapshots?: TupleSnapshot[]
  /** Axis range [first, last] transaction id. */
  range: [number, number]
  /** Axis caption, ≤ 12 CJK characters. */
  axis?: string
}

/** MVCC: versions of one row as spans on a transaction-id axis (xmin to xmax), with snapshots showing which version each reader sees. */
export function TupleVersions({ kicker, title, lead, source, hint, versions, snapshots = [], range, axis }: TupleVersionsProps) {
  const [a, b] = range
  const pct = (t: number) => ((t - a) / (b - a)) * 100
  const sees = (s: TupleSnapshot, v: TupleVersion) => v.xmin <= s.at && (v.xmax === undefined || v.xmax > s.at)
  const ticks = Array.from({ length: 5 }, (_, i) => Math.round(a + ((b - a) * i) / 4))
  return (
    <section className="slide">
      <Hint id="tupleversions">{hint}</Hint>
      <div className="frame t3">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className="t3-tv">
          <div className="t3-tv__plot">
            {versions.map((v, i) => (
              <div key={i} className="t3-tv__row" data-build>
                <span className="t3-tv__tag">v{i + 1}</span>
                <div className="t3-tv__track">
                  <div
                    className={`t3-tv__span${v.xmax === undefined ? ' is-live' : ''}`}
                    style={vars({ '--l': pct(v.xmin), '--r': v.xmax === undefined ? 100 : pct(v.xmax) })}
                  >
                    <b>{v.value}</b>
                    <small>
                      xmin {v.xmin} · xmax {v.xmax ?? '—'}
                    </small>
                  </div>
                </div>
              </div>
            ))}
            {snapshots.map((s, k) => (
              <div key={k} className="t3-tv__snap" style={vars({ '--l': pct(s.at) })} data-build>
                <span>{s.label}</span>
                <small>
                  看到 v{versions.findIndex((v) => sees(s, v)) + 1}
                </small>
              </div>
            ))}
          </div>
          <div className="t3-tv__axis">
            <span className="t3-tv__tag" aria-hidden />
            <div className="t3-tv__ticks">
              {ticks.map((t) => (
                <span key={t} style={vars({ '--l': pct(t) })}>
                  {t}
                </span>
              ))}
            </div>
          </div>
          {axis && <p className="t3-tv__cap">{axis}</p>}
        </Reveal>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
