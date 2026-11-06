// Mock interfaces: a chat, an app panel and a step strip, built in HTML instead of
// described in words (an idea from oil-html, MIT). Sizes use --m, so the same parts
// sit in a slide (--m scales with the stage) and in a report (--m = 1px).
// They are illustrations: each carries a visible label, '示意界面' by default.
import type { CSSProperties } from 'react'

export interface ChatMessage {
  from: 'user' | 'bot'
  /** ≤ 60 CJK characters. */
  text: string
  /** Optional result card under a bot message: 2–4 rows of label and value. */
  card?: { title: string; rows: [string, string][] }
}

export interface MockChatProps {
  /** App or assistant name in the title bar, ≤ 12 characters. Not a real brand unless it is yours. */
  app: string
  /** 2–6 messages. */
  messages: ChatMessage[]
  /** Visible honesty label. Default '示意界面'. */
  label?: string
  /** Adds data-build to each message, for step-by-step reveal in a deck. */
  build?: boolean
}

export function MockChat({ app, messages, label = '示意界面', build }: MockChatProps) {
  return (
    <div className="mk mk-chat">
      <div className="mk__bar">
        <i />
        <i />
        <i />
        <span>{app}</span>
        <em className="mk__label">{label}</em>
      </div>
      <div className="mk-chat__body">
        {messages.map((m, i) => (
          <div key={i} className={`mk-chat__msg is-${m.from}`} data-build={build ? i : undefined}>
            <p>{m.text}</p>
            {m.card && (
              <div className="mk-chat__card">
                <b>{m.card.title}</b>
                <dl>
                  {m.card.rows.map(([k, v]) => (
                    <div key={k}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export interface MockAppProps {
  /** Window or page name, ≤ 14 characters. */
  app: string
  /** Heading inside the panel, ≤ 16 CJK characters. */
  title: string
  /** 2–5 filled-in fields. value ≤ 24 CJK characters. */
  fields: { label: string; value: string }[]
  /** 0–4 tags. */
  tags?: string[]
  /** Status pill at the top right. */
  status?: { text: string; tone?: 'ok' | 'wait' | 'stop' }
  label?: string
  style?: CSSProperties
}

export function MockApp({ app, title, fields, tags = [], status, label = '示意界面', style }: MockAppProps) {
  return (
    <div className="mk mk-app" style={style}>
      <div className="mk__bar">
        <i />
        <i />
        <i />
        <span>{app}</span>
        <em className="mk__label">{label}</em>
      </div>
      <div className="mk-app__body">
        <div className="mk-app__head">
          <b>{title}</b>
          {status && <span className={`mk-app__status is-${status.tone ?? 'ok'}`}>{status.text}</span>}
        </div>
        <dl className="mk-app__fields">
          {fields.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
        {tags.length > 0 && (
          <div className="mk-app__tags">
            {tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export interface StepStripProps {
  /** 3–5 steps. title ≤ 8 CJK characters, body ≤ 24. */
  steps: { title: string; body?: string }[]
  build?: boolean
}

/** A numbered strip that gives the whole flow before the details. */
export function StepStrip({ steps, build }: StepStripProps) {
  return (
    <ol className="mk-steps" style={{ '--n': steps.length } as CSSProperties}>
      {steps.map((s, i) => (
        <li key={s.title} data-build={build ? i : undefined}>
          <span className="mk-steps__n">{i + 1}</span>
          <b>{s.title}</b>
          {s.body && <p>{s.body}</p>}
        </li>
      ))}
    </ol>
  )
}
