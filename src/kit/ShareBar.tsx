import { Reveal } from '../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from './shared'

export interface ShareRow {
  /** ≤ 10 CJK characters. */
  label: string
  /** One share per legend entry, in percent. Should add up to 100. */
  values: number[]
  /** Muted line under the label, ≤ 16 CJK characters. */
  note?: string
}

export interface ShareBarProps extends SlideBase {
  /** 2–5 segment names, ≤ 6 CJK characters each. */
  legend: string[]
  /** 3–6 rows to compare. */
  rows: ShareRow[]
  /** The segment the slide is about: it turns accent in every row. */
  focus?: number
  /** One line under the chart, ≤ 50 CJK characters. */
  footnote?: string
}

/** 100% stacked bars: how a whole splits up, row against row. Hover a segment to read it. */
export function ShareBar({ kicker, title, lead, source, hint, legend, rows, focus, footnote }: ShareBarProps) {
  return (
    <section className="slide">
      <Hint id="share">{hint}</Hint>
      <div className="frame s-share">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className="share__legend">
          {legend.map((l, k) => (
            <span key={l} className={`share__key is-${k}${focus === k ? ' is-focus' : ''}`}>
              {l}
            </span>
          ))}
        </Reveal>
        <div className="share">
          {rows.map((r, i) => (
            <Reveal key={r.label} build i={i * 0.6 + 3.6} className="share__row">
              <div className="share__label">
                <b>{r.label}</b>
                {r.note && <span>{r.note}</span>}
              </div>
              <div className="share__bar" style={vars({ animationDelay: `${480 + i * 110}ms` })}>
                {r.values.map((v, k) => (
                  <span key={k} className={`share__seg is-${k}${focus === k ? ' is-focus' : ''}`} style={{ flexGrow: v }} title={`${legend[k]} ${v}%`}>
                    {v >= 7 && <em>{v}%</em>}
                  </span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
        {footnote && (
          <Reveal i={rows.length * 0.6 + 4} className="mx__foot">
            {footnote}
          </Reveal>
        )}
        <SlideFoot source={source} i={rows.length * 0.6 + 5} />
      </div>
    </section>
  )
}
