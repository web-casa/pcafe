import { useState } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot } from '../../shared'
import type { PhotoImage } from '../../v2/p1/img'
import { FolioRail } from './parts'

export interface FolioWord {
  /** The quote, ≤ 56 字. */
  text: string
  /** ≤ 6 字. */
  name: string
  /** Role · company, ≤ 16 字. */
  role: string
  avatar?: PhotoImage
  /** One result next to the quote: value ≤ 5 个字符, label ≤ 8 字. */
  metric?: { value: string; label: string }
  /** The project picture the rail slides to. */
  image: PhotoImage
  /** Caption chip on the picture, ≤ 14 字. */
  caption?: string
}

export interface FolioWordsProps {
  /** Mono line, ≤ 20 个字符. */
  kicker: string
  /** 2–4 quotes; each owns a frame on the rail. */
  words: FolioWord[]
  source?: string
  hint?: string
}

/** Client words, one at a time in large type; the arrows flip the quote and slide the rail to the project it is about. */
export function FolioWords({ kicker, words, source, hint }: FolioWordsProps) {
  const list = words.slice(0, 4)
  const [on, setOn] = useState(0)
  const w = list[on]
  const go = (d: number) => setOn((on + d + list.length) % list.length)
  const frames = list.map((q, i) => ({
    image: q.image,
    tag: String(i + 1).padStart(2, '0'),
    caption: q.caption,
  }))
  return (
    <section className="slide fo">
      <Hint id="foliowords">{hint}</Hint>
      <div className="fo-side">
        <div className="fo-body">
          <Reveal i={0} className="fo-k">
            {kicker}
          </Reveal>
          <Reveal i={1}>
            <blockquote className="fo-quote" key={on}>
              <p>“{w.text}”</p>
            </blockquote>
          </Reveal>
          <Reveal i={2} className="fo-by">
            <div className="fo-me" key={on}>
              {w.avatar && <img src={w.avatar.src} alt={w.avatar.alt} draggable={false} />}
              <span>
                <b>{w.name}</b>
                <small>{w.role}</small>
              </span>
            </div>
            {w.metric && (
              <div className="fo-metric" key={`m${on}`}>
                <b>{w.metric.value}</b>
                <small>{w.metric.label}</small>
              </div>
            )}
          </Reveal>
        </div>
        {list.length > 1 && (
          <Reveal i={4} className="fo-pager">
            <button type="button" aria-label="上一条" onClick={() => go(-1)}>
              ←
            </button>
            <button type="button" aria-label="下一条" onClick={() => go(1)}>
              →
            </button>
            <span>
              {String(on + 1).padStart(2, '0')} / {String(list.length).padStart(2, '0')}
            </span>
          </Reveal>
        )}
        <SlideFoot source={source} />
      </div>
      <FolioRail frames={frames} focus={on} onFocus={setOn} height={720} />
    </section>
  )
}
