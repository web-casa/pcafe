import { Reveal } from '../../../deck/primitives'
import { Icon, type IconName } from '../../Icon'
import { Hint, SlideFoot } from '../../shared'

export interface AgencyHeroLine {
  /** ≤ 7 CJK characters (or 12 Latin letters). */
  text: string
  /** Optional icon tile set inline after the words. */
  icon?: IconName
}

export interface AgencyHeroProps {
  /** Lime pill at the top centre, ≤ 24 CJK characters. */
  badge: string
  /** 2–3 giant headline lines; at most 2 of them carry an icon. */
  lines: AgencyHeroLine[]
  /** Dark pill with a live dot, bottom left, ≤ 16 CJK characters. */
  tag: string
  /** Paragraph on the right, ≤ 64 CJK characters. */
  lead: string
  /** One or two pill buttons under the lead (labels only), each ≤ 10 characters; the first is filled. */
  actions: string[]
  /** Optional muted row of names along the bottom (text only, ≤ 6). */
  names?: string[]
  /** Small caption above the names, ≤ 16 CJK characters. */
  namesLabel?: string
  source?: string
  hint?: string
}

/** Agency hero: lime badge, a three-line giant headline with inline icon tiles, a dark status pill, a right-hand lead with pill buttons, and a muted names row. */
export function AgencyHero({ badge, lines, tag, lead, actions, names = [], namesLabel, source, hint }: AgencyHeroProps) {
  return (
    <section className="slide">
      <Hint id="agencyhero">{hint}</Hint>
      <div className="frame ag-hero">
        <Reveal i={0} className="ag-hero__badge">
          <span aria-hidden className="ag-bolt">
            <Icon name="bolt" size={22} variant="bold" />
          </span>
          {badge}
        </Reveal>
        <h1 className="ag-hero__title">
          {lines.map((l, i) => (
            <Reveal key={i} i={1 + i} y={40} className="ag-hero__line">
              <span>{l.text}</span>
              {l.icon && (
                <span aria-hidden className={`ag-tile ag-tile--${i % 3}`}>
                  <Icon name={l.icon} size={92} variant="bold" />
                </span>
              )}
            </Reveal>
          ))}
        </h1>
        <div className="ag-hero__low">
          <Reveal i={5} className="ag-pill-dark">
            <i aria-hidden />
            {tag}
          </Reveal>
          <Reveal i={6} className="ag-hero__aside">
            <p>{lead}</p>
            <div className="ag-hero__btns">
              {actions.map((a, i) => (
                <span key={a} className={i === 0 ? 'ag-btn ag-btn--fill' : 'ag-btn'}>
                  {a}
                  {i === 0 && <Icon name="calendar" size={24} />}
                  {i > 0 && <Icon name="link" size={24} />}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
        {names.length > 0 && (
          <Reveal i={7} className="ag-hero__names">
            {namesLabel && <span className="ag-hero__nlabel">{namesLabel}</span>}
            <div>
              {names.map((n) => (
                <span key={n}>{n}</span>
              ))}
            </div>
          </Reveal>
        )}
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
