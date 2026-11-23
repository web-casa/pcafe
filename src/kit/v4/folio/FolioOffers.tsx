import { useState } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot } from '../../shared'
import { FolioRail, type FolioFrame } from './parts'

export interface FolioOffer {
  /** ≤ 6 字. */
  name: string
  /** ≤ 22 字. */
  note: string
  /** e.g. "¥28k", ≤ 6 个字符. */
  price: string
  /** Small suffix, e.g. "/ 月", ≤ 3 字. */
  unit?: string
}

export interface FolioOffersProps {
  /** Mono line, ≤ 20 个字符. */
  kicker: string
  /** ≤ 8 字. */
  title: string
  /** Grey line, ≤ 10 字. */
  sub?: string
  /** 2–4 ways to work together. */
  offers: FolioOffer[]
  /** Which offer starts picked. */
  picked?: number
  /** The dashed open slot on the rail. */
  slot: {
    /** ≤ 8 字. */
    title: string
    /** ≤ 18 字. */
    note?: string
    /** Button, ≤ 8 字. */
    cta: string
    /** Mono line above it, e.g. "05 / 05 · 档期开放", ≤ 18 个字符. */
    label?: string
  }
  /** 1–2 pictures above the slot (past work). */
  frames: FolioFrame[]
  /** Small line along the foot, ≤ 24 字. */
  foot?: string
  source?: string
  hint?: string
}

/** Ways to work together as a priced list; picking one writes it onto the dashed "your project here" slot that waits on the rail. */
export function FolioOffers({ kicker, title, sub, offers, picked = 0, slot, frames, foot, source, hint }: FolioOffersProps) {
  const [on, setOn] = useState(picked)
  const list = offers.slice(0, 4)
  const pick = list[on] ?? list[0]
  const past = frames.slice(0, 2)
  return (
    <section className="slide fo">
      <Hint id="foliooffers">{hint}</Hint>
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
          <ul className="fo-offers">
            {list.map((o, i) => (
              <Reveal i={2 + i * 0.6} y={12} key={o.name}>
                <li className={i === on ? 'is-on' : ''} onClick={() => setOn(i)}>
                  <em>{String(i + 1).padStart(2, '0')}</em>
                  <span>
                    <b>{o.name}</b>
                    <small>{o.note}</small>
                  </span>
                  <strong>
                    {o.price}
                    {o.unit && <small> {o.unit}</small>}
                  </strong>
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
        <SlideFoot source={source} />
      </div>
      <FolioRail frames={past} focus={past.length} height={724} slotAt={past.length}>
        <div className="fo-slot">
          {slot.label && <span className="fo-slot__label">{slot.label}</span>}
          <h3>{slot.title}</h3>
          {slot.note && <p>{slot.note}</p>}
          <span className="fo-slot__pick" key={on}>
            {pick.name} · {pick.price}
            {pick.unit ? ` ${pick.unit}` : ''}
          </span>
          <span className="fo-btn is-accent">
            {slot.cta}
            <i>→</i>
          </span>
        </div>
      </FolioRail>
    </section>
  )
}
