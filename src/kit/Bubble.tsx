import { Reveal } from '../deck/primitives'
import { fmt } from './chart-util'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from './shared'

export interface BubblePoint {
  /** ≤ 8 CJK characters. */
  label: string
  x: number
  y: number
  /** Area of the bubble. Leave out for a plain scatter. */
  size?: number
  /** Where the label sits when neighbours crowd it. Defaults to below. */
  side?: 'below' | 'above' | 'left' | 'right'
}

export interface BubbleAxis {
  /** ≤ 10 CJK characters, unit included. */
  label: string
  min: number
  max: number
}

export interface BubbleProps extends SlideBase {
  /** 3–10 points. */
  points: BubblePoint[]
  x: BubbleAxis
  y: BubbleAxis
  /** What bubble size means, ≤ 12 CJK characters. Shown only when points have size. */
  sizeLabel?: string
  /** Label of the point to emphasise. */
  focus?: string
  /** One-line reading of the chart, ≤ 30 CJK characters. */
  note?: string
}

/** Points on two axes; with `size`, a bubble chart. One point can be the focus. */
export function Bubble({ kicker, title, lead, source, hint, points, x, y, sizeLabel, focus, note }: BubbleProps) {
  const maxSize = Math.max(...points.map((p) => p.size ?? 0)) || 1
  const pos = (v: number, a: BubbleAxis) => (v - a.min) / (a.max - a.min || 1)
  return (
    <section className="slide">
      <Hint id="bubble">{hint}</Hint>
      <div className="frame s-chart">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="bubble">
          <Reveal i={3} className="bubble__plot">
            <span className="bubble__axis bubble__axis--y">{y.label}</span>
            <span className="bubble__axis bubble__axis--x">{x.label}</span>
            {[0, 0.5, 1].map((t) => (
              <span key={`x${t}`} className="bubble__tick bubble__tick--x" style={vars({ '--t': t })}>
                {fmt(x.min + t * (x.max - x.min), (x.max - x.min) % 2 ? 1 : 0)}
              </span>
            ))}
            {[0, 0.5, 1].map((t) => (
              <span key={`y${t}`} className="bubble__tick bubble__tick--y" style={vars({ '--t': t })}>
                {fmt(y.min + t * (y.max - y.min), (y.max - y.min) % 2 ? 1 : 0)}
              </span>
            ))}
            {points.map((p, i) => (
              <div
                key={p.label}
                className={`bubble__pt bubble__pt--${p.side ?? 'below'}${p.label === focus ? ' is-focus' : ''}`}
                data-build={i}
                style={vars({ '--x': pos(p.x, x), '--y': pos(p.y, y), '--d': p.size ? 36 + Math.sqrt(p.size / maxSize) * 130 : 26, '--k': i })}
              >
                <i />
                <span>{p.label}</span>
              </div>
            ))}
          </Reveal>
          {(note || (sizeLabel && points.some((p) => p.size))) && (
            <Reveal i={6} className="bubble__aside">
              {sizeLabel && points.some((p) => p.size) && (
                <div className="bubble__key">
                  <i />
                  <i />
                  <span>{sizeLabel}</span>
                </div>
              )}
              {note && <p className="chart-note">{note}</p>}
            </Reveal>
          )}
        </div>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
