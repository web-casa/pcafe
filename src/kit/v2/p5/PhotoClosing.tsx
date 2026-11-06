import { Kicker, Reveal } from '../../../deck/primitives'
import { Hint, Lines, type Text } from '../../shared'

export interface PhotoClosingProps {
  kicker: string
  /** 1–2 lines × ≤ 10 CJK characters. */
  title: Text
  /** ≤ 44 CJK characters. */
  lead?: string
  /** 0–3 next steps / contact lines, each ≤ 20 characters. */
  actions?: string[]
  image: string
  alt: string
  credit?: string
  source?: string
  hint?: string
}

/** Closing slide on a full-bleed image: a slow push-in, a dark gradient from the left, a large final line and up to three next steps. Use with tone: 'dark'. */
export function PhotoClosing({ kicker, title, lead, actions = [], image, alt, credit, source, hint }: PhotoClosingProps) {
  return (
    <section className="slide s-pclose">
      <Hint id="photoclosing">{hint}</Hint>
      <div className="pclose__media" data-crop>
        <img src={image} alt={alt} />
      </div>
      <div className="pclose__shade" aria-hidden />
      <div className="frame pclose__frame">
        <Reveal i={0}>
          <Kicker>{kicker}</Kicker>
        </Reveal>
        <Reveal i={1}>
          <h2 className="pclose__title">
            <Lines text={title} />
          </h2>
        </Reveal>
        {lead && (
          <Reveal i={2}>
            <p className="pclose__lead">{lead}</p>
          </Reveal>
        )}
        {actions.length > 0 && (
          <ul className="pclose__actions">
            {actions.slice(0, 3).map((a, k) => (
              <Reveal key={k} i={3 + k} build className="pclose__action">
                <i aria-hidden>{String(k + 1).padStart(2, '0')}</i>
                {a}
              </Reveal>
            ))}
          </ul>
        )}
        {(source || credit) && (
          <Reveal i={7} className="pclose__src">
            <p>{[source, credit].filter(Boolean).join(' · ')}</p>
          </Reveal>
        )}
      </div>
    </section>
  )
}
