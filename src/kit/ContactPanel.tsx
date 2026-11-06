import type { ReactNode } from 'react'
import { Kicker, Reveal } from '../deck/primitives'
import { Icon, type IconName } from './Icon'
import { Hint, Lines, type Text } from './shared'

export interface ContactPanelProps {
  kicker: string
  /** ≤ 2 lines × 10 CJK characters. */
  title: Text
  /** ≤ 50 CJK characters. */
  lead?: string
  /** 2–3 promises with a check, ≤ 18 CJK characters each. */
  checks?: string[]
  /** 2–4 ways to reach you or the next step: label ≤ 8, value ≤ 28 characters. Real addresses only. */
  fields: { icon: IconName; label: string; value: string }[]
  /** Text on the bar at the bottom of the card, ≤ 14 CJK characters. */
  action: string
  hint?: ReactNode
}

/** A closing slide: a dark card with the offer on the left and a white contact card on the right. */
export function ContactPanel({ kicker, title, lead, checks = [], fields, action, hint }: ContactPanelProps) {
  return (
    <section className="slide">
      <Hint id="contact">{hint}</Hint>
      <div className="frame s-contact">
        <div className="contact" data-tone="dark">
          <div className="contact__copy">
            <Reveal i={0}>
              <Kicker>{kicker}</Kicker>
            </Reveal>
            <Reveal i={1}>
              <h2 className="contact__title s-title">
                <Lines text={title} />
              </h2>
            </Reveal>
            {lead && (
              <Reveal i={2} className="contact__lead">
                {lead}
              </Reveal>
            )}
            {checks.length > 0 && (
              <Reveal i={3} className="contact__checks">
                {checks.map((c) => (
                  <span key={c}>
                    <Icon name="check" size={24} />
                    {c}
                  </span>
                ))}
              </Reveal>
            )}
          </div>
          <Reveal i={3} y={18} className="contact__card-wrap">
            <div className="contact__card" data-tone="light">
              {fields.map((f, i) => (
                <Reveal key={f.label} build i={i * 0.5 + 4} className="contact__field">
                  <span>
                    <Icon name={f.icon} size={24} />
                    {f.label}
                  </span>
                  <b>{f.value}</b>
                </Reveal>
              ))}
              <div className="contact__action">
                {action}
                <span className="arrow">→</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
