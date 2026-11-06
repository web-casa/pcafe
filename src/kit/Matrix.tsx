import { Reveal } from '../deck/primitives'
import { Icon, type IconName } from './Icon'
import { Hint, SlideFoot, SlideHead, type SlideBase } from './shared'

export interface MatrixColumn {
  icon?: IconName
  /** ≤ 8 CJK characters. */
  label: string
  /** Muted second line, ≤ 14 CJK characters. */
  note?: string
}

export interface MatrixRow {
  /** ≤ 10 CJK characters. */
  label: string
  /** Muted line under the label, ≤ 16 characters. */
  sub?: string
  /** One cell per column: a short mono value (≤ 18 characters), or null for "none". */
  cells: (string | null)[]
}

export interface MatrixProps extends SlideBase {
  /** 2–4 columns. */
  columns: MatrixColumn[]
  /** 3–6 rows. */
  rows: MatrixRow[]
  /** Index of the column to tint in accent: the one the slide is about. */
  focus?: number
  /** One muted line under the grid, ≤ 60 CJK characters. */
  footnote?: string
}

/** Rows × columns of short identifiers. Hovering a cell lights its row and column. */
export function Matrix({ kicker, title, lead, source, hint, columns, rows, focus, footnote }: MatrixProps) {
  // Inline styles skip the `u` transform, so the label width lives in CSS (--mx-label).
  const grid = { gridTemplateColumns: `var(--mx-label) repeat(${columns.length}, minmax(0, 1fr))` }
  const tone = (c: number) => (c === focus ? ' is-focus' : '')
  return (
    <section className="slide">
      <Hint id="matrix">{hint}</Hint>
      <div className="frame s-mx">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="mx" role="table">
          <Reveal i={3} className="mx__row mx__row--head" style={grid}>
            <span role="columnheader" />
            {columns.map((c, ci) => (
              <span key={c.label} role="columnheader" className={`mx__th${tone(ci)}`} data-col={ci}>
                {c.icon && <Icon name={c.icon} size={36} tone={ci === focus ? 'accent' : 'ink'} />}
                <b>{c.label}</b>
                {c.note && <small>{c.note}</small>}
              </span>
            ))}
          </Reveal>
          {rows.map((r, ri) => (
            <Reveal key={r.label} build i={ri * 0.6 + 4} className="mx__row" style={grid}>
              <span role="rowheader" className="mx__label">
                <b>{r.label}</b>
                {r.sub && <small>{r.sub}</small>}
              </span>
              {r.cells.map((cell, ci) => (
                <span key={ci} role="cell" className={`mx__cell${tone(ci)}`} data-col={ci}>
                  {cell ? <code>{cell}</code> : <i aria-label="无">—</i>}
                </span>
              ))}
            </Reveal>
          ))}
        </div>
        {footnote && (
          <Reveal i={rows.length * 0.6 + 5} className="mx__foot">
            {footnote}
          </Reveal>
        )}
        <SlideFoot source={source} i={rows.length * 0.6 + 6} />
      </div>
    </section>
  )
}
