import { Reveal } from '../../../deck/primitives'
import { Hint, Lines, type Text } from '../../shared'
import { Photo, type PhotoImage } from '../../v2/p1/img'

export interface MonographHeroProps {
  /** Section marker, ≤ 8 字, e.g. '01 关于我们'. */
  kicker: string
  /** ≤ 3 lines × 12 字. */
  title: Text
  /** Rating at the top right: score ≤ 7 个字符, note ≤ 12 字, 3–4 small faces (optional). */
  rating?: { score: string; note: string; faces?: PhotoImage[] }
  /** Small note above the cards, title ≤ 10 字, body ≤ 30 字. */
  aside?: { title: string; body: string }
  /** Story card: a picture, an index ≤ 4 个字符, and a serif paragraph ≤ 70 字. */
  story: { image: PhotoImage; index?: string; text: string }
  /** A second picture at the right, dark works best. */
  image: PhotoImage
  hint?: string
}

/** An agency introduction: a three-line statement, a rating, a story card that reads like a magazine paragraph with a play button, and one dark object picture. Made for `monograph`, works in any style. */
export function MonographHero({ kicker, title, rating, aside, story, image, hint }: MonographHeroProps) {
  return (
    <section className="slide">
      <Hint id="monographhero">{hint}</Hint>
      <div className="frame mg-hero">
        <div className="mg-hero__top">
          <div>
            <Reveal i={0} className="mg-k">
              {kicker}
            </Reveal>
            <h1 className="mg-title mg-hero__title">
              <span className="mg-lines">
                <Lines text={title} />
              </span>
            </h1>
          </div>
          <div className="mg-hero__side">
            {rating && (
              <Reveal i={2} className="mg-rate">
                {rating.faces && (
                  <span className="mg-faces">
                    {rating.faces.map((f, i) => (
                      <img key={i} src={f.src} alt={f.alt} />
                    ))}
                  </span>
                )}
                <span>
                  <b>
                    <i>★★★★★</i> {rating.score}
                  </b>
                  <small>{rating.note}</small>
                </span>
              </Reveal>
            )}
            {aside && (
              <Reveal i={3} className="mg-aside">
                <b>{aside.title}</b>
                <small>{aside.body}</small>
              </Reveal>
            )}
          </div>
        </div>
        <div className="mg-hero__cards">
          <div className="mg-story">
            <div className="mg-story__img">
              <Photo image={story.image} />
            </div>
            <div className="mg-story__txt">
              {story.index && <span className="mg-idx">{story.index}</span>}
              <p>{story.text}</p>
              <span className="mg-play" aria-hidden="true" />
            </div>
          </div>
          <div className="mg-obj">
            <Photo image={image} />
          </div>
        </div>
      </div>
    </section>
  )
}
