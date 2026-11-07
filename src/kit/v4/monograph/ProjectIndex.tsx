import { useState } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint, Lines, SlideFoot, type Text } from '../../shared'
import { Photo, type PhotoImage } from '../../v2/p1/img'

export interface IndexedProject {
  /** Client · project, ≤ 14 字. */
  name: string
  /** ≤ 6 个字符, e.g. '2024'. */
  year: string
  /** The picture shown when the row is active; portrait works best. */
  image: PhotoImage
}

export interface ProjectIndexProps {
  /** Section marker, ≤ 8 字. */
  kicker: string
  /** 1 line, ≤ 12 字. */
  title: Text
  /** Pill button at the top right, ≤ 8 字. */
  cta?: string
  /** 3–6 projects, newest first. Click or hover a row to show its picture. */
  projects: IndexedProject[]
  source?: string
  hint?: string
}

/** A project index: a list of rows, the active one inked black, and its picture at the right. Click or hover a row to switch. Made for `monograph`, works in any style. */
export function ProjectIndex({ kicker, title, cta, projects, source, hint }: ProjectIndexProps) {
  const [on, setOn] = useState(0)
  return (
    <section className="slide">
      <Hint id="projectindex">{hint}</Hint>
      <div className="frame mg-idxs">
        <div className="mg-head">
          <div>
            <Reveal i={0} className="mg-k">
              {kicker}
            </Reveal>
            <h2 className="mg-title">
              <span className="mg-lines">
                <Lines text={title} />
              </span>
            </h2>
          </div>
          {cta && (
            <Reveal i={2} className="mg-pill">
              {cta}
            </Reveal>
          )}
        </div>
        <div className="mg-idxs__body">
          <ul className="mg-rows" role="tablist">
            {projects.map((p, i) => (
              <Reveal key={p.name} i={3 + i * 0.6} y={14}>
                <li>
                  <button type="button" role="tab" aria-selected={i === on} className={i === on ? 'is-on' : ''} onClick={() => setOn(i)} onMouseEnter={() => setOn(i)}>
                    <span>{p.name}</span>
                    <small>
                      {p.year} {i === on && '↗'}
                    </small>
                  </button>
                </li>
              </Reveal>
            ))}
          </ul>
          <div className="mg-idxs__img" data-crop>
            {projects.map((p, i) => (
              <div key={p.name} className={`mg-idxs__pic${i === on ? ' is-on' : ''}`} aria-hidden={i !== on}>
                <Photo image={p.image} />
              </div>
            ))}
          </div>
        </div>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
