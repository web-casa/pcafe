import { Reveal } from '../deck/primitives'
import { Icon, type IconName } from './Icon'
import { Hint, SlideFoot, SlideHead, type SlideBase } from './shared'

export interface Persona {
  icon: IconName
  /** The role, ≤ 10 CJK characters, e.g. '市场负责人'. */
  role: string
  /** Muted chip: their part in the decision, ≤ 6 CJK characters, e.g. '决策者'. */
  part: string
  /** The job they hire the product for, in their words. ≤ 30 CJK characters. */
  job: string
  /** Exactly 2 goals and 2 pains, ≤ 18 CJK characters each. */
  goals: [string, string]
  pains: [string, string]
  /** 2–3 places to reach them, ≤ 8 characters each. */
  channels: string[]
  /** The primary buyer: accent rule on top. */
  focus?: boolean
}

export interface PersonaCardsProps extends SlideBase {
  /** Exactly 3 personas: the buying group, not three market segments. */
  personas: Persona[]
}

/** Three buyer personas side by side: job, goals, pains and where to reach them. */
export function PersonaCards({ kicker, title, lead, source, hint, personas }: PersonaCardsProps) {
  return (
    <section className="slide">
      <Hint id="persona">{hint}</Hint>
      <div className="frame s-persona">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="persona">
          {personas.map((p, i) => (
            <Reveal key={p.role} build i={i * 0.8 + 3} className={`persona__card${p.focus ? ' is-focus' : ''}`}>
              <div className="persona__top">
                <span className="persona__icon">
                  <Icon name={p.icon} size={44} tone={p.focus ? 'accent' : 'ink'} />
                </span>
                <span className="persona__part">{p.part}</span>
              </div>
              <h3>{p.role}</h3>
              <p className="persona__job">“{p.job}”</p>
              <dl className="persona__lists">
                <div>
                  <dt>目标</dt>
                  {p.goals.map((g) => (
                    <dd key={g}>{g}</dd>
                  ))}
                </div>
                <div>
                  <dt>痛点</dt>
                  {p.pains.map((g) => (
                    <dd key={g}>{g}</dd>
                  ))}
                </div>
              </dl>
              <div className="persona__ch">
                <span>触达</span>
                {p.channels.map((c) => (
                  <code key={c}>{c}</code>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
        <SlideFoot source={source} i={6} />
      </div>
    </section>
  )
}
