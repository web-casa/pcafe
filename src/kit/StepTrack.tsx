import { Cmd, Reveal } from '../deck/primitives'
import { Icon, type IconName } from './Icon'
import { Hint, SlideFoot, SlideHead, type SlideBase } from './shared'

export interface Step {
  /** ≤ 8 CJK characters. */
  title: string
  /** ≤ 40 CJK characters (two lines at most). */
  body: string
  /** Shell command (dark chip with # prompt) or, with `config: true`, a config line (light chip). ≤ 30 characters. */
  cmd?: string
  config?: boolean
  /** Optional icon before the title. Give every step one or none. */
  icon?: IconName
}

export interface StepTrackProps extends SlideBase {
  /** 3–5 sequential steps. The last one is highlighted as the finish. */
  steps: Step[]
  /** Optional follow-up strip: a label plus 2–5 short commands. */
  after?: { label: string; cmds: string[] }
}

/** A linear procedure on a connected track. */
export function StepTrack({ kicker, title, lead, source, hint, steps, after }: StepTrackProps) {
  const n = steps.length
  return (
    <section className="slide">
      <Hint id="steps">{hint}</Hint>
      <div className="frame s-steps" style={{ ['--n' as string]: n }}>
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="steps__track" aria-hidden>
          <span className="steps__line" />
        </div>
        <ol className="steps__list">
          {steps.map((s, i) => (
            <li key={s.title}>
              <Reveal build i={i * 1.4 + 2} className="steps__item">
                <span className="steps__node">{i + 1}</span>
                <h3>
                  {s.icon && <Icon name={s.icon} size={36} tone={i === n - 1 ? 'accent' : 'ink'} />}
                  {s.title}
                </h3>
                <p>{s.body}</p>
                {s.cmd && (s.config ? <code className="cmd is-config">{s.cmd}</code> : <Cmd>{s.cmd}</Cmd>)}
              </Reveal>
            </li>
          ))}
        </ol>
        {after && (
          <Reveal i={n * 1.4 + 3} className="steps__after">
            <span className="steps__after-label">{after.label}</span>
            {after.cmds.map((c) => (
              <Cmd key={c}>{c}</Cmd>
            ))}
          </Reveal>
        )}
        <SlideFoot source={source} i={n * 1.4 + 4} />
      </div>
    </section>
  )
}
