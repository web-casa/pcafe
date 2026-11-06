import { Reveal } from '../../../deck/primitives'
import { fmt } from '../../chart-util'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from '../../shared'
import { SHADES, niceTicks } from './util'

export interface AreaSeries {
  /** ≤ 6 CJK characters. Bottom of the stack first. */
  name: string
  values: number[]
}

export interface StackedAreaProps extends SlideBase {
  /** 4–30 x points; give `ticks` to label only some. */
  x: string[]
  /** 2–6 series, bottom first. */
  series: AreaSeries[]
  /** 'share' turns every column into 100 %. */
  mode?: 'value' | 'share'
  /** Indexes of x to label. Default: every one if ≤ 12, else first, last and every 5th. */
  ticks?: number[]
  unit?: string
  /** Series drawn in the accent. */
  focus?: string
}

/** Layers that add up to a total over time. With build, layers stack from the bottom one by one. */
export function StackedArea({ kicker, title, lead, source, hint, x, series, mode = 'value', ticks, unit, focus }: StackedAreaProps) {
  const totals = x.map((_, i) => series.reduce((n, s) => n + (s.values[i] ?? 0), 0))
  const share = mode === 'share'
  const vals = series.map((s) => s.values.map((v, i) => (share ? ((v ?? 0) / (totals[i] || 1)) * 100 : v ?? 0)))
  const yt = share ? [0, 25, 50, 75, 100] : niceTicks(0, Math.max(...totals))
  const top = yt.at(-1)!
  const px = (i: number) => (i / (x.length - 1)) * 1000
  const py = (v: number) => 400 - (v / top) * 400
  const cum: number[][] = []
  vals.forEach((v, k) => cum.push(v.map((n, i) => n + (k ? cum[k - 1][i] : 0))))
  const shape = (k: number) => {
    const upper = cum[k].map((v, i) => `${px(i)},${py(v)}`)
    const lower = (k ? cum[k - 1] : x.map(() => 0)).map((v, i) => `${px(i)},${py(v)}`).reverse()
    return [...upper, ...lower].join(' ')
  }
  const show = ticks ?? (x.length <= 12 ? x.map((_, i) => i) : x.map((_, i) => i).filter((i) => i === 0 || i === x.length - 1 || i % 5 === 0))
  const last = x.length - 1
  // Right-hand labels at each layer's last midpoint, nudged apart so thin layers stay legible.
  const GAP = 0.085
  const pos = series.map((_, k) => (cum[k][last] - vals[k][last] / 2) / top)
  for (let k = 1; k < pos.length; k++) pos[k] = Math.max(pos[k], pos[k - 1] + GAP)
  for (let k = pos.length - 1; k >= 0; k--) pos[k] = Math.min(pos[k], (k === pos.length - 1 ? 0.97 : pos[k + 1] - GAP))
  let grey = 0
  return (
    <section className="slide">
      <Hint id="stack">{hint}</Hint>
      <div className="frame s-chart">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className="sarea">
          <div className="sarea__plot">
            {yt.map((t) => (
              <span key={t} className="sarea__grid" style={vars({ '--at': t / top })}>
                <b>{fmt(t)}</b>
              </span>
            ))}
            {series.map((s, k) => {
              const c = s.name === focus ? 'var(--accent)' : SHADES[grey++ % SHADES.length]
              return (
                <div key={s.name} className={`sarea__layer${s.name === focus ? ' is-focus' : ''}`} data-build={`area-${k}`} style={vars({ '--c': c, '--k': k })}>
                  <svg viewBox="0 0 1000 400" preserveAspectRatio="none" aria-hidden>
                    <polygon points={shape(k)} />
                  </svg>
                  <span className="sarea__name" style={vars({ '--at': pos[k] })}>
                    <i />
                    {s.name}
                    <b>
                      {fmt(vals[k][last], share ? 1 : 0)}
                      {share ? '%' : ''}
                    </b>
                  </span>
                </div>
              )
            })}
          </div>
          <div className="sarea__x">
            {show.map((i) => (
              <span key={i} style={vars({ '--at': i / last })}>
                {x[i]}
              </span>
            ))}
          </div>
          {unit && <span className="sarea__unit">单位 · {unit}</span>}
        </Reveal>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
