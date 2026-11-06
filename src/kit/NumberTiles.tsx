import { Reveal } from '../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from './shared'

export interface NumberTilesProps extends SlideBase {
  /** 3–4 tiles: principles, rules, phases. title ≤ 10 CJK characters, body ≤ 36. */
  tiles: { title: string; body: string }[]
}

/** Tall solid tiles with an outsized numeral each. Made for `stencil` (its four saturated colours), works in any style. */
export function NumberTiles({ kicker, title, lead, source, hint, tiles }: NumberTilesProps) {
  return (
    <section className="slide">
      <Hint id="numbertiles">{hint}</Hint>
      <div className="frame s-nt">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <ol className="nt__row" style={vars({ '--n': tiles.length })}>
          {tiles.map((t, i) => (
            <li key={t.title} className="nt__tile" data-build={i} data-k={i + 1}>
              <Reveal i={3 + i * 0.6} y={30} className="nt__in">
                <span className="nt__num">{i + 1}</span>
                <div>
                  <h3>{t.title}</h3>
                  <p>{t.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
