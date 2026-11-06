import { Fragment } from 'react'
import { Kicker, Reveal } from '../../../deck/primitives'
import { Hint, Lines, SlideFoot, type Text } from '../../shared'

export interface MarkerSweepMark {
  /** Exact substring of `body` to highlight. */
  text: string
  /** Note shown under the paragraph when this mark is drawn, ≤ 22 CJK characters. */
  note?: string
}

export interface MarkerSweepProps {
  kicker: string
  /** ≤ 1 line × 16 CJK characters. */
  title: Text
  /** The paragraph, 50–110 CJK characters. */
  body: string
  /** 2–4 substrings in reading order; each is swept with a highlighter as one build step. */
  marks: MarkerSweepMark[]
  source?: string
  hint?: React.ReactNode
}

/** A paragraph set large; a highlighter pen sweeps across its key phrases one at a time, each with a numbered margin note. */
export function MarkerSweep({ kicker, title, body, marks, source, hint }: MarkerSweepProps) {
  const parts: { s: string; m?: number }[] = []
  let rest = body
  marks.forEach((m, i) => {
    const at = rest.indexOf(m.text)
    if (at < 0) return
    parts.push({ s: rest.slice(0, at) }, { s: m.text, m: i })
    rest = rest.slice(at + m.text.length)
  })
  parts.push({ s: rest })
  return (
    <section className="slide">
      <Hint id="markersweep">{hint}</Hint>
      <div className="frame x2-ms">
        <Reveal i={0}>
          <Kicker>{kicker}</Kicker>
        </Reveal>
        <Reveal i={1}>
          <h2 className="s-title">
            <Lines text={title} />
          </h2>
        </Reveal>
        <Reveal i={2}>
          <p className="x2-ms__body">
            {parts.map((p, k) =>
              p.m === undefined ? (
                <Fragment key={k}>{p.s}</Fragment>
              ) : (
                <mark key={k} className="x2-ms__mark" data-build={`ms${p.m}`} style={{ '--k': p.m } as React.CSSProperties}>
                  {p.s}
                  <sup aria-hidden>{p.m + 1}</sup>
                </mark>
              ),
            )}
          </p>
        </Reveal>
        <div className="x2-ms__notes">
          {marks.map((m, i) =>
            m.note ? (
              <Reveal key={i} i={3 + i} className="x2-ms__note">
                <div data-build={`ms${i}`}>
                  <span>{i + 1}</span>
                  <p>{m.note}</p>
                </div>
              </Reveal>
            ) : null,
          )}
        </div>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
