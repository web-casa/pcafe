import type { ReactNode } from 'react'
import { Kicker, Reveal } from '../deck/primitives'
import type { IconName } from './Icon'
import { IconTile, type Spot } from './parts'
import { Hint, SlideFoot, type Text } from './shared'

export interface StatementProps {
  /** Small label above the sentence, 2–8 CJK characters. */
  kicker: string
  /** The one sentence this slide exists for. ≤ 28 CJK characters; pass an array to break lines (≤ 2 lines × 14). */
  text: Text
  /** Substrings of `text` set in the accent colour. 0–2. */
  marks?: string[]
  /**
   * Icons set inline after words of the sentence, as small colour tiles: { 词: 'chart' }.
   * 0–4. The word must appear in `text`; it stays in ink unless it is also a mark.
   */
  icons?: Record<string, IconName>
  /** One quiet line under the sentence, ≤ 40 CJK characters. */
  sub?: string
  source?: string
  hint?: ReactNode
}

function accent(line: string, marks: string[], icons: Record<string, IconName>, seen: { n: number }): ReactNode {
  const keys = [...marks, ...Object.keys(icons)]
  const hits = keys.map((k) => [line.indexOf(k), k] as const).filter(([at]) => at >= 0)
  if (!hits.length) return line
  const [at, hit] = hits.reduce((a, b) => (b[0] < a[0] || (b[0] === a[0] && b[1].length > a[1].length) ? b : a))
  const icon = icons[hit]
  const spot = ((seen.n++ % 6) + 1) as Spot
  return (
    <>
      {line.slice(0, at)}
      {marks.includes(hit) ? <em>{hit}</em> : hit}
      {icon && <IconTile icon={icon} spot={spot} size={84} className="statement__tile" />}
      {accent(line.slice(at + hit.length), marks, icons, seen)}
    </>
  )
}

/** One sentence, centred, with nothing else on the page. A pause between dense slides. */
export function Statement({ kicker, text, marks = [], icons = {}, sub, source, hint }: StatementProps) {
  const lines = typeof text === 'string' ? [text] : text
  const seen = { n: 0 }
  return (
    <section className="slide">
      <Hint id="statement">{hint}</Hint>
      <div className="frame s-statement">
        <div className="statement">
          <Reveal i={0}>
            <Kicker>{kicker}</Kicker>
          </Reveal>
          <h2 className="statement__text">
            {lines.map((l, i) => (
              <Reveal key={i} i={i + 1} y={24} className="statement__line">
                {accent(l, marks, icons, seen)}
              </Reveal>
            ))}
          </h2>
          {sub && (
            <Reveal i={lines.length + 2} className="statement__sub">
              {sub}
            </Reveal>
          )}
        </div>
        <SlideFoot source={source} i={9} />
      </div>
    </section>
  )
}
