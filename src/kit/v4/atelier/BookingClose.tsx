import { useState } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint, Lines, type Text } from '../../shared'
import { type PhotoImage } from '../../v2/p1/img'

export interface BookingCloseProps {
  /** Status pill, ≤ 14 字. */
  badge: string
  /** ≤ 2 lines × 6 字. */
  title: Text
  /** ≤ 36 字. */
  lead?: string
  ctas?: [string, string?]
  /** 2 contacts: value ≤ 20 个字符, label ≤ 6 字. */
  contacts?: { value: string; label: string }[]
  /** The booking card. */
  card: {
    /** Host avatar (square crop of a face). */
    avatar?: PhotoImage
    /** ≤ 10 字. */
    name: string
    /** ≤ 14 字. */
    note?: string
    /** Status chip, ≤ 4 字. */
    status?: string
    /** Month line, ≤ 10 个字符. */
    month: string
    /** Day of week the first cell falls on, 0 = Monday. */
    offset?: number
    /** Number of days to show, 14–21. */
    days: number
    /** First day number shown. */
    from: number
    /** Days that can be picked (others are greyed). */
    open: number[]
    /** 3 time slots, each ≤ 5 个字符. */
    slots: string[]
  }
  hint?: string
}

const WEEK = ['一', '二', '三', '四', '五', '六', '日']

/** The ask with a live booking card: pick a day and a time slot right on the slide. Made for `atelier`, works in any style. */
export function BookingClose({ badge, title, lead, ctas, contacts = [], card, hint }: BookingCloseProps) {
  const [day, setDay] = useState(card.open[Math.min(1, card.open.length - 1)])
  const [slot, setSlot] = useState(Math.min(1, card.slots.length - 1))
  const cells = Array.from({ length: card.days }, (_, i) => card.from + i)
  return (
    <section className="slide">
      <Hint id="bookingclose">{hint}</Hint>
      <div className="frame at-book">
        <div className="at-book__l">
          <Reveal i={0} className="at-badge">
            <i />
            {badge}
          </Reveal>
          <Reveal i={1}>
            <h2 className="at-hero__title at-book__title">
              <Lines text={title} />
            </h2>
          </Reveal>
          {lead && (
            <Reveal i={2}>
              <p className="at-hero__lead">{lead}</p>
            </Reveal>
          )}
          {ctas && (
            <Reveal i={3} className="at-ctas">
              <span className="at-btn is-ink">
                <i />
                {ctas[0]}
              </span>
              {ctas[1] && <span className="at-btn">{ctas[1]} →</span>}
            </Reveal>
          )}
          {contacts.length > 0 && (
            <Reveal i={4} className="at-contacts">
              {contacts.map((c) => (
                <div key={c.value}>
                  <b>{c.value}</b>
                  <small>{c.label}</small>
                </div>
              ))}
            </Reveal>
          )}
        </div>
        <Reveal i={3} y={40} className="at-cal">
          <div className="at-cal__hd">
            {card.avatar ? <img src={card.avatar.src} alt={card.avatar.alt} /> : <i>{card.name.slice(0, 1)}</i>}
            <div>
              <b>{card.name}</b>
              {card.note && <small>{card.note}</small>}
            </div>
            {card.status && <span className="at-cal__st">{card.status}</span>}
          </div>
          <div className="at-cal__m">{card.month}</div>
          <div className="at-cal__grid" role="group" aria-label="选择日期">
            {WEEK.map((w) => (
              <span key={w} className="at-cal__w">
                {w}
              </span>
            ))}
            {Array.from({ length: card.offset ?? 0 }, (_, i) => (
              <span key={`b${i}`} />
            ))}
            {cells.map((d) => {
              const open = card.open.includes(d)
              return (
                <button key={d} type="button" disabled={!open} aria-pressed={d === day} className={`at-cal__d${open ? ' is-open' : ''}${d === day ? ' is-on' : ''}`} onClick={() => setDay(d)}>
                  {d}
                </button>
              )
            })}
          </div>
          <div className="at-cal__slots" role="group" aria-label="选择时间">
            {card.slots.map((s, i) => (
              <button key={s} type="button" aria-pressed={i === slot} className={i === slot ? 'is-on' : ''} onClick={() => setSlot(i)}>
                {s}
              </button>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
