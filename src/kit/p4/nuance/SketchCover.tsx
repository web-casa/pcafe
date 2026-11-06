import type { ReactNode } from 'react'
import { Kicker, Reveal } from '../../../deck/primitives'
import { Icon, type IconName } from '../../Icon'
import { Hint, SlideFoot } from '../../shared'

export interface SketchCoverProps {
  /** 2–12 characters. */
  kicker: string
  /** Line 1: words before the tag, ≤ 6 CJK characters. */
  pre: string
  /** Line 1: the tagged word in the tilted label, ≤ 4 CJK characters. */
  tag: string
  /** Line 2, ≤ 12 CJK characters. */
  line: string
  /** ≤ 48 CJK characters. */
  lead: string
  /** What is "written" on the dotted canvas: one command or phrase, ≤ 30 characters. */
  canvas: string
  /** 3–5 pills under the panel, each ≤ 8 CJK characters. */
  chips: string[]
  source?: string
  hint?: ReactNode
}

const TOOLS: IconName[] = ['cursor', 'pen', 'layers', 'text', 'gallery', 'refresh']

/** Product or portfolio opening: an iridescent rounded panel with a serif headline whose key word sits in a tilted orange label, a dotted drawing canvas with one hand-circled line, and a row of red-dot pills. */
export function SketchCover({ kicker, pre, tag, line, lead, canvas, chips, source, hint }: SketchCoverProps) {
  return (
    <section className="slide">
      <Hint id="sketchcover">{hint}</Hint>
      <div className="frame nsk">
        <div className="nsk__panel" aria-hidden />
        <div className="nsk__copy">
          <Reveal i={0}>
            <Kicker>{kicker}</Kicker>
          </Reveal>
          <Reveal i={1}>
            <h1 className="s-title nsk__title">
              <span className="nsk__l1">
                {pre}
                <span className="nu-tag">{tag}</span>
              </span>
              <br />
              {line}
            </h1>
          </Reveal>
          <Reveal i={2}>
            <p className="s-lead nsk__lead">{lead}</p>
          </Reveal>
        </div>
        <Reveal i={3} className="nsk__board">
          <div className="nsk__tools" aria-hidden>
            {TOOLS.map((t, k) => (
              <span key={t} className={k === 1 ? 'is-on' : undefined}>
                <Icon name={t} size={24} />
              </span>
            ))}
            <i />
          </div>
          <div className="nsk__ink">
            <code>{canvas}</code>
            <svg className="nsk__loop" viewBox="0 0 400 100" preserveAspectRatio="none" aria-hidden>
              <path d="M30 58 C 40 12, 360 4, 384 44 C 400 84, 120 98, 36 80 C 4 72, 18 40, 70 30" />
            </svg>
          </div>
          <svg className="nsk__arrow" viewBox="0 0 120 80" aria-hidden>
            <path d="M8 70 C 30 30, 70 14, 108 18 M92 6 L110 18 L94 32" />
          </svg>
        </Reveal>
        <div className="nsk__chips">
          {chips.map((c, k) => (
            <Reveal key={c} i={4 + k * 0.4} className="nu-pill">
              {c}
            </Reveal>
          ))}
        </div>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
