import { Numeral, Reveal } from '../../../deck/primitives'
import { Hint, Lines, type Text } from '../../shared'
import { type PhotoImage } from '../../v2/p1/img'

export interface NocturneHeroProps {
  /** 3–4 small faces above the title (optional). */
  faces?: PhotoImage[]
  /** ≤ 2 lines × 8 字. */
  title: Text
  /** ≤ 36 字. */
  lead?: string
  /** Accent button and a quiet button, each ≤ 8 字. */
  ctas?: [string, string?]
  /** Small line under the buttons, ≤ 16 字. */
  note?: string
  /** 2–3 figures along the bottom: value ≤ 7 个字符 (digits roll in), label ≤ 6 字. */
  stats?: { value: string; label: string }[]
  /** The phone: main picture (portrait), up to 4 thumbnails, a label ≤ 4 字 and a button ≤ 8 字. With 2+ thumbnails, two of them also float beside the phone as prints. `toast` (≤ 12 字) is a notification card next to it. */
  phone: { image: PhotoImage; thumbs?: PhotoImage[]; label?: string; cta?: string; toast?: string }
  hint?: string
}

/** A consumer app opening on a dark violet glow: promise and figures at the left, a floating phone at the right showing the result. Made for `nocturne`, works in any style. */
export function NocturneHero({ faces = [], title, lead, ctas, note, stats = [], phone, hint }: NocturneHeroProps) {
  return (
    <section className="slide">
      <Hint id="nocturnehero">{hint}</Hint>
      <div className="nc-glow" aria-hidden="true" />
      <div className="frame nc-hero">
        <div className="nc-hero__l">
          {faces.length > 0 && (
            <Reveal i={0} className="nc-faces">
              {faces.map((f, i) => (
                <img key={i} src={f.src} alt={f.alt} />
              ))}
            </Reveal>
          )}
          <Reveal i={1}>
            <h1 className="nc-title nc-hero__title">
              <Lines text={title} />
            </h1>
          </Reveal>
          {lead && (
            <Reveal i={2}>
              <p className="nc-lead">{lead}</p>
            </Reveal>
          )}
          {ctas && (
            <Reveal i={3} className="nc-ctas">
              <span className="nc-btn is-accent">✦ {ctas[0]}</span>
              {ctas[1] && <span className="nc-btn">{ctas[1]}</span>}
            </Reveal>
          )}
          {note && (
            <Reveal i={4}>
              <small className="nc-note">{note}</small>
            </Reveal>
          )}
          {stats.length > 0 && (
            <div className="nc-stats">
              {stats.map((s, i) => (
                <Reveal key={s.label} i={5 + i}>
                  <b>
                    <Numeral text={s.value} delay={0.6 + i * 0.12} />
                  </b>
                  <small>{s.label}</small>
                </Reveal>
              ))}
            </div>
          )}
        </div>
        <div className="nc-phone">
          {phone.thumbs && phone.thumbs.length > 1 && (
            <div className="nc-sats" aria-hidden="true">
              <img className="nc-sat is-a" src={phone.thumbs[0].src} alt="" />
              <img className="nc-sat is-b" src={phone.thumbs[phone.thumbs.length > 2 ? 2 : 1].src} alt="" />
            </div>
          )}
          {phone.toast && (
            <div className="nc-toast">
              <i aria-hidden="true">✓</i>
              <span>{phone.toast}</span>
            </div>
          )}
          <div className="nc-phone__body">
            <div className="nc-phone__screen">
              <img src={phone.image.src} alt={phone.image.alt} />
              {phone.label && <span className="nc-phone__label">{phone.label}</span>}
              {phone.thumbs && (
                <div className="nc-phone__thumbs">
                  {phone.thumbs.slice(0, 4).map((t, i) => (
                    <img key={i} src={t.src} alt={t.alt} style={{ animationDelay: `${1 + i * 0.1}s` }} />
                  ))}
                </div>
              )}
              {phone.cta && <span className="nc-phone__cta">✦ {phone.cta}</span>}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
