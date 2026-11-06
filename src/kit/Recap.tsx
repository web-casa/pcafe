import { Reveal } from '../deck/primitives'
import { Icon } from './Icon'
import { Hint, SlideFoot, SlideHead, type SlideBase } from './shared'

export interface RecapProps extends SlideBase {
  /** 3–4 points: title ≤ 12, body ≤ 36 CJK characters. */
  points: { title: string; body: string }[]
  /** Teaser for what comes next: label ≤ 6, title ≤ 14 CJK characters. */
  next?: { label: string; title: string }
}

/** The end of a chapter: the points to keep, ticked, and a pointer to the next chapter. */
export function Recap({ kicker, title, lead, source, hint, points, next }: RecapProps) {
  return (
    <section className="slide">
      <Hint id="recap">{hint}</Hint>
      <div className="frame s-recap">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <ol className={`recap recap--${points.length}`}>
          {points.map((p, i) => (
            <Reveal key={p.title} build i={i * 0.6 + 3} className="recap__item">
              <span className="recap__check">
                <Icon name="check" size={30} />
              </span>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </Reveal>
          ))}
        </ol>
        {next && (
          <Reveal i={7} className="recap__next">
            <span>{next.label}</span>
            <b>{next.title}</b>
            <span className="arrow">→</span>
          </Reveal>
        )}
        <SlideFoot source={source} i={9} />
      </div>
    </section>
  )
}
