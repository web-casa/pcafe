import { Kicker, Reveal } from '../deck/primitives'
import { Hint, Lines, type Text } from './shared'

export interface ChapterNumberProps {
  kicker: string
  /** The giant chapter number: 1–2 characters. */
  num: string
  /** 2–3 short lines, ≤ 8 CJK characters each. */
  title: Text
  /** ≤ 60 CJK characters. */
  body?: string
  /** Footer left and right, ≤ 16 characters each: "第 2 章，共 5 章". */
  foot?: [string, string]
  hint?: React.ReactNode
}

/** A chapter opener: one giant numeral in the accent colour beside a short serif title. Made for `pink-script`, works in any style. */
export function ChapterNumber({ kicker, num, title, body, foot, hint }: ChapterNumberProps) {
  return (
    <section className="slide s-cn">
      <Hint id="chapternumber">{hint}</Hint>
      <Reveal i={1} y={40} className="cn__num"><span>{num}</span></Reveal>
      <div className="cn__copy">
        <Reveal i={0}><Kicker>{kicker}</Kicker></Reveal>
        <Reveal i={2}><h2 className="cn__title"><Lines text={title} /></h2></Reveal>
        {body && <Reveal i={3}><p className="cn__body">{body}</p></Reveal>}
      </div>
      {foot && (
        <Reveal i={4} className="cn__foot"><span>{foot[0]}</span><span>{foot[1]}</span></Reveal>
      )}
    </section>
  )
}
