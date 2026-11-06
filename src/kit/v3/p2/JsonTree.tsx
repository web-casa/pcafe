import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot, SlideHead, type SlideBase } from '../../shared'
import { CodeWindow, sqlLine } from './code'

export interface JsonLine {
  /** Indent level 0–4. */
  depth: number
  /** Raw text of the line after the indent, ≤ 34 characters, e.g. `"city": "Berkeley",`. */
  text: string
  /** Id of the query (0-based) that picks this line. */
  pick?: number
}

export interface JsonQuery {
  /** Expression, ≤ 40 characters, e.g. "doc -> 'tags' ->> 0". */
  expr: string
  /** What it returns, ≤ 24 characters. */
  result: string
  /** ≤ 20 CJK characters. */
  note?: string
}

export interface JsonTreeProps extends SlideBase {
  /** 6–13 lines of a pretty-printed document. */
  doc: JsonLine[]
  /** 2–4 path queries; each is a build step that marks the lines it picks. */
  queries: JsonQuery[]
  /** Window title, ≤ 20 characters. */
  file?: string
}

/** A JSON document beside the path expressions that read it; each step marks the part a query returns. */
export function JsonTree({ kicker, title, lead, source, hint, doc, queries, file }: JsonTreeProps) {
  return (
    <section className="slide">
      <Hint id="jsontree">{hint}</Hint>
      <div className="frame t3">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="t3-jt">
          <Reveal i={3}>
            <CodeWindow title={file} className="t3-jt__doc">
              {doc.map((l, i) => (
                <div
                  key={i}
                  className={`t3-jt__line${l.pick !== undefined ? ' is-pick' : ''}`}
                  style={{ paddingLeft: `calc(${l.depth} * 32 * var(--u))` }}
                  data-build={l.pick !== undefined ? `q${l.pick}` : undefined}
                >
                  {l.pick !== undefined && <em aria-hidden>{l.pick + 1}</em>}
                  <code>{l.text}</code>
                </div>
              ))}
            </CodeWindow>
          </Reveal>
          <div className="t3-jt__qs">
            {queries.map((q, k) => (
              <Reveal key={k} i={4 + k} build={`q${k}`} className="t3-jt__q">
                <em>{k + 1}</em>
                <code>{sqlLine(q.expr)}</code>
                <span className="t3-jt__arrow" aria-hidden>
                  →
                </span>
                <b>{q.result}</b>
                {q.note && <p>{q.note}</p>}
              </Reveal>
            ))}
          </div>
        </div>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
