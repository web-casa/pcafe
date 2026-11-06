import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot, SlideHead, type SlideBase } from '../../shared'
import { CodeWindow, sqlLine } from './code'

export interface ResultGridProps extends SlideBase {
  /** 2–6 lines × ≤ 40 characters. */
  sql: string[]
  /** 2–5 column names, ≤ 14 characters each. */
  columns: string[]
  /** 3–7 rows; each cell ≤ 14 characters. */
  rows: string[][]
  /** Index of a column to draw in the accent. */
  mark?: number
  /** Rows to emphasise (0-based). */
  hot?: number[]
  /** Footer line, e.g. "(5 rows)". ≤ 24 characters. */
  status?: string
  /** Reading under the query, ≤ 60 CJK characters. */
  note?: string
}

/** A query and the table it returns, side by side like a SQL client. Build: query first, then the result. */
export function ResultGrid({ kicker, title, lead, source, hint, sql, columns, rows, mark, hot = [], status, note }: ResultGridProps) {
  return (
    <section className="slide">
      <Hint id="resultgrid">{hint}</Hint>
      <div className="frame t3">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="t3-rg">
          <Reveal i={3}>
            <CodeWindow title="query.sql" className="t3-rg__sql">
              {sql.map((l, i) => (
                <code key={i}>{sqlLine(l)}</code>
              ))}
            </CodeWindow>
            {note && <p className="t3-note">{note}</p>}
          </Reveal>
          <Reveal i={4} build="result" className="t3-rg__grid">
            <table>
              <thead>
                <tr>
                  {columns.map((c, i) => (
                    <th key={c} className={i === mark ? 'is-mark' : undefined}>
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, j) => (
                  <tr key={j} className={hot.includes(j) ? 'is-hot' : undefined}>
                    {r.map((c, i) => (
                      <td key={i} className={i === mark ? 'is-mark' : undefined}>
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {status && <p className="t3-rg__status">{status}</p>}
          </Reveal>
        </div>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
