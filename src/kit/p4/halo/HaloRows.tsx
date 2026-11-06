import { Kicker, Reveal } from '../../../deck/primitives'
import { Icon, type IconName } from '../../Icon'
import { Hint, Lines, SlideFoot, type SlideBase } from '../../shared'

export interface HaloRow {
  icon: IconName
  /** ≤ 12 CJK characters. */
  title: string
  /** ≤ 22 CJK characters, or a short key / command. */
  detail: string
}

export interface HaloRowsProps extends SlideBase {
  /** 3–6 rows. */
  items: HaloRow[]
}

/** Heading block on the left; on the right a list of hairline-separated rows, each an outline icon, a title, a short detail and a plus mark. */
export function HaloRows({ kicker, title, lead, source, hint, items }: HaloRowsProps) {
  return (
    <section className="slide">
      <Hint id="halorows">{hint}</Hint>
      <div className="frame s-hrows">
        <div className="hrows__head">
          <Reveal i={0}>
            <Kicker>{kicker}</Kicker>
          </Reveal>
          <Reveal i={1}>
            <h2 className="s-title">
              <Lines text={title} />
            </h2>
          </Reveal>
          {lead && (
            <Reveal i={2}>
              <p className="s-lead">{lead}</p>
            </Reveal>
          )}
          <SlideFoot source={source} i={9} />
        </div>
        <div className={`hrows__list hrows__list--n${Math.min(items.length, 6)}`}>
          {items.slice(0, 6).map((r, i) => (
            <Reveal key={r.title} i={3 + i} build className="hrow">
              <span className="hrow__icon">
                <Icon name={r.icon} size={40} />
              </span>
              <span className="hrow__title">{r.title}</span>
              <span className="hrow__detail">{r.detail}</span>
              <span className="hrow__plus" aria-hidden />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
