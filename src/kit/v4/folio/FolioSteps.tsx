import { useState } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot } from '../../shared'
import type { PhotoImage } from '../../v2/p1/img'
import { FolioRail } from './parts'

export interface FolioStep {
  /** ≤ 6 字. */
  name: string
  /** When, e.g. "第 1 周", ≤ 6 字. */
  time?: string
  /** Shown while the step is open, ≤ 36 字. */
  body: string
  /** The picture the rail slides to for this step. */
  image: PhotoImage
  /** Caption chip on that picture, ≤ 14 字. */
  caption?: string
}

export interface FolioStepsProps {
  /** Mono line, ≤ 20 个字符. */
  kicker: string
  /** ≤ 8 字. */
  title: string
  /** Grey line, ≤ 10 字. */
  sub?: string
  /** 3–5 steps; each one owns a frame on the rail. */
  steps: FolioStep[]
  /** Step open at the start. */
  open?: number
  source?: string
  hint?: string
}

/** How the work runs, as an accordion of steps; opening a step slides the rail to that step's picture. */
export function FolioSteps({ kicker, title, sub, steps, open = 0, source, hint }: FolioStepsProps) {
  const list = steps.slice(0, 5)
  const [on, setOn] = useState(Math.min(open, list.length - 1))
  const frames = list.map((s, i) => ({
    image: s.image,
    tag: String(i + 1).padStart(2, '0'),
    caption: s.caption ?? s.name,
  }))
  return (
    <section className="slide fo">
      <Hint id="foliosteps">{hint}</Hint>
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
          <ol className="fo-steps">
            {list.map((s, i) => (
              <Reveal i={2 + i * 0.5} y={12} key={s.name}>
                <li className={i === on ? 'is-on' : ''} onClick={() => setOn(i)}>
                  <div className="fo-steps__head">
                    <em>{String(i + 1).padStart(2, '0')}</em>
                    <b>{s.name}</b>
                    {s.time && <small>{s.time}</small>}
                    <i aria-hidden="true">+</i>
                  </div>
                  <div className="fo-steps__body" data-crop>
                    <p>{s.body}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
        <SlideFoot source={source} />
      </div>
      <FolioRail frames={frames} focus={on} onFocus={setOn} height={700} />
    </section>
  )
}
