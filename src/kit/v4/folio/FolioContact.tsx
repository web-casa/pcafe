import { useState } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint } from '../../shared'
import type { PhotoImage } from '../../v2/p1/img'
import { FolioRail, type FolioFrame } from './parts'

export interface FolioContactProps {
  /** Mono line, ≤ 20 个字符. */
  kicker: string
  /** ≤ 8 字. */
  title: string
  /** Grey line, ≤ 10 字. */
  sub?: string
  /** 3–4 questions; question ≤ 16 字, answer ≤ 48 字. */
  faqs: { q: string; a: string }[]
  /** The booking card on the rail. */
  card: {
    avatar: PhotoImage
    /** ≤ 8 字. */
    name: string
    /** e.g. "30 分钟 · 视频", ≤ 14 字. */
    note?: string
    /** Status beside the green dot, ≤ 8 字. */
    status?: string
    /** Day line above the slots, ≤ 14 字. */
    day?: string
    /** 3–6 times, each ≤ 5 个字符. */
    slots: string[]
    /** Button, ≤ 8 字. */
    cta: string
    /** Email or handle under the button, ≤ 26 个字符. */
    mail?: string
  }
  /** 1–2 pictures around the card. */
  frames: FolioFrame[]
  /** Small line along the foot, ≤ 24 字. */
  foot?: string
  hint?: string
}

/** A closing page: an accordion of common questions on the left and a booking card on the rail where a time can be picked. */
export function FolioContact({ kicker, title, sub, faqs, card, frames, foot, hint }: FolioContactProps) {
  const [open, setOpen] = useState(0)
  const [slot, setSlot] = useState(0)
  const past = frames.slice(0, 2)
  return (
    <section className="slide fo">
      <Hint id="foliocontact">{hint}</Hint>
      <div className="fo-side">
        <div className="fo-body">
          <Reveal i={0} className="fo-k">
            {kicker}
          </Reveal>
          <Reveal i={1}>
            <h2 className="fo-h2">
              {title}
              {sub && <span>{sub}</span>}
            </h2>
          </Reveal>
          <ul className="fo-faq">
            {faqs.slice(0, 4).map((f, i) => (
              <Reveal i={2 + i * 0.5} y={12} key={f.q}>
                <li className={i === open ? 'is-on' : ''} onClick={() => setOpen(i === open ? -1 : i)}>
                  <div className="fo-faq__q">
                    <b>{f.q}</b>
                    <i aria-hidden="true">+</i>
                  </div>
                  <div className="fo-faq__a" data-crop>
                    <p>{f.a}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
        {foot && (
          <Reveal i={6} className="fo-tags is-quiet">
            {foot}
          </Reveal>
        )}
      </div>
      <FolioRail frames={past} focus={1} height={700} slotAt={1}>
        <div className="fo-book">
          <div className="fo-book__who">
            <img src={card.avatar.src} alt={card.avatar.alt} draggable={false} />
            <span>
              <b>{card.name}</b>
              {card.note && <small>{card.note}</small>}
            </span>
            {card.status && (
              <em>
                <i />
                {card.status}
              </em>
            )}
          </div>
          {card.day && <div className="fo-book__day">{card.day}</div>}
          <div className="fo-book__slots">
            {card.slots.slice(0, 6).map((s, i) => (
              <button type="button" key={s} className={i === slot ? 'is-on' : ''} onClick={() => setSlot(i)}>
                {s}
              </button>
            ))}
          </div>
          <span className="fo-btn is-accent is-wide">
            {card.cta} · {card.slots[slot]}
            <i>→</i>
          </span>
          {card.mail && <div className="fo-book__mail">{card.mail}</div>}
        </div>
      </FolioRail>
    </section>
  )
}
