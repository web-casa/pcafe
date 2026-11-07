import { Numeral, Reveal } from '../../../deck/primitives'
import { Hint, Lines, type Text } from '../../shared'
import { Photo, type PhotoImage } from '../../v2/p1/img'

export interface ProofMosaicProps {
  kicker?: string
  /** 1 line ≤ 10 字. */
  title: Text
  /** The big dark card: quote ≤ 48 字, name ≤ 6 字, role ≤ 16 个字符, portrait (person in the upper half). */
  quote: { text: string; name: string; role: string; image: PhotoImage }
  /** The sun-coloured figure: value ≤ 7 个字符, label ≤ 2 lines × 6 字. */
  stat: { value: string; label: Text }
  /** Exactly 2 short quotes: text ≤ 30 字, name ≤ 4 字, role ≤ 16 个字符, and an optional result (value ≤ 6 个字符, label ≤ 8 字). */
  items: { text: string; name: string; role: string; face?: PhotoImage; result?: { value: string; label: string } }[]
  /** Star rating shown on the small cards, 1–5. */
  stars?: number
  source?: string
  hint?: string
}

/** Social proof as a mosaic: one big dark quote with a portrait, a sun-yellow headline figure, and two short quotes that each carry a measured result. Made for `sunrise`, works in any style. */
export function ProofMosaic({ kicker, title, quote, stat, items, stars = 5, source, hint }: ProofMosaicProps) {
  return (
    <section className="slide">
      <Hint id="proofmosaic">{hint}</Hint>
      <div className="sr-sun is-soft" aria-hidden="true" />
      <div className="frame sr-proof">
        <div className="sr-center">
          {kicker && (
            <Reveal i={0} className="sr-kick">
              ◆ {kicker}
            </Reveal>
          )}
          <Reveal i={1}>
            <h2 className="sr-title">
              <Lines text={title} />
            </h2>
          </Reveal>
        </div>
        <div className="sr-proof__grid">
          <Reveal i={2} y={40} className="sr-bigq">
            <div className="sr-bigq__tx">
              <i className="sr-bigq__mark" aria-hidden="true">
                “
              </i>
              <p>{quote.text}</p>
              <div className="sr-by">
                <b>{quote.name}</b>
                {quote.role}
              </div>
            </div>
            <div className="sr-bigq__ph">
              <Photo image={quote.image} />
            </div>
          </Reveal>
          <div className="sr-proof__side">
            <Reveal i={3} y={30} className="sr-stat">
              <b>
                <Numeral text={stat.value} delay={0.7} />
              </b>
              <span>
                <Lines text={stat.label} />
              </span>
            </Reveal>
            {items.slice(0, 2).map((it, i) => (
              <Reveal key={it.name} i={4 + i} y={30} className="sr-q">
                <div className="sr-q__top">
                  <span className="sr-stars" aria-label={`${stars} / 5`}>
                    {'★★★★★'.slice(0, Math.max(1, Math.min(5, stars)))}
                  </span>
                  {it.result && (
                    <span className="sr-q__res">
                      <b>{it.result.value}</b>
                      {it.result.label}
                    </span>
                  )}
                </div>
                <p>“{it.text}”</p>
                <div className="sr-q__by">
                  {it.face && <img src={it.face.src} alt={it.face.alt} />}
                  <span>
                    <b>{it.name}</b>
                    {it.role}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        {source && <small className="sr-src-note">{source}</small>}
      </div>
    </section>
  )
}
