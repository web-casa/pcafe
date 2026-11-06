import { Kicker, Reveal } from '../deck/primitives'
import { Hint, Lines, SlideFoot, type SlideBase } from './shared'

export interface GridStep {
  /** When, ≤ 8 characters: "今天", "下个月". */
  when: string
  /** ≤ 10 CJK characters. */
  title: string
  /** ≤ 40 CJK characters. */
  body: string
  /** Small footnote, ≤ 10 characters: effort, owner. */
  meta?: string
}

export interface StepGridProps extends SlideBase {
  /** Exactly 3 steps; the last one is set on a dark tile. */
  steps: GridStep[]
}

/** Next steps as a tiled grid: a big accent title tile, a pattern tile, then three step tiles. Made for `neo-grid`, works in any style. */
export function StepGrid({ kicker, title, lead, source, hint, steps }: StepGridProps) {
  return (
    <section className="slide">
      <Hint id="stepgrid">{hint}</Hint>
      <div className="frame s-sg">
        <div className="sg__grid">
          <div className="sg__head sg__tile is-accent">
            <Reveal i={0}><Kicker>{kicker}</Kicker></Reveal>
            <Reveal i={1}><h2 className="sg__title"><Lines text={title} /></h2></Reveal>
            {lead && <Reveal i={2}><p className="sg__lead">{lead}</p></Reveal>}
          </div>
          <Reveal i={2} className="sg__pattern sg__tile is-dark" aria-hidden>
            <svg viewBox="0 0 5 5">
              {Array.from({ length: 25 }, (_, k) => (((k % 5) + Math.floor(k / 5)) % 2 ? null : <rect key={k} x={k % 5} y={Math.floor(k / 5)} width="1" height="1" />))}
            </svg>
          </Reveal>
          {steps.map((s, i) => (
            <div key={s.title} className={`sg__step sg__tile${i === steps.length - 1 ? ' is-dark' : ''}`} data-build={i}>
              <Reveal i={3 + i * 0.5} y={24} className="sg__in">
                <p className="sg__when">{String(i + 1).padStart(2, '0')} · {s.when}</p>
                <h3>{s.title}</h3>
                <p className="sg__body">{s.body}</p>
                {s.meta && <p className="sg__meta">{s.meta}</p>}
              </Reveal>
            </div>
          ))}
        </div>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
