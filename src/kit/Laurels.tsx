import { Reveal } from '../deck/primitives'
import { Laurel } from './parts'
import { Hint, SlideFoot, SlideHead, type SlideBase } from './shared'

export interface LaurelsProps extends SlideBase {
  /** 3–4 honours: title ≤ 10, sub ≤ 14 CJK characters. Each must be citable in `source`. */
  items: { title: string; sub?: string; note?: string }[]
}

/** Awards, rankings or milestones set between wheat branches, with a line of context under each. */
export function Laurels({ kicker, title, lead, source, hint, items }: LaurelsProps) {
  return (
    <section className="slide">
      <Hint id="laurels">{hint}</Hint>
      <div className="frame s-laurels">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className={`laurels laurels--${items.length}`}>
          {items.map((it, i) => (
            <Reveal key={it.title} build i={i * 0.6 + 3} className="laurels__item">
              <Laurel title={it.title} sub={it.sub} />
              {it.note && <p>{it.note}</p>}
            </Reveal>
          ))}
        </div>
        <SlideFoot source={source} i={9} />
      </div>
    </section>
  )
}
