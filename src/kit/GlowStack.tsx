import { Reveal } from '../deck/primitives'
import { Icon } from './Icon'
import type { Spot } from './parts'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from './shared'

export interface GlowStackProps extends SlideBase {
  /** The card in focus. */
  front: {
    /** Mono caption, ≤ 12 characters. */
    label: string
    /** ≤ 14 CJK characters. */
    title: string
    /** 2–4 lines, each ≤ 20 CJK characters. */
    items: string[]
  }
  /** The card behind it, blurred: what comes before or after. Title ≤ 14 CJK characters. */
  back: { label: string; title: string }
  /** Glow colour under the cards. Defaults to 4 (violet). */
  spot?: Spot
}

/** One card in focus with a blurred card behind it and a colour glow underneath: "this one now, that one next". */
export function GlowStack({ kicker, title, lead, source, hint, front, back, spot = 4 }: GlowStackProps) {
  return (
    <section className="slide">
      <Hint id="glowstack">{hint}</Hint>
      <div className="frame s-glow">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="glow" style={vars({ '--g': `var(--spot-${spot})` })}>
          <i className="glow__light" aria-hidden />
          <Reveal i={3} className="glow__back">
            <span>{back.label}</span>
            <b>{back.title}</b>
          </Reveal>
          <Reveal i={4} className="glow__front">
            <span>{front.label}</span>
            <b>{front.title}</b>
            <ul>
              {front.items.map((t) => (
                <li key={t}>
                  <Icon name="check" size={24} />
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
