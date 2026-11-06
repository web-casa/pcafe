import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from '../../shared'

export interface ProgressCard {
  /** ≤ 10 CJK characters. */
  label: string
  /** 0–100, drives the bar and ring. */
  value: number
  /** Shown figure, ≤ 6 characters; defaults to `${value}%`. */
  display?: string
  /** ≤ 30 CJK characters. */
  note: string
}

export interface ProgressCardsProps extends SlideBase {
  /** 2–4 cards; each build step fills one card's bar and ring. */
  cards: ProgressCard[]
}

/** Cards that each carry a progress ring and bar; on its build step a card's ring and bar fill to the value. */
export function ProgressCards({ kicker, title, lead, cards, source, hint }: ProgressCardsProps) {
  return (
    <section className="slide">
      <Hint id="progresscards">{hint}</Hint>
      <div className="frame c3-frame">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="c3prog" style={{ gridTemplateColumns: `repeat(${cards.length}, minmax(0, 1fr))` }}>
          {cards.map((c, i) => (
            <Reveal key={i} i={3 + i} className="c3prog__slot">
              <div className="c3prog__card" data-build="" style={vars({ '--v': Math.max(0, Math.min(100, c.value)) })}>
                <svg className="c3prog__ring" viewBox="0 0 120 120" aria-hidden>
                  <circle cx="60" cy="60" r="52" pathLength={100} />
                  <circle cx="60" cy="60" r="52" pathLength={100} />
                </svg>
                <b>{c.display ?? `${c.value}%`}</b>
                <h3>{c.label}</h3>
                <div className="c3prog__bar" aria-hidden>
                  <i />
                </div>
                <p>{c.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
