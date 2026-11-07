import { Numeral, Reveal } from '../../../deck/primitives'
import { Hint, Lines, type Text } from '../../shared'
import { Photo, type PhotoImage } from '../../v2/p1/img'

export interface TeamBannerProps {
  /** Pill on the photo, ≤ 6 字. */
  kicker: string
  /** Wide team photo, people in the upper two thirds. */
  image: PhotoImage
  /** Dark card: ≤ 2 lines × 12 字. */
  statement: Text
  /** Under the statement, ≤ 16 字. */
  note?: string
  /** 2–3 figures: value ≤ 5 个字符 (digits roll in), label ≤ 10 字. */
  stats: { value: string; label: string }[]
  source?: string
  hint?: string
}

/** The team in one wide photo, with a dark statement card and figures floating along the bottom. Made for `atelier`, works in any style. */
export function TeamBanner({ kicker, image, statement, note, stats, source, hint }: TeamBannerProps) {
  return (
    <section className="slide">
      <Hint id="teambanner">{hint}</Hint>
      <div className="frame at-team">
        <div className="at-team__img">
          <Photo image={image} />
        </div>
        <Reveal i={2} className="at-pill is-dot is-float">
          {kicker}
        </Reveal>
        <div className="at-team__row" style={{ ['--n' as string]: stats.length }}>
          <Reveal i={4} y={30} className="at-team__say">
            <b>
              <Lines text={statement} />
            </b>
            {note && <small>{note}</small>}
          </Reveal>
          {stats.map((s, i) => (
            <Reveal key={s.label} i={5 + i} y={30} className="at-team__stat">
              <b>
                <Numeral text={s.value} delay={0.7 + i * 0.12} />
              </b>
              <small>{s.label}</small>
            </Reveal>
          ))}
        </div>
        {source && <span className="at-team__src">{source}</span>}
      </div>
    </section>
  )
}
