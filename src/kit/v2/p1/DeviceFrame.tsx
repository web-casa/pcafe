import { Reveal } from '../../../deck/primitives'
import { Hint, SlideHead, SlideFoot, type SlideBase } from '../../shared'
import type { PhotoImage } from './img'

export interface DevicePoint {
  /** ≤ 10 字. */
  title: string
  /** ≤ 30 字. */
  body: string
}

export interface DeviceFrameProps extends SlideBase {
  /** A real screenshot. laptop: 16:10 / 16:9; tablet: 4:3; phone: 9:19.5. */
  image: PhotoImage
  device?: 'laptop' | 'tablet' | 'phone'
  /** 0–3 callouts beside the device, each one build step. */
  points?: DevicePoint[]
}

/** Real screenshot inside a drawn laptop, tablet or phone frame, with up to three callouts beside it. */
export function DeviceFrame({ kicker, title, lead, image, device = 'laptop', points = [], source, hint }: DeviceFrameProps) {
  return (
    <section className="slide">
      <Hint id="deviceframe">{hint}</Hint>
      <div className={`frame v21-device v21-device--${device}`}>
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="v21-device__body">
          <Reveal i={3} y={40} className="v21-device__stage">
            <div className="v21-device__shell">
              <div className="v21-device__screen" data-crop>
                <img src={image.src} alt={image.alt} draggable={false} style={{ objectPosition: image.focus ?? 'top center' }} />
              </div>
            </div>
            {device === 'laptop' && <i className="v21-device__base" aria-hidden />}
          </Reveal>
          {points.length > 0 && (
            <ol className="v21-device__points">
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
        </div>
        <SlideFoot source={[image.credit, source].filter(Boolean).join(' · ') || undefined} />
      </div>
    </section>
  )
}
