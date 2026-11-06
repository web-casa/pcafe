import { Kicker, Reveal } from '../../../deck/primitives'
import { Hint, Lines, SlideFoot, type Text } from '../../shared'
import { Photo, type PhotoImage } from './img'

export interface StackPhoto {
  image: PhotoImage
  /** ≤ 10 字. */
  title: string
  /** ≤ 32 字. */
  body: string
}

export interface PhotoStackProps {
  kicker: string
  /** ≤ 2 lines × 8 字. */
  title: Text
  /** 3–4 photos. Credits are merged into the source line. Each build step drops the next print on the pile and lights its caption. */
  photos: StackPhoto[]
  source?: string
  hint?: string
}

const TILT = [-5, 4, -2.5, 6]
const SHIFT = [[-30, 10], [40, -20], [-10, 30], [24, 0]]

/** A pile of prints: each step lands the next photo on top, slightly turned, while its caption lights up on the left. */
export function PhotoStack({ kicker, title, photos, source, hint }: PhotoStackProps) {
  const p = photos.slice(0, 4)
  return (
    <section className="slide">
      <Hint id="photostack">{hint}</Hint>
      <div className="frame v21-stack">
        <div className="v21-stack__copy">
          <Reveal i={0}>
            <Kicker>{kicker}</Kicker>
          </Reveal>
          <Reveal i={1}>
            <h2 className="s-title">
              <Lines text={title} />
            </h2>
          </Reveal>
          <ol className="v21-stack__list">
            {p.map((ph, i) => (
              <Reveal key={i} i={2 + i} build={`s${i}`}>
                <li>
                  <b>{String(i + 1).padStart(2, '0')}</b>
                  <div>
                    <strong>{ph.title}</strong>
                    <span>{ph.body}</span>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
          <SlideFoot source={[...new Set(p.map((ph) => ph.image.credit).filter(Boolean)), source].filter(Boolean).join(' · ') || undefined} />
        </div>
        <div className="v21-stack__pile">
          {p.map((ph, i) => (
            <Reveal key={i} i={2 + i} y={0} build={`s${i}`} className="v21-stack__slot">
              <div className="v21-stack__print" style={{ rotate: `${TILT[i]}deg`, translate: `calc(${SHIFT[i][0]} * var(--u)) calc(${SHIFT[i][1]} * var(--u))` }}>
                <Photo image={{ ...ph.image, credit: undefined }} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
