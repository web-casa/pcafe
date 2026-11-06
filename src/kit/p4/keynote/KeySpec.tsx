import { Kicker, Reveal } from '../../../deck/primitives'
import { Hint, Lines, SlideFoot, type Text } from '../../shared'

export interface KeySpecItem {
  /** ≤ 7 characters. */
  value: string
  /** ≤ 12 CJK characters. */
  label: string
}

export interface KeySpecProps {
  /** 2–8 characters. */
  kicker: string
  /** Statement over the number, ≤ 1 line × 16 CJK characters. */
  title: Text
  /** The giant number, ≤ 5 characters. */
  value: string
  /** Unit beside it, ≤ 4 characters. */
  unit?: string
  /** One line under the number saying what it measures, ≤ 30 CJK characters. */
  caption: string
  /** 0–3 supporting specs in a row along the bottom. */
  specs?: KeySpecItem[]
  source?: string
  hint?: string
}

/** Giant spec number: one gradient numeral fills the slide's middle, a caption below, up to three small specs on a hairline row. */
export function KeySpec({ kicker, title, value, unit, caption, specs = [], source, hint }: KeySpecProps) {
  return (
    <section className="slide">
      <Hint id="keyspec">{hint}</Hint>
      <div className="frame s-kspec">
        <Reveal i={0}>
          <Kicker>{kicker}</Kicker>
        </Reveal>
        <Reveal i={1}>
          <h2 className="kspec__title">
            <Lines text={title} />
          </h2>
        </Reveal>
        <Reveal i={2} y={50} className="kspec__figure">
          <b className="kn-grad">{value}</b>
          {unit && <span>{unit}</span>}
        </Reveal>
        <Reveal i={3}>
          <p className="kspec__caption">{caption}</p>
        </Reveal>
        {specs.length > 0 && (
          <div className="kspec__specs">
            {specs.map((s, i) => (
              <Reveal key={s.label} i={4 + i} build>
                <b>{s.value}</b>
                <span>{s.label}</span>
              </Reveal>
            ))}
          </div>
        )}
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
