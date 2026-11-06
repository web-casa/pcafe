import { Kicker, Reveal } from '../../../deck/primitives'
import { Hint, Lines, SlideFoot, type Text } from '../../shared'
import { Photo, type PhotoImage } from './img'

export interface CaseMetric {
  /** ≤ 7 个字符. */
  value: string
  /** ≤ 12 字. */
  label: string
}

export interface CaseStudyProps {
  image: PhotoImage
  kicker: string
  /** ≤ 2 lines × 10 字. */
  title: Text
  /** 1–4 tags, each ≤ 6 字. */
  tags?: string[]
  /** ≤ 70 字. */
  body: string
  /** Exactly 3 metrics; each one build step. */
  metrics: CaseMetric[]
  source?: string
  hint?: string
}

/** Case card: a large hero image on the left inside a rounded card, tags, a short story and three metrics on the right. */
export function CaseStudy({ image, kicker, title, tags = [], body, metrics, source, hint }: CaseStudyProps) {
  return (
    <section className="slide">
      <Hint id="casestudy">{hint}</Hint>
      <div className="frame v21-case">
        <Reveal i={0} y={30} className="v21-case__img">
          <Photo image={image} />
        </Reveal>
        <div className="v21-case__copy">
          <Reveal i={1}>
            <Kicker>{kicker}</Kicker>
          </Reveal>
          <Reveal i={2}>
            <h2 className="s-title v21-case__title">
              <Lines text={title} />
            </h2>
          </Reveal>
          {tags.length > 0 && (
            <Reveal i={3} className="v21-case__tags">
              {tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </Reveal>
          )}
          <Reveal i={4}>
            <p className="v21-case__body">{body}</p>
          </Reveal>
          <div className="v21-case__metrics">
            {metrics.slice(0, 3).map((m, i) => (
              <Reveal key={m.label} i={5 + i} build className="v21-case__metric">
                <b>{m.value}</b>
                <span>{m.label}</span>
              </Reveal>
            ))}
          </div>
          <SlideFoot source={source} />
        </div>
      </div>
    </section>
  )
}
