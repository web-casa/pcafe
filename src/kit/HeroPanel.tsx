import type { ReactNode } from 'react'
import { Reveal } from '../deck/primitives'
import { Laurel, Pill } from './parts'
import { Hint, Lines, type Text } from './shared'

export interface HeroPanelProps {
  /** Small chip + text above the title, e.g. { label: '新版本', text: '2.0 · 2026 年 10 月' }. */
  tag?: { label: string; text: string }
  /** ≤ 2 lines × 10 CJK characters. */
  title: Text
  /** ≤ 40 CJK characters. */
  lead: string
  /** 1–2 pills under the lead: the first solid, the second outlined. Facts, not fake buttons. */
  pills?: string[]
  /** A real screenshot shown floating at the right of the dark card. */
  src: string
  alt: string
  /** 0–3 laurels under the card. Only for awards, rankings or counts you can cite in `source`. */
  laurels?: { title: string; sub?: string }[]
  source?: string
  hint?: ReactNode
}

/** A cover built as one large dark rounded card: title on the left, a product screenshot floating on the right. */
export function HeroPanel({ tag, title, lead, pills = [], src, alt, laurels = [], source, hint }: HeroPanelProps) {
  return (
    <section className="slide">
      <Hint id="heropanel">{hint}</Hint>
      <div className={`frame s-heropanel${laurels.length ? ' has-laurels' : ''}`}>
        <div className="heropanel" data-tone="dark" data-crop>
          <div className="heropanel__copy">
            {tag && (
              <Reveal i={0} className="heropanel__tag">
                <Pill tone="solid">{tag.label}</Pill>
                <span>{tag.text}</span>
              </Reveal>
            )}
            <Reveal i={1}>
              <h1 className="heropanel__title cover__title">
                <Lines text={title} />
              </h1>
            </Reveal>
            <Reveal i={2} className="heropanel__lead">
              {lead}
            </Reveal>
            {pills.length > 0 && (
              <Reveal i={3} className="heropanel__pills">
                {pills.map((p, i) => (
                  <Pill key={p} tone={i === 0 ? 'solid' : 'line'}>
                    {p}
                  </Pill>
                ))}
              </Reveal>
            )}
          </div>
          <Reveal i={3} y={30} className="heropanel__shot">
            <img src={src} alt={alt} draggable={false} />
          </Reveal>
        </div>
        {laurels.length > 0 && (
          <Reveal i={6} className="heropanel__laurels">
            {laurels.map((l) => (
              <Laurel key={l.title} {...l} />
            ))}
          </Reveal>
        )}
        {source && (
          <Reveal i={7} className="heropanel__source s-source">
            来源 · {source}
          </Reveal>
        )}
      </div>
    </section>
  )
}
