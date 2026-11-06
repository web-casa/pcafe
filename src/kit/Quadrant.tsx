import { Reveal } from '../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from './shared'

export interface QuadrantPoint {
  /** ≤ 8 CJK characters. */
  label: string
  /** 0–100 along each axis. Keep points ≥ 8 apart so labels don't collide. */
  x: number
  y: number
  /** Accent dot with a pulse ring: "us" or the target position. */
  focus?: boolean
}

export interface QuadrantProps extends SlideBase {
  /** Axis ends as [low, high], each ≤ 6 CJK characters. */
  x: [string, string]
  y: [string, string]
  /** Quadrant names in reading order: top-left, top-right, bottom-left, bottom-right. ≤ 8 CJK characters each. */
  zones?: [string, string, string, string]
  /** 3–7 points. */
  points: QuadrantPoint[]
  /** Right-hand notes: 2–3 short paragraphs, title ≤ 10, body ≤ 40 CJK characters. */
  notes: { title: string; body: string }[]
}

/** A 2 × 2 positioning map. The focus point pulses; hover any point to lift its label. */
export function Quadrant({ kicker, title, lead, source, hint, x, y, zones, points, notes }: QuadrantProps) {
  return (
    <section className="slide">
      <Hint id="quadrant">{hint}</Hint>
      <div className="frame s-quad">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="quad__body">
          <Reveal i={3} className="quad" y={16}>
            <div className="quad__plot">
              {zones?.map((z, i) => (
                <span key={z} className={`quad__zone is-${i}`}>
                  {z}
                </span>
              ))}
              <span className="quad__axis is-x" aria-hidden />
              <span className="quad__axis is-y" aria-hidden />
              {points.map((p, i) => (
                <span
                  key={p.label}
                  className={`quad__pt${p.focus ? ' is-focus' : ''}${p.x > 72 ? ' is-left' : ''}`}
                  style={vars({ left: `${p.x}%`, bottom: `${p.y}%`, animationDelay: `${600 + i * 110}ms` })}
                >
                  <i />
                  <b>{p.label}</b>
                </span>
              ))}
            </div>
            <span className="quad__x">
              <span>{x[0]}</span>
              <span>{x[1]} →</span>
            </span>
            <span className="quad__y">
              <span>↑ {y[1]}</span>
              <span>{y[0]}</span>
            </span>
          </Reveal>
          <div className="quad__notes">
            {notes.map((n, i) => (
              <Reveal key={n.title} build i={i + 5} className="quad__note">
                <h3>{n.title}</h3>
                <p>{n.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
        <SlideFoot source={source} i={9} />
      </div>
    </section>
  )
}
