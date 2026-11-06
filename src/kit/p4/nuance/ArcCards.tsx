import { Kicker, Reveal } from '../../../deck/primitives'
import { Icon, type IconName } from '../../Icon'
import { Hint, Lines, SlideFoot, type SlideBase } from '../../shared'

export interface ArcCard {
  icon: IconName
  /** ≤ 8 CJK characters. */
  title: string
  /** 16–34 CJK characters. */
  text: string
}

export interface ArcCardsProps extends Omit<SlideBase, 'lead'> {
  /** Exactly 5 cards; the outer ones lean in, the middle one sits flat. */
  cards: [ArcCard, ArcCard, ArcCard, ArcCard, ArcCard]
}

/** A centred serif heading over five dark cards bent along a shallow arc, each with an icon in orange corner brackets: services, mechanisms, features of equal weight. */
export function ArcCards({ kicker, title, source, hint, cards }: ArcCardsProps) {
  return (
    <section className="slide">
      <Hint id="arccards">{hint}</Hint>
      <div className="frame narc">
        <div className="narc__head">
          <Reveal i={0}>
            <Kicker>{kicker}</Kicker>
          </Reveal>
          <Reveal i={1}>
            <h2 className="s-title narc__title">
              <Lines text={title} />
            </h2>
          </Reveal>
        </div>
        <div className="narc__row">
          {cards.map((c, k) => (
            <Reveal key={c.title} build i={3 + k * 0.5} className={`narc__slot narc__slot--${k}`}>
              <div className={`narc__card narc__card--${k}`}>
              <span className="narc__icon">
                <i aria-hidden />
                <Icon name={c.icon} size={34} />
              </span>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
