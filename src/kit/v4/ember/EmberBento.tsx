import { useState } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint } from '../../shared'
import type { PhotoImage } from '../../v2/p1/img'
import { Dot } from './parts'

export interface EmberCard {
  /** One-character mark on the accent square. */
  icon: string
  /** ≤ 8 字. */
  title: string
  /** ≤ 34 字. */
  body: string
  /** Dark, lit picture filling the card. */
  image?: PhotoImage
  /** 3–6 one-character tool marks in a floating dock; click one to light it. Its name shows in `tip`. */
  tools?: { mark: string; name: string }[]
  /** 2–4 switches, each label ≤ 8 字. */
  toggles?: { label: string; on: boolean }[]
}

export interface EmberBentoProps {
  dot?: string
  /** ≤ 16 字, one line in serif. */
  title: string
  /** Exactly 4 cards: the 1st and 3rd are tall, the 2nd and 4th share the middle column. */
  cards: EmberCard[]
  hint?: string
}

function Card({ c, tall }: { c: EmberCard; tall?: boolean }) {
  const [tool, setTool] = useState(Math.min(3, (c.tools?.length ?? 1) - 1))
  const [sw, setSw] = useState(() => (c.toggles ?? []).map((t) => t.on))
  return (
    <div className={`eb-bx${tall ? ' is-tall' : ''}${c.image ? ' has-img' : ''}`} data-crop>
      {c.image && <img src={c.image.src} alt={c.image.alt} draggable={false} style={{ objectPosition: c.image.focus ?? 'center' }} />}
      {c.tools && (
        <div className="eb-tools" role="group" aria-label={c.title}>
          {c.tools.slice(0, 6).map((t, i) => (
            <button type="button" key={t.name} className={i === tool ? 'is-on' : undefined} aria-pressed={i === tool} aria-label={t.name} onClick={() => setTool(i)}>
              {t.mark}
            </button>
          ))}
          <small key={tool}>{c.tools[tool]?.name}</small>
        </div>
      )}
      {c.toggles && (
        <div className="eb-tg">
          {c.toggles.slice(0, 4).map((t, i) => (
            <button
              type="button"
              key={t.label}
              role="switch"
              aria-checked={sw[i]}
              className={sw[i] ? 'is-on' : undefined}
              onClick={() => setSw((s) => s.map((v, j) => (j === i ? !v : v)))}
            >
              <span>◈ {t.label}</span>
              <u aria-hidden="true" />
            </button>
          ))}
        </div>
      )}
      <div className="eb-bx__tx">
        <b>
          <i aria-hidden="true">{c.icon}</i>
          {c.title}
        </b>
        <p>{c.body}</p>
      </div>
    </div>
  )
}

/** Four feature cards in a dark bento: two tall picture cards, one with a tool dock you can click and one with working switches. */
export function EmberBento({ dot, title, cards, hint }: EmberBentoProps) {
  const [a, b, c, d] = cards
  return (
    <section className="slide eb">
      <Hint id="emberbento">{hint}</Hint>
      <div className="eb-head">
        {dot && (
          <Reveal i={0}>
            <Dot>{dot}</Dot>
          </Reveal>
        )}
        <Reveal i={0.4}>
          <h2 className="eb-h2">{title}</h2>
        </Reveal>
      </div>
      <div className="eb-bento">
        {[a, b, c, d].map(
          (x, i) =>
            x && (
              <Reveal key={i} i={1 + i * 0.3} className={`eb-bento__${i}`}>
                <Card c={x} tall={i === 0 || i === 2} />
              </Reveal>
            ),
        )}
      </div>
    </section>
  )
}
