import { Kicker, Reveal } from '../../../deck/primitives'
import { Hint, Lines, SlideFoot, type Text } from '../../shared'
import { Photo, type PhotoImage } from './img'

export interface PhotoSplitPoint {
  /** ≤ 10 字. */
  title: string
  /** ≤ 36 字. */
  body: string
}

export interface PhotoSplitProps {
  image: PhotoImage
  /** Which half holds the photo. Default 'left'. */
  side?: 'left' | 'right'
  kicker: string
  /** ≤ 3 lines × 9 字. */
  title: Text
  /** ≤ 60 字. */
  lead?: string
  /** 0–3 points, each one build step. */
  points?: PhotoSplitPoint[]
  source?: string
  hint?: string
}

/** Half photo, half text. The photo bleeds to the slide edge on its side. */
export function PhotoSplit({ image, side = 'left', kicker, title, lead, points = [], source, hint }: PhotoSplitProps) {
  return (
    <section className={`slide v21-psplit v21-psplit--${side}`}>
      <Hint id="photosplit">{hint}</Hint>
      <Reveal i={0} y={0} className="v21-psplit__img">
        <Photo image={image} />
      </Reveal>
      <div className="frame v21-psplit__frame">
        <div className="v21-psplit__copy">
          <Reveal i={1}>
            <Kicker>{kicker}</Kicker>
          </Reveal>
          <Reveal i={2}>
            <h2 className="s-title">
              <Lines text={title} />
            </h2>
          </Reveal>
          {lead && (
            <Reveal i={3}>
              <p className="s-lead v21-psplit__lead">{lead}</p>
            </Reveal>
          )}
          {points.length > 0 && (
            <ol className="v21-psplit__points">
              {points.map((p, i) => (
                <Reveal key={p.title} i={4 + i} build>
                  <li>
                    <b>{p.title}</b>
                    <span>{p.body}</span>
                  </li>
                </Reveal>
              ))}
            </ol>
          )}
          <SlideFoot source={source} />
        </div>
      </div>
    </section>
  )
}
