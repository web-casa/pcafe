import { useState } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot } from '../../shared'
import { Dot } from './parts'

export interface SlatePlan {
  /** ≤ 6 字. */
  name: string
  /** ≤ 20 字. */
  note: string
  /** Price per seat per month as a number; 0 means free. Leave out for "talk to us". */
  perSeat?: number
  /** Text shown instead of a number, e.g. "联系我们", ≤ 6 字. */
  custom?: string
  /** 3–5 features, each ≤ 12 字. */
  items: string[]
  /** Button, ≤ 8 字. */
  cta: string
}

export interface SlatePricingProps {
  dot?: string
  /** 1 line ≤ 12 字. */
  title: string
  /** Exactly 3 plans; the middle one is lit. */
  plans: SlatePlan[]
  /** Seats at the start and the step for − / +. */
  seats?: number
  step?: number
  /** Labels: seat counter, per month, currency symbol. */
  labels?: { seats: string; month: string; currency: string; popular?: string }
  source?: string
  hint?: string
}

/** Three plans with the middle one lit in the accent gradient; a seat counter recalculates every price as you press − and +. */
export function SlatePricing({ dot, title, plans, seats = 10, step = 5, labels, source, hint }: SlatePricingProps) {
  const L = labels ?? { seats: '团队人数', month: '/ 月', currency: '¥', popular: '最多人选' }
  const [n, setN] = useState(seats)
  const fmt = (v: number) => v.toLocaleString('en-US')
  return (
    <section className="slide sl">
      <Hint id="slatepricing">{hint}</Hint>
      <div className="sl-price__head">
        <div>
          {dot && (
            <Reveal i={0}>
              <Dot>{dot}</Dot>
            </Reveal>
          )}
          <Reveal i={0.5}>
            <h2 className="sl-h2 is-left is-one">{title}</h2>
          </Reveal>
        </div>
        <Reveal i={1} className="sl-seats">
          <small>{L.seats}</small>
          <button type="button" aria-label="减少" onClick={() => setN(Math.max(step, n - step))}>
            −
          </button>
          <b key={n}>{n}</b>
          <button type="button" aria-label="增加" onClick={() => setN(Math.min(500, n + step))}>
            +
          </button>
        </Reveal>
      </div>
      <div className="sl-plans">
        {plans.slice(0, 3).map((p, i) => (
          <Reveal i={1.5 + i * 0.4} y={30} key={p.name}>
            <article className={`sl-plan${i === 1 ? ' is-on' : ''}`}>
              <header>
                <b>{p.name}</b>
                {i === 1 && L.popular && <em>{L.popular}</em>}
              </header>
              <small>{p.note}</small>
              <div className="sl-plan__price" key={n}>
                {p.custom ?? (
                  <>
                    {L.currency}
                    {fmt((p.perSeat ?? 0) * n)}
                    <small> {L.month}</small>
                  </>
                )}
              </div>
              <ul>
                {p.items.slice(0, 5).map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
              <span className="sl-plan__cta">{p.cta}</span>
            </article>
          </Reveal>
        ))}
      </div>
      <div className="sl-foot">
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
