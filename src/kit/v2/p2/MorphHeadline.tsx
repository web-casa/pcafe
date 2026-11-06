import { Kicker, Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot } from '../../shared'
import { Chars } from './chars'

export interface MorphNote {
  /** ≤ 6 CJK characters. */
  label: string
  /** ≤ 40 CJK characters. */
  body: string
}

export interface MorphHeadlineProps {
  kicker: string
  /** First sentence, shown on arrival. ≤ 12 CJK characters. */
  from: string
  /** Second sentence the first morphs into (one build step). ≤ 12 CJK characters. */
  to: string
  /** Exactly 2 notes: the first explains `from`, the second `to`. */
  notes?: [MorphNote, MorphNote]
  source?: string
  hint?: React.ReactNode
}

/** Two sentences in one place: the first blurs apart character by character and the second condenses in its place. */
export function MorphHeadline({ kicker, from, to, notes, source, hint }: MorphHeadlineProps) {
  return (
    <section className="slide">
      <Hint id="morphheadline">{hint}</Hint>
      <div className="frame x2-mh">
        <Reveal i={0}>
          <Kicker>{kicker}</Kicker>
        </Reveal>
        <Reveal i={1} className="x2-mh__stage">
          <div className="x2-mh__pair" data-build="mh">
            <h2 className="x2-mh__from">
              <Chars text={from} />
            </h2>
            <h2 className="x2-mh__to">
              <Chars text={to} />
            </h2>
          </div>
        </Reveal>
        {notes && (
          <div className="x2-mh__notes">
            <Reveal i={3} className="x2-mh__note">
              <span>{notes[0].label}</span>
              <p>{notes[0].body}</p>
            </Reveal>
            <Reveal i={4} className="x2-mh__note x2-mh__note--to" build="mh">
              <span>{notes[1].label}</span>
              <p>{notes[1].body}</p>
            </Reveal>
          </div>
        )}
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
