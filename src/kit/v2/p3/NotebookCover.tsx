import { Kicker, Reveal } from '../../../deck/primitives'
import { Hint, Lines, SlideFoot, vars, type Text } from '../../shared'

export interface NotebookCoverProps {
  /** Chapter number, ≤ 3 characters. */
  number: string
  /** 2–8 CJK characters. */
  kicker: string
  /** Chapter title on the label, ≤ 2 lines × 7 CJK characters. */
  title: Text
  /** Line under the label title, ≤ 16 CJK characters. */
  sub?: string
  /** 2–4 items in this chapter, each ≤ 14 CJK characters. */
  items?: string[]
  /** Optional decor- leather texture for the cover (imported asset). */
  texture?: string
  source?: string
  hint?: string
}

/** Chapter page as a hardback notebook: tilted cover with elastic band and a paper label carrying the chapter. */
export function NotebookCover({ number, kicker, title, sub, items = [], texture, source, hint }: NotebookCoverProps) {
  return (
    <section className="slide">
      <Hint id="notebookcover">{hint}</Hint>
      <div className="frame c3-frame c3nb-frame">
        <div className="c3nb__copy">
          <Reveal i={0}>
            <Kicker>{kicker}</Kicker>
          </Reveal>
          <Reveal i={1}>
            <p className="c3nb__num">{number}</p>
          </Reveal>
          {items.length > 0 && (
            <ol className="c3nb__items">
              {items.map((t, i) => (
                <Reveal key={i} i={3 + i}>
                  <li>
                    <span>{String(i + 1).padStart(2, '0')}</span>
                    {t}
                  </li>
                </Reveal>
              ))}
            </ol>
          )}
          <SlideFoot source={source} />
        </div>
        <Reveal i={2} y={40} className="c3nb">
          <div className="c3nb__book" style={texture ? vars({ '--tex': `url(${texture})` }) : undefined}>
            <i className="c3nb__pages" aria-hidden />
            <div className="c3nb__cover">
              <i className="c3nb__stitch" aria-hidden />
              <div className="c3nb__label">
                <span>No. {number}</span>
                <h2>
                  <Lines text={title} />
                </h2>
                {sub && <p>{sub}</p>}
              </div>
              <i className="c3nb__band" aria-hidden />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
