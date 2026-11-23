import { useEffect, useState } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot } from '../../shared'
import type { PhotoImage } from '../../v2/p1/img'
import { Count } from '../../v4/dusk/parts'

export interface AgencyQuote {
  /** ≤ 40 字. */
  text: string
  name: string
  /** Role · company, ≤ 14 字. */
  role: string
  /** Portrait on the right of the quote card. */
  image: PhotoImage
}

export interface AgencyProofProps {
  /** Small white pill at the top left, ≤ 6 字. */
  tag: string
  /** 2 lines × ≤ 12 字. */
  title: string[]
  /** 1–3 quotes; arrows step through them. */
  quotes: AgencyQuote[]
  /** Gradient tile, bottom left, ≤ 14 字. */
  statement: string
  /** Picture tile with a ≤ 10 字 caption. */
  visual: { image: PhotoImage; caption: string }
  /** Number tile: value counts up; label ≤ 8 字, foot ≤ 8 字, 0–4 faces. */
  stat: { value: string; label: string; foot: string; faces?: PhotoImage[] }
  /** Advance every N ms until someone clicks an arrow; 0 turns it off. Default 6400. */
  autoplay?: number
  source?: string
  hint?: string
}

/** Agency proof: a dark quote card with a portrait that steps between clients, over a three-tile bento (gradient statement, picture, counting number with faces). */
export function AgencyProof({ tag, title, quotes, statement, visual, stat, autoplay = 6400, source, hint }: AgencyProofProps) {
  const list = quotes.slice(0, 3)
  const [on, setOn] = useState(0)
  const [auto, setAuto] = useState(autoplay > 0)
  useEffect(() => {
    if (!auto || list.length < 2) return
    const t = window.setTimeout(() => setOn((x) => (x + 1) % list.length), autoplay)
    return () => window.clearTimeout(t)
  }, [on, auto, autoplay, list.length])
  const go = (d: number) => {
    setAuto(false)
    setOn((x) => (x + d + list.length) % list.length)
  }
  const q = list[on]
  return (
    <section className="slide ag-soft">
      <Hint id="agencyproof">{hint}</Hint>
      <div className="ag-head is-tight">
        <Reveal i={0}>
          <span className="ag-tag">{tag}</span>
        </Reveal>
        <Reveal i={0.5}>
          <h2 className="ag-h2">
            {title.slice(0, 2).map((l, i) => (
              <span key={i}>{l}</span>
            ))}
          </h2>
        </Reveal>
      </div>
      <Reveal i={1} className="ag-pf__quote">
        <div className="ag-pf__card">
          <div className="ag-pf__q">
            <i aria-hidden="true">“</i>
            <blockquote key={`q${on}`}>“{q.text}”</blockquote>
            {list.length > 1 && (
              <div className="ag-pf__ctl">
                <button type="button" aria-label="上一条评价" onClick={() => go(-1)}>
                  ←
                </button>
                <button type="button" aria-label="下一条评价" onClick={() => go(1)}>
                  →
                </button>
                <span className="ag-pf__count">
                  {String(on + 1).padStart(2, '0')} / {String(list.length).padStart(2, '0')}
                </span>
              </div>
            )}
          </div>
          <figure data-crop>
            {list.map((x, i) => (
              <img key={i} src={x.image.src} alt={x.image.alt} draggable={false} className={i === on ? 'is-on' : undefined} style={{ objectPosition: x.image.focus ?? 'center' }} />
            ))}
            <figcaption key={`c${on}`}>
              {q.name}
              <small>{q.role}</small>
            </figcaption>
          </figure>
        </div>
      </Reveal>
      <div className="ag-pf__bento">
        <Reveal i={1.5} className="ag-pf__tile is-grad">
          <span>{statement}</span>
        </Reveal>
        <Reveal i={1.8} className="ag-pf__tile is-pic">
          <div data-crop>
            <img src={visual.image.src} alt={visual.image.alt} draggable={false} style={{ objectPosition: visual.image.focus ?? 'center' }} />
          </div>
          <span>{visual.caption}</span>
        </Reveal>
        <Reveal i={2.1} className="ag-pf__tile is-num">
          <b>
            <Count value={stat.value} delay={900} />
          </b>
          <small>{stat.label}</small>
          <div className="ag-pf__row">
            <span>{stat.foot}</span>
            {stat.faces && stat.faces.length > 0 && (
              <span className="ag-faces is-light">
                {stat.faces.slice(0, 4).map((f, i) => (
                  <img key={i} src={f.src} alt={f.alt} draggable={false} />
                ))}
              </span>
            )}
          </div>
        </Reveal>
      </div>
      {source && (
        <div className="ag-foot">
          <SlideFoot source={source} />
        </div>
      )}
    </section>
  )
}
