import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot, SlideHead, type SlideBase } from '../../shared'

export interface AccordionStep {
  /** ≤ 6 CJK characters (also shown vertically when folded). */
  title: string
  /** ≤ 16 CJK characters. */
  sub?: string
  /** ≤ 60 CJK characters. */
  body: string
}

export interface ProcessAccordionProps extends SlideBase {
  /** 4–6 steps as vertical panels. Each build step opens the next panel and folds the previous. */
  steps: AccordionStep[]
  /** Panel open when fully built (no build or print). Defaults to the last. */
  open?: number
}

/** Horizontal accordion of process steps: folded panels show number + vertical title; the current one opens wide with its text. */
export function ProcessAccordion({ kicker, title, lead, steps, open = steps.length - 1, source, hint }: ProcessAccordionProps) {
  return (
    <section className="slide">
      <Hint id="processaccordion">{hint}</Hint>
      <div className="frame c3-frame">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className="c3acc">
          {steps.map((s, i) => (
            <div key={i} className={`c3acc__panel${i === open ? ' is-open' : ''}`} data-build="">
              <span className="c3acc__no">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="c3acc__fold" aria-hidden>
                {s.title}
              </h3>
              <div className="c3acc__body">
                <h3>{s.title}</h3>
                {s.sub && <p className="c3acc__sub">{s.sub}</p>}
                <p>{s.body}</p>
              </div>
            </div>
          ))}
        </Reveal>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
