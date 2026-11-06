import { Kicker, Reveal } from '../../../deck/primitives'
import { Hint, Lines, SlideFoot, type SlideBase } from '../../shared'

export interface CaseCardProps extends SlideBase {
  /** A real screenshot (imported). */
  image: string
  /** Alt text, ≤ 30 CJK characters. */
  alt: string
  /** 2–3 grey pills at the bottom left, each ≤ 10 CJK characters. */
  tags: string[]
  /** 2–3 words for the dark ticker band under the image, each ≤ 14 characters. */
  ticker: string[]
}

/** One project or feature as a white case card: serif title, a short paragraph and grey pills on the left, a real screenshot on the right over a dark ticker band. */
export function CaseCard({ kicker, title, lead, source, hint, image, alt, tags, ticker }: CaseCardProps) {
  const band = [...ticker, ...ticker, ...ticker]
  return (
    <section className="slide">
      <Hint id="casecard">{hint}</Hint>
      <div className="frame ncase">
        <Reveal i={0} className="ncase__card">
          <div className="ncase__copy">
            <Kicker>{kicker}</Kicker>
            <h2 className="s-title ncase__title">
              <Lines text={title} />
            </h2>
            {lead && <p className="ncase__lead">{lead}</p>}
            <div className="ncase__tags">
              {tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>
          <div className="ncase__media">
            <div className="ncase__shot" data-crop>
              <img src={image} alt={alt} />
            </div>
            <div className="ncase__band" data-crop>
              <div aria-hidden>
                {band.map((w, k) => (
                  <span key={k}>
                    <i />
                    {w}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
        <SlideFoot source={source} i={6} />
      </div>
    </section>
  )
}
