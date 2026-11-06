import { Kicker, Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot } from '../../shared'

export interface RotatingWordItem {
  /** The word that drops into the headline slot, ≤ 4 CJK characters. */
  word: string
  /** One line about it, shown in its card, ≤ 30 CJK characters. */
  note: string
  /** Optional figure in the card, ≤ 8 characters. */
  value?: string
}

export interface RotatingWordProps {
  kicker: string
  /** Text before the slot, ≤ 8 CJK characters. */
  before: string
  /** 2–4 words; each → swaps the slot to the next and lights its card. */
  words: RotatingWordItem[]
  /** Text after the slot, ≤ 6 CJK characters. */
  after?: string
  source?: string
  hint?: React.ReactNode
}

/** Headline with one word that rotates: each build step rolls the next word into the slot and lights the matching card below. */
export function RotatingWord({ kicker, before, words, after, source, hint }: RotatingWordProps) {
  return (
    <section className="slide">
      <Hint id="rotatingword">{hint}</Hint>
      <div className="frame x2-rw">
        <Reveal i={0}>
          <Kicker>{kicker}</Kicker>
        </Reveal>
        <Reveal i={1}>
          <h2 className="s-title x2-rw__title">
            {before}
            <span className="x2-rw__slot">
              {words.map((w, i) => (
                <span key={w.word} className="x2-rw__word" data-build={i === 0 ? undefined : `rw${i}`}>
                  {w.word}
                </span>
              ))}
            </span>
            {after}
          </h2>
        </Reveal>
        <div className="x2-rw__cards" style={{ '--n': words.length } as React.CSSProperties}>
          {words.map((w, i) => (
            <Reveal key={w.word} i={2 + i} className="x2-rw__card">
              <div data-build={i === 0 ? undefined : `rw${i}`} className="x2-rw__cardin">
                <span className="x2-rw__idx">{String(i + 1).padStart(2, '0')}</span>
                <b>{w.word}</b>
                {w.value && <strong>{w.value}</strong>}
                <p>{w.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
