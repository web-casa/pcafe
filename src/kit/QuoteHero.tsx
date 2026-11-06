import type { ReactNode } from 'react'
import { Kicker, Reveal } from '../deck/primitives'
import { Icon, type IconName } from './Icon'
import { Hint, SlideFoot, vars, type Text } from './shared'

export interface QuoteNote {
  icon: IconName
  /** ≤ 8 CJK characters. */
  label: string
  /** ≤ 36 CJK characters. */
  text: string
}

export interface QuoteHeroProps {
  kicker: string
  /** The definition or quotation. ≤ 64 CJK characters; pass an array to break lines yourself (≤ 3 lines × 22). */
  quote: Text
  /** Substrings of `quote` to underline in accent: the words the audience should remember. 1–3. */
  marks?: string[]
  /** Who said it or where it is defined, ≤ 30 characters. */
  cite: string
  /** Exactly 3 supporting notes under the quote. */
  notes?: QuoteNote[]
  source?: string
  hint?: ReactNode
}

function highlight(line: string, marks: string[]) {
  if (!marks.length) return line
  const parts: ReactNode[] = []
  let rest = line
  let k = 0
  while (rest) {
    const hits = marks.map((m) => [rest.indexOf(m), m] as const).filter(([at]) => at >= 0)
    if (!hits.length) break
    const [at, m] = hits.reduce((a, b) => (b[0] < a[0] ? b : a))
    if (at > 0) parts.push(rest.slice(0, at))
    parts.push(
      <mark key={k} style={vars({ '--k': k })}>
        {m}
      </mark>,
    )
    k += 1
    rest = rest.slice(at + m.length)
  }
  if (rest) parts.push(rest)
  return parts
}

/** A definition or quotation set large, with the key words marked, and three notes beneath. */
export function QuoteHero({ kicker, quote, marks = [], cite, notes, source, hint }: QuoteHeroProps) {
  const lines = typeof quote === 'string' ? [quote] : quote
  return (
    <section className="slide">
      <Hint id="quote">{hint}</Hint>
      <div className="frame s-quote">
        <Reveal i={0}>
          <Kicker>{kicker}</Kicker>
        </Reveal>
        <div className="quote__body">
          <span className="quote__mark" aria-hidden>
            “
          </span>
          <Reveal i={1}>
            <blockquote className="quote__text">
              {lines.map((l, i) => (
                <span key={i}>{highlight(l, marks)}</span>
              ))}
            </blockquote>
          </Reveal>
          <Reveal i={3} className="quote__cite">
            {cite}
          </Reveal>
        </div>
        {notes && (
          <dl className="quote__notes">
            {notes.map((n, i) => (
              <Reveal key={n.label} build i={i + 5} className="quote__note">
                <dt>
                  <Icon name={n.icon} size={34} />
                  {n.label}
                </dt>
                <dd>{n.text}</dd>
              </Reveal>
            ))}
          </dl>
        )}
        <SlideFoot source={source} i={9} />
      </div>
    </section>
  )
}
