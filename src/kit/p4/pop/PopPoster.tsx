import { Kicker, Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot } from '../../shared'
import { Marked } from '../keynote/marks'

export interface PopBadge {
  /** ≤ 4 characters. */
  value: string
  /** ≤ 6 CJK characters. */
  label: string
}

export interface PopPosterProps {
  /** 2–8 characters. */
  kicker: string
  /** The headline: 2–3 lines × ≤ 7 CJK characters each (Latin ≤ 10 characters). */
  title: string[]
  /** One substring of `title` boxed in a tilted colour block. */
  mark?: string
  /** Round sticker at the top right. */
  badge?: PopBadge
  /** 0–4 chips along the bottom, each ≤ 12 characters. */
  tags?: string[]
  source?: string
  hint?: string
}

/** Bold headline poster: chunky stacked headline, one word boxed in a tilted colour block, a round sticker and a row of outlined chips. */
export function PopPoster({ kicker, title, mark, badge, tags = [], source, hint }: PopPosterProps) {
  return (
    <section className="slide">
      <Hint id="popposter">{hint}</Hint>
      <div className="pposter__dots" aria-hidden />
      <div className="frame s-pposter">
        <Reveal i={0}>
          <Kicker>{kicker}</Kicker>
        </Reveal>
        <Reveal i={1} y={36}>
          <h1 className="pposter__title">
            <Marked text={title} marks={mark ? [mark] : []} wrap={(s, k) => <span key={k} className="pposter__mark">{s}</span>} />
          </h1>
        </Reveal>
        {badge && (
          <Reveal i={3} className="pposter__badgewrap">
            <div className="pposter__badge">
              <b>{badge.value}</b>
              <span>{badge.label}</span>
            </div>
          </Reveal>
        )}
        {tags.length > 0 && (
          <div className="pposter__tags">
            {tags.map((t, i) => (
              <Reveal key={t} i={4 + i} build>
                <span className="pposter__tag">{t}</span>
              </Reveal>
            ))}
          </div>
        )}
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
