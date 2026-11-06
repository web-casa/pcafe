import { Kicker, Reveal } from '../deck/primitives'
import { Hint, Lines, SlideFoot, vars, type SlideBase } from './shared'

export interface TiltShotProps extends SlideBase {
  /** A real screenshot of a real product. */
  src: string
  alt: string
  /** Image width ÷ height. Default 16 / 10. */
  ratio?: number
  /** 2–3 points read after the screenshot turns upright. */
  points: { title: string; body: string }[]
}

/**
 * A screenshot shown tilted in perspective; the first press (with `build: 'reveal'`) turns it
 * upright for reading, the next presses bring in the points. Without `build` it shows upright.
 */
export function TiltShot({ kicker, title, lead, source, hint = '按 → 摆正截图', src, alt, ratio = 16 / 10, points }: TiltShotProps) {
  return (
    <section className="slide">
      <Hint id="tiltshot">{hint}</Hint>
      <div className="frame s-tilt">
        <div className="tilt__stage">
          <Reveal i={2} y={30}>
            <div className="tilt__shot" data-build={0} style={vars({ '--ar': ratio })}>
              <img src={src} alt={alt} draggable={false} />
            </div>
          </Reveal>
        </div>
        <div className="tilt__copy">
          <Reveal i={0}>
            <Kicker>{kicker}</Kicker>
          </Reveal>
          <Reveal i={1}>
            <h2 className="s-title">
              <Lines text={title} />
            </h2>
          </Reveal>
          {lead && (
            <Reveal i={2}>
              <p className="s-lead">{lead}</p>
            </Reveal>
          )}
          <ol className="tilt__points">
            {points.map((p, i) => (
              <li key={p.title} data-build={i + 1}>
                <Reveal i={3 + i * 0.5}>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
