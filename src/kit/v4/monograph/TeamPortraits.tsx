import { Reveal } from '../../../deck/primitives'
import { Hint, Lines, type Text } from '../../shared'
import { Photo, type PhotoImage } from '../../v2/p1/img'

export interface Portrait {
  photo: PhotoImage
  /** ≤ 6 字. */
  name: string
  /** ≤ 8 字. */
  role: string
}

export interface TeamPortraitsProps {
  kicker: string
  /** 1 line, ≤ 8 字. */
  title: Text
  /** Pill at the top right, ≤ 10 字. */
  cta?: string
  /** Exactly 3 people; portraits are set in black and white and turn colour on hover. */
  people: Portrait[]
  /** The fourth tile, a dark card: title 2 lines × ≤ 5 字 with one word in the accent, body ≤ 34 字, contact ≤ 22 个字符. */
  join?: { title: [string, string]; accent?: string; body: string; contact: string }
  hint?: string
}

/** The people: three black-and-white portraits that warm to colour on hover, and a dark hiring card. Made for `monograph`, works in any style. */
export function TeamPortraits({ kicker, title, cta, people, join, hint }: TeamPortraitsProps) {
  return (
    <section className="slide">
      <Hint id="teamportraits">{hint}</Hint>
      <div className="frame mg-team">
        <div className="mg-head">
          <div>
            <Reveal i={0} className="mg-k">
              {kicker}
            </Reveal>
            <h2 className="mg-title">
              <span className="mg-lines">
                <Lines text={title} />
              </span>
            </h2>
          </div>
          {cta && (
            <Reveal i={2} className="mg-pill">
              {cta}
            </Reveal>
          )}
        </div>
        <div className="mg-team__row">
          {people.slice(0, 3).map((p, i) => (
            <figure key={p.name} className="mg-face" style={{ animationDelay: `${0.25 + i * 0.12}s` }}>
              <div className="mg-face__img">
                <Photo image={p.photo} />
              </div>
              <figcaption>
                <b>{p.name}</b>
                <small>
                  {p.role}
                  <i>{String(i + 1).padStart(2, '0')}</i>
                </small>
              </figcaption>
            </figure>
          ))}
          {join && (
            <figure className="mg-face" style={{ animationDelay: '0.61s' }}>
              <div className="mg-join">
                <b>
                  {join.title[0]}
                  <br />
                  {join.accent && join.title[1].includes(join.accent) ? (
                    <>
                      {join.title[1].split(join.accent)[0]}
                      <em>{join.accent}</em>
                      {join.title[1].split(join.accent).slice(1).join(join.accent)}
                    </>
                  ) : (
                    join.title[1]
                  )}
                </b>
                <p>{join.body}</p>
              </div>
              <figcaption>
                <b>加入我们</b>
                <small>
                  {join.contact}
                  <i>↗</i>
                </small>
              </figcaption>
            </figure>
          )}
        </div>
      </div>
    </section>
  )
}
