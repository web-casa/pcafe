import type { ReactNode } from 'react'
import { Kicker, Reveal } from '../deck/primitives'
import { Icon } from './Icon'
import { Hint, Lines, type Text } from './shared'
import { pad2 } from '../deck/motion'

export interface ChapterProgressProps {
  kicker: string
  /** The chapter about to start, ≤ 2 lines × 10 CJK characters. */
  title: Text
  /** ≤ 50 CJK characters. */
  lead?: string
  /** All chapter names in order, 3–6, ≤ 8 CJK characters each. */
  chapters: string[]
  /** 0-based index of the chapter this slide opens. */
  current: number
  hint?: ReactNode
}

/** A chapter opener that shows where the talk is: done chapters ticked, this one lit, the rest ahead. */
export function ChapterProgress({ kicker, title, lead, chapters, current, hint }: ChapterProgressProps) {
  return (
    <section className="slide">
      <Hint id="chprog">{hint}</Hint>
      <div className="frame s-chprog">
        <div className="chprog__top">
          <div>
            <Reveal i={0}>
              <Kicker>{kicker}</Kicker>
            </Reveal>
            <Reveal i={1}>
              <h2 className="chprog__title break__title">
                <Lines text={title} />
              </h2>
            </Reveal>
            {lead && (
              <Reveal i={2} className="s-lead chprog__lead">
                {lead}
              </Reveal>
            )}
          </div>
          <Reveal i={2} className="chprog__count">
            <b className="numeral">{pad2(current + 1)}</b>
            <span>/ {pad2(chapters.length)}</span>
          </Reveal>
        </div>
        <Reveal i={4} className="chprog__track" style={{ ['--n' as string]: chapters.length, ['--at' as string]: current }}>
          <i className="chprog__line" />
          {chapters.map((c, i) => (
            <div key={c} className={`chprog__step${i < current ? ' is-done' : i === current ? ' is-now' : ''}`}>
              <span className="chprog__dot">{i < current ? <Icon name="check" size={30} variant="bold" /> : pad2(i + 1)}</span>
              <b>{c}</b>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
