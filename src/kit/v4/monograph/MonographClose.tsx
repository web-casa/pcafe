import { Reveal } from '../../../deck/primitives'
import { Hint } from '../../shared'
import { Photo, type PhotoImage } from '../../v2/p1/img'

export interface MonographCloseProps {
  kicker: string
  /** Exactly 3 lines × ≤ 5 字; the middle line is set in the accent. */
  title: [string, string, string]
  /** 2–3 contacts: value ≤ 20 个字符, label ≤ 8 字. */
  contacts: { value: string; label: string }[]
  /** Picture at the right, with a dark pill button on it (≤ 10 字). */
  image: PhotoImage
  cta?: string
  hint?: string
}

/** The ask: three huge lines with the middle one in the accent, contacts ruled underneath, and a picture carrying the button. Made for `monograph`, works in any style. */
export function MonographClose({ kicker, title, contacts, image, cta, hint }: MonographCloseProps) {
  return (
    <section className="slide">
      <Hint id="monographclose">{hint}</Hint>
      <div className="frame mg-end">
        <div className="mg-end__l">
          <Reveal i={0} className="mg-k">
            {kicker}
          </Reveal>
          <h2 className="mg-title mg-end__title">
            <span className="mg-lines">
              <span>{title[0]}</span>
              <span className="is-accent">{title[1]}</span>
              <span>{title[2]}</span>
            </span>
          </h2>
          <Reveal i={5} className="mg-end__foot" style={{ ['--n' as string]: contacts.length }}>
            {contacts.map((c) => (
              <div key={c.value}>
                <b>{c.value}</b>
                <small>{c.label}</small>
              </div>
            ))}
          </Reveal>
        </div>
        <div className="mg-end__img">
          <Photo image={image} />
          {cta && <span className="mg-cta">● {cta}</span>}
        </div>
      </div>
    </section>
  )
}
