import { Reveal } from '../deck/primitives'
import { MiniUI, type PanelUI } from './parts'
import { Hint, SlideFoot, SlideHead, type SlideBase } from './shared'

export interface PanelCard {
  /** Muted line above the title, ≤ 12 CJK characters. */
  eyebrow?: string
  /** ≤ 8 CJK characters. */
  title: string
  /** ≤ 24 CJK characters. Optional; the mini interface usually says enough. */
  body?: string
  /** The mini interface drawn in the card: list, figure, bars, progress, convert or chips. */
  ui: PanelUI
}

export interface PanelCardsProps extends SlideBase {
  /** 3 or 4 cards. */
  cards: PanelCard[]
}

/** Product capabilities as pale cards, each holding a small working piece of the interface. */
export function PanelCards({ kicker, title, lead, source, hint, cards }: PanelCardsProps) {
  return (
    <section className="slide">
      <Hint id="panels">{hint}</Hint>
      <div className="frame s-panels">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className={`panels panels--${cards.length}`}>
          {cards.map((c, i) => (
            <Reveal key={c.title} build i={i * 0.6 + 3} className="panel-card">
              <div className="panel-card__head">
                {c.eyebrow && <span>{c.eyebrow}</span>}
                <h3>{c.title}</h3>
                {c.body && <p>{c.body}</p>}
              </div>
              <div className="panel-card__ui">
                <MiniUI ui={c.ui} />
              </div>
            </Reveal>
          ))}
        </div>
        <SlideFoot source={source} i={9} />
      </div>
    </section>
  )
}
