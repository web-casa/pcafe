import type { ReactNode } from 'react'
import { Kicker, Reveal } from '../deck/primitives'
import { Hint, SlideFoot } from './shared'

export interface ContrastSide {
  /** ≤ 6 CJK characters, e.g. '过去' / '现在'. */
  label: string
  /** ≤ 20 CJK characters. */
  text: string
}

export interface ContrastProps {
  kicker: string
  /** The old way: shown muted and struck through. */
  before: ContrastSide
  /** The new way: shown in ink with the accent label. */
  after: ContrastSide
  /** ≤ 40 CJK characters, under both lines. */
  sub?: string
  source?: string
  hint?: ReactNode
}

/** Two sentences stacked: the old way muted and struck, the new way in full ink. */
export function Contrast({ kicker, before, after, sub, source, hint }: ContrastProps) {
  return (
    <section className="slide">
      <Hint id="contrast">{hint}</Hint>
      <div className="frame s-contrast">
        <Reveal i={0}>
          <Kicker>{kicker}</Kicker>
        </Reveal>
        <div className="contrast">
          <Reveal i={1} className="contrast__row is-before">
            <span>{before.label}</span>
            <p>{before.text}</p>
          </Reveal>
          <Reveal i={3} className="contrast__row is-after" build>
            <span>{after.label}</span>
            <p>{after.text}</p>
          </Reveal>
        </div>
        {sub && (
          <Reveal i={5} className="contrast__sub">
            {sub}
          </Reveal>
        )}
        <SlideFoot source={source} i={9} />
      </div>
    </section>
  )
}
