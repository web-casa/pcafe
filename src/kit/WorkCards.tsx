import { Reveal } from '../deck/primitives'
import type { IconName } from './Icon'
import { IconTile, type Spot } from './parts'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from './shared'

export interface WorkCard {
  /** ≤ 12 CJK characters. */
  title: string
  /** Outlined pill, bottom-left, ≤ 8 CJK characters. */
  tag: string
  /** Background spot colour. */
  spot?: Spot
  icon?: IconName
  /** A real screenshot, or a `decor-` illustration (decoration only). */
  src?: string
  alt?: string
}

export interface WorkCardsProps extends SlideBase {
  /** 3–4 cards. */
  cards: WorkCard[]
}

/** Portfolio-style cards: a big colour block each, an icon or image in the middle, a pill tag in the corner. */
export function WorkCards({ kicker, title, lead, source, hint, cards }: WorkCardsProps) {
  return (
    <section className="slide">
      <Hint id="work">{hint}</Hint>
      <div className="frame s-work">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="work" style={vars({ '--n': cards.length })}>
          {cards.map((c, i) => {
            const spot = c.spot ?? (((i % 5) + 1) as Spot)
            return (
              <Reveal key={c.title} build i={3 + i * 0.5} className={`work__card work__card--s${spot}`}>
                <h3>{c.title}</h3>
                <div className="work__art">{c.src ? <img src={c.src} alt={c.alt ?? ''} draggable={false} /> : c.icon && <IconTile icon={c.icon} spot={6} size={150} />}</div>
                <span className="work__tag">{c.tag}</span>
              </Reveal>
            )
          })}
        </div>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
