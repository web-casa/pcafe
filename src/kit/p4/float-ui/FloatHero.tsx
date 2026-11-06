import type { ReactNode } from 'react'
import { Kicker, Reveal } from '../../../deck/primitives'
import { Icon, type IconName } from '../../Icon'
import { Hint, Lines, SlideFoot, type Text } from '../../shared'
import { Wave } from './Wave'

export interface FloatChip {
  icon: IconName
  /** ≤ 10 characters (CJK counts double). */
  label: string
}

export interface FloatHeroProps {
  /** 2–12 characters. */
  kicker: string
  /** 1–2 lines, ≤ 12 CJK characters each. */
  title: Text
  /** ≤ 48 CJK characters. */
  lead: string
  /** 4–6 chips floating around the headline, placed clockwise from top-left. */
  chips: FloatChip[]
  /** Small card under the lead: label ≤ 12 characters, text ≤ 22 CJK characters. */
  card: { label: string; text: string }
  source?: string
  hint?: ReactNode
}

/** A calm centred headline with small UI chips and a waveform card floating around it at slight angles. Opening or section page for a product, a tool, a voice/AI feature. */
export function FloatHero({ kicker, title, lead, chips, card, source, hint }: FloatHeroProps) {
  return (
    <section className="slide">
      <Hint id="floathero">{hint}</Hint>
      <div className="frame fh">
        <div className="fh__center">
          <Reveal i={0}>
            <Kicker>{kicker}</Kicker>
          </Reveal>
          <Reveal i={1}>
            <h1 className="s-title fh__title">
              <Lines text={title} />
            </h1>
          </Reveal>
          <Reveal i={2}>
            <p className="s-lead fh__lead">{lead}</p>
          </Reveal>
          <Reveal i={3} className="fh__card">
            <span className="fh__play" aria-hidden>
              <Icon name="user-speak" size={26} variant="bold" />
            </span>
            <div>
              <span className="fh__cardlabel">{card.label}</span>
              <b>{card.text}</b>
            </div>
            <Wave bars={28} played={0.55} />
          </Reveal>
        </div>
        {chips.map((c, i) => (
          <Reveal key={c.label} i={4 + i * 0.6} className={`fh__chip fh__chip--${i}`}>
            <span className="fu-chip">
              <span className="fu-chip__icon">
                <Icon name={c.icon} size={26} />
              </span>
              {c.label}
            </span>
          </Reveal>
        ))}
        <SlideFoot source={source} i={9} />
      </div>
    </section>
  )
}
