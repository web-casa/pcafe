import { Reveal } from '../../../deck/primitives'
import { Icon } from '../../Icon'
import { Hint, SlideFoot, SlideHead, type SlideBase } from '../../shared'

export type MiniUi =
  /** A text field: label ≤ 10 CJK characters, value ≤ 24 characters (shown mono). */
  | { kind: 'field'; label: string; value: string }
  /** A row of 2–4 option pills, each ≤ 8 characters; `on` is the chosen one. */
  | { kind: 'options'; items: string[]; on: number }
  /** A confirmation line, ≤ 14 CJK characters. */
  | { kind: 'done'; text: string }

export interface UiStep {
  /** ≤ 8 CJK characters. */
  title: string
  /** ≤ 36 CJK characters. */
  text: string
  ui: MiniUi
}

export interface UiStepsProps extends SlideBase {
  /** Exactly 3 steps. */
  steps: [UiStep, UiStep, UiStep]
}

function Mini({ ui }: { ui: MiniUi }) {
  if (ui.kind === 'field')
    return (
      <div className="uis__field">
        <span>{ui.label}</span>
        <code>
          {ui.value}
          <i aria-hidden />
        </code>
      </div>
    )
  if (ui.kind === 'options')
    return (
      <div className="uis__opts">
        {ui.items.map((o, i) => (
          <span key={o} className={i === ui.on ? 'is-on' : undefined}>
            {o}
          </span>
        ))}
      </div>
    )
  return (
    <div className="uis__done">
      <span aria-hidden>
        <Icon name="check" size={30} variant="bold" />
      </span>
      {ui.text}
    </div>
  )
}

/** Three numbered step cards, each topped with a small UI snippet (a field, option pills, a confirmation): onboarding, setup, a short how-to. */
export function UiSteps({ kicker, title, lead, source, hint, steps }: UiStepsProps) {
  return (
    <section className="slide">
      <Hint id="uisteps">{hint}</Hint>
      <div className="frame uis">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <ol className="uis__row">
          {steps.map((st, i) => (
            <Reveal key={st.title} build i={3 + i} className="uis__card">
              <div className="uis__ui">
                <Mini ui={st.ui} />
              </div>
              <div className="uis__copy">
                <span className="uis__num">{`第 ${i + 1} 步`}</span>
                <h3>{st.title}</h3>
                <p>{st.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
