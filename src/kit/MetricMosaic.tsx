import { Kicker, Reveal } from '../deck/primitives'
import { Hint, Lines, SlideFoot, type SlideBase } from './shared'

export interface MosaicMetric { value: string; label: string }

export interface MetricMosaicProps extends SlideBase {
  /** The tall strip on the left: value ≤ 7 characters. */
  side: MosaicMetric
  /** 2–3 small tiles: value ≤ 6 characters, label ≤ 14. */
  small: MosaicMetric[]
  /** The big tile: value ≤ 6 characters, label ≤ 16. */
  hero: MosaicMetric
}

/** A tiled grid of figures: one tall strip, a title tile, small tiles and one huge accent tile. Made for `neo-grid`, works in any style. */
export function MetricMosaic({ kicker, title, lead, source, hint, side, small, hero }: MetricMosaicProps) {
  return (
    <section className="slide">
      <Hint id="metricmosaic">{hint}</Hint>
      <div className="frame s-mm">
        <div className="mm__grid">
          <Reveal i={2} y={30} className="mm__side mm__tile is-accent">
            <p className="mm__v">{side.value}</p>
            <p className="mm__l">{side.label}</p>
          </Reveal>
          <div className="mm__head mm__tile">
            <Reveal i={0}><Kicker>{kicker}</Kicker></Reveal>
            <Reveal i={1}><h2 className="mm__title"><Lines text={title} /></h2></Reveal>
            {lead && <Reveal i={2}><p className="mm__lead">{lead}</p></Reveal>}
          </div>
          <div className="mm__small">
            {small.map((m, i) => (
              <Reveal key={m.label} i={3 + i * 0.5} y={24} className="mm__tile">
                <p className="mm__v">{m.value}</p>
                <p className="mm__l">{m.label}</p>
              </Reveal>
            ))}
          </div>
          <Reveal i={5} y={30} className="mm__hero mm__tile is-accent">
            <p className="mm__l">{hero.label}</p>
            <p className="mm__big">{hero.value}</p>
          </Reveal>
        </div>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
