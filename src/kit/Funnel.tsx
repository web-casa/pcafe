import { Reveal } from '../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from './shared'

export interface FunnelStage {
  /** ≤ 8 CJK characters. */
  label: string
  value: number
  /** Muted line under the label: what counts as this stage. ≤ 18 CJK characters. */
  note?: string
}

export interface FunnelProps extends SlideBase {
  /** 4–6 stages from widest to narrowest. Conversion between stages is computed. */
  stages: FunnelStage[]
  /** Index of the step to fix first: the drop from stage `leak` to `leak + 1` turns accent. Pick it by impact, not just the lowest rate. */
  leak?: number
  /** Chip text on the leak step. Default '优先修复'. */
  leakLabel?: string
  /** Unit after each value, e.g. '人' or '个'. */
  unit?: string
  /** Right-hand column: why the leak matters and what to try, ≤ 3 lines. */
  aside?: { title: string; body: string }
}

const fmt = (n: number) => n.toLocaleString('en-US')
const pct = (a: number, b: number) => {
  const p = (b / a) * 100
  return p >= 10 ? `${Math.round(p)}%` : `${p.toFixed(1)}%`
}

/** A conversion funnel. Bars narrow evenly (not to scale); conversion between stages is computed and the step to fix is called out. */
export function Funnel({ kicker, title, lead, source, hint, stages, leak, leakLabel = '优先修复', unit = '', aside }: FunnelProps) {
  const top = stages[0].value
  // Bars narrow evenly so every stage stays legible; the numbers carry the data.
  const step = 58 / Math.max(1, stages.length - 1)
  return (
    <section className="slide">
      <Hint id="funnel">{hint}</Hint>
      <div className="frame s-funnel">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="funnel__body">
          <ol className="funnel">
            {stages.map((s, i) => {
              const w = 100 - i * step
              const next = stages[i + 1]
              return (
                <li key={s.label} className="funnel__step" data-build>
                  <Reveal i={i * 0.8 + 3} className="funnel__row">
                    <div className="funnel__label">
                      <b>{s.label}</b>
                      {s.note && <span>{s.note}</span>}
                    </div>
                    <div className="funnel__lane">
                      <span className="funnel__bar" style={vars({ '--w': `${w}%`, '--o': 1 - i * 0.12, animationDelay: `${420 + i * 120}ms` })} />
                    </div>
                    <div className="funnel__value">
                      {fmt(s.value)}
                      <small>{unit}</small>
                    </div>
                  </Reveal>
                  {next && (
                    <Reveal i={i * 0.8 + 3.4} className={`funnel__rate${leak === i ? ' is-leak' : ''}`}>
                      <span>
                        {pct(s.value, next.value)}
                        {leak === i && <em>{leakLabel}</em>}
                      </span>
                    </Reveal>
                  )}
                </li>
              )
            })}
          </ol>
          {aside && (
            <Reveal i={stages.length * 0.8 + 3} className="funnel__aside">
              <p className="funnel__aside-k">全程转化 {pct(top, stages[stages.length - 1].value)}</p>
              <h3>{aside.title}</h3>
              <p>{aside.body}</p>
            </Reveal>
          )}
        </div>
        <SlideFoot source={source} i={stages.length * 0.8 + 4} />
      </div>
    </section>
  )
}
