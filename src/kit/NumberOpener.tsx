import type { ReactNode } from 'react'
import { Kicker, Reveal } from '../deck/primitives'
import { Hint, Lines, SlideFoot, type Text } from './shared'

export interface NumberOpenerProps {
  kicker: string
  /** The number, ≤ 5 characters including symbols: '97%', '1/3', '42'. */
  value: string
  /** Small unit after the number, ≤ 4 characters. */
  unit?: string
  /** What the number means, ≤ 2 lines × 14 CJK characters. */
  text: Text
  /** One quieter line, ≤ 40 CJK characters. */
  sub?: string
  source: string
  hint?: ReactNode
}

/** Opens a talk or chapter on one number, set huge on the left, with the sentence that explains it. */
export function NumberOpener({ kicker, value, unit, text, sub, source, hint }: NumberOpenerProps) {
  return (
    <section className="slide">
      <Hint id="opener">{hint}</Hint>
      <div className="frame s-opener">
        <Reveal i={1} y={30} className="opener__value">
          <b className="numeral">{value}</b>
          {unit && <span>{unit}</span>}
        </Reveal>
        <div className="opener__copy">
          <Reveal i={0}>
            <Kicker>{kicker}</Kicker>
          </Reveal>
          <Reveal i={2}>
            <h2 className="opener__text s-title">
              <Lines text={text} />
            </h2>
          </Reveal>
          {sub && (
            <Reveal i={3} className="s-lead">
              {sub}
            </Reveal>
          )}
        </div>
        <SlideFoot source={source} i={9} />
      </div>
    </section>
  )
}
