import { Reveal, Source } from '../deck/primitives'
import { Icon, type IconName } from './Icon'
import { Hint, SlideHead, type SlideBase } from './shared'

export interface CompareRow {
  item: string
  before: string
  after: string
  /** Render both values in monospace: file names, commands, flags. */
  mono?: boolean
  /** Optional icon before the item. Give every row one or none. */
  icon?: IconName
}

export interface CompareTableProps extends Omit<SlideBase, 'lead'> {
  /** Column headings, e.g. ['Lumen 12 · birch', 'Lumen 13 · aurora']. */
  columns: [before: string, after: string]
  /** 4–7 rows. Every cell must fit on one line: item ≤ 12, values ≤ 22 CJK characters. */
  rows: CompareRow[]
  /** Heading of the first column. Defaults to 项目. */
  itemLabel?: string
}

/**
 * Before → after, row by row. The "after" column sits on a raised panel so
 * the eye reads the new state first. The source goes top-right because the
 * table uses the full height.
 */
export function CompareTable({ kicker, title, source, hint, columns, rows, itemLabel = '项目' }: CompareTableProps) {
  return (
    <section className="slide">
      <Hint id="compare">{hint}</Hint>
      <div className="frame s-cmp">
        <SlideHead kicker={kicker} title={title} aside={source && <Source>{source}</Source>} />
        <Reveal i={2} className="cmp" y={16}>
          <div className="cmp__panel" aria-hidden />
          <div className="cmp__th">{itemLabel}</div>
          <div className="cmp__th">{columns[0]}</div>
          <div className="cmp__th" aria-hidden />
          <div className="cmp__th is-new">{columns[1]}</div>
          {rows.flatMap((c, i) => [
            <div key={`${i}a`} className="cmp__item" data-build={i}>
              {c.icon && <Icon name={c.icon} size={28} />}
              {c.item}
            </div>,
            <div key={`${i}b`} className={`cmp__old${c.mono ? ' is-mono' : ''}`} data-build={i}>
              {c.before}
            </div>,
            <div key={`${i}c`} className="cmp__arrow" aria-label="变为" data-build={i} />,
            <div key={`${i}d`} className={`cmp__new${c.mono ? ' is-mono' : ''}`} data-build={i}>
              {c.after}
            </div>,
          ])}
        </Reveal>
      </div>
    </section>
  )
}
