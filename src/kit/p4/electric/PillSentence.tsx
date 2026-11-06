import type { ReactNode } from 'react'
import { Kicker, Reveal } from '../../../deck/primitives'
import { Icon, type IconName } from '../../Icon'
import { Hint, SlideFoot } from '../../shared'

/** A run of words, or a pill holding 1–2 icons that sits inside the sentence. */
export type PillPart = string | { icons: IconName[] }

export interface PillSentenceProps {
  kicker: string
  /** The sentence: text runs ≤ 44 CJK characters in total, plus 2–3 icon pills. */
  parts: PillPart[]
  /** Bottom-left note: label ≤ 12 CJK characters, body ≤ 24. */
  note?: { label: string; body: string }
  /** Bottom-right paragraph, ≤ 64 CJK characters. */
  aside?: string
  source?: string
  hint?: ReactNode
}

/** One huge left-aligned sentence with small icon pills set inline between the words, then a quiet two-column footer: a short note left, a paragraph right. */
export function PillSentence({ kicker, parts, note, aside, source, hint }: PillSentenceProps) {
  let pill = 0
  return (
    <section className="slide">
      <Hint id="pillsentence">{hint}</Hint>
      <div className="frame el-ps">
        <Reveal i={0}>
          <Kicker>{kicker}</Kicker>
        </Reveal>
        <Reveal i={1}>
          <p className="el-ps__text">
            {parts.map((p, i) =>
              typeof p === 'string' ? (
                <span key={i}>{p}</span>
              ) : (
                <span key={i} className={`el-pill el-pill--${(pill++ % 3) + 1}`} aria-hidden>
                  {p.icons.slice(0, 2).map((n) => (
                    <Icon key={n} name={n} size={46} variant="bold-duotone" />
                  ))}
                </span>
              ),
            )}
          </p>
        </Reveal>
        <div className="el-ps__foot">
          {note && (
            <Reveal i={3} className="el-ps__note">
              <b>{note.label}</b>
              <span>{note.body}</span>
            </Reveal>
          )}
          {aside && (
            <Reveal i={4} className="el-ps__aside">
              {aside}
            </Reveal>
          )}
        </div>
        <SlideFoot source={source} i={6} />
      </div>
    </section>
  )
}
