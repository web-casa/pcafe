import { useState } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot } from '../../shared'
import { Dot } from './parts'

export interface SlateCompareProps {
  dot?: string
  /** 2 lines × ≤ 9 字. */
  title: string[]
  /** ≤ 40 字. */
  lead?: string
  /** Button, ≤ 8 字. */
  cta?: string
  /** 2–3 small figures: value ≤ 6 个字符, label ≤ 8 字. */
  stats?: { value: string; label: string }[]
  /** Column names: yours first, theirs second, each ≤ 5 字. */
  cols: [string, string]
  /** 4–7 rows: icon one character, label ≤ 8 字, ours / theirs true or false. */
  rows: { icon?: string; label: string; ours: boolean; theirs: boolean }[]
  /** Toggle text, ≤ 6 字. Default "只看差异". */
  diffLabel?: string
  source?: string
  hint?: string
}

/** Why us: a short pitch on the left and a check table on the right with your column lit in the accent gradient; a toggle hides the rows where both sides match. */
export function SlateCompare({ dot, title, lead, cta, stats = [], cols, rows, diffLabel = '只看差异', source, hint }: SlateCompareProps) {
  const [diff, setDiff] = useState(false)
  const list = rows.slice(0, 7)
  return (
    <section className="slide sl">
      <Hint id="slatecompare">{hint}</Hint>
      <div className="sl-cmp__l">
        {dot && (
          <Reveal i={0}>
            <Dot>{dot}</Dot>
          </Reveal>
        )}
        <Reveal i={0.5}>
          <h2 className="sl-h2 is-left">
            {title.slice(0, 2).map((l, i) => (
              <span key={i}>{l}</span>
            ))}
          </h2>
        </Reveal>
        {lead && (
          <Reveal i={1}>
            <p className="sl-lead">{lead}</p>
          </Reveal>
        )}
        {cta && (
          <Reveal i={1.5} className="sl-ctas">
            <span className="sl-btn">{cta} →</span>
          </Reveal>
        )}
        {stats.length > 0 && (
          <div className="sl-mini">
            {stats.slice(0, 3).map((s, i) => (
              <Reveal i={2 + i * 0.3} key={s.label}>
                <div>
                  <b>{s.value}</b>
                  <small>{s.label}</small>
                </div>
              </Reveal>
            ))}
          </div>
        )}
        <div className="sl-cmp__src">
          <SlideFoot source={source} />
        </div>
      </div>
      <Reveal i={1} className="sl-cmp">
        <i className="sl-cmp__col" />
        <div className="sl-cmp__row is-head">
          <span>
            <button type="button" className={`sl-toggle${diff ? ' is-on' : ''}`} onClick={() => setDiff(!diff)} aria-pressed={diff}>
              <i />
              {diffLabel}
            </button>
          </span>
          <span>{cols[0]}</span>
          <span>{cols[1]}</span>
        </div>
        {list.map((r) => (
          <div className={`sl-cmp__row${diff && r.ours === r.theirs ? ' is-hidden' : ''}`} key={r.label} data-crop>
            <span>
              {r.icon && <i>{r.icon}</i>}
              {r.label}
            </span>
            <span>
              <b className={r.ours ? 'is-ok' : 'is-no'}>{r.ours ? '✓' : '×'}</b>
            </span>
            <span>
              <b className={r.theirs ? 'is-ok is-dim' : 'is-no'}>{r.theirs ? '✓' : '×'}</b>
            </span>
          </div>
        ))}
      </Reveal>
    </section>
  )
}
