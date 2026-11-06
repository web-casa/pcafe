import { Reveal } from '../../../deck/primitives'
import { fmt } from '../../chart-util'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from '../../shared'

export interface SpikeCallout {
  /** Index into x. */
  at: number
  /** ≤ 24 CJK characters. */
  text: string
}

export interface SpikeChartProps extends SlideBase {
  /** 3–24 x labels, each ≤ 8 characters. */
  x: string[]
  values: number[]
  /** Unit after the value labels, ≤ 6 characters. */
  unit?: string
  decimals?: number
  /** 0–3 callouts; with build each one is a step. The largest value is always labelled. */
  callouts?: SpikeCallout[]
  /** Line under the chart (e.g. which values are derived), ≤ 50 CJK characters. */
  note?: string
}

const W = 1600
const H = 520

/** A glowing area line where one spike dominates; the peak is labelled, callouts step in. */
export function SpikeChart({ kicker, title, lead, source, hint, x, values, unit = '', decimals = 0, callouts = [], note }: SpikeChartProps) {
  const max = Math.max(...values) || 1
  const peak = values.indexOf(max)
  const px = (i: number) => (x.length === 1 ? W / 2 : (i / (x.length - 1)) * W)
  const py = (v: number) => H - (v / max) * (H - 40)
  const line = values.map((v, i) => `${i ? 'L' : 'M'}${px(i).toFixed(1)},${py(v).toFixed(1)}`).join('')
  const area = `${line}L${W},${H}L0,${H}Z`
  return (
    <section className="slide">
      <Hint id="spike">{hint}</Hint>
      <div className="frame s-chart">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className="v33-spike">
          <div className="v33-spike__plot">
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden>
              <defs>
                <linearGradient id="v33-spike-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="var(--accent)" stopOpacity="0.42" />
                  <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0.25, 0.5, 0.75, 1].map((t) => (
                <line key={t} x1={0} x2={W} y1={H - t * (H - 40)} y2={H - t * (H - 40)} className="v33-spike__grid" />
              ))}
              <path d={area} fill="url(#v33-spike-fill)" />
              <path d={line} pathLength={1} className="v33-spike__line" />
            </svg>
            {values.map((v, i) => (
              <span key={i} className={`v33-spike__pt${i === peak ? ' is-peak' : ''}`} style={vars({ '--x': px(i) / W, '--y': py(v) / H })} aria-hidden={i !== peak || undefined}>
                {i === peak && (
                  <b>
                    {fmt(v, decimals)}
                    {unit}
                  </b>
                )}
              </span>
            ))}
            {callouts.map((c) => (
              <p key={c.at} data-build="" className="v33-spike__call" style={vars({ '--x': px(c.at) / W, '--y': py(values[c.at]) / H })}>
                {c.text}
              </p>
            ))}
          </div>
          <div className="v33-spike__x">
            {x.map((l, i) => (
              <span key={l} style={vars({ '--x': px(i) / W })}>
                {l}
              </span>
            ))}
          </div>
          {note && <p className="v33-spike__note">{note}</p>}
        </Reveal>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
