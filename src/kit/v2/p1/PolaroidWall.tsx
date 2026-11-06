import { Reveal } from '../../../deck/primitives'
import { Hint, SlideHead, SlideFoot, type SlideBase } from '../../shared'
import { Photo, type PhotoImage } from './img'

export interface Polaroid {
  image: PhotoImage
  /** Handwritten-style note under the photo, ≤ 10 字. */
  note: string
}

export interface PolaroidWallProps extends SlideBase {
  /** 3–5 polaroids, pinned with a slight tilt; each one build step. */
  items: Polaroid[]
}

const TILT = [-4, 3, -2, 4.5, -3.5]
const LIFT = [10, -14, 18, -6, 12]

/** Polaroid wall: 3–5 square prints with tape, each slightly rotated, a serif-italic note under each. */
export function PolaroidWall({ kicker, title, lead, items, source, hint }: PolaroidWallProps) {
  return (
    <section className="slide">
      <Hint id="polaroidwall">{hint}</Hint>
      <div className="frame v21-pola">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className={`v21-pola__row v21-pola__row--${items.length}`}>
          {items.slice(0, 5).map((it, i) => (
            <Reveal key={i} i={3 + i} build>
              <div className="v21-pola__card" style={{ rotate: `${TILT[i]}deg`, translate: `0 calc(${LIFT[i]} * var(--u))` }}>
                <i className="v21-pola__tape" aria-hidden />
                <Photo image={it.image} />
                <p className="v21-pola__note">{it.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
