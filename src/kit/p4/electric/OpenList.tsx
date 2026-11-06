import type { ReactNode } from 'react'
import { Kicker, Reveal } from '../../../deck/primitives'
import { Hint, Lines, SlideFoot, type Text } from '../../shared'

export interface OpenRow {
  /** Key, command or short code shown as a key cap, ≤ 8 characters. Omit if none. */
  key?: string
  /** ≤ 16 CJK characters. */
  q: string
  /** ≤ 44 CJK characters; shown only on the open row. */
  a: string
}

export interface OpenListProps {
  kicker: string
  /** ≤ 2 lines × 6 CJK characters. */
  title: Text
  /** ≤ 40 CJK characters. */
  lead?: string
  /** Pill button under the lead, ≤ 16 characters. */
  action?: string
  /** 5–7 rows. */
  rows: OpenRow[]
  /** Index of the expanded row, default 0. */
  open?: number
  source?: string
  hint?: ReactNode
}

/** Accordion list: title, lead and a pill button on the left; hairline rows on the right with key caps and plus marks, one row opened to show its answer. */
export function OpenList({ kicker, title, lead, action, rows, open = 0, source, hint }: OpenListProps) {
  return (
    <section className="slide">
      <Hint id="openlist">{hint}</Hint>
      <div className="frame el-ol">
        <div className="el-ol__side">
          <Reveal i={0}>
            <Kicker>{kicker}</Kicker>
          </Reveal>
          <Reveal i={1}>
            <h2 className="s-title el-ol__title">
              <Lines text={title} />
            </h2>
          </Reveal>
          {lead && (
            <Reveal i={2}>
              <p className="el-ol__lead">{lead}</p>
            </Reveal>
          )}
          {action && (
            <Reveal i={3} className="el-ol__action">
              <span className="el-btn el-btn--line">
                {action}
                <span className="el-btn__arrow" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </span>
              </span>
            </Reveal>
          )}
          <SlideFoot source={source} i={10} />
        </div>
        <div className="el-ol__rows">
          {rows.slice(0, 7).map((r, i) => (
            <Reveal key={r.q} i={2 + i * 0.6} build className={`el-ol__row${i === open ? ' is-open' : ''}`}>
              <div className="el-ol__q">
                {r.key && <kbd>{r.key}</kbd>}
                <span>{r.q}</span>
                <i className="el-ol__mark" aria-hidden />
              </div>
              {i === open && <p className="el-ol__a">{r.a}</p>}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
