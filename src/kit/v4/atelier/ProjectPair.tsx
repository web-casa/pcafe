import { Reveal } from '../../../deck/primitives'
import { Hint, Lines, SlideFoot, type Text } from '../../shared'
import { Photo, type PhotoImage } from '../../v2/p1/img'

export interface PairProject {
  image: PhotoImage
  /** Client · project, ≤ 16 字. */
  name: string
  /** What it was, ≤ 8 字. */
  tag: string
}

export interface ProjectPairProps {
  /** Pill above the title, ≤ 6 字. */
  kicker: string
  /** ≤ 2 lines × 9 字. */
  title: Text
  /** Exactly 2 projects, landscape images. */
  projects: PairProject[]
  source?: string
  hint?: string
}

/** Two featured projects side by side under a centred title; the images wipe up and lean in on hover. Made for `atelier`, works in any style. */
export function ProjectPair({ kicker, title, projects, source, hint }: ProjectPairProps) {
  return (
    <section className="slide">
      <Hint id="projectpair">{hint}</Hint>
      <div className="frame at-pair">
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
        <div className="at-pair__row">
          {projects.slice(0, 2).map((p, i) => (
            <figure className="at-work" key={p.name} data-build="">
              <div className="at-work__img" style={{ animationDelay: `${0.35 + i * 0.15}s` }}>
                <Photo image={p.image} />
              </div>
              <Reveal i={5 + i * 1.5} y={12}>
                <figcaption>
                  <b>{p.name}</b>
                  <span>{p.tag}</span>
                </figcaption>
              </Reveal>
            </figure>
          ))}
        </div>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
