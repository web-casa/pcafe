import { Reveal } from '../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from './shared'

export interface MethodStep {
  /** ≤ 8 CJK characters. */
  title: string
  /** ≤ 44 CJK characters. */
  body: string
  /** Footer left, ≤ 8 characters: who. */
  who?: string
  /** Footer right, ≤ 8 characters: how long. */
  when?: string
}

export interface MethodStepsProps extends SlideBase {
  /** 3–4 steps; dark and light cards alternate. */
  steps: MethodStep[]
}

/** A working method as numbered cards, dark and light in turn, each with a who / how-long footer. Made for `emerald`, works in any style. */
export function MethodSteps({ kicker, title, lead, source, hint, steps }: MethodStepsProps) {
  return (
    <section className="slide">
      <Hint id="methodsteps">{hint}</Hint>
      <div className="frame s-ms">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <ol className="ms__row" style={vars({ '--n': steps.length })}>
          {steps.map((s, i) => (
            <li key={s.title} className={`ms__card${i % 2 ? '' : ' is-dark'}`} data-build={i}>
              <Reveal i={3 + i * 0.5} y={24} className="ms__in">
                <span className="ms__n">{String(i + 1).padStart(2, '0')}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                {(s.who || s.when) && <div className="ms__foot"><span>{s.who}</span><span>{s.when}</span></div>}
              </Reveal>
            </li>
          ))}
        </ol>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
