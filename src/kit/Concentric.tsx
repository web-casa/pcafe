import { Reveal } from '../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from './shared'

export interface Ring {
  /** On the ring, ≤ 6 CJK characters. */
  label: string
  /** In the list, ≤ 30 CJK characters. */
  note: string
}

export interface ConcentricProps extends SlideBase {
  /** 3–4 rings, innermost (the core) first. */
  rings: Ring[]
}

/** Nested rings from core to edge, explained in a list beside them: scope, layers of influence, core and periphery. */
export function Concentric({ kicker, title, lead, source, hint, rings }: ConcentricProps) {
  const n = rings.length
  return (
    <section className="slide">
      <Hint id="concentric">{hint}</Hint>
      <div className="frame s-rings">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="rings">
          <div className="rings__art" aria-hidden>
            {[...rings].reverse().map((r, j) => {
              const k = n - 1 - j
              return (
                <Reveal key={r.label} build={`ring${k}`} i={3 + k * 0.4} className="rings__ring" style={vars({ '--s': (k + 1) / n, '--k': k / Math.max(1, n - 1) })}>
                  <span>{r.label}</span>
                </Reveal>
              )
            })}
          </div>
          <ol className="rings__list">
            {rings.map((r, k) => (
              <Reveal key={r.label} build={`ring${k}`} i={3.2 + k * 0.4} style={vars({ '--k': k / Math.max(1, n - 1) })}>
                <i aria-hidden />
                <b>{r.label}</b>
                <p>{r.note}</p>
              </Reveal>
            ))}
          </ol>
        </div>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
