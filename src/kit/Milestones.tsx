import { Reveal } from '../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from './shared'

export interface Milestone {
  /** As it should read, ≤ 10 characters: '2026-04-30', '2026-02', 'Q3'. */
  date: string
  /** ≤ 24 CJK characters (two lines). */
  title: string
  /** Muted kind label, ≤ 8 CJK characters, e.g. '部门规章'. */
  tag?: string
  /** Accent dot: the event the slide is about. */
  focus?: boolean
}

export interface MilestonesProps extends SlideBase {
  /** 4–7 events in date order. They are spaced evenly, not to scale. */
  events: Milestone[]
}

/** Dated events on one axis, alternating above and below so each gets room for two lines. */
export function Milestones({ kicker, title, lead, source, hint, events }: MilestonesProps) {
  return (
    <section className="slide">
      <Hint id="milestones">{hint}</Hint>
      <div className="frame s-miles">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <ol className="miles" style={vars({ '--n': events.length + 1 })}>
          <span className="miles__axis" aria-hidden />
          {events.map((e, i) => (
            <li key={e.date + e.title} className={`miles__event ${i % 2 ? 'is-below' : 'is-above'}${e.focus ? ' is-focus' : ''}`} style={{ gridColumn: i + 1 }} data-build>
              <span className="miles__dot" aria-hidden style={{ animationDelay: `${500 + i * 120}ms` }} />
              <Reveal i={i * 0.6 + 3} y={i % 2 ? -18 : 18} className="miles__card">
                <time>{e.date}</time>
                <p>{e.title}</p>
                {e.tag && <span className="miles__tag">{e.tag}</span>}
              </Reveal>
            </li>
          ))}
        </ol>
        <SlideFoot source={source} i={events.length * 0.6 + 4} />
      </div>
    </section>
  )
}
