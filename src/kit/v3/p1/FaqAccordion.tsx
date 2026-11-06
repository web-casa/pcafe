import { Reveal } from '../../../deck/primitives'
import { Hint, Lines, SlideFoot, type SlideBase } from '../../shared'
import { D1Buttons, type D1Action } from './util'

export interface FaqAccItem {
  /** ≤ 24 字. */
  q: string
  /** ≤ 70 字. */
  a: string
}

export interface FaqAccordionProps extends SlideBase {
  /** 3–6 questions. With build: 'focus' each → opens the next and closes the previous. */
  items: FaqAccItem[]
  /** Item open when fully built. Default 0. */
  open?: number
  /** 0–1 button under the lead. */
  actions?: D1Action[]
}

/** Website-style FAQ accordion: intro on the left, a list of questions with +/− on the right, one answer open at a time. */
export function FaqAccordion({ kicker, title, lead, items, open = 0, actions, source, hint }: FaqAccordionProps) {
  return (
    <section className="slide">
      <Hint id="faqaccordion">{hint}</Hint>
      <div className="frame d1-frame d1faq">
        <div className="d1faq__intro">
          <Reveal i={0}>
            <p className="kicker">{kicker}</p>
          </Reveal>
          <Reveal i={1}>
            <h2 className="s-title">
              <Lines text={title} />
            </h2>
          </Reveal>
          {lead && (
            <Reveal i={2}>
              <p className="d1faq__lead">{lead}</p>
            </Reveal>
          )}
          <Reveal i={3}>
            <D1Buttons actions={actions} />
          </Reveal>
          <SlideFoot source={source} />
        </div>
        <Reveal i={3} className="d1faq__list">
          {items.map((it, i) => (
            <div key={i} className={`d1faq__item${i === open ? ' is-open' : ''}`} data-build="">
              <div className="d1faq__q">
                <span className="d1faq__no">{String(i + 1).padStart(2, '0')}</span>
                <h3>{it.q}</h3>
                <span className="d1faq__pm" aria-hidden />
              </div>
              <div className="d1faq__a" data-crop>
                <p>{it.a}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
