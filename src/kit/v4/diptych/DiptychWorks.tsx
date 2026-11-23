import { useState } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot } from '../../shared'
import type { PhotoImage } from '../../v2/p1/img'
import { DiptychPlate, Soft } from './parts'

export interface DiptychWork {
  /** ≤ 6 字. */
  name: string
  /** What it was, ≤ 6 字. */
  kind: string
  /** e.g. "2026", ≤ 6 个字符. */
  year?: string
  image: PhotoImage
}

export interface DiptychWorksProps {
  /** Small grey line, ≤ 16 字. */
  kicker: string
  /** 1–2 lines × ≤ 8 字. */
  title: string[]
  /** Words in `title` set in grey. */
  soft?: string
  /** 3–6 projects; hovering one puts its picture on the plate. */
  works: DiptychWork[]
  /** Project lit at the start. */
  active?: number
  signature?: string
  source?: string
  hint?: string
}

/** Selected work as a numbered list; hovering or clicking a row swaps the big picture on the left to that project. */
export function DiptychWorks({ kicker, title, soft, works, active = 0, signature, source, hint }: DiptychWorksProps) {
  const list = works.slice(0, 6)
  const [on, setOn] = useState(Math.min(active, list.length - 1))
  const shots = list.map((w) => ({
    image: w.image,
    title: w.name,
    meta: [w.kind, w.year].filter(Boolean).join(' · '),
  }))
  return (
    <section className="slide dp">
      <Hint id="diptychworks">{hint}</Hint>
      <DiptychPlate shots={shots} index={on} onIndex={setOn} signature={signature} />
      <div className="dp-side">
        <Reveal i={0} className="dp-k">
          {kicker}
        </Reveal>
        <Reveal i={1}>
          <h2 className="dp-h2">
            {title.slice(0, 2).map((l, k) => (
              <span key={k}>
                <Soft line={l} soft={soft} />
              </span>
            ))}
          </h2>
        </Reveal>
        <ul className="dp-list">
          {list.map((w, k) => (
            <Reveal i={2 + k * 0.4} y={10} key={w.name}>
              <li className={k === on ? 'is-on' : ''} onMouseEnter={() => setOn(k)} onClick={() => setOn(k)}>
                <em>{String(k + 1).padStart(2, '0')}</em>
                <b>{w.name}</b>
                <small>{w.kind}</small>
                <i aria-hidden="true">→</i>
              </li>
            </Reveal>
          ))}
        </ul>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
