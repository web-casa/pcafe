import { Reveal } from '../deck/primitives'
import type { Spot } from './parts'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from './shared'

export interface DuoCard {
  /** ≤ 8 CJK characters. */
  name: string
  /** The big figure, ≤ 6 characters. */
  value: string
  /** Unit after the figure, ≤ 6 characters. */
  unit?: string
  /** ≤ 24 CJK characters. */
  note: string
  /** 3–5 lines, each ≤ 16 CJK characters. */
  items: string[]
}

export interface DuoCardsProps extends SlideBase {
  /** Exactly two. */
  cards: [DuoCard, DuoCard]
  /** Card colours. Defaults to orange (3) and violet (4). */
  spots?: [Spot, Spot]
}

/** Two solid colour cards side by side, each a big figure plus a dotted checklist: two plans, two options, two modes. */
export function DuoCards({ kicker, title, lead, source, hint, cards, spots = [3, 4] }: DuoCardsProps) {
  return (
    <section className="slide">
      <Hint id="duocards">{hint}</Hint>
      <div className="frame s-duo">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="duo">
          {cards.map((c, i) => (
            <Reveal key={c.name} build i={3 + i} className="duo__card" style={vars({ '--c': `var(--spot-${spots[i]})` })}>
              <span className="duo__name">{c.name}</span>
              <div className="duo__value">
                <b>{c.value}</b>
                {c.unit && <span>{c.unit}</span>}
              </div>
              <p>{c.note}</p>
              <ul>
                {c.items.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
