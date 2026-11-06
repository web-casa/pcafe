import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from '../../shared'

export interface ModelSpecCardProps extends SlideBase {
  /** Model name on the card, ≤ 18 characters. */
  name: string
  /** Version tag, ≤ 16 characters. */
  tag?: string
  /** Total vs active parameters, in the same unit. */
  params: { total: number; active: number; unit: string; activeLabel?: string }
  /** 4–8 spec rows: label ≤ 6, value ≤ 18 CJK characters. Each row is a build step. */
  specs: { label: string; value: string }[]
  /** 2–5 chips under the name, ≤ 8 characters each. */
  chips?: string[]
}

/** A model "ID card": name and chips, a total-vs-active parameter meter, and a list of spec rows on the right. */
export function ModelSpecCard({ kicker, title, lead, source, hint, name, tag, params, specs, chips }: ModelSpecCardProps) {
  const ratio = params.active / params.total
  return (
    <section className="slide">
      <Hint id="spec">{hint}</Hint>
      <div className="frame s-chart">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className="mcard">
          <div className="mcard__id">
            {tag && <p className="mcard__tag">{tag}</p>}
            <p className="mcard__name">{name}</p>
            {chips && (
              <p className="mcard__chips">
                {chips.map((c) => (
                  <span key={c}>{c}</span>
                ))}
              </p>
            )}
            <div className="mcard__meter">
              <p>
                <b>{params.total}</b>
                <small>{params.unit} 总参数</small>
              </p>
              <div className="mcard__track" style={vars({ '--w': Math.max(ratio, 0.006) })} aria-hidden>
                <i />
              </div>
              <p className="mcard__active">
                <b>{params.active}</b>
                <small>
                  {params.unit} {params.activeLabel ?? '激活'}
                </small>
              </p>
            </div>
          </div>
          <dl className="mcard__specs">
            {specs.map((s) => (
              <div key={s.label} data-build>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
