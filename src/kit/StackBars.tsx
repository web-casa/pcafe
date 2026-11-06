import { Reveal } from '../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from './shared'

export interface StackBarsProps extends SlideBase {
  /** 3–6 layers, top first; each sits a step further left. name ≤ 8 CJK characters, note ≤ 20. */
  layers: { name: string; note: string }[]
}

/** Layers as staggered bars stepping down the page, top layer first. Made for `broadside`, works in any style. */
export function StackBars({ kicker, title, lead, source, hint, layers }: StackBarsProps) {
  const n = layers.length
  return (
    <section className="slide">
      <Hint id="stackbars">{hint}</Hint>
      <div className="frame s-sb">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <ol className="sb__list" style={vars({ '--n': n })}>
          {layers.map((l, i) => (
            <li key={l.name} style={vars({ '--k': n - 1 - i, '--o': 0.45 + (0.55 * (n - 1 - i)) / Math.max(1, n - 1) })} data-build={i}>
              <Reveal i={3 + i * 0.4} y={16} className="sb__bar">
                <b>{l.name}</b>
                <span>{l.note}</span>
              </Reveal>
            </li>
          ))}
        </ol>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
