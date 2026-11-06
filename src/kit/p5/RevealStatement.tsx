import type { ReactNode } from 'react'
import { Kicker, Reveal } from '../../deck/primitives'
import { Hint, SlideFoot, type Text } from '../shared'
import { CharReveal, splitChars } from './CharReveal'

export interface RevealStatementProps {
  /** Small label above the sentence, 2–8 CJK characters. */
  kicker: string
  /** The one sentence, revealed character by character. ≤ 24 CJK characters; array to break lines (≤ 2 lines × 12). */
  text: Text
  /** One quiet line that fades in after the sentence, ≤ 36 CJK characters. */
  sub?: string
  source?: string
  hint?: ReactNode
}

/** One big sentence that types itself in, char by char. Use once or twice per deck, for the line people should remember. */
export function RevealStatement({ kicker, text, sub, source, hint }: RevealStatementProps) {
  const lines = typeof text === 'string' ? [text] : text
  const STAGGER = 0.05
  let offset = 0.3
  const starts = lines.map((l) => {
    const at = offset
    offset += splitChars(l).length * STAGGER + 0.08
    return at
  })
  return (
    <section className="slide">
      <Hint id="reveal-statement">{hint}</Hint>
      <div className="frame s-statement">
        <div className="statement rstatement">
          <Reveal i={0}>
            <Kicker>{kicker}</Kicker>
          </Reveal>
          <h2 className="statement__text rstatement__text" aria-label={lines.join('')}>
            {lines.map((l, i) => (
              <span key={i} className="statement__line" aria-hidden>
                <CharReveal text={l} delay={starts[i]} stagger={STAGGER} />
              </span>
            ))}
          </h2>
          {sub && (
            <Reveal delay={offset + 0.1} className="statement__sub">
              {sub}
            </Reveal>
          )}
        </div>
        <SlideFoot source={source} i={9} />
      </div>
    </section>
  )
}
