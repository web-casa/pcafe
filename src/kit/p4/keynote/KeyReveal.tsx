import { Kicker, Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot, type Text } from '../../shared'
import { Marked } from './marks'

export interface KeyFact {
  /** ≤ 6 characters. */
  value: string
  /** ≤ 10 CJK characters. */
  label: string
}

export interface KeyRevealProps {
  /** Small gradient line above the headline, 2–12 characters. */
  kicker: string
  /** One enormous headline: ≤ 2 lines × 8 CJK characters; pass an array to break lines. */
  title: Text
  /** 0–2 substrings of `title` filled with the gradient. */
  marks?: string[]
  /** One quiet sub-line under the headline, ≤ 36 CJK characters. */
  sub?: string
  /** 0–3 small figures along the bottom. */
  facts?: KeyFact[]
  source?: string
  hint?: string
}

/** Launch-keynote reveal: one huge tight headline centred on a black canvas, gradient-filled hero words, a quiet sub-line, optional figures low down. */
export function KeyReveal({ kicker, title, marks, sub, facts = [], source, hint }: KeyRevealProps) {
  return (
    <section className="slide">
      <Hint id="keyreveal">{hint}</Hint>
      <div className="kn-halo" aria-hidden />
      <div className="frame s-kreveal">
        <div className="kreveal__main">
          <Reveal i={0}>
            <Kicker>{kicker}</Kicker>
          </Reveal>
          <Reveal i={1} y={40}>
            <h1 className="kreveal__title">
              <Marked text={title} marks={marks} wrap={(s, k) => <span key={k} className="kn-grad">{s}</span>} />
            </h1>
          </Reveal>
          {sub && (
            <Reveal i={3}>
              <p className="kreveal__sub">{sub}</p>
            </Reveal>
          )}
        </div>
        {facts.length > 0 && (
          <div className="kreveal__facts">
            {facts.map((f, i) => (
              <Reveal key={f.label} i={4 + i} build>
                <b>{f.value}</b>
                <span>{f.label}</span>
              </Reveal>
            ))}
          </div>
        )}
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
