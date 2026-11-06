import { Reveal } from '../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from './shared'

export interface PyramidLevel {
  /** Inside the band, ≤ 8 CJK characters. */
  label: string
  /** Beside the band, ≤ 30 CJK characters. */
  note: string
}

export interface PyramidProps extends SlideBase {
  /** 3–5 levels, top (narrowest, fewest) first. */
  levels: PyramidLevel[]
}

/** A layered pyramid: each level rests on the one below. Use for prerequisites, hierarchies, needs. */
export function Pyramid({ kicker, title, lead, source, hint, levels }: PyramidProps) {
  const n = levels.length
  // Each band is a trapezoid; the top one keeps a flat tip so its label fits.
  const w = (k: number) => (k + 0.6) / (n + 0.6)
  return (
    <section className="slide">
      <Hint id="pyramid">{hint}</Hint>
      <div className="frame s-pyramid">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <ol className="pyramid" style={vars({ '--n': n })}>
          {levels.map((l, k) => (
            <Reveal key={l.label} build i={3 + (n - 1 - k) * 0.5} className="pyramid__row">
              <div className="pyramid__band" style={vars({ '--t': `${((1 - w(k)) / 2) * 100}%`, '--b': `${((1 - w(k + 1)) / 2) * 100}%`, '--k': k / Math.max(1, n - 1) })}>
                <b>{l.label}</b>
              </div>
              <p>{l.note}</p>
            </Reveal>
          ))}
        </ol>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
