import { useState } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Icon } from '../../Icon'
import { Hint, SlideFoot, SlideHead, type SlideBase } from '../../shared'

export interface Slot {
  /** ≤ 8 characters, e.g. 10:00. */
  time: string
  /** ≤ 8 CJK characters. */
  note?: string
}

export interface SlotPickerProps extends SlideBase {
  /** Card header: title ≤ 12 CJK characters, meta ≤ 10 characters (e.g. 30 分钟). */
  card: { title: string; meta: string }
  /** Month label, ≤ 10 characters. */
  month: string
  /** Weekday of day 1, Monday = 0 … Sunday = 6. */
  start: number
  /** Days in the month, 28–31. */
  days: number
  /** Days shown as available (dotted). */
  open: number[]
  /** The selected day; must be in `open`. */
  day: number
  /** 3–5 time slots for the selected day. */
  slots: Slot[]
  /** Index of the slot shown as chosen. Default 0. */
  pick?: number
}

const WEEK = ['一', '二', '三', '四', '五', '六', '日']

/** A booking card: month calendar with open days and a column of time slots, both clickable. Schedules, review slots, office hours; mark as 示意 unless the dates are real. */
export function SlotPicker({ kicker, title, lead, source, hint, card, month, start, days, open, day, slots, pick = 0 }: SlotPickerProps) {
  const [d, setD] = useState(day)
  const [s, setS] = useState(pick)
  const cells = [...Array(start).fill(0), ...Array.from({ length: days }, (_, i) => i + 1)]
  return (
    <section className="slide">
      <Hint id="slotpicker">{hint}</Hint>
      <div className="frame frame--split s-slots">
        <div className="slots__text">
          <SlideHead kicker={kicker} title={title} lead={lead} />
          <SlideFoot source={source} i={8} />
        </div>
        <Reveal i={3} className="slots">
          <div className="slots__card">
            <header className="slots__head">
              <span className="slots__icon" aria-hidden>
                <Icon name="calendar" size={30} />
              </span>
              <b>{card.title}</b>
              <span className="slots__meta">
                <Icon name="clock" size={22} />
                {card.meta}
              </span>
            </header>
            <div className="slots__body">
              <div className="slots__cal">
                <div className="slots__month">{month}</div>
                <div className="slots__grid">
                  {WEEK.map((w) => (
                    <span key={w} className="slots__wd">
                      {w}
                    </span>
                  ))}
                  {cells.map((n, i) =>
                    n === 0 ? (
                      <span key={`e${i}`} />
                    ) : open.includes(n) ? (
                      <button key={n} type="button" className={`slots__day is-open${n === d ? ' is-on' : ''}`} onClick={() => setD(n)}>
                        {n}
                      </button>
                    ) : (
                      <span key={n} className="slots__day">
                        {n}
                      </span>
                    ),
                  )}
                </div>
              </div>
              <div className="slots__times">
                <div className="slots__month">{`${month.replace(/.*年\s*/, '')} ${d} 日`}</div>
                {slots.map((t, i) => (
                  <button key={t.time} type="button" className={`slots__time${i === s ? ' is-on' : ''}`} onClick={() => setS(i)}>
                    <b>{t.time}</b>
                    {t.note && <span>{t.note}</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
