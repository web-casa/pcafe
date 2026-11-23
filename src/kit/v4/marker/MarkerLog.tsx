import { useState } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint } from '../../shared'
import { Corners, Mark, type MarkerCorners } from './parts'

export interface MarkerEntry {
  /** Mono date, e.g. "09.18", ≤ 6 个字符. */
  date: string
  /** ≤ 20 字; ==…== marks a phrase. */
  title: string
  /** Kind of note, ≤ 4 字. */
  tag?: string
  /** Shown when the row is opened, ≤ 50 字. */
  body?: string
}

export interface MarkerLogProps {
  kicker: string
  /** Mono line on the right of the kicker, ≤ 14 字. */
  meta?: string
  /** 3–6 dated notes, newest first. */
  entries: MarkerEntry[]
  /** Row open at the start; -1 for none. */
  open?: number
  corners?: MarkerCorners
  hint?: string
}

/** A dated notebook: short entries with a marked phrase and a tag; clicking a row unfolds a line more. */
export function MarkerLog({ kicker, meta, entries, open = 0, corners, hint }: MarkerLogProps) {
  const [on, setOn] = useState(open)
  return (
    <section className="slide mr">
      <Hint id="markerlog">{hint}</Hint>
      <div className="mr-col mr-log">
        <Reveal i={0} className="mr-nowhead is-top">
          <span>{kicker}</span>
          {meta && <span>{meta}</span>}
        </Reveal>
        <ol>
          {entries.slice(0, 6).map((e, k) => (
            <Reveal i={1 + k * 0.4} y={12} key={e.date + e.title}>
              <li className={k === on ? 'is-on' : ''} onClick={() => setOn(k === on ? -1 : k)}>
                <div className="mr-log__row">
                  <em>{e.date}</em>
                  <b>
                    <Mark text={e.title} from={1 + k * 0.4} start={k} />
                  </b>
                  {e.tag && <span>{e.tag}</span>}
                  <i aria-hidden="true">↗</i>
                </div>
                {e.body && (
                  <div className="mr-log__body" data-crop>
                    <p>{e.body}</p>
                  </div>
                )}
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
      {corners && <Corners {...corners} />}
    </section>
  )
}
