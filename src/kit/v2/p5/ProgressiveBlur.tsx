import { Kicker, Reveal } from '../../../deck/primitives'
import { Hint, Lines, type Text } from '../../shared'

export interface ProgressiveBlurProps {
  kicker: string
  /** 1–2 lines × ≤ 14 CJK characters. */
  title: Text
  /** ≤ 56 CJK characters. */
  lead?: string
  /** 0–3 tags, each ≤ 8 characters. */
  tags?: string[]
  image: string
  alt: string
  credit?: string
  source?: string
  hint?: string
}

/** Full-bleed image whose lower part blurs in progressively stronger bands; the title sits on the blurred zone. Use with tone: 'dark'. */
export function ProgressiveBlur({ kicker, title, lead, tags = [], image, alt, credit, source, hint }: ProgressiveBlurProps) {
  return (
    <section className="slide s-pblur">
      <Hint id="progressiveblur">{hint}</Hint>
      <img className="pblur__img" src={image} alt={alt} data-crop />
      <div className="pblur__blur" data-crop aria-hidden>
        {[1, 2, 3, 4, 5, 6].map((k) => (
          <i key={k} style={{ ['--k' as string]: k }} />
        ))}
      </div>
      <div className="frame pblur__frame">
        <div className="pblur__copy">
          <Reveal i={0}>
            <Kicker>{kicker}</Kicker>
          </Reveal>
          <Reveal i={1}>
            <h2 className="s-title pblur__title">
              <Lines text={title} />
            </h2>
          </Reveal>
          {lead && (
            <Reveal i={2} build>
              <p className="pblur__lead">{lead}</p>
            </Reveal>
          )}
        </div>
        <Reveal i={3} className="pblur__side">
          {tags.length > 0 && (
            <div className="pblur__tags">
              {tags.slice(0, 3).map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          )}
          {(source || credit) && <p className="pblur__src">{[source, credit].filter(Boolean).join(' · ')}</p>}
        </Reveal>
      </div>
    </section>
  )
}
