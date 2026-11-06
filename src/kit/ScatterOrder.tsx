import { Reveal } from '../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from './shared'

export interface ScatterStep {
  /** ≤ 8 CJK characters. */
  title: string
  /** ≤ 28 CJK characters. */
  body: string
}

export interface ScatterOrderProps extends SlideBase {
  /** 4–6 steps, in reading order. */
  steps: ScatterStep[]
}

// Where each card waits before it is placed: x, y in u and a tilt in degrees.
const SCATTER: [number, number, number][] = [
  [170, -140, -9],
  [-40, 170, 7],
  [120, 50, -5],
  [-150, -120, 10],
  [-130, 160, -7],
  [-220, 40, 6],
]

/**
 * Scattered cards fall into an ordered path, one per press (with `build: 'reveal'`).
 * The connecting line draws once every card is in place. Without `build` the path shows ordered.
 */
export function ScatterOrder({ kicker, title, lead, source, hint = '按 → 逐个归位', steps }: ScatterOrderProps) {
  return (
    <section className="slide">
      <Hint id="scatterorder">{hint}</Hint>
      <div className="frame s-so">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className="so__wrap">
          <ol className="so__row" style={vars({ '--n': steps.length })}>
            {steps.map((s, i) => {
              const [x, y, r] = SCATTER[i % SCATTER.length]
              return (
                <li key={s.title} className="so__item" data-build={i} style={vars({ '--sx': x, '--sy': y, '--sr': `${r}deg`, '--k': i })}>
                  <span className="so__dot">{String(i + 1).padStart(2, '0')}</span>
                  <div className="so__card">
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </Reveal>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
