import { Kicker, Reveal } from '../deck/primitives'
import { Icon } from './Icon'
import { MiniUI } from './parts'
import { Hint, Lines, SlideFoot, type SlideBase } from './shared'

export interface AskResult {
  /** ≤ 8 characters. */
  name: string
  /** Muted line, ≤ 10 characters. */
  sub?: string
  /** The headline figure, e.g. '+142%'. ≤ 6 characters. */
  value: string
  /** 4–10 values for the mini bar chart; the last bar is highlighted. */
  bars: number[]
  /** Under the chart, ≤ 14 characters. */
  note?: string
}

export interface AskAnswerProps extends SlideBase {
  /** The question as a user would type it, ≤ 30 CJK characters. */
  question: string
  /** One line summarising the answer, ≤ 20 CJK characters. */
  found: string
  /** Exactly 3 result cards. */
  results: AskResult[]
  /** 2–3 short notes under the lead: where answers come from, limits. ≤ 20 CJK characters each. */
  notes?: string[]
}

/** A question put to a tool and the answer it returns, as cards with a figure and a small chart. */
export function AskAnswer({ kicker, title, lead, source, hint, question, found, results, notes = [] }: AskAnswerProps) {
  return (
    <section className="slide">
      <Hint id="ask">{hint}</Hint>
      <div className="frame s-ask">
        <div className="ask__copy">
          <Reveal i={0}>
            <Kicker>{kicker}</Kicker>
          </Reveal>
          <Reveal i={1}>
            <h2 className="s-title">
              <Lines text={title} />
            </h2>
          </Reveal>
          {lead && (
            <Reveal i={2} className="s-lead ask__lead">
              {lead}
            </Reveal>
          )}
          {notes.length > 0 && (
            <Reveal i={3} className="ask__notes">
              {notes.map((n) => (
                <span key={n}>
                  <Icon name="check" size={24} />
                  {n}
                </span>
              ))}
            </Reveal>
          )}
        </div>
        <Reveal i={3} y={18} className="ask__panel">
          <p className="ask__q">{question}</p>
          <p className="ask__found">
            <Icon name="stars" size={26} tone="accent" />
            {found}
          </p>
          <div className="ask__results">
            {results.map((r, i) => (
              <Reveal key={r.name} build i={i * 0.6 + 5} className="ask__card">
                <div className="ask__who">
                  <b>{r.name}</b>
                  {r.sub && <span>{r.sub}</span>}
                </div>
                <strong>{r.value}</strong>
                <MiniUI ui={{ kind: 'bars', values: r.bars }} />
                {r.note && <span className="ask__note">{r.note}</span>}
              </Reveal>
            ))}
          </div>
        </Reveal>
        <SlideFoot source={source} i={9} />
      </div>
    </section>
  )
}
