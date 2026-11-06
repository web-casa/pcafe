import { Reveal } from '../deck/primitives'
import { Hint, SlideFoot, SlideHead, type SlideBase } from './shared'

export interface FaqItem {
  /** The question as people ask it, ≤ 24 CJK characters. */
  q: string
  /** The answer in one or two sentences, ≤ 56 CJK characters. */
  a: string
  /** Mono chip after the answer: the command, section or flag it hinges on. ≤ 24 characters. */
  tag?: string
}

export interface FaqProps extends SlideBase {
  /** 4 or 6 questions, in two columns. */
  items: FaqItem[]
}

/** Questions and short answers in two columns. A numbered serif Q anchors each one. */
export function Faq({ kicker, title, lead, source, hint, items }: FaqProps) {
  return (
    <section className="slide">
      <Hint id="faq">{hint}</Hint>
      <div className="frame s-faq">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="faq">
          {items.map((it, i) => (
            <Reveal key={it.q} build i={i * 0.5 + 3} className="faq__item">
              <span className="faq__q" aria-hidden>
                Q{i + 1}
              </span>
              <div>
                <h3>{it.q}</h3>
                <p>{it.a}</p>
                {it.tag && <code>{it.tag}</code>}
              </div>
            </Reveal>
          ))}
        </div>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
