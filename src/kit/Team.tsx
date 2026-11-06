import { Reveal } from '../deck/primitives'
import { Hint, SlideFoot, SlideHead, type SlideBase } from './shared'

export interface TeamMember {
  /** A person's name or, when the slide is about roles, the role. ≤ 8 CJK characters. */
  name: string
  /** Muted line: title, team or headcount. ≤ 14 CJK characters. */
  role: string
  /** What they own, ≤ 36 CJK characters. */
  owns: string
  /** Avatar text, 1–3 characters. Default: first CJK character, or the initials of a Latin name. */
  initials?: string
  /** The owner of the whole effort: accent avatar. */
  focus?: boolean
}

export interface TeamProps extends SlideBase {
  /** 4, 6 or 8 people. */
  members: TeamMember[]
}

const initialsOf = (name: string) => {
  if (/[一-鿿]/.test(name)) return name.match(/[一-鿿]/)![0]
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

/** Who is on the team and what each person owns. Avatars are initials, not photos. */
export function Team({ kicker, title, lead, source, hint, members }: TeamProps) {
  return (
    <section className="slide">
      <Hint id="team">{hint}</Hint>
      <div className="frame s-team">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className={`team team--${members.length > 6 ? 4 : members.length > 4 ? 3 : 4}`}>
          {members.map((m, i) => (
            <Reveal key={m.name} build i={i * 0.4 + 3} className={`team__card${m.focus ? ' is-focus' : ''}`}>
              <span className={`team__avatar${(m.initials ?? '').length > 2 ? ' is-long' : ''}`} aria-hidden>
                {m.initials ?? initialsOf(m.name)}
              </span>
              <div>
                <h3>{m.name}</h3>
                <p className="team__role">{m.role}</p>
              </div>
              <p className="team__owns">{m.owns}</p>
            </Reveal>
          ))}
        </div>
        <SlideFoot source={source} i={9} />
      </div>
    </section>
  )
}
