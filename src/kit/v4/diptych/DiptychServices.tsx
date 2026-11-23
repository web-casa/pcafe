import { useState } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot } from '../../shared'
import type { PhotoImage } from '../../v2/p1/img'
import { DiptychPlate, Soft } from './parts'

export interface DiptychService {
  /** Tab label, ≤ 4 字. */
  name: string
  /** One line about it, ≤ 40 字. */
  body: string
  /** 3–5 deliverables, each ≤ 10 字. */
  items: string[]
  /** e.g. "4–6 周", ≤ 8 字. */
  time?: string
  /** e.g. "¥60k 起", ≤ 8 字. */
  price?: string
  image: PhotoImage
}

export interface DiptychServicesProps {
  kicker: string
  /** 1–2 lines × ≤ 8 字. */
  title: string[]
  soft?: string
  /** 2–4 services as tabs; each brings its own picture. */
  services: DiptychService[]
  /** Labels for the timeline and price, each ≤ 4 字. Default ['周期', '预算']. */
  labels?: [string, string]
  signature?: string
  source?: string
  hint?: string
}

/** What you offer as tabs: picking a tab swaps the plate picture and shows that service's line, deliverables, timeline and price. */
export function DiptychServices({ kicker, title, soft, services, labels = ['周期', '预算'], signature, source, hint }: DiptychServicesProps) {
  const list = services.slice(0, 4)
  const [on, setOn] = useState(0)
  const s = list[on]
  const shots = list.map((x) => ({
    image: x.image,
    title: x.name,
    meta: x.time,
  }))
  return (
    <section className="slide dp">
      <Hint id="diptychservices">{hint}</Hint>
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
        <Reveal i={2}>
          <div className="dp-tabs" role="tablist">
            {list.map((x, k) => (
              <button type="button" role="tab" aria-selected={k === on} key={x.name} className={k === on ? 'is-on' : ''} onClick={() => setOn(k)}>
                {x.name}
              </button>
            ))}
          </div>
        </Reveal>
        <Reveal i={3}>
          <div className="dp-svc" key={on}>
            <p>{s.body}</p>
            <ul>
              {s.items.slice(0, 5).map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
            <div className="dp-svc__foot">
              {s.time && (
                <span>
                  <small>{labels[0]}</small>
                  {s.time}
                </span>
              )}
              {s.price && (
                <span>
                  <small>{labels[1]}</small>
                  {s.price}
                </span>
              )}
            </div>
          </div>
        </Reveal>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
