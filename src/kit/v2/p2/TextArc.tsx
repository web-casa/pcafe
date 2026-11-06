import { useId } from 'react'
import { Kicker, Reveal } from '../../../deck/primitives'
import { Hint, Lines, SlideFoot, type Text } from '../../shared'

export interface TextArcProps {
  kicker: string
  /** ≤ 2 lines × 8 CJK characters. */
  title: Text
  /** ≤ 60 CJK characters. */
  lead?: string
  /** 0–3 short points, each ≤ 24 CJK characters. */
  points?: string[]
  /** Text set around the circle, 16–44 characters (Latin counts 1, CJK counts 2). Repeat a phrase with " · " to close the ring. */
  ring: string
  /** Big word or figure in the middle of the ring, ≤ 5 characters. */
  center: string
  /** Line under the centre figure, ≤ 8 CJK characters. */
  centerLabel?: string
  /** Optional decorative image filling the disc (imported asset). */
  image?: string
  alt?: string
  credit?: string
  source?: string
  hint?: React.ReactNode
}

/** Editorial ring: a line of text set around a circle (SVG textPath, still real text) that turns into place, with a figure in the middle. */
export function TextArc({ kicker, title, lead, points = [], ring, center, centerLabel, image, alt = '', credit, source, hint }: TextArcProps) {
  const id = useId().replace(/:/g, '')
  return (
    <section className="slide">
      <Hint id="textarc">{hint}</Hint>
      <div className="frame x2-ta">
        <div className="x2-ta__copy">
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
          {points.length > 0 && (
            <ul className="x2-ta__points">
              {points.map((p, i) => (
                <Reveal key={i} i={3 + i}>
                  <li>{p}</li>
                </Reveal>
              ))}
            </ul>
          )}
          <SlideFoot source={source} />
        </div>
        <Reveal i={2} y={0} className="x2-ta__art" build>
          <div className="x2-ta__disc" data-crop>
            {image && <img src={image} alt={alt} className="x2-ta__img" />}
            <div className="x2-ta__center">
              <b>{center}</b>
              {centerLabel && <span>{centerLabel}</span>}
            </div>
          </div>
          <svg className="x2-ta__ring" viewBox="0 0 720 720" width="720" height="720">
            <defs>
              <path id={`ring${id}`} d="M360,360 m-318,0 a318,318 0 1,1 636,0 a318,318 0 1,1 -636,0" />
            </defs>
            <circle cx="360" cy="360" r="290" className="x2-ta__hair" aria-hidden />
            <text className="x2-ta__text">
              <textPath href={`#ring${id}`} textLength={1990} lengthAdjust="spacing">
                {ring}
              </textPath>
            </text>
          </svg>
          {credit && <p className="x2-ta__credit">{credit}</p>}
        </Reveal>
      </div>
    </section>
  )
}
