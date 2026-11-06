import { Kicker, Reveal } from '../../../deck/primitives'
import { Hint, Lines, SlideFoot, vars, type Text } from '../../shared'

export interface EnvelopeProps {
  /** 2–8 CJK characters. */
  kicker: string
  /** ≤ 3 lines × 8 CJK characters. */
  title: Text
  /** ≤ 60 CJK characters. */
  lead?: string
  /** Letter: greeting ≤ 12 CJK characters. */
  greeting: string
  /** Letter body, ≤ 72 CJK characters. */
  body: string
  /** Signature line, ≤ 14 CJK characters. */
  sign: string
  /** Stamp text, ≤ 4 characters. */
  stamp?: string
  /** Optional decor- paper texture for the letter (imported asset). */
  texture?: string
  source?: string
  hint?: string
}

/** An envelope drawn in CSS: build step 1 opens the flap, step 2 draws the letter up out of the pocket. */
export function Envelope({ kicker, title, lead, greeting, body, sign, stamp, texture, source, hint }: EnvelopeProps) {
  return (
    <section className="slide">
      <Hint id="envelope">{hint}</Hint>
      <div className="frame c3-frame c3env-frame">
        <div className="c3env__copy">
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
          <SlideFoot source={source} />
        </div>
        <Reveal i={3} className="c3env">
          <div className="c3env__body" data-build="" style={texture ? vars({ '--tex': `url(${texture})` }) : undefined}>
            <div className="c3env__back" aria-hidden />
            <div className="c3env__letter" data-build="">
              <p className="c3env__greet">{greeting}</p>
              <p className="c3env__text">{body}</p>
              <p className="c3env__sign">{sign}</p>
            </div>
            <div className="c3env__front" aria-hidden />
            <div className="c3env__flap" aria-hidden />
            {stamp && (
              <span className="c3env__stamp" aria-hidden>
                {stamp}
              </span>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
