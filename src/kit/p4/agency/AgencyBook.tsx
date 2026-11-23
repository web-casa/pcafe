import { useState, type CSSProperties } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint } from '../../shared'
import type { PhotoImage } from '../../v2/p1/img'

export interface AgencyBookProps {
  /** Small white pill above the title, ≤ 8 字. */
  tag?: string
  /** 2–3 lines × ≤ 9 字. */
  title: string[]
  /** ≤ 44 字. */
  lead: string
  /** Card heading, ≤ 12 字. */
  heading: string
  /** 4–5 days as [weekday, date], e.g. ["周三", "11/12"]. */
  days: [string, string][]
  /** 3–6 time slots, e.g. "14:00". */
  slots: string[]
  /** Verb on the button, ≤ 4 字; the picked day and time follow it. Default "预约". */
  cta?: string
  /** The person who takes the call. */
  host: { image: PhotoImage; name: string; role: string }
  /** Small line under the button, ≤ 24 字. */
  note?: string
  /** 0–4 contact facts along the bottom, label ≤ 6 字, value ≤ 16 个字符. */
  contacts?: { label: string; value: string }[]
  /** Day and slot picked at the start (0-based). Default [1, 1]. */
  pick?: [number, number]
  hint?: string
}

/** Agency close on the blue gradient: a big light headline on the left and a frosted booking card on the right and an optional contact row along the bottom; pick a day and a time and the button reads them back. */
export function AgencyBook({ tag, title, lead, heading, days, slots, cta = '预约', host, note, contacts = [], pick = [1, 1], hint }: AgencyBookProps) {
  const ds = days.slice(0, 5)
  const ts = slots.slice(0, 6)
  const [d, setD] = useState(Math.min(pick[0], ds.length - 1))
  const [t, setT] = useState(Math.min(pick[1], ts.length - 1))
  const [sent, setSent] = useState(false)
  return (
    <section className="slide ag-blue is-close">
      <Hint id="agencybook">{hint}</Hint>
      <div className="ag-blue__fx" aria-hidden="true" data-crop>
        <i className="ag-blue__glow" />
      </div>
      <div className="ag-bk">
        {tag && (
          <Reveal i={0}>
            <span className="ag-tag is-glass">{tag}</span>
          </Reveal>
        )}
        <Reveal i={0.5} y={30}>
          <h2 className="ag-bk__h">
            {title.slice(0, 3).map((l, i) => (
              <span key={i}>{l}</span>
            ))}
          </h2>
        </Reveal>
        <Reveal i={1}>
          <p className="ag-bk__lead">{lead}</p>
        </Reveal>
      </div>
      <Reveal i={1.4} className="ag-bk__card">
        <div className="ag-cal">
          <div className="ag-cal__top">
            <b>{heading}</b>
            <span className="ag-cal__host">
              <img src={host.image.src} alt={host.image.alt} draggable={false} />
              <span>
                {host.name}
                <small>{host.role}</small>
              </span>
            </span>
          </div>
          <div className="ag-cal__days" role="radiogroup" aria-label="日期">
            {ds.map(([w, n], i) => (
              <button
                key={i}
                type="button"
                role="radio"
                aria-checked={i === d}
                className={i === d ? 'is-on' : undefined}
                onClick={() => {
                  setD(i)
                  setSent(false)
                }}
              >
                <small>{w}</small>
                {n}
              </button>
            ))}
          </div>
          <div className="ag-cal__slots" role="radiogroup" aria-label="时间">
            {ts.map((s, i) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={i === t}
                className={i === t ? 'is-on' : undefined}
                style={{ '--i': i } as CSSProperties}
                onClick={() => {
                  setT(i)
                  setSent(false)
                }}
              >
                {s}
              </button>
            ))}
          </div>
          <button type="button" className={sent ? 'ag-cal__go is-sent' : 'ag-cal__go'} onClick={() => setSent(true)}>
            <i aria-hidden="true">{sent ? '✓' : '→'}</i>
            <span key={`${d}-${t}-${sent}`}>
              {sent ? '已预约' : cta} {ds[d]?.[0]} {ds[d]?.[1]} · {ts[t]}
            </span>
          </button>
          {note && <p className="ag-cal__note">{note}</p>}
        </div>
      </Reveal>
      {contacts.length > 0 && (
        <Reveal i={2} className="ag-bk__contacts">
          {contacts.slice(0, 4).map((c) => (
            <div key={c.label}>
              <small>{c.label}</small>
              {c.value}
            </div>
          ))}
        </Reveal>
      )}
    </section>
  )
}
