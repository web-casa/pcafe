import { Kicker, Reveal } from '../../../deck/primitives'
import { Hint, Lines, SlideFoot, type SlideBase } from '../../shared'

export interface GlowSub {
  /** ≤ 8 characters, e.g. "3.6 MB". */
  value: string
  /** ≤ 16 CJK characters. */
  label: string
}

export interface GlowMetricProps extends SlideBase {
  /** The one number, ≤ 5 characters. Set in a serif italic, very large. */
  figure: string
  /** Unit after the figure, ≤ 4 characters, e.g. "MB". */
  unit?: string
  /** What the number counts, ≤ 30 CJK characters. */
  caption: string
  /** Exactly 3 supporting numbers along the hairline row at the bottom. */
  subs: GlowSub[]
}

/**
 * Dark metric hero: title on the left, one huge serif-italic number glowing on the right
 * over a warm light pool, three supporting numbers on a hairline row underneath.
 * title ≤ 2 lines × 8 CJK characters; lead ≤ 50.
 */
export function GlowMetric({ kicker, title, lead, source, hint, figure, unit, caption, subs }: GlowMetricProps) {
  return (
    <section className="slide">
      <Hint id="glowmetric">{hint}</Hint>
      <div className="wdg__pool" aria-hidden />
      <div className="frame wdg">
        <div className="wdg__copy">
          <Reveal i={0}>
            <Kicker>{kicker}</Kicker>
          </Reveal>
          <Reveal i={1}>
            <h2 className="s-title wdg__title">
              <Lines text={title} />
            </h2>
          </Reveal>
          {lead && (
            <Reveal i={2}>
              <p className="s-lead wdg__lead">{lead}</p>
            </Reveal>
          )}
        </div>
        <Reveal i={3} className="wdg__hero">
          <p className="wdg__fig">
            {figure}
            {unit && <small>{unit}</small>}
          </p>
          <p className="wdg__cap">{caption}</p>
        </Reveal>
        <div className="wdg__subs">
          {subs.map((s, i) => (
            <Reveal key={s.label} build i={4 + i * 0.5} className="wdg__sub">
              <b>{s.value}</b>
              <span>{s.label}</span>
            </Reveal>
          ))}
        </div>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
