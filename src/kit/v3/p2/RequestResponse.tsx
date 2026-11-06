import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot, SlideHead, type SlideBase } from '../../shared'
import { CodeWindow, sqlLine } from './code'

export interface RrPanel {
  /** Panel label, ≤ 10 CJK characters, e.g. "客户端发送". */
  label: string
  /** Window title, ≤ 20 characters. */
  file?: string
  /** 2–9 lines × ≤ 36 characters. */
  lines: string[]
}

export interface RequestResponseProps extends SlideBase {
  request: RrPanel
  response: RrPanel
  /** On the arrow, ≤ 8 CJK characters, e.g. "一次往返". */
  via?: string
  /** One reading under the pair, ≤ 50 CJK characters. */
  note?: string
}

/** A request and its response as two code panels joined by an arrow. Build: request, then arrow and response. */
export function RequestResponse({ kicker, title, lead, source, hint, request, response, via, note }: RequestResponseProps) {
  const panel = (p: RrPanel) => (
    <>
      <p className="t3-rr__label">{p.label}</p>
      <CodeWindow title={p.file}>
        {p.lines.map((l, i) => (
          <code key={i}>{sqlLine(l)}</code>
        ))}
      </CodeWindow>
    </>
  )
  return (
    <section className="slide">
      <Hint id="reqres">{hint}</Hint>
      <div className="frame t3">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="t3-rr">
          <Reveal i={3} className="t3-rr__side">
            {panel(request)}
          </Reveal>
          <Reveal i={4} build="res" className="t3-rr__via">
            <span className="t3-rr__beam" aria-hidden />
            {via && <b>{via}</b>}
          </Reveal>
          <Reveal i={5} build="res" className="t3-rr__side is-res">
            {panel(response)}
          </Reveal>
        </div>
        {note && (
          <Reveal i={6} className="t3-note">
            {note}
          </Reveal>
        )}
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
