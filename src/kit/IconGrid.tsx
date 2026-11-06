import { Reveal } from '../deck/primitives'
import { Icon, type IconName } from './Icon'
import { Hint, SlideFoot, SlideHead, type SlideBase } from './shared'

export interface IconCard {
  icon: IconName
  /** ≤ 8 CJK characters. */
  title: string
  /** 18–40 CJK characters. */
  body: string
  /** Mono chip in the top-right corner, ≤ 12 characters. */
  tag?: string
}

export interface IconGridProps extends SlideBase {
  /** 6 cards (3 × 2) or 8 cards (4 × 2). */
  items: IconCard[]
}

/** Parallel items as icon cards. Hovering a card lifts it and lights its icon. */
export function IconGrid({ kicker, title, lead, source, hint, items }: IconGridProps) {
  const cols = items.length > 6 ? 4 : 3
  return (
    <section className="slide">
      <Hint id="icongrid">{hint}</Hint>
      <div className="frame s-igrid">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="igrid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {items.map((it, i) => (
            <Reveal key={it.title} build i={i * 0.5 + 3} className="igrid__card">
              <div className="igrid__top">
                <span className="igrid__icon">
                  <Icon name={it.icon} size={44} />
                </span>
                {it.tag && <code>{it.tag}</code>}
              </div>
              <h3>{it.title}</h3>
              <p>{it.body}</p>
            </Reveal>
          ))}
        </div>
        <SlideFoot source={source} i={9} />
      </div>
    </section>
  )
}
