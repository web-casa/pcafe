import { Reveal } from '../../../deck/primitives'
import { Hint, Lines, SlideFoot, type Text } from '../../shared'
import { Photo, type PhotoImage } from '../../v2/p1/img'

export interface ProcessRow {
  /** ≤ 8 字. */
  title: string
  /** ≤ 26 字. */
  body: string
  /** How long, ≤ 6 字, e.g. '第 1 周'. */
  time?: string
}

export interface ProcessQuoteProps {
  kicker: string
  /** ≤ 2 lines × 8 字. */
  title: Text
  /** 3–5 numbered rows; each is a build step with `build: 'reveal'`. */
  steps: ProcessRow[]
  /** Tall portrait at the right. */
  portrait: PhotoImage
  /** Rating pill on the portrait, ≤ 14 个字符, e.g. '5.0 · 40+ 位客户'. */
  rating?: string
  /** Quote card on the portrait: text ≤ 48 字, by ≤ 6 字, role ≤ 14 字. */
  quote: { text: string; by: string; role?: string }
  source?: string
  hint?: string
}

/** How you work as numbered rows with timings, beside a client portrait carrying a rating pill and a quote card. Made for `atelier`, works in any style. */
export function ProcessQuote({ kicker, title, steps, portrait, rating, quote, source, hint }: ProcessQuoteProps) {
  return (
    <section className="slide">
      <Hint id="processquote">{hint}</Hint>
      <div className="frame at-proc">
        <div className="at-proc__l">
          <Reveal i={0} className="at-pill is-dot">
            {kicker}
          </Reveal>
          <Reveal i={1}>
            <h2 className="at-title">
              <Lines text={title} />
            </h2>
          </Reveal>
          <ol className="at-rows">
            {steps.map((s, i) => (
              <Reveal key={s.title} i={3 + i} build>
                <li>
                  <span className="at-rows__n">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <b>{s.title}</b>
                    <small>{s.body}</small>
                  </div>
                  {s.time && <em>{s.time}</em>}
                </li>
              </Reveal>
            ))}
          </ol>
          <SlideFoot source={source} />
        </div>
        <div className="at-proc__r">
          <Photo image={portrait} />
          {rating && (
            <Reveal i={6} className="at-rating">
              <span>★★★★★</span>
              {rating}
            </Reveal>
          )}
          <Reveal i={7} y={30} className="at-quote">
            <p>“{quote.text}”</p>
            <div>
              <i>{quote.by.slice(0, 1)}</i>
              <span>
                <b>{quote.by}</b>
                {quote.role && <small>{quote.role}</small>}
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
