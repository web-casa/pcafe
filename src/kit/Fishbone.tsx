import { Reveal } from '../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from './shared'

export interface Bone {
  /** Cause category, ≤ 6 CJK characters. */
  label: string
  /** 1–3 causes, each ≤ 12 CJK characters. */
  causes: string[]
}

export interface FishboneProps extends SlideBase {
  /** The effect at the head, ≤ 10 CJK characters. */
  problem: string
  /** 4 or 6 categories; they alternate above and below the spine. */
  bones: Bone[]
}

/** Cause-and-effect (Ishikawa) diagram: the problem at the head, cause categories as ribs along the spine. */
export function Fishbone({ kicker, title, lead, source, hint, problem, bones }: FishboneProps) {
  const cols = Math.ceil(bones.length / 2)
  return (
    <section className="slide">
      <Hint id="fishbone">{hint}</Hint>
      <div className="frame s-fish">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="fish" style={vars({ '--cols': cols })}>
          <i className="fish__spine" aria-hidden />
          <Reveal i={3} className="fish__head">
            {problem}
          </Reveal>
          {bones.map((b, i) => {
            const up = i % 2 === 0
            const col = Math.floor(i / 2)
            return (
              <Reveal key={b.label} build i={3.5 + i * 0.3} className={`fish__bone fish__bone--${up ? 'up' : 'down'}`} style={vars({ '--col': col })}>
                <i className="fish__rib" aria-hidden />
                <b>{b.label}</b>
                <ul>
                  {b.causes.map((c, j) => (
                    <li key={c} style={vars({ '--j': up ? j + 1 : b.causes.length - j })}>
                      {c}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )
          })}
        </div>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
