import { Kicker, Reveal } from '../../../deck/primitives'
import { Hint, Lines, type Text } from '../../shared'
import { Photo, type PhotoImage } from './img'

export interface MagazineSpreadProps {
  image: PhotoImage
  kicker: string
  /** Big headline, ≤ 2 lines × 8 字. */
  title: Text
  /** Standfirst under the headline, ≤ 40 字. */
  standfirst?: string
  /** Body text with a drop cap on its first character, 1–2 paragraphs, ≤ 150 字 in total. */
  body: string[]
  /** Pull quote in the right column, ≤ 26 字. */
  pull?: string
  /** Running footer like “第 3 页 · 专题”, ≤ 16 字. */
  folio?: string
  source?: string
  hint?: string
}

/** Magazine spread: the left page is one full photo, the right page has a big headline, standfirst, drop-capped body and a pull quote. */
export function MagazineSpread({ image, kicker, title, standfirst, body, pull, folio, source, hint }: MagazineSpreadProps) {
  return (
    <section className="slide v21-mag">
      <Hint id="magazinespread">{hint}</Hint>
      <Reveal i={0} y={0} className="v21-mag__img">
        <Photo image={image} />
      </Reveal>
      <i className="v21-mag__gutter" aria-hidden />
      <div className="v21-mag__page">
        <Reveal i={1}>
          <Kicker>{kicker}</Kicker>
        </Reveal>
        <Reveal i={2}>
          <h2 className="v21-mag__title">
            <Lines text={title} />
          </h2>
        </Reveal>
        {standfirst && (
          <Reveal i={3}>
            <p className="v21-mag__stand">{standfirst}</p>
          </Reveal>
        )}
        <div className="v21-mag__cols">
          <Reveal i={4} className="v21-mag__body">
            {body.map((p, i) => (
              <p key={i} className={i === 0 ? 'v21-mag__first' : undefined}>
                {p}
              </p>
            ))}
          </Reveal>
          {pull && (
            <Reveal i={5} build className="v21-mag__pull">
              <p>{pull}</p>
            </Reveal>
          )}
        </div>
        <Reveal i={6} className="v21-mag__folio">
          {folio && <span>{folio}</span>}
          {source && <span className="s-source">来源 · {source}</span>}
        </Reveal>
      </div>
    </section>
  )
}
