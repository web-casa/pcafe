import { Kicker, Reveal } from '../../../deck/primitives'
import { Hint, type SlideBase } from '../../shared'

export interface RibbonSectionProps extends Omit<SlideBase, 'title' | 'source'> {
  /** Chapter number, 1–99. */
  index: number
  /** Chapter title carried on the ribbon, one line, ≤ 8 CJK characters. */
  title: string
  /** ≤ 44 CJK characters. */
  lead?: string
  /** 2–4 page titles in this chapter, each ≤ 12 CJK characters. */
  contents: string[]
}

/**
 * Chapter opener: one wide accent ribbon sweeps across the slide carrying the
 * chapter number and title; a lime ribbon crosses behind it. Lead and the
 * chapter's page list sit below. No source: a section page states no facts.
 */
export function RibbonSection({ kicker, title, lead, hint, index, contents }: RibbonSectionProps) {
  const num = String(index).padStart(2, '0')
  return (
    <section className="slide">
      <Hint id="ribbonsection">{hint}</Hint>
      <div className="rbs__bands" data-crop>
        <div className="rbs__back" aria-hidden />
        <Reveal i={1} y={0} className="rbs__wrap">
          <div className="rbs__band">
            <span className="rbs__num" aria-hidden>
              {num}
            </span>
            <h2 className="rbs__title">{title}</h2>
          </div>
        </Reveal>
      </div>
      <div className="frame rbs">
        <Reveal i={0}>
          <Kicker>{kicker}</Kicker>
        </Reveal>
        <div className="rbs__foot">
          {lead && (
            <Reveal i={2}>
              <p className="rbs__lead">{lead}</p>
            </Reveal>
          )}
          <ol className="rbs__list">
            {contents.map((c, i) => (
              <Reveal key={c} i={3 + i * 0.5}>
                <li>
                  <b>{String(i + 1).padStart(2, '0')}</b>
                  {c}
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
