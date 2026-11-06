import type { ReactNode } from 'react'
import { Kicker, Reveal } from '../deck/primitives'
import { Icon, type IconName } from './Icon'
import { Hint, Lines, type Text } from './shared'

export interface ThanksProps {
  kicker: string
  /** ≤ 2 lines × 8 CJK characters, e.g. '谢谢'. */
  title: Text
  /** What you want questions about, ≤ 40 CJK characters. */
  prompt?: string
  /** 2–4 real ways to follow up: label ≤ 6, value ≤ 32 characters. */
  contacts: { icon: IconName; label: string; value: string }[]
  /** Optional QR code image (a real one) with a ≤ 10 character caption. */
  qr?: { src: string; label: string }
  hint?: ReactNode
}

/** The last slide: thanks, an invitation to ask, and how to follow up. */
export function Thanks({ kicker, title, prompt, contacts, qr, hint }: ThanksProps) {
  return (
    <section className="slide">
      <Hint id="thanks">{hint}</Hint>
      <div className="frame s-thanks">
        <div className="thanks__copy">
          <Reveal i={0}>
            <Kicker>{kicker}</Kicker>
          </Reveal>
          <Reveal i={1} y={30}>
            <h2 className="thanks__title close__statement">
              <Lines text={title} />
            </h2>
          </Reveal>
          {prompt && (
            <Reveal i={2} className="thanks__prompt">
              <Icon name="chat" size={30} tone="accent" />
              {prompt}
            </Reveal>
          )}
        </div>
        <div className="thanks__side">
          <ul className="thanks__contacts">
            {contacts.map((c, i) => (
              <Reveal key={c.label} i={i * 0.6 + 3} className="thanks__contact">
                <Icon name={c.icon} size={32} />
                <span>{c.label}</span>
                <b>{c.value}</b>
              </Reveal>
            ))}
          </ul>
          {qr && (
            <Reveal i={6} className="thanks__qr">
              <img src={qr.src} alt="" draggable={false} />
              <span>{qr.label}</span>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}
