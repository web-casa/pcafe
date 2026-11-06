import { Kicker, Reveal } from '../deck/primitives'
import { MockChat, type ChatMessage } from './mock/Mock'
import { Hint, Lines, SlideFoot, type SlideBase } from './shared'

export interface ChatDemoProps extends SlideBase {
  /** Name in the chat window's title bar, ≤ 12 characters. */
  app: string
  /** 2–5 messages, alternating as in a real exchange. */
  messages: ChatMessage[]
  /** 0–3 short notes under the lead, ≤ 20 CJK characters each. */
  notes?: string[]
  /** Visible label on the window. Default '示意界面'. */
  label?: string
}

/**
 * A mock chat that shows how something is used, instead of describing it.
 * With `build: 'reveal'` the messages arrive one per press.
 */
export function ChatDemo({ kicker, title, lead, source, hint = '按 → 逐条出现对话', app, messages, notes = [], label }: ChatDemoProps) {
  return (
    <section className="slide">
      <Hint id="chatdemo">{hint}</Hint>
      <div className="frame s-chatdemo">
        <div className="chatdemo__copy">
          <Reveal i={0}>
            <Kicker>{kicker}</Kicker>
          </Reveal>
          <Reveal i={1}>
            <h2 className="s-title">
              <Lines text={title} />
            </h2>
          </Reveal>
          {lead && (
            <Reveal i={2}>
              <p className="s-lead">{lead}</p>
            </Reveal>
          )}
          {notes.length > 0 && (
            <Reveal i={3} className="chatdemo__notes">
              <ul>
                {notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>
        <Reveal i={2} y={24} className="chatdemo__win">
          <MockChat app={app} messages={messages} label={label} build />
        </Reveal>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
