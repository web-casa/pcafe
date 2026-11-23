import { useState } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot } from '../../shared'
import type { PhotoImage } from '../../v2/p1/img'
import { DiptychPlate } from './parts'

export interface DiptychWord {
  /** ≤ 50 字. */
  text: string
  /** ≤ 6 字. */
  name: string
  /** Role · company, ≤ 16 字. */
  role: string
  /** The project picture shown on the plate while this quote is on. */
  image: PhotoImage
  /** Project name on the plate caption, ≤ 8 字. */
  project?: string
}

export interface DiptychWordsProps {
  kicker: string
  /** 2–4 quotes. */
  words: DiptychWord[]
  /** 2–3 figures under the quotes: value ≤ 5 个字符, label ≤ 8 字. */
  stats?: { value: string; label: string }[]
  signature?: string
  source?: string
  hint?: string
}

/** Client words one at a time beside the project they are about; the numbered tabs flip both together, with two or three figures below. */
export function DiptychWords({ kicker, words, stats = [], signature, source, hint }: DiptychWordsProps) {
  const list = words.slice(0, 4)
  const [on, setOn] = useState(0)
  const w = list[on]
  const shots = list.map((q) => ({
    image: q.image,
    title: q.project,
    meta: q.name,
  }))
  return (
    <section className="slide dp">
      <Hint id="diptychwords">{hint}</Hint>
      <DiptychPlate shots={shots} index={on} onIndex={setOn} signature={signature} />
      <div className="dp-side">
        <Reveal i={0} className="dp-k">
          {kicker}
        </Reveal>
        <Reveal i={1} className="dp-qtabs">
          {list.map((q, k) => (
            <button type="button" key={q.name} className={k === on ? 'is-on' : ''} onClick={() => setOn(k)}>
              {String(k + 1).padStart(2, '0')}
            </button>
          ))}
        </Reveal>
        <Reveal i={2}>
          <blockquote className="dp-quote" key={on}>
            <p>“{w.text}”</p>
            <footer>
              <b>{w.name}</b>
              <small>{w.role}</small>
            </footer>
          </blockquote>
        </Reveal>
        {stats.length > 0 && (
          <div className="dp-stats">
            {stats.slice(0, 3).map((s, k) => (
              <Reveal i={3.5 + k * 0.4} key={s.label}>
                <b>{s.value}</b>
                <small>{s.label}</small>
              </Reveal>
            ))}
          </div>
        )}
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
