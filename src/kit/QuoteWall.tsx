import { Reveal } from '../deck/primitives'
import { Hint, SlideFoot, SlideHead, type SlideBase } from './shared'

export interface WallQuote {
  /** The exact words, without quotation marks. Focus quote ≤ 50, others ≤ 40 CJK characters. */
  text: string
  /** Who said it: person or organisation, ≤ 16 characters. */
  who: string
  /** Where: document, page or occasion, ≤ 24 characters. */
  where?: string
  /** Mono chip, ≤ 12 characters: the topic it settles. */
  tag?: string
}

export interface QuoteWallProps extends SlideBase {
  /** 3 or 5 quotes. The first is the large one. Quote verbatim and name the source in `source`. */
  quotes: WallQuote[]
}

/** Several short verbatim quotes: one large, the rest in a grid. For customer voices or what the authorities actually say. */
export function QuoteWall({ kicker, title, lead, source, hint, quotes }: QuoteWallProps) {
  return (
    <section className="slide">
      <Hint id="quotes">{hint}</Hint>
      <div className="frame s-wall">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className={`wall wall--${quotes.length > 3 ? 5 : 3}`}>
          {quotes.map((q, i) => (
            <Reveal key={q.text} build i={i * 0.6 + 3} className={`wall__card${i === 0 ? ' is-focus' : ''}`}>
              <blockquote>{q.text}</blockquote>
              <footer>
                <b>{q.who}</b>
                {q.where && <span>{q.where}</span>}
                {q.tag && <code>{q.tag}</code>}
              </footer>
            </Reveal>
          ))}
        </div>
        <SlideFoot source={source} i={9} />
      </div>
    </section>
  )
}
