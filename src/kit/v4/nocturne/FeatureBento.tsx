import { Reveal } from '../../../deck/primitives'
import { Hint, Lines, type Text } from '../../shared'
import { Photo, type PhotoImage } from '../../v2/p1/img'

export interface BentoSmall {
  /** Tiny chip, ≤ 6 个字符. */
  tag: string
  /** ≤ 8 字. */
  title: string
  /** ≤ 20 字. */
  body: string
  image: PhotoImage
}

export interface FeatureBentoProps {
  /** Pill above the title, ≤ 16 个字符. */
  kicker: string
  /** ≤ 2 lines × 8 字. */
  title: Text
  /** Big accent card: title ≤ 8 字, body ≤ 26 字, 3 portraits fanned out. */
  hero: { title: string; body: string; images: PhotoImage[] };
  /** Big dark card: title ≤ 8 字, body ≤ 26 字, 6–8 labelled thumbnails (label ≤ 4 字). */
  grid: { title: string; body: string; items: { image: PhotoImage; label: string }[] }
  /** Exactly 3 small cards along the bottom. */
  small: BentoSmall[]
  hint?: string
}

/** Features as a bento: a glowing accent card with fanned portraits, a grid of style thumbnails, and three small cards with pictures. Made for `nocturne`, works in any style. */
export function FeatureBento({ kicker, title, hero, grid, small, hint }: FeatureBentoProps) {
  return (
    <section className="slide">
      <Hint id="featurebento">{hint}</Hint>
      <div className="nc-glow is-top" aria-hidden="true" />
      <div className="frame nc-bento">
        <div className="nc-center">
          <Reveal i={0} className="nc-pill">
            {kicker}
          </Reveal>
          <Reveal i={1}>
            <h2 className="nc-title">
              <Lines text={title} />
            </h2>
          </Reveal>
        </div>
        <div className="nc-bento__grid">
          <Reveal i={3} y={36} className="nc-tile is-accent">
            <div className="nc-tile__hd">
              <b>{hero.title}</b>
              <small>{hero.body}</small>
            </div>
            <div className="nc-fan" data-crop>
              {hero.images.slice(0, 3).map((im, i) => (
                <img key={i} src={im.src} alt={im.alt} style={{ ['--i' as string]: i - 1 }} />
              ))}
            </div>
          </Reveal>
          <Reveal i={4} y={36} className="nc-tile">
            <div className="nc-tile__hd">
              <b>{grid.title}</b>
              <small>{grid.body}</small>
            </div>
            <div className="nc-styles">
              {grid.items.slice(0, 8).map((it, i) => (
                <figure key={it.label} style={{ animationDelay: `${0.7 + i * 0.06}s` }}>
                  <img src={it.image.src} alt={it.image.alt} />
                  <figcaption>{it.label}</figcaption>
                </figure>
              ))}
            </div>
          </Reveal>
          <div className="nc-bento__row">
            {small.slice(0, 3).map((s, i) => (
              <Reveal key={s.title} i={5 + i} y={30} className="nc-tile is-small">
                <div className="nc-tile__img">
                  <Photo image={s.image} />
                </div>
                <div className="nc-tile__txt">
                  <span className="nc-chip">{s.tag}</span>
                  <b>{s.title}</b>
                  <small>{s.body}</small>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
