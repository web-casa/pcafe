import { graphemes } from '../../../emoji/render'
import type { CSSProperties } from 'react'
import { Kicker, Reveal } from '../../../deck/primitives'
import { Hint, Lines, SlideFoot, type Text } from '../../shared'

export interface SplitFlapRow {
  /** Left column, exactly 5 characters, e.g. "07-16" or "13:32". */
  time: string
  /** Middle column, ≤ 8 CJK characters or ≤ 14 Latin characters. */
  label: string
  /** Optional second column of 5 characters (e.g. a clock time). */
  at?: string
  /** Right column, ≤ 4 CJK characters. */
  status: string
}

export interface SplitFlapProps {
  kicker: string
  /** ≤ 1 line × 16 CJK characters. */
  title: Text
  /** Column headings: [time, label, status] or [time, at, label, status] when rows use `at`. ≤ 6 CJK characters each. */
  heads?: string[]
  /** 3–6 rows; each row is a build step and its flaps flip into place. */
  rows: SplitFlapRow[]
  source?: string
  hint?: React.ReactNode
}

function Flaps({ text, cls }: { text: string; cls: string }) {
  return (
    <span className={`x2-sf__cell ${cls}`}>
      {graphemes(text).map((c, k) => (
        <span key={k} className="x2-sf__flap" style={{ '--i': k } as CSSProperties}>
          <span className="x2-sf__glyph">{c === ' ' ? ' ' : c}</span>
        </span>
      ))}
    </span>
  )
}

/** Departure board: rows of split-flap tiles that flip character by character into the final text. */
export function SplitFlap({ kicker, title, heads, rows, source, hint }: SplitFlapProps) {
  const hasAt = rows.some((r) => r.at)
  const width = Math.max(...rows.map((r) => [...r.label].length))
  return (
    <section className="slide">
      <Hint id="splitflap">{hint}</Hint>
      <div className="frame x2-sf">
        <Reveal i={0}>
          <Kicker>{kicker}</Kicker>
        </Reveal>
        <Reveal i={1}>
          <h2 className="s-title">
            <Lines text={title} />
          </h2>
        </Reveal>
        <Reveal i={2} className="x2-sf__board" style={{ '--w': width } as CSSProperties}>
          {heads && (
            <div className={`x2-sf__row x2-sf__head${hasAt ? ' x2-sf__row--at' : ''}`}>
              {heads.map((h) => (
                <span key={h}>{h}</span>
              ))}
            </div>
          )}
          {rows.map((r, i) => (
            <div key={i} className={`x2-sf__row${hasAt ? ' x2-sf__row--at' : ''}`} data-build style={{ '--r': i } as CSSProperties}>
              <Flaps text={r.time} cls="x2-sf__time" />
              {hasAt && <Flaps text={r.at ?? '     '} cls="x2-sf__time" />}
              <Flaps text={r.label.padEnd(width, ' ')} cls="x2-sf__label" />
              <span className="x2-sf__status">{r.status}</span>
            </div>
          ))}
        </Reveal>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
