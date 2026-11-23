import { useState } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint } from '../../shared'
import { DiptychPlate, type DiptychShot, Soft } from './parts'

export interface DiptychAboutProps {
  kicker: string
  /** 1–2 lines × ≤ 8 字. */
  title: string[]
  soft?: string
  /** 2–4 roles, newest first: role ≤ 14 字, note ≤ 14 字, years ≤ 11 个字符. */
  roles: { role: string; note?: string; years: string }[]
  /** Big underlined address; click copies it. ≤ 22 个字符. */
  mail?: string
  /** Shown after a click on the address, ≤ 6 字. Default "已复制". */
  copied?: string
  /** Ink button and a plain button, each ≤ 8 字. */
  ctas?: [string, string?]
  /** 1–3 shots (a portrait works well). */
  shots: DiptychShot[]
  signature?: string
  hint?: string
}

/** An about page: a short line, a career timeline and a big address you can click to copy, beside a portrait on the plate. */
export function DiptychAbout({ kicker, title, soft, roles, mail, copied = '已复制', ctas, shots, signature, hint }: DiptychAboutProps) {
  const [i, setI] = useState(0)
  const [done, setDone] = useState(false)
  const copy = () => {
    if (!mail) return
    navigator.clipboard?.writeText(mail).catch(() => undefined)
    setDone(true)
    window.setTimeout(() => setDone(false), 1600)
  }
  return (
    <section className="slide dp">
      <Hint id="diptychabout">{hint}</Hint>
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
        <ol className="dp-tl">
          {roles.slice(0, 4).map((r, k) => (
            <Reveal i={2 + k * 0.4} y={10} key={r.role}>
              <li>
                <span>
                  {r.role}
                  {r.note && <small>{r.note}</small>}
                </span>
                <em>{r.years}</em>
              </li>
            </Reveal>
          ))}
        </ol>
        {mail && (
          <Reveal i={4}>
            <button type="button" className={`dp-mail${done ? ' is-done' : ''}`} onClick={copy}>
              {mail}
              <small>{copied}</small>
            </button>
          </Reveal>
        )}
        {ctas && (
          <Reveal i={5} className="dp-ctas">
            <span className="dp-btn is-ink">{ctas[0]}</span>
            {ctas[1] && <span className="dp-btn">{ctas[1]}</span>}
          </Reveal>
        )}
      </div>
    </section>
  )
}
