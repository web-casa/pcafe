import { Reveal } from '../../../deck/primitives'
import { Hint, Lines, SlideFoot, type Text } from '../../shared'
import { Photo, type PhotoImage } from '../../v2/p1/img'

export interface LedgerRow {
  /** ≤ 6 字. */
  title: string
  /** ≤ 26 字. */
  body: string
}

export interface ServiceLedgerProps {
  kicker: string
  /** 1 line, ≤ 8 字. */
  title: Text
  /** 3–5 rows, each a build step with `build: 'reveal'`. */
  rows: LedgerRow[]
  /** Tall picture at the right with an optional caption pill ≤ 10 字. */
  image: PhotoImage
  caption?: string
  source?: string
  hint?: string
}

/** What you do, as a ruled ledger: accent numbers, a service name and one line each; a tall photo at the right. Made for `monograph`, works in any style. */
export function ServiceLedger({ kicker, title, rows, image, caption, source, hint }: ServiceLedgerProps) {
  return (
    <section className="slide">
      <Hint id="serviceledger">{hint}</Hint>
      <div className="frame mg-led">
        <div className="mg-led__l">
          <Reveal i={0} className="mg-k">
            {kicker}
          </Reveal>
          <h2 className="mg-title">
            <span className="mg-lines">
              <Lines text={title} />
            </span>
          </h2>
          <ol className="mg-led__rows">
            {rows.map((r, i) => (
              <Reveal key={r.title} i={3 + i} build>
                <li>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  <b>{r.title}</b>
                  <small>{r.body}</small>
                </li>
              </Reveal>
            ))}
          </ol>
          <SlideFoot source={source} />
        </div>
        <div className="mg-led__img">
          <Photo image={image} />
          {caption && <span className="mg-cap">{caption}</span>}
        </div>
      </div>
    </section>
  )
}
