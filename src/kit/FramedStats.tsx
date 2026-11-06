import { Reveal } from '../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from './shared'

export interface FramedStatsProps extends SlideBase {
  /** 3–4 figures. value ≤ 6 characters, label ≤ 12 CJK characters. */
  stats: { value: string; label: string }[]
}

/** Figures in thick-framed boxes with hard offset shadows. Made for `block-frame`, works in any style. */
export function FramedStats({ kicker, title, lead, source, hint, stats }: FramedStatsProps) {
  return (
    <section className="slide">
      <Hint id="framedstats">{hint}</Hint>
      <div className="frame s-fs">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="fs__row" style={vars({ '--n': stats.length })}>
          {stats.map((s, i) => (
            <Reveal key={s.label} i={3 + i * 0.5} y={24} className="fs__box">
              <i className="fs__dot" aria-hidden />
              <p className="fs__v">{s.value}</p>
              <p className="fs__l">{s.label}</p>
            </Reveal>
          ))}
        </div>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
