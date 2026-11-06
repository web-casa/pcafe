import { Reveal } from '../../../deck/primitives'
import { fmt } from '../../chart-util'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from '../../shared'
import { niceTicks } from './util'

export interface ScatterPoint {
  /** ≤ 6 CJK characters; printed only for labelled points. */
  name: string
  x: number
  y: number
  /** Print the name next to the dot. Keep it to ≤ 8 points. */
  label?: boolean
  /** Accent dot. */
  focus?: boolean
}

export interface ScatterProps extends SlideBase {
  /** 6–60 points. */
  points: ScatterPoint[]
  /** Axis names with unit, ≤ 14 CJK characters each. */
  xLabel: string
  yLabel: string
  /** Quadrant split lines (data values). Omit both for a plain scatter. */
  split?: { x: number; y: number }
  /** Quadrant names, ≤ 8 CJK characters: [top-left, top-right, bottom-left, bottom-right]. Each is a build step. */
  quadrants?: [string, string, string, string]
  xDecimals?: number
  yDecimals?: number
}

/** Dots on two measures, split into four quadrants that are named one by one. */
export function Scatter({ kicker, title, lead, source, hint, points, xLabel, yLabel, split, quadrants, xDecimals = 0, yDecimals = 0 }: ScatterProps) {
  const xt = niceTicks(Math.min(0, ...points.map((p) => p.x)), Math.max(...points.map((p) => p.x)))
  const yt = niceTicks(Math.min(0, ...points.map((p) => p.y)), Math.max(...points.map((p) => p.y)))
  const px = (v: number) => (v - xt[0]) / (xt.at(-1)! - xt[0])
  const py = (v: number) => (v - yt[0]) / (yt.at(-1)! - yt[0])
  return (
    <section className="slide">
      <Hint id="scatter">{hint}</Hint>
      <div className="frame s-chart">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className="scat">
          <span className="scat__ylabel">{yLabel}</span>
          <div className="scat__plot">
            {yt.map((t) => (
              <span key={`y${t}`} className="scat__gy" style={vars({ '--at': py(t) })}>
                <b>{fmt(t, t % 1 ? Math.max(1, yDecimals) : yDecimals)}</b>
              </span>
            ))}
            {xt.map((t) => (
              <span key={`x${t}`} className="scat__gx" style={vars({ '--at': px(t) })}>
                <b>{fmt(t, t % 1 ? Math.max(1, xDecimals) : xDecimals)}</b>
              </span>
            ))}
            {split && (
              <>
                <i className="scat__split is-x" style={vars({ '--at': px(split.x) })} aria-hidden />
                <i className="scat__split is-y" style={vars({ '--at': py(split.y) })} aria-hidden />
              </>
            )}
            {split &&
              quadrants?.map((q, i) => (
                <span key={q} className={`scat__quad q${i}`} data-build={`q${i}`} style={vars({ '--sx': px(split.x), '--sy': py(split.y) })}>
                  {q}
                </span>
              ))}
            {points.map((p, i) => (
              <span key={p.name} className={`scat__pt${p.focus ? ' is-focus' : ''}${p.label ? ' has-label' : ''}${px(p.x) > 0.8 ? ' is-left' : ''}`} style={vars({ '--x': px(p.x), '--y': py(p.y), '--k': i })}>
                {p.label && <b>{p.name}</b>}
              </span>
            ))}
          </div>
          <span className="scat__xlabel">{xLabel}</span>
        </Reveal>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
