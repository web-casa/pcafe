import { Kicker, Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot } from '../../shared'
import { Chars } from './chars'

export interface TypewriterMeta {
  /** ≤ 6 CJK characters. */
  label: string
  /** ≤ 12 CJK characters. */
  value: string
}

export interface TypewriterProps {
  kicker: string
  /** 1–3 lines typed one after another, each ≤ 32 Latin characters or ≤ 16 CJK characters. */
  lines: string[]
  /** One line under the typed text (a translation or who said it), ≤ 40 CJK characters. */
  caption?: string
  /** 0–3 label/value pairs along the bottom. */
  meta?: TypewriterMeta[]
  source?: string
  hint?: React.ReactNode
}

/** Typewriter: lines of real text appear character by character behind a blinking caret; each line is a build step. */
export function Typewriter({ kicker, lines, caption, meta = [], source, hint }: TypewriterProps) {
  return (
    <section className="slide">
      <Hint id="typewriter">{hint}</Hint>
      <div className="frame x2-tw">
        <Reveal i={0}>
          <Kicker>{kicker}</Kicker>
        </Reveal>
        <div className="x2-tw__screen">
          {lines.map((l, i) => (
            <Reveal key={i} i={1} y={0} build className={`x2-tw__line${i === lines.length - 1 ? " x2-tw__line--last" : ""}`} style={{ '--n': [...l].length, '--d': i * 0.4 } as React.CSSProperties}>
              <p>
                <Chars text={l} />
                <span className="x2-tw__caret" aria-hidden />
              </p>
            </Reveal>
          ))}
          {caption && (
            <Reveal i={3} className="x2-tw__caption">
              <p>{caption}</p>
            </Reveal>
          )}
        </div>
        {meta.length > 0 && (
          <Reveal i={4} className="x2-tw__meta">
            {meta.map((m) => (
              <div key={m.label}>
                <span>{m.label}</span>
                <b>{m.value}</b>
              </div>
            ))}
          </Reveal>
        )}
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
