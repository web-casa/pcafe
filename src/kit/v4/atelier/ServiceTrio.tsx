import { Reveal } from '../../../deck/primitives'
import { Hint, Lines, SlideFoot, type Text } from '../../shared'
import { Photo, type PhotoImage } from '../../v2/p1/img'

export interface TrioService {
  image: PhotoImage
  /** ≤ 6 字. */
  title: string
  /** ≤ 30 字. */
  body: string
  /** 2–3 small tags, each ≤ 6 字. */
  tags?: string[]
}

export interface ServiceTrioProps {
  kicker: string
  /** 1 line, ≤ 14 字. */
  title: Text
  /** Exactly 3 services; each card is a build step with `build: 'reveal'`. */
  services: TrioService[]
  source?: string
  hint?: string
}

/** Three services as soft cards: a photo on top, a number, a title, one line and small tags. Made for `atelier`, works in any style. */
export function ServiceTrio({ kicker, title, services, source, hint }: ServiceTrioProps) {
  return (
    <section className="slide">
      <Hint id="servicetrio">{hint}</Hint>
      <div className="frame at-trio">
        <div className="at-center">
          <Reveal i={0} className="at-pill">
            {kicker}
          </Reveal>
          <Reveal i={1}>
            <h2 className="at-title">
              <Lines text={title} />
            </h2>
          </Reveal>
        </div>
        <div className="at-trio__row">
          {services.slice(0, 3).map((s, i) => (
            <Reveal key={s.title} i={3 + i} y={36} build className="at-card">
              <div className="at-card__img">
                <Photo image={s.image} />
              </div>
              <span className="at-card__n">{String(i + 1).padStart(2, '0')}</span>
              <b>{s.title}</b>
              <p>{s.body}</p>
              {s.tags && (
                <div className="at-tags">
                  {s.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              )}
            </Reveal>
          ))}
        </div>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
