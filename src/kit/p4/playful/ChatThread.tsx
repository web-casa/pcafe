import { Kicker, Reveal } from '../../../deck/primitives'
import { Icon } from '../../Icon'
import { Hint, Lines, SlideFoot, type SlideBase } from '../../shared'

export interface ChatMessage {
  /** 'q' = the asker (left, white bubble); 'a' = the answer (right, accent bubble). */
  from: 'q' | 'a'
  /** Questions ≤ 24 CJK characters, answers ≤ 44. */
  text: string
}

export interface ChatThreadProps extends SlideBase {
  /** 3–6 messages, top to bottom. Each one is a build step. */
  messages: ChatMessage[]
  /** Names over the two sides, each ≤ 6 characters. Defaults to 提问 / 回答. */
  names?: { q: string; a: string }
}

/**
 * Q&A as a chat thread: title and lead on the left with a hand-drawn squiggle,
 * speech bubbles on the right, questions left in white, answers right in the accent.
 * title ≤ 2 lines × 7 CJK characters; lead ≤ 50.
 */
export function ChatThread({ kicker, title, lead, source, hint, messages, names = { q: '提问', a: '回答' } }: ChatThreadProps) {
  return (
    <section className="slide">
      <Hint id="chatthread">{hint}</Hint>
      <div className="frame plc">
        <div className="plc__copy">
          <Reveal i={0}>
            <Kicker>{kicker}</Kicker>
          </Reveal>
          <Reveal i={1}>
            <h2 className="s-title plc__title">
              <Lines text={title} />
            </h2>
          </Reveal>
          {lead && (
            <Reveal i={2}>
              <p className="s-lead">{lead}</p>
            </Reveal>
          )}
          <svg className="plc__doodle" viewBox="0 0 300 120" aria-hidden>
            <path d="M8 70 C 40 20, 60 110, 95 62 S 150 20, 175 66 S 230 104, 262 48" />
            <path d="M246 34 L 266 46 L 252 66" />
          </svg>
          <SlideFoot source={source} i={8} />
        </div>
        <div className="plc__thread">
          {messages.map((m, i) => (
            <Reveal key={i} build i={3 + i * 0.4} className={`plc__msg plc__msg--${m.from}`}>
              <span className="plc__av" aria-hidden>
                <Icon name={m.from === 'q' ? 'user' : 'stars'} size={30} />
              </span>
              <div className="plc__bubble">
                {(i === 0 || messages[i - 1].from !== m.from) && <small>{m.from === 'q' ? names.q : names.a}</small>}
                <p>{m.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
