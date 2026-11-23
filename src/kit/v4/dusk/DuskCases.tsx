import { useEffect, useState } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot } from '../../shared'
import type { PhotoImage } from '../../v2/p1/img'
import { Tag } from './parts'

export interface DuskCase {
  /** Customer name with a one-character mark, e.g. "✳ 常青科技"; ≤ 10 字. */
  company: string
  /** The result, ≤ 26 字. */
  headline: string
  image: PhotoImage
}

export interface DuskVoice {
  /** e.g. "◼ 模块实验室", ≤ 10 字. */
  company: string
  /** ≤ 44 字. */
  quote: string
  name: string
  /** ≤ 12 字. */
  role: string
  avatar?: PhotoImage
}

export interface DuskCasesProps {
  tag?: { icon?: string; label: string }
  /** One line, ≤ 16 字. */
  title: string
  /** 2–4 case studies in a carousel. */
  cases: DuskCase[]
  /** Exactly 2 short quotes on the right. */
  voices: DuskVoice[]
  /** Button on the case card, ≤ 6 字. Default "读案例". */
  cta?: string
  /** Advance every N ms; 0 turns it off. Default 5200. */
  autoplay?: number
  source?: string
  hint?: string
}

/** Customer proof: a big photo case study that slides between customers (arrows, dots, autoplay) next to two short quote cards. */
export function DuskCases({ tag, title, cases, voices, cta = '读案例', autoplay = 5200, source, hint }: DuskCasesProps) {
  const list = cases.slice(0, 4)
  const [on, setOn] = useState(0)
  const [tick, setTick] = useState(0)
  useEffect(() => {
    if (!autoplay || list.length < 2) return
    const t = window.setTimeout(() => setOn((x) => (x + 1) % list.length), autoplay)
    return () => window.clearTimeout(t)
  }, [on, tick, autoplay, list.length])
  const go = (d: number) => {
    setTick((t) => t + 1)
    setOn((x) => (x + d + list.length) % list.length)
  }
  const c = list[on]
  return (
    <section className="slide du">
      <Hint id="duskcases">{hint}</Hint>
      <div className="du-cases__head">
        {tag && (
          <Reveal i={0}>
            <Tag icon={tag.icon}>{tag.label}</Tag>
          </Reveal>
        )}
        <Reveal i={0.4}>
          <h2 className="du-h2 is-one">{title}</h2>
        </Reveal>
      </div>
      <Reveal i={0.8} className="du-case__wrap">
        <div className="du-case" data-crop>
          {list.map((x, i) => (
            <img key={i} src={x.image.src} alt={x.image.alt} draggable={false} className={i === on ? 'is-on' : undefined} style={{ objectPosition: x.image.focus ?? 'center' }} />
          ))}
          <div className="du-case__co" key={`c${on}`}>
            {c.company}
          </div>
          <div className="du-case__tx" key={`t${on}`}>
            <p>{c.headline}</p>
            <span className="du-btn is-white">{cta} →</span>
          </div>
          {list.length > 1 && (
            <div className="du-case__nav">
              <div className="du-case__dots" aria-hidden="true">
                {list.map((_, i) => (
                  <i key={i} className={i === on ? 'is-on' : undefined} style={i === on && autoplay ? { animationDuration: `${autoplay}ms` } : undefined} />
                ))}
              </div>
              <button type="button" aria-label="上一个" onClick={() => go(-1)}>
                ‹
              </button>
              <button type="button" aria-label="下一个" onClick={() => go(1)}>
                ›
              </button>
            </div>
          )}
        </div>
      </Reveal>
      <div className="du-voices">
        {voices.slice(0, 2).map((v, i) => (
          <Reveal key={i} i={1.1 + i * 0.3}>
            <figure className="du-voice">
              <span className="du-voice__co">{v.company}</span>
              <blockquote>“{v.quote}”</blockquote>
              <figcaption>
                {v.avatar && <img src={v.avatar.src} alt={v.avatar.alt} draggable={false} />}
                <span>
                  {v.name}
                  <small>{v.role}</small>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
      <div className="du-foot">
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
