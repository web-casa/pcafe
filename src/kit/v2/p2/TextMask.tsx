import { Kicker, Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot } from '../../shared'

export interface TextMaskFact {
  /** ≤ 8 characters. */
  value: string
  /** ≤ 10 CJK characters. */
  label: string
}

export interface TextMaskProps {
  kicker: string
  /** The cut-out word: 2–5 Latin capitals or 1–2 CJK characters. */
  word: string
  /** Headline beside the word, ≤ 2 lines × 10 CJK characters. */
  title: string | string[]
  /** ≤ 36 CJK characters. */
  sub?: string
  /** 0–3 figures along the bottom. */
  facts?: TextMaskFact[]
  /** Imported image seen through the letters. */
  image: string
  /** Describes the image for screen readers. */
  alt: string
  credit?: string
  source?: string
  hint?: React.ReactNode
}

/** Giant cut-out word: an image shows only through the letters, drifting into place; headline and figures underneath. */
export function TextMask({ kicker, word, title, sub, facts = [], image, alt, credit, source, hint }: TextMaskProps) {
  const lines = typeof title === 'string' ? [title] : title
  return (
    <section className="slide">
      <Hint id="textmask">{hint}</Hint>
      <div className="frame x2-tm">
        <Reveal i={0}>
          <Kicker>{kicker}</Kicker>
        </Reveal>
        <Reveal i={1} y={0} className="x2-tm__wordbox">
          <h1 className="x2-tm__word" style={{ backgroundImage: `url(${image})` }} data-len={[...word].length}>
            {word}
          </h1>
          <span className="x2-tm__alt" role="img" aria-label={alt} />
        </Reveal>
        <div className="x2-tm__foot">
          <Reveal i={2} className="x2-tm__copy">
            <h2 className="x2-tm__title">
              {lines.map((l, i) => (
                <span key={i}>{l}</span>
              ))}
            </h2>
            {sub && <p className="x2-tm__sub">{sub}</p>}
          </Reveal>
          {facts.length > 0 && (
            <div className="x2-tm__facts">
              {facts.map((f, i) => (
                <Reveal key={f.label} i={3 + i}>
                  <b>{f.value}</b>
                  <span>{f.label}</span>
                </Reveal>
              ))}
            </div>
          )}
        </div>
        <div className="x2-tm__src">
          {credit && <p className="x2-tm__credit">{credit}</p>}
          <SlideFoot source={source} />
        </div>
      </div>
    </section>
  )
}
