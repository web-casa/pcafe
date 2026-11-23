import { useState } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot } from '../../shared'
import type { PhotoImage } from '../../v2/p1/img'
import { Glow, Print } from './parts'

export interface AlbumPlusProps {
  /** Plan name, ≤ 10 个字符. */
  name: string
  /** ≤ 46 字. */
  lead?: string
  /** Exactly 4 features: icon one character, title ≤ 7 字, note ≤ 24 字. */
  feats: { icon: string; title: string; note: string }[]
  /** Monthly and yearly prices, e.g. ["¥18", "¥168"], each ≤ 6 个字符. */
  prices: [string, string]
  /** Labels for the toggle and the unit after each price; defaults are Chinese. */
  periods?: { month: string; year: string; perMonth: string; perYear: string; save?: string }
  /** Button, ≤ 8 字. */
  cta: string
  /** 2–4 prints floating around the card. */
  around?: PhotoImage[]
  source?: string
  hint?: string
}

const AROUND = [
  { left: 110, top: 170, w: 250, h: 300, r: -9 },
  { left: 1560, top: 190, w: 240, h: 290, r: 8 },
  { left: 220, top: 580, w: 230, h: 280, r: 6 },
  { left: 1480, top: 600, w: 250, h: 290, r: -5 },
]

/** A single paid plan on a centred card: four features in a grid, a monthly / yearly switch that rolls the price, and prints drifting gently around it. */
export function AlbumPlus({ name, lead, feats, prices, periods, cta, around = [], source, hint }: AlbumPlusProps) {
  const p = periods ?? { month: '月付', year: '年付', perMonth: '/ 月', perYear: '/ 年', save: '省 22%' }
  const [yearly, setYearly] = useState(false)
  return (
    <section className="slide al">
      <Hint id="albumplus">{hint}</Hint>
      <Glow at="center" />
      {around.slice(0, 4).map((img, k) => {
        const a = AROUND[k]
        return (
          <Print
            key={k}
            print={{ image: img }}
            className="al-float"
            style={{
              left: `calc(${a.left} * var(--u))`,
              top: `calc(${a.top} * var(--u))`,
              width: `calc(${a.w} * var(--u))`,
              ['--h' as string]: `calc(${a.h - 60} * var(--u))`,
              rotate: `${a.r}deg`,
              animationDelay: `${0.4 + k * 0.12}s, ${k * 1.1}s`,
            }}
          />
        )
      })}
      <Reveal i={0} className="al-plus">
        <h2>
          {name} <i>✦</i>
        </h2>
        {lead && <p>{lead}</p>}
        <div className="al-feats">
          {feats.slice(0, 4).map((f, k) => (
            <div key={f.title} className={`is-${k}`}>
              <i>{f.icon}</i>
              <b>{f.title}</b>
              <small>{f.note}</small>
            </div>
          ))}
        </div>
        <div className="al-bill">
          <div className="al-switch" role="group">
            <button type="button" className={yearly ? '' : 'is-on'} onClick={() => setYearly(false)}>
              {p.month}
            </button>
            <button type="button" className={yearly ? 'is-on' : ''} onClick={() => setYearly(true)}>
              {p.year}
              {p.save && <em>{p.save}</em>}
            </button>
          </div>
          <div className="al-price" data-crop key={yearly ? "y" : "m"}>
            {yearly ? prices[1] : prices[0]}
            <small> {yearly ? p.perYear : p.perMonth}</small>
          </div>
          <span className="al-btn">{cta} →</span>
        </div>
      </Reveal>
      <div className="al-plus__foot">
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
