import { Kicker, Numeral, Reveal, usePointerDrift } from '../deck/primitives'
import { Icon, type IconName } from './Icon'
import { Hint, Lines, vars, type Text } from './shared'

export interface CoverProps {
  kicker: string
  /** Main title, 1–2 short lines (e.g. a product + version). */
  title: Text
  /** Optional serif-italic second line: a codename, a quote, a theme word. */
  subtitle?: string
  lead: string
  /** 2–4 key facts along the bottom. Values ≤ 10 characters. Optional icon before the label. */
  facts: { label: string; value: string; icon?: IconName }[]
  /** The giant display figure on the right: 1–4 characters. */
  numeral: string
  /** Small aside in the top-right corner, up to 2 lines. */
  note?: Text
  hint?: React.ReactNode
}

/** Opening slide: editorial title on the left, one oversized figure on the right. */
export function Cover({ kicker, title, subtitle, lead, facts, numeral, note, hint }: CoverProps) {
  const { drift, lean, settle } = usePointerDrift(34, 20)
  return (
    <section className="slide s-cover" onPointerMove={lean} onPointerLeave={settle}>
      <Hint id="cover">{hint}</Hint>
      <div className="cover__copy">
        <Reveal i={0}>
          <Kicker>{kicker}</Kicker>
        </Reveal>
        <Reveal i={1}>
          <h1 className="cover__title">
            <Lines text={title} />
            {subtitle && <em>“{subtitle}”</em>}
          </h1>
        </Reveal>
        <Reveal i={2}>
          <p className="cover__lead">{lead}</p>
        </Reveal>
      </div>
      <Reveal i={4} className="cover__facts">
        <dl>
          {facts.map((f) => (
            <div key={f.label}>
              <dt>
                {f.icon && <Icon name={f.icon} size={22} tone="mute" />}
                {f.label}
              </dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
      {note && (
        <Reveal i={5} className="cover__note">
          <p>
            <Lines text={note} />
          </p>
        </Reveal>
      )}
      <div className="numeral cover__num" style={vars({ '--len': Math.max(2, [...numeral].length) })} aria-hidden>
        <Numeral text={numeral} drift={drift} delay={0.2} />
      </div>
    </section>
  )
}
