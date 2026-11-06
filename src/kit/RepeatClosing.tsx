import { Reveal } from '../deck/primitives'
import { ChatBubble } from './decor'
import { Hint, Lines, type Text } from './shared'

export interface RepeatClosingProps {
  /** Latin word repeated as the background texture, ≤ 12 characters, e.g. 'THANK YOU'. */
  word: string
  /** The line in front, ≤ 2 lines × 10 CJK characters. */
  title: Text
  /** Mono line under it, ≤ 40 CJK characters. */
  sub?: string
  /** Optional chat bubble in the corner: name ≤ 8, text ≤ 16 CJK characters. */
  chat?: { name: string; text: string }
  hint?: string
}

/** Closing page: a word repeated across the whole background, one underlined line in front. */
export function RepeatClosing({ word, title, sub, chat, hint }: RepeatClosingProps) {
  const row = Array.from({ length: 6 }, () => word).join(' · ')
  return (
    <section className="slide">
      <Hint id="repeat">{hint}</Hint>
      <div className="repeat__bg" aria-hidden data-crop>
        {Array.from({ length: 9 }, (_, i) => (
          <span key={i} style={{ ['--k' as string]: i }}>
            {row}
          </span>
        ))}
      </div>
      <div className="frame s-repeat">
        <Reveal i={1}>
          <h2 className="close__statement repeat__title">
            <Lines text={title} />
          </h2>
        </Reveal>
        {sub && (
          <Reveal i={2} className="repeat__sub">
            {sub}
          </Reveal>
        )}
        {chat && (
          <Reveal i={4} className="repeat__chat">
            <ChatBubble name={chat.name} text={chat.text} />
          </Reveal>
        )}
      </div>
    </section>
  )
}
