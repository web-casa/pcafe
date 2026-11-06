import { Reveal } from '../deck/primitives'
import { Hint, SlideFoot, SlideHead, type SlideBase } from './shared'

export type ScoreTone = 'good' | 'mid' | 'bad' | 'plain'
export interface ScoreCell { text: string; tone?: ScoreTone }

export interface ScoreTableProps extends SlideBase {
  /** 2–4 options compared, ≤ 10 CJK characters each. */
  columns: string[]
  /** 3–5 criteria; each row has one cell per column, cell text ≤ 8 characters. */
  rows: { label: string; cells: ScoreCell[] }[]
  /** Optional name for the first column. */
  corner?: string
}

/** A scorecard: black header row, criteria down the side, every verdict in a coloured pill. Made for `stencil`, works in any style. */
export function ScoreTable({ kicker, title, lead, source, hint, columns, rows, corner = '' }: ScoreTableProps) {
  return (
    <section className="slide">
      <Hint id="scoretable">{hint}</Hint>
      <div className="frame s-st">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} y={24} className="st__wrap">
          <table className="st__table">
            <thead>
              <tr><th>{corner}</th>{columns.map((c) => <th key={c}>{c}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.label} data-build={i}>
                  <th scope="row">{r.label}</th>
                  {r.cells.map((c, j) => (
                    <td key={j}><span className={`st__pill is-${c.tone ?? 'plain'}`}>{c.text}</span></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
