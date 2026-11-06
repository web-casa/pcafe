import { Kicker, Numeral, Reveal } from '../deck/primitives'
import { Hint } from './shared'

export interface ClosingProps {
  kicker: string
  /** Small display mark echoing the cover figure: 1–4 digits (a number, not a word). */
  mark?: string
  /** The one sentence the audience should remember. ≤ 20 CJK characters. */
  statement: string
  /** A muted second sentence: the call to action. ≤ 28 CJK characters. */
  follow?: string
  /** Exactly 3 takeaways, each 20–46 CJK characters. */
  takeaways: string[]
  /** Reference URLs or document names, without protocol. 2–5 items. These are the slide's sources. */
  refs?: string[]
  hint?: React.ReactNode
}

/** Final slide: one statement, three takeaways, the reading list. */
export function Closing({ kicker, mark, statement, follow, takeaways, refs, hint }: ClosingProps) {
  return (
    <section className="slide s-close">
      <Hint id="closing">{hint}</Hint>
      <div className="frame close__frame">
        <Reveal i={0} className="close__mark">
          {mark && (
            <div className="numeral close__num" aria-hidden>
              <Numeral text={mark} delay={0.1} />
            </div>
          )}
          <Kicker>{kicker}</Kicker>
        </Reveal>
        <Reveal i={1}>
          <h2 className="close__statement">
            {statement}
            {follow && <span>{follow}</span>}
          </h2>
        </Reveal>
        <ol className="close__takeaways">
          {takeaways.map((t, i) => (
            <li key={i}>
              <Reveal build i={i + 3}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                <p>{t}</p>
              </Reveal>
            </li>
          ))}
        </ol>
        {refs && (
          <Reveal i={7} className="close__refs">
            <span>参考资料</span>
            {refs.map((r) => (
              <span key={r}>{r}</span>
            ))}
          </Reveal>
        )}
      </div>
    </section>
  )
}
