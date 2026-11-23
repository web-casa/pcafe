import { useState } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint } from '../../shared'
import { DiptychPlate, type DiptychShot, Soft } from './parts'

export interface DiptychHeroProps {
  /** Status pill with a live green dot, ≤ 10 字. */
  status: string
  /** 2–3 lines × ≤ 7 字. */
  title: string[]
  /** Words inside `title` set in grey, ≤ 4 字. */
  soft?: string
  /** ≤ 40 字. */
  lead?: string
  /** Ink button and a plain button, each ≤ 8 字. */
  ctas?: [string, string?]
  /** 4–8 client or project names drifting along the foot, each ≤ 10 个字符. */
  clients?: string[]
  /** 2–5 shots on the left plate; it advances on its own. */
  shots: DiptychShot[]
  /** Latin signature on the plate, ≤ 12 个字符. */
  signature?: string
  /** Milliseconds per shot; 0 stops the autoplay. Default 5200. */
  autoplay?: number
  hint?: string
}

/** A portfolio opening: one tall picture card on the left that cycles through work, and a short bold promise with buttons on the right above a drifting row of client names. */
export function DiptychHero({ status, title, soft, lead, ctas, clients = [], shots, signature, autoplay = 5200, hint }: DiptychHeroProps) {
  const [i, setI] = useState(0)
  const run = [...clients, ...clients]
  return (
    <section className="slide dp">
      <Hint id="diptychhero">{hint}</Hint>
      <DiptychPlate shots={shots.slice(0, 5)} index={i} onIndex={setI} signature={signature} autoplay={autoplay} />
      <div className="dp-side dp-side--mid">
        <Reveal i={0} className="dp-status">
          <i />
          {status}
        </Reveal>
        <Reveal i={1}>
          <h1 className="dp-h1">
            {title.slice(0, 3).map((l, k) => (
              <span key={k}>
                <Soft line={l} soft={soft} />
              </span>
            ))}
          </h1>
        </Reveal>
        {lead && (
          <Reveal i={2}>
            <p className="dp-lead">{lead}</p>
          </Reveal>
        )}
        {ctas && (
          <Reveal i={3} className="dp-ctas">
            <span className="dp-btn is-ink">{ctas[0]}</span>
            {ctas[1] && <span className="dp-btn">{ctas[1]}</span>}
          </Reveal>
        )}
      </div>
      {clients.length > 0 && (
        <Reveal i={5}>
          <div className="dp-marq" data-crop aria-hidden="true">
            <div className="dp-marq__track">
              {run.map((c, k) => (
                <span key={k}>{c}</span>
              ))}
            </div>
          </div>
        </Reveal>
      )}
    </section>
  )
}
