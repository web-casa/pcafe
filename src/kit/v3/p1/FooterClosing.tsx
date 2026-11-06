import { Reveal } from '../../../deck/primitives'
import { Hint, Lines, type SlideBase } from '../../shared'
import { D1Buttons, type D1Action } from './util'

export interface FooterColumn {
  /** ≤ 8 字. */
  heading: string
  /** 2–5 links, each ≤ 26 个字符 or ≤ 13 字. */
  links: string[]
}

export interface FooterClosingProps extends SlideBase {
  /** 2–4 link columns; each is one build step. */
  columns: FooterColumn[]
  /** 0–2 buttons under the lead. */
  actions?: D1Action[]
  /** Giant word along the bottom, 3–10 Latin characters (decorative text, not a logo). */
  wordmark: string
  /** Small line at the very bottom left, ≤ 40 字. */
  note?: string
}

/** Closing slide shaped like a website footer: title and buttons, columns of links, and a giant wordmark along the bottom. */
export function FooterClosing({ kicker, title, lead, columns, actions, wordmark, note, source, hint }: FooterClosingProps) {
  return (
    <section className="slide">
      <Hint id="footerclosing">{hint}</Hint>
      <div className="frame d1foot">
        <div className="d1foot__top">
          <div className="d1foot__intro">
            <Reveal i={0}>
              <p className="kicker">{kicker}</p>
            </Reveal>
            <Reveal i={1}>
              <h2 className="d1foot__title">
                <Lines text={title} />
              </h2>
            </Reveal>
            {lead && (
              <Reveal i={2}>
                <p className="d1foot__lead">{lead}</p>
              </Reveal>
            )}
            <Reveal i={3}>
              <D1Buttons actions={actions} />
            </Reveal>
          </div>
          <div className="d1foot__cols" style={{ ['--n' as string]: columns.length }}>
            {columns.map((c, i) => (
              <Reveal key={i} i={3 + i} build className="d1foot__col">
                <h3>{c.heading}</h3>
                <ul>
                  {c.links.map((l, k) => (
                    <li key={k}>{l}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal i={8} className="d1foot__base">
          <div className="d1foot__line">
            {note && <span>{note}</span>}
            {source && <span className="d1foot__src">来源 · {source}</span>}
          </div>
          <div className="d1foot__crop" data-crop>
            <p className="d1foot__word" aria-hidden style={{ ['--n' as string]: wordmark.length }}>
              {wordmark}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
