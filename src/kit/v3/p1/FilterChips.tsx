import { Reveal } from '../../../deck/primitives'
import { Icon } from '../../Icon'
import type { IconName } from '../../icon-set'
import { Hint, SlideFoot, SlideHead, type SlideBase } from '../../shared'

export interface FilterCard {
  /** ≤ 12 个字符 or ≤ 8 字. */
  title: string
  /** ≤ 22 字. */
  desc?: string
  icon?: IconName
  /** Indexes of the chips this card belongs to. */
  in: number[]
}

export interface FilterChipsProps extends SlideBase {
  /** 2–6 chips, each ≤ 6 字. With build: 'focus' each → selects the next chip. */
  chips: string[]
  /** 4–12 cards (4 per row). */
  cards: FilterCard[]
  /** Chip selected when fully built; -1 = none, all cards lit. Default -1. */
  active?: number
}

/** A row of filter chips over a card grid; each step selects a chip, its cards stay lit and the rest fade. */
export function FilterChips({ kicker, title, lead, chips, cards, active = -1, source, hint }: FilterChipsProps) {
  return (
    <section className="slide">
      <Hint id="filterchips">{hint}</Hint>
      <div className="frame d1-frame">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className={`d1chip${active >= 0 ? ` is-k${active}` : ''}`}>
          <div className="d1chip__row">
            {chips.map((c, i) => (
              <span key={i} className={`d1chip__chip${i === active ? ' is-on' : ''}`} data-k={i} data-build="">
                <i aria-hidden />
                {c}
                <em>{cards.filter((x) => x.in.includes(i)).length}</em>
              </span>
            ))}
          </div>
          <div className={`d1chip__grid${cards.length > 8 ? ' is-dense' : ''}`}>
            {cards.map((c, i) => (
              <div key={i} className="d1chip__card" data-in={c.in.map((k) => `k${k}`).join(' ')}>
                {c.icon && <Icon name={c.icon} size={30} />}
                <h3>{c.title}</h3>
                {c.desc && <p>{c.desc}</p>}
              </div>
            ))}
          </div>
        </Reveal>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
