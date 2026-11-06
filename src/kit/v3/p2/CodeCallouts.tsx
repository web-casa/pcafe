import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot, SlideHead, type SlideBase } from '../../shared'
import { CodeWindow, sqlLine } from './code'

export interface CodeCallout {
  /** 1-based line numbers this note explains. */
  lines: number[]
  /** ≤ 10 CJK characters. */
  title: string
  /** ≤ 40 CJK characters. */
  body: string
}

export interface CodeCalloutsProps extends SlideBase {
  /** 4–12 lines × ≤ 52 characters. */
  code: string[]
  /** File name in the window bar, ≤ 20 characters. */
  file?: string
  /** 2–4 notes; each is a build step that lights its lines and number. */
  notes: CodeCallout[]
  /** Highlight SQL keywords (default true). */
  sql?: boolean
}

/** Code block with numbered markers on chosen lines and matching notes beside it. */
export function CodeCallouts({ kicker, title, lead, source, hint, code, file, notes, sql = true }: CodeCalloutsProps) {
  const owner = new Map<number, number>()
  notes.forEach((n, k) => n.lines.forEach((l) => owner.has(l) || owner.set(l, k)))
  return (
    <section className="slide">
      <Hint id="codecallouts">{hint}</Hint>
      <div className="frame t3">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="t3-cc">
          <Reveal i={3}>
            <CodeWindow title={file} className="t3-cc__code">
              {code.map((l, i) => {
                const k = owner.get(i + 1)
                const first = k !== undefined && notes[k].lines[0] === i + 1
                return (
                  <div key={i} className={`t3-cc__line${k !== undefined ? ' is-noted' : ''}`} data-build={k !== undefined ? `n${k}` : undefined}>
                    <span className="t3-cc__ln" aria-hidden>
                      {i + 1}
                    </span>
                    <code>{sql ? sqlLine(l) : l || ' '}</code>
                    {first && <em className="t3-cc__pin">{k + 1}</em>}
                  </div>
                )
              })}
            </CodeWindow>
          </Reveal>
          <div className="t3-cc__notes">
            {notes.map((n, k) => (
              <Reveal key={k} i={4 + k} build={`n${k}`} className="t3-cc__note">
                <em>{k + 1}</em>
                <div>
                  <b>{n.title}</b>
                  <p>{n.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
