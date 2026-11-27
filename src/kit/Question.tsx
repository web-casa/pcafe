import type { ReactNode } from 'react'
import { Kicker, Reveal } from '../deck/primitives'
import { Hint, Lines, SlideFoot, type Text } from './shared'

export interface QuestionProps {
  kicker: string
  /** The question, ≤ 2 lines × 12 CJK characters, ending with ？. */
  question: Text
  /** One line that frames why it matters, ≤ 36 CJK characters. */
  sub?: string
  /** Optional fact or quote source pinned to the bottom safe area. */
  source?: string
  hint?: ReactNode
}

/** One question on an empty page, a large question mark behind it. Opens a chapter by asking what it answers. */
export function Question({ kicker, question, sub, source, hint }: QuestionProps) {
  return (
    <section className="slide">
      <Hint id="question">{hint}</Hint>
      <div className="frame s-question">
        <span className="question__mark" aria-hidden>
          ?
        </span>
        <div className="question__copy">
          <Reveal i={0}>
            <Kicker>{kicker}</Kicker>
          </Reveal>
          <Reveal i={1} y={28}>
            <h2 className="question__text statement__text">
              <Lines text={question} />
            </h2>
          </Reveal>
          {sub && (
            <Reveal i={3} className="question__sub">
              {sub}
            </Reveal>
          )}
        </div>
        <SlideFoot source={source} i={5} />
      </div>
    </section>
  )
}
