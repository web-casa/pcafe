import { Kicker, Reveal } from '../../../deck/primitives'
import { Icon, type IconName } from '../../Icon'
import { Hint, Lines, SlideFoot, type Text } from '../../shared'

export interface AgencyRow {
  /** ≤ 14 CJK characters. */
  title: string
  /** Optional one-line note in grey after the title, ≤ 22 CJK characters. */
  note?: string
  icon: IconName
}

export interface AgencyRowsProps {
  kicker: string
  /** ≤ 2 lines × 12 CJK characters. */
  title: Text
  /** Outlined pill at the right of the heading, ≤ 10 characters. */
  more?: string
  /** 4–5 rows. */
  items: AgencyRow[]
  source?: string
  hint?: string
}

/** Numbered service rows: big heading with an outlined pill, then hairline rows of number, title, grey note, a colour icon tile and a round plus button. */
export function AgencyRows({ kicker, title, more, items, source, hint }: AgencyRowsProps) {
  return (
    <section className="slide">
      <Hint id="agencyrows">{hint}</Hint>
      <div className="frame ag-rows">
        <div className="ag-rows__head">
          <div>
            <Reveal i={0}>
              <Kicker>{kicker}</Kicker>
            </Reveal>
            <Reveal i={1}>
              <h2 className="s-title">
                <Lines text={title} />
              </h2>
            </Reveal>
          </div>
          {more && (
            <Reveal i={2} className="ag-btn">
              {more}
            </Reveal>
          )}
        </div>
        <ol className="ag-rows__list">
          {items.map((it, i) => (
            <Reveal key={it.title} i={3 + i} build className="ag-rows__row">
              <span className="ag-rows__num">{String(i + 1).padStart(2, '0')}</span>
              <span className="ag-rows__title">{it.title}</span>
              <span className="ag-rows__note">{it.note}</span>
              <span aria-hidden className={`ag-tile ag-tile--sm ag-tile--${i % 3}`}>
                <Icon name={it.icon} size={40} variant="bold" />
              </span>
              <span aria-hidden className="ag-plus" />
            </Reveal>
          ))}
        </ol>
        <SlideFoot source={source} i={9} />
      </div>
    </section>
  )
}
