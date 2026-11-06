import { Kicker, Numeral, Reveal, Source, usePointerDrift } from '../deck/primitives'
import { Hint, Lines, vars, type SlideBase } from './shared'

export interface BigStatProps extends SlideBase {
  /** The one number, ≤ 6 characters including the unit, e.g. '97%' or '9.34%'. */
  figure: string
  /** What the number counts, ≤ 30 CJK characters. Sits directly under the figure. */
  caption: string
  /** 2–3 supporting numbers: value ≤ 8 characters, label ≤ 24 CJK characters. */
  support?: { value: string; label: string }[]
}

/** One number carries the slide. The figure rises in on the left; the argument sits on the right. */
export function BigStat({ kicker, title, lead, source, hint, figure, caption, support }: BigStatProps) {
  const { drift, lean, settle } = usePointerDrift(18, 12)
  return (
    <section className="slide" onPointerMove={lean} onPointerLeave={settle}>
      <Hint id="bigstat">{hint}</Hint>
      <div className="frame bigstat">
        <div className="bigstat__figure">
          <div className="numeral bigstat__num" style={vars({ '--len': Math.max(3, [...figure].length) })} role="img" aria-label={figure}>
            <Numeral text={figure} drift={drift} delay={0.2} />
          </div>
          <Reveal i={4} className="bigstat__caption">
            {caption}
          </Reveal>
        </div>
        <div className="s-copy bigstat__copy">
          <Reveal i={0}>
            <Kicker>{kicker}</Kicker>
          </Reveal>
          <Reveal i={1}>
            <h2 className="s-title">
              <Lines text={title} />
            </h2>
          </Reveal>
          {lead && (
            <Reveal i={2}>
              <p className="s-lead">{lead}</p>
            </Reveal>
          )}
          {support && (
            <dl className="bigstat__support">
              {support.map((s, i) => (
                <Reveal key={s.label} build i={i + 5}>
                  <dt>{s.value}</dt>
                  <dd>{s.label}</dd>
                </Reveal>
              ))}
            </dl>
          )}
          {source && (
            <Reveal i={9} className="s-foot">
              <Source>{source}</Source>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}
