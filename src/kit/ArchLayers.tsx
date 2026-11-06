import { Reveal } from '../deck/primitives'
import { Hint, SlideFoot, SlideHead, type SlideBase } from './shared'

export interface ArchLayer {
  /** ≤ 8 CJK characters. */
  name: string
  /** Mono tag such as a folder or tier name, ≤ 16 characters. */
  tag?: string
  /** 2–5 parts, each ≤ 10 characters. */
  items: string[]
}

export interface ArchLayersProps extends SlideBase {
  /** 3–5 layers, top (closest to the user) first. */
  layers: ArchLayer[]
  /** Index of the layer to highlight. */
  focus?: number
}

/** A layered architecture: stacked tiers, each listing its parts, the top one nearest the user. */
export function ArchLayers({ kicker, title, lead, source, hint, layers, focus }: ArchLayersProps) {
  return (
    <section className="slide">
      <Hint id="archlayers">{hint}</Hint>
      <div className="frame s-arch">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <ol className="arch">
          {layers.map((l, k) => (
            <Reveal key={l.name} build i={3 + k * 0.4} className={`arch__layer${k === focus ? ' arch__layer--focus' : ''}`}>
              <div className="arch__name">
                <b>{l.name}</b>
                {l.tag && <span>{l.tag}</span>}
              </div>
              <ul>
                {l.items.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ol>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
