import { useState } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint } from '../../shared'
import { DiptychPlate, type DiptychShot, Soft } from './parts'

export interface DiptychContactProps {
  kicker: string
  /** 1–2 lines × ≤ 8 字. */
  title: string[]
  soft?: string
  /** 2–3 groups of chips to pick from: label ≤ 6 字, 2–5 options × ≤ 6 字. */
  groups: { label: string; options: string[]; multi?: boolean }[]
  /** Send button, ≤ 6 字. */
  cta: string
  /** Line under the button, e.g. reply time, ≤ 24 字. */
  note?: string
  shots: DiptychShot[]
  signature?: string
  hint?: string
}

/** A brief-me close: two or three rows of chips (what, budget, when) to pick, and a send button that sums up the picks. */
export function DiptychContact({ kicker, title, soft, groups, cta, note, shots, signature, hint }: DiptychContactProps) {
  const [i, setI] = useState(0)
  const rows = groups.slice(0, 3)
  const [picks, setPicks] = useState<number[][]>(() => rows.map(() => [0]))
  const toggle = (g: number, k: number) =>
    setPicks((p) =>
      p.map((row, gi) => {
        if (gi !== g) return row
        if (!rows[g].multi) return [k]
        const next = row.includes(k) ? row.filter((x) => x !== k) : [...row, k]
        return next.length ? next : row
      }),
    )
  const count = picks.reduce((n, r) => n + r.length, 0)
  return (
    <section className="slide dp">
      <Hint id="diptychcontact">{hint}</Hint>
      <DiptychPlate shots={shots.slice(0, 3)} index={i} onIndex={setI} signature={signature} />
      <div className="dp-side">
        <Reveal i={0} className="dp-k">
          {kicker}
        </Reveal>
        <Reveal i={1}>
          <h2 className="dp-h2">
            {title.slice(0, 2).map((l, k) => (
              <span key={k}>
                <Soft line={l} soft={soft} />
              </span>
            ))}
          </h2>
        </Reveal>
        <div className="dp-form">
          {rows.map((g, gi) => (
            <Reveal i={2 + gi * 0.5} y={10} key={g.label}>
              <fieldset>
                <legend>{g.label}</legend>
                <div>
                  {g.options.slice(0, 5).map((o, k) => (
                    <button type="button" key={o} aria-pressed={picks[gi].includes(k)} className={picks[gi].includes(k) ? 'is-on' : ''} onClick={() => toggle(gi, k)}>
                      {o}
                    </button>
                  ))}
                </div>
              </fieldset>
            </Reveal>
          ))}
        </div>
        <Reveal i={4} className="dp-send">
          <span className="dp-btn is-ink is-big">
            {cta}
            <em key={count}>{count}</em>
          </span>
          {note && <small>{note}</small>}
        </Reveal>
      </div>
    </section>
  )
}
