import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from '../../shared'

export interface StackCard {
  /** Big label, ≤ 6 characters (a year, a number). */
  mark: string
  /** ≤ 10 CJK characters. */
  title: string
  /** ≤ 44 CJK characters. */
  body: string
}

export interface CardStackProps extends SlideBase {
  /** 3–4 cards. They start as one pile; each build step pushes the next card out into the row. */
  cards: StackCard[]
}

/** A pile of cards: each build step slides the next card out of the stack into its own place in the row. */
export function CardStack({ kicker, title, lead, cards, source, hint }: CardStackProps) {
  return (
    <section className="slide">
      <Hint id="cardstack">{hint}</Hint>
      <div className="frame c3-frame">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className="c3stack" style={vars({ '--n': cards.length })}>
          {cards.map((c, i) => (
            <div key={i} className="c3stack__card" data-build="" style={vars({ '--k': i, '--z': cards.length - i })}>
              <div className="c3stack__inner">
                <b>{c.mark}</b>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </div>
            </div>
          ))}
        </Reveal>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
