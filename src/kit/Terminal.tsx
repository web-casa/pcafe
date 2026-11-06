import { Reveal } from '../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from './shared'

export interface TerminalStep {
  /** The command, without the prompt. ≤ 44 characters. */
  cmd: string
  /** 0–3 lines of output, ≤ 48 characters each. Abridge with '…'. */
  out?: string[]
  /** What the step shows, beside the terminal. ≤ 34 CJK characters. */
  note: string
}

export interface TerminalProps extends SlideBase {
  /** Window title, e.g. 'root@aurora: ~'. */
  window: string
  /** Prompt character(s). Default '#'. */
  prompt?: string
  /** 3–4 steps. Each gets a numbered marker in the terminal and a note on the right. */
  steps: TerminalStep[]
}

/** A terminal session with numbered annotations: what to type and what it tells you. */
export function Terminal({ kicker, title, lead, source, hint, window: win, prompt = '#', steps }: TerminalProps) {
  return (
    <section className="slide">
      <Hint id="terminal">{hint}</Hint>
      <div className="frame s-term">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="term__body">
          <Reveal i={3} className="term" y={16}>
            <div className="term__bar">
              <i />
              <i />
              <i />
              <span>{win}</span>
            </div>
            <div className="term__screen">
              {steps.map((s, i) => (
                <div key={s.cmd} className="term__step" style={vars({ '--d': `${250 + i * 180}ms` })}>
                  <p className="term__cmd">
                    <span className="term__n">{i + 1}</span>
                    <span className="t-prompt">{prompt}</span>
                    <span className="term__typed" style={vars({ '--chars': [...s.cmd].length })}>
                      {s.cmd}
                    </span>
                  </p>
                  {s.out?.map((o, k) => (
                    <p key={k} className="term__out">
                      {o}
                    </p>
                  ))}
                </div>
              ))}
              <p className="term__cmd is-idle" style={vars({ '--d': `${250 + steps.length * 180}ms` })}>
                <span className="term__n" />
                <span className="t-prompt">{prompt}</span>
                <span className="term__caret" />
              </p>
            </div>
          </Reveal>
          <ol className="term__notes">
            {steps.map((s, i) => (
              <Reveal key={s.cmd} build i={i * 0.9 + 4} className="term__note">
                <span>{i + 1}</span>
                <p>{s.note}</p>
              </Reveal>
            ))}
          </ol>
        </div>
        <SlideFoot source={source} i={9} />
      </div>
    </section>
  )
}
