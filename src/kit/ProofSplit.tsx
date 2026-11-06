import { Kicker, Reveal } from '../deck/primitives'
import { Icon, type IconName } from './Icon'
import { IconTile } from './parts'
import { Hint, Lines, SlideFoot, type SlideBase } from './shared'

export interface ProofSplitProps extends SlideBase {
  /** The large icon on the dark panel. */
  icon: IconName
  /** 3–5 setting rows on the dark panel: label ≤ 8, value ≤ 12 characters. */
  rows: { label: string; value: string }[]
  /** Exactly 2 figures: value ≤ 6 characters, label ≤ 12 CJK characters. */
  stats: { value: string; label: string }[]
  /** 0–3 checked lines, ≤ 20 CJK characters each. */
  checks?: string[]
}

/** A dark panel of settings on the left; the claim and two proof figures on the right. */
export function ProofSplit({ kicker, title, lead, source, hint, icon, rows, stats, checks = [] }: ProofSplitProps) {
  return (
    <section className="slide">
      <Hint id="proof">{hint}</Hint>
      <div className="frame s-proof">
        <Reveal i={2} y={18} className="proof__panel">
          <IconTile icon={icon} size={150} className="proof__icon" />
          <dl className="proof__rows">
            {rows.map((r, i) => (
              <Reveal key={r.label} build i={i * 0.5 + 4}>
                <dt>{r.label}</dt>
                <dd>{r.value}</dd>
              </Reveal>
            ))}
          </dl>
        </Reveal>
        <div className="proof__copy">
          <Reveal i={0}>
            <Kicker>{kicker}</Kicker>
          </Reveal>
          <Reveal i={1}>
            <h2 className="s-title">
              <Lines text={title} />
            </h2>
          </Reveal>
          {lead && (
            <Reveal i={2} className="s-lead">
              {lead}
            </Reveal>
          )}
          <Reveal i={4} className="proof__stats">
            {stats.map((s) => (
              <div key={s.label}>
                <b>{s.value}</b>
                <span>{s.label}</span>
              </div>
            ))}
          </Reveal>
          {checks.length > 0 && (
            <Reveal i={5} className="proof__checks">
              {checks.map((c) => (
                <span key={c}>
                  <Icon name="check" size={24} tone="accent" />
                  {c}
                </span>
              ))}
            </Reveal>
          )}
          <SlideFoot source={source} i={9} />
        </div>
      </div>
    </section>
  )
}
