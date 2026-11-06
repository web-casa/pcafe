// Blocks that show instead of tell: a step strip and mock interfaces (src/kit/mock).
// They work in both views and never split across sheets.
import type { CSSProperties } from 'react'
import { MockApp, MockChat, StepStrip, type ChatMessage, type MockAppProps } from '../kit/mock/Mock'
import { Inline } from './blocks'

export interface StepsProps {
  /** 3–5 steps. title ≤ 8 CJK characters, body ≤ 24. Put it before the detailed blocks. */
  steps: { title: string; body?: string }[]
}

export function Steps({ steps }: StepsProps) {
  return (
    <div className="b b-steps">
      <StepStrip steps={steps} />
    </div>
  )
}

export interface ChatProps {
  app: string
  /** 2–6 messages. */
  messages: ChatMessage[]
  /** ≤ 30 CJK characters: what the exchange shows. */
  caption: string
  /** Visible label on the window. Default '示意界面'. */
  label?: string
}

/** A mock chat with a caption. Marked '示意界面' unless it reproduces a real exchange. */
export function Chat({ app, messages, caption, label }: ChatProps) {
  return (
    <div className="b b-mock">
      <div className="b-mock__one">
        <MockChat app={app} messages={messages} label={label} />
      </div>
      <p className="doc-source"><Inline text={caption} /></p>
    </div>
  )
}

export interface AppsProps {
  /** 1–3 filled-in app panels. */
  cards: Omit<MockAppProps, 'style'>[]
  caption: string
}

export function Apps({ cards, caption }: AppsProps) {
  return (
    <div className="b b-mock">
      <div className="b-mock__row" style={{ '--n': cards.length } as CSSProperties}>
        {cards.map((c) => <MockApp key={c.app + c.title} {...c} />)}
      </div>
      <p className="doc-source"><Inline text={caption} /></p>
    </div>
  )
}
