import { useState } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint } from '../../shared'
import type { PhotoImage } from '../../v2/p1/img'
import { Glow } from './parts'

export interface AlbumDay {
  /** Short day label on the pin, e.g. "周一", ≤ 3 字. */
  day: string
  /** Full date shown when picked, e.g. "6 月 10 日", ≤ 8 字. */
  date: string
  image: PhotoImage
  /** Caption on the print, ≤ 6 字. */
  caption?: string
  /** Shown when picked, ≤ 40 字. */
  note?: string
  /** Where, ≤ 10 字. */
  place?: string
}

export interface AlbumWeekProps {
  /** Mono-ish label, ≤ 12 字. */
  kicker?: string
  /** 1 line ≤ 12 字. */
  title: string
  /** 5–7 days hung on a line. */
  days: AlbumDay[]
  /** Day picked at the start. */
  picked?: number
  hint?: string
}

/** One week as prints pegged on a line; pick a print and it lifts out while its date, note and place write in below. */
export function AlbumWeek({ kicker, title, days, picked = 2, hint }: AlbumWeekProps) {
  const list = days.slice(0, 7)
  const [on, setOn] = useState(Math.min(picked, list.length - 1))
  const d = list[on]
  return (
    <section className="slide al">
      <Hint id="albumweek">{hint}</Hint>
      <Glow at="center" />
      <div className="al-week__head">
        {kicker && (
          <Reveal i={0} className="al-k">
            {kicker}
          </Reveal>
        )}
        <Reveal i={0.5}>
          <h2 className="al-h2 is-one">{title}</h2>
        </Reveal>
      </div>
      <div className="al-line">
        <svg className="al-line__rope" viewBox="0 0 1920 120" preserveAspectRatio="none" aria-hidden="true">
          <path d="M-20 20 Q960 120 1940 20" />
        </svg>
        {list.map((x, k) => {
          const t = (k + 0.5) / list.length
          const sag = 4 * t * (1 - t) * 50
          return (
            <button
              type="button"
              key={x.day}
              className={`al-peg${k === on ? ' is-on' : ''}`}
              style={{
                left: `${t * 100}%`,
                top: `calc(${20 + sag} * var(--u))`,
                ['--r' as string]: `${(k % 2 ? 1 : -1) * (2 + (k % 3))}deg`,
                animationDelay: `${0.3 + k * 0.08}s`,
              }}
              onClick={() => setOn(k)}
              aria-label={`${x.day} ${x.date}`}
            >
              <i className="al-peg__pin" />
              <figure className="al-print">
                <img src={x.image.src} alt={x.image.alt} draggable={false} style={{ objectPosition: x.image.focus ?? 'center' }} />
                {x.caption && <figcaption>{x.caption}</figcaption>}
              </figure>
              <span className="al-peg__day">{x.day}</span>
            </button>
          )
        })}
      </div>
      <Reveal i={2} className="al-day">
        <div key={on} className="al-day__in">
          <b>{d.date}</b>
          {d.note && <p>{d.note}</p>}
          {d.place && <small>◎ {d.place}</small>}
        </div>
      </Reveal>
    </section>
  )
}
