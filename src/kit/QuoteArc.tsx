import { Reveal } from '../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from './shared'

export interface ArcQuote {
  /** Verbatim, ≤ 48 CJK characters. */
  text: string
  /** ≤ 12 characters. */
  name: string
  /** Where it was said or written, ≤ 20 CJK characters. */
  role: string
}

export interface QuoteArcProps extends SlideBase {
  /** Exactly 3 quotes; the middle one stands in front. */
  quotes: [ArcQuote, ArcQuote, ArcQuote]
  source: string
}

/** Three quote cards on a curve, the middle one forward, the side ones turned in. */
export function QuoteArc({ kicker, title, lead, source, hint, quotes }: QuoteArcProps) {
  return (
    <section className="slide">
      <Hint id="quotearc">{hint}</Hint>
      <div className="frame s-quotearc">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="quotearc">
          {quotes.map((q, i) => (
            <Reveal key={q.name} build i={3 + (i === 1 ? 0 : 0.6)} className="quotearc__slot">
              <div className={`quotearc__card quotearc__card--${i}`} style={vars({ '--k': i })}>
                <span className="quotearc__mark" aria-hidden>
                  “
                </span>
                <p>{q.text}</p>
                <footer>
                  <b>{q.name}</b>
                  <span>{q.role}</span>
                </footer>
              </div>
            </Reveal>
          ))}
        </div>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
