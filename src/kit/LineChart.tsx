import { Reveal } from '../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from './shared'

export interface LineSeries {
  /** Legend name, ≤ 8 CJK characters. */
  name: string
  /** One value per x label; null leaves a gap. */
  values: (number | null)[]
  /** Per-point label override, e.g. '43,000+' for an approximate figure. */
  labels?: (string | undefined)[]
  /** The series the slide is about: accent line, area fill, value labels. Exactly one. */
  focus?: boolean
}

export interface LineChartProps extends SlideBase {
  /** 4–12 x-axis labels: years, quarters, months. ≤ 6 characters each. */
  x: string[]
  /** 1–3 series. */
  series: LineSeries[]
  /** Axis floor. Default 0; raise it only when the change matters more than the size, and say so in the lead. */
  yFrom?: number
  /** Unit shown under the axis, e.g. '个' or '%'. */
  unit?: string
  /** Decimal places for computed labels. Default 0. */
  digits?: number
  /** 1–2 callouts on the focus series: x index and ≤ 16 CJK characters. */
  annotations?: { at: number; text: string }[]
  /** Right-hand reading: 2–3 lines, key ≤ 8, text ≤ 30 CJK characters. */
  notes?: { key: string; text: string }[]
}

function niceTicks(lo: number, hi: number) {
  const raw = (hi - lo) / 4
  const mag = Math.pow(10, Math.floor(Math.log10(raw)))
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw)!
  const top = Math.ceil(hi / step) * step
  const ticks: number[] = []
  for (let t = Math.floor(lo / step) * step; t <= top + step / 2; t += step) ticks.push(t)
  return ticks
}

/** A line chart for change over time. One focus series carries the labels; callouts sit below the line. */
export function LineChart({ kicker, title, lead, source, hint, x, series, yFrom = 0, unit, digits = 0, annotations = [], notes }: LineChartProps) {
  const all = series.flatMap((s) => s.values.filter((v): v is number => v !== null))
  const ticks = niceTicks(yFrom, Math.max(...all) * 1.06)
  const lo = ticks[0]
  const hi = ticks.at(-1)!
  const px = (i: number) => 4 + (i * 92) / Math.max(1, x.length - 1)
  const py = (v: number) => ((v - lo) / (hi - lo)) * 100
  const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })
  const path = (vals: (number | null)[]) =>
    vals
      .map((v, i) => (v === null ? null : `${px(i) * 10},${(100 - py(v)) * 4}`))
      .filter(Boolean)
      .join(' ')
  const focus = series.find((s) => s.focus) ?? series[0]
  const fv = focus.values
  const firstI = fv.findIndex((v) => v !== null)
  const lastI = fv.length - 1 - [...fv].reverse().findIndex((v) => v !== null)
  const area = `${px(firstI) * 10},400 ${path(fv)} ${px(lastI) * 10},400`

  return (
    <section className="slide">
      <Hint id="line">{hint}</Hint>
      <div className="frame s-line">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className={`line__body${notes ? ' has-notes' : ''}`}>
          <Reveal i={3} className="line" y={16}>
            {series.length > 1 && (
              <ul className="line__legend">
                {series.map((s) => (
                  <li key={s.name} className={s === focus ? 'is-focus' : undefined}>
                    {s.name}
                  </li>
                ))}
              </ul>
            )}
            <div className="line__plot">
              {ticks.map((t) => (
                <span key={t} className="line__grid" style={vars({ bottom: `${py(t)}%` })}>
                  <b>{fmt(t)}</b>
                </span>
              ))}
              <svg className="line__svg" viewBox="0 0 1000 400" preserveAspectRatio="none" aria-hidden>
                <polygon className="line__area" points={area} />
                {series.map((s) => (
                  <polyline key={s.name} className={s === focus ? 'is-focus' : undefined} points={path(s.values)} />
                ))}
              </svg>
              {series.map((s) =>
                s.values.map((v, i) =>
                  v === null ? null : (
                    <span
                      key={`${s.name}${i}`}
                      className={`line__pt${s === focus ? ' is-focus' : ''}${i === lastI && s === focus ? ' is-last' : ''}`}
                      style={vars({ left: `${px(i)}%`, bottom: `${py(v)}%`, animationDelay: `${520 + i * 90}ms` })}
                    >
                      {s === focus && <b>{s.labels?.[i] ?? fmt(v)}</b>}
                    </span>
                  ),
                ),
              )}
              {annotations.map((a) => {
                const v = fv[a.at]
                if (v === null || v === undefined) return null
                return (
                  <span key={a.at} className="line__note" style={vars({ left: `${px(a.at)}%`, '--top': `${100 - py(v)}%` })}>
                    <em>{a.text}</em>
                  </span>
                )
              })}
            </div>
            <div className="line__x">
              {x.map((l, i) => (
                <span key={l} style={vars({ left: `${px(i)}%` })}>
                  {l}
                </span>
              ))}
            </div>
            {unit && <span className="line__unit">单位 · {unit}</span>}
          </Reveal>
          {notes && (
            <dl className="line__notes">
              {notes.map((n, i) => (
                <Reveal key={n.key} build i={i + 6}>
                  <dt>{n.key}</dt>
                  <dd>{n.text}</dd>
                </Reveal>
              ))}
            </dl>
          )}
        </div>
        <SlideFoot source={source} i={9} />
      </div>
    </section>
  )
}
