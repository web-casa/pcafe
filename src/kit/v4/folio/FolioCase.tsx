import { useState } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot } from '../../shared'
import { FolioRail, type FolioFrame } from './parts'

export interface FolioCaseStat {
  /** The number, ≤ 4 个字符. */
  value: string
  /** Accent superscript unit, ≤ 2 个字符. */
  unit?: string
  /** ≤ 8 字. */
  label: string
}

export interface FolioCaseProps {
  /** Mono line, e.g. "CASE 02 / 04 · 2026", ≤ 24 个字符. */
  kicker: string
  /** Project name, ≤ 8 字. */
  title: string
  /** Grey line under it, ≤ 12 字. */
  sub?: string
  /** 2–4 label / value rows; label ≤ 5 字, value ≤ 20 字. */
  meta: { label: string; value: string }[]
  /** 2–3 results. */
  stats?: FolioCaseStat[]
  /** Underlined link along the foot, ≤ 10 字. */
  link?: string
  /** 3–5 frames; `focus` is this project. */
  frames: FolioFrame[]
  /** Frame in view at the start. Default 1. */
  focus?: number
  source?: string
  hint?: string
}

/** One project in depth: name, a fact table and two or three results on the left; the rail centres the project picture with its neighbours peeking in. */
export function FolioCase({ kicker, title, sub, meta, stats = [], link, frames, focus = 1, source, hint }: FolioCaseProps) {
  const [on, setOn] = useState(Math.min(focus, frames.length - 1))
  return (
    <section className="slide fo">
      <Hint id="foliocase">{hint}</Hint>
      <div className="fo-side">
        <div className="fo-body">
          <Reveal i={0} className="fo-k">
            {kicker}
          </Reveal>
          <Reveal i={1}>
            <h2 className="fo-h2">
              {title}
              {sub && <span>{sub}</span>}
            </h2>
          </Reveal>
          <dl className="fo-meta">
            {meta.slice(0, 4).map((m, i) => (
              <Reveal i={2 + i * 0.5} y={10} key={m.label}>
                <div className="fo-meta__row">
                  <dt>{m.label}</dt>
                  <dd>{m.value}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
          {stats.length > 0 && (
            <div className="fo-nums">
              {stats.slice(0, 3).map((s, i) => (
                <Reveal i={4.5 + i * 0.5} key={s.label}>
                  <b>
                    {s.value}
                    {s.unit && <sup>{s.unit}</sup>}
                  </b>
                  <small>{s.label}</small>
                </Reveal>
              ))}
            </div>
          )}
        </div>
        {link && (
          <Reveal i={7} className="fo-tags">
            <u>{link}</u>
          </Reveal>
        )}
        <SlideFoot source={source} />
      </div>
      <FolioRail frames={frames.slice(0, 5)} focus={on} onFocus={setOn} height={740} />
    </section>
  )
}
