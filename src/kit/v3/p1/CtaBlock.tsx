import { Reveal } from '../../../deck/primitives'
import { Hint, Lines, SlideFoot, type SlideBase } from '../../shared'
import { D1Buttons, type D1Action } from './util'

export interface CtaBlockProps extends SlideBase {
  /** A command or address shown in a copy field, ≤ 44 个字符. */
  command?: string
  /** Label over the copy field, ≤ 10 字. */
  commandLabel?: string
  /** 1–3 buttons. */
  actions?: D1Action[]
  /** 2–4 next steps on the right, title ≤ 10 字, body ≤ 30 字. Each is one build step. */
  steps: { title: string; body: string }[]
}

/** A large call-to-action block: headline, copy field with a command, buttons, and a numbered list of next steps. */
export function CtaBlock({ kicker, title, lead, command, commandLabel, actions, steps, source, hint }: CtaBlockProps) {
  return (
    <section className="slide">
      <Hint id="ctablock">{hint}</Hint>
      <div className="frame d1-frame">
        <Reveal i={0} className="d1cta">
          <div className="d1cta__main">
            <p className="kicker">{kicker}</p>
            <h2 className="d1cta__title">
              <Lines text={title} />
            </h2>
            {lead && <p className="d1cta__lead">{lead}</p>}
            {command && (
              <div className="d1cta__field">
                {commandLabel && <span className="d1cta__flabel">{commandLabel}</span>}
                <div className="d1cta__cmd">
                  <code>{command}</code>
                  <span className="d1cta__copy" aria-hidden>
                    复制
                  </span>
                </div>
              </div>
            )}
            <D1Buttons actions={actions} />
          </div>
          <ol className="d1cta__steps">
            {steps.map((s, i) => (
              <li key={i} data-build="">
                <span className="d1cta__no">{i + 1}</span>
                <div>
                  <b>{s.title}</b>
                  <p>{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
