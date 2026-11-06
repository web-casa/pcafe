import { Reveal } from '../deck/primitives'
import type { IconName } from './Icon'
import { IconTile } from './parts'
import { Hint } from './shared'

export interface PixelClosingProps {
  /** Latin words in the pixel face, ≤ 10 characters, e.g. "LET'S TALK". */
  big: string
  /** Text on the striped button block, ≤ 10 CJK characters. */
  action: string
  /** ≤ 40 CJK characters. */
  sub?: string
  /** 0–3 contact lines: label ≤ 6, value ≤ 24 characters. */
  contacts?: { label: string; value: string }[]
  /** A `decor-` mascot illustration (decoration only); an icon tile stands in when absent. */
  mascot?: { src: string; alt: string }
  /** Icon for the stand-in tile. */
  icon?: IconName
  hint?: string
}

/** Closing page: giant pixel words, a striped block holding a button-like call to action, an optional mascot. */
export function PixelClosing({ big, action, sub, contacts = [], mascot, icon = 'chat', hint }: PixelClosingProps) {
  return (
    <section className="slide">
      <Hint id="pixel">{hint}</Hint>
      <div className="frame s-pixel">
        <Reveal i={0} className="pixel__mascot">
          {mascot ? <img src={mascot.src} alt={mascot.alt} draggable={false} /> : <IconTile icon={icon} spot={5} size={150} />}
        </Reveal>
        <Reveal i={1}>
          <h2 className="pixel__big" lang="en">
            {big}
          </h2>
        </Reveal>
        <Reveal i={2} className="pixel__block">
          <span className="pixel__btn">
            {action}
            <span className="arrow">→</span>
          </span>
        </Reveal>
        {sub && (
          <Reveal i={3} className="pixel__sub">
            {sub}
          </Reveal>
        )}
        {contacts.length > 0 && (
          <Reveal i={4} className="pixel__contacts">
            {contacts.map((c) => (
              <span key={c.label}>
                <em>{c.label}</em>
                {c.value}
              </span>
            ))}
          </Reveal>
        )}
      </div>
    </section>
  )
}
