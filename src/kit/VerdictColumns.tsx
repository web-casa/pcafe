import { Reveal } from '../deck/primitives'
import { Icon, type IconName } from './Icon'
import { Hint, SlideFoot, SlideHead, type SlideBase } from './shared'

export interface VerdictGroup {
  /** go = recommended (accent), plan = conditional (ink), stop = not now (hollow). */
  tone: 'go' | 'plan' | 'stop'
  /** ≤ 6 CJK characters. */
  label: string
  /** 2–3 items per group, counts within 1 of each other. Title ≤ 16, body 14–26 CJK characters (one line). */
  items: { title: string; body: string; icon?: IconName }[]
}

export interface VerdictColumnsProps extends SlideBase {
  /** 2–3 groups, ordered from "yes" to "no". */
  groups: VerdictGroup[]
}

/** Recommendations sorted into verdict buckets: who should, who should wait, who should not. */
export function VerdictColumns({ kicker, title, lead, source, hint, groups }: VerdictColumnsProps) {
  return (
    <section className="slide">
      <Hint id="verdict">{hint}</Hint>
      <div className="frame s-who">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="who__cols" style={{ gridTemplateColumns: `repeat(${groups.length}, minmax(0, 1fr))` }}>
          {groups.map((v, c) => (
            <Reveal key={v.label} build i={c + 3} className={`who__col is-${v.tone}`}>
              <h3>
                <i aria-hidden />
                {v.label}
              </h3>
              <ul>
                {v.items.map((it) => (
                  <li key={it.title} className={it.icon ? 'has-icon' : undefined}>
                    {it.icon && <Icon name={it.icon} size={32} tone={v.tone === 'go' ? 'accent' : 'ink'} />}
                    <b>{it.title}</b>
                    <span>{it.body}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
        <SlideFoot source={source} i={7} />
      </div>
    </section>
  )
}
