import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from '../../shared'

export interface ShieldLayer {
  /** ≤ 10 CJK characters. */
  name: string
  /** ≤ 34 CJK characters. */
  note: string
  /** Mono tag, ≤ 10 characters (e.g. 'L3/4'). */
  tag?: string
}

export interface ShieldLayersProps extends SlideBase {
  /** 2–5 layers, outermost first. With build, each ring and its row light up in turn. */
  layers: ShieldLayer[]
  /** What the rings protect, ≤ 4 CJK characters. */
  core: string
}

/** Defence in depth: concentric glowing half-rings around a protected core, read from the outside in. */
export function ShieldLayers({ kicker, title, lead, source, hint, layers, core }: ShieldLayersProps) {
  const n = layers.length
  const W = 760
  const R0 = 120
  const R1 = 360
  const r = (i: number) => R1 - (i * (R1 - R0)) / Math.max(1, n)
  return (
    <section className="slide">
      <Hint id="shield">{hint}</Hint>
      <div className="frame s-chart">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="v33-shield">
          <Reveal i={3} className="v33-shield__art">
            <svg viewBox={`${-W / 2} ${-R1 - 20} ${W} ${R1 + 40}`} aria-hidden>
              {layers.map((l, i) => (
                <g key={l.name} data-build={`l-${i}`} style={vars({ '--k': i })}>
                  <path d={`M${-r(i)},0 A${r(i)},${r(i)} 0 0 1 ${r(i)},0`} className="v33-shield__ring" />
                </g>
              ))}
              <path d={`M${-R0 + 16},0 A${R0 - 16},${R0 - 16} 0 0 1 ${R0 - 16},0 Z`} className="v33-shield__core" />
            </svg>
            {layers.map((l, i) => (
              <b key={l.name} data-build={`l-${i}`} className="v33-shield__num" style={vars({ '--x': 0.5 - (r(i) * 0.707) / W, '--y': 1 - (r(i) * 0.707 + 20) / (R1 + 40) })}>
                {i + 1}
              </b>
            ))}
            <span className="v33-shield__label">{core}</span>
          </Reveal>
          <ol className="v33-shield__list">
            {layers.map((l, i) => (
              <li key={l.name} data-build={`l-${i}`}>
                <b>{i + 1}</b>
                <div>
                  <h3>
                    {l.name}
                    {l.tag && <em>{l.tag}</em>}
                  </h3>
                  <p>{l.note}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
