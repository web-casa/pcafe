import { useState } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint, Lines, SlideFoot, type Text } from '../../shared'

export interface GlowPlan {
  /** ≤ 4 字. */
  name: string
  /** Prices for the two periods, each ≤ 6 个字符, e.g. ['¥99', '¥79']. */
  price: [string, string]
  /** ≤ 24 字. */
  body: string
  /** 3–5 items, each ≤ 10 字. */
  items: string[]
  /** Optional allowance meter above the button: label ≤ 6 字, value ≤ 10 个字符, pct 0–100. */
  quota?: { label: string; value: string; pct: number }
  /** Button, ≤ 6 字. */
  cta: string
  /** The highlighted plan (one at most). */
  hot?: boolean
  /** Badge on the highlighted plan, ≤ 4 字. */
  badge?: string
}

export interface GlowPricingProps {
  kicker: string
  /** 1 line, ≤ 12 字. */
  title: Text
  /** The two periods, each ≤ 4 字, and an optional saving note ≤ 6 字 on the second. */
  periods: [string, string]
  save?: string
  /** Unit after the price, ≤ 3 字, per period. */
  units?: [string, string]
  /** Exactly 3 plans. */
  plans: GlowPlan[]
  source?: string
  hint?: string
}

/** Three plans on a dark stage with the favourite glowing in the accent; a period switch flips every price. Made for `nocturne`, works in any style. */
export function GlowPricing({ kicker, title, periods, save, units = ['/月', '/月'], plans, source, hint }: GlowPricingProps) {
  const [p, setP] = useState(0)
  return (
    <section className="slide">
      <Hint id="glowpricing">{hint}</Hint>
      <div className="nc-glow is-top" aria-hidden="true" />
      <div className="frame nc-price">
        <div className="nc-center">
          <Reveal i={0} className="nc-pill">
            {kicker}
          </Reveal>
          <Reveal i={1}>
            <h2 className="nc-title">
              <Lines text={title} />
            </h2>
          </Reveal>
          <Reveal i={2} className="nc-switch" style={{ ['--p' as string]: p }}>
            <i aria-hidden="true" />
            {periods.map((x, i) => (
              <button key={x} type="button" aria-pressed={p === i} onClick={() => setP(i)}>
                {x}
                {i === 1 && save && <em>{save}</em>}
              </button>
            ))}
          </Reveal>
        </div>
        <div className="nc-plans">
          {plans.slice(0, 3).map((pl, i) => (
            <Reveal key={pl.name} i={4 + i} y={40} className={`nc-plan${pl.hot ? ' is-hot' : ''}`}>
              <div className="nc-plan__hd">
                <span>{pl.name}</span>
                {pl.hot && pl.badge && <em>{pl.badge}</em>}
              </div>
              <div className="nc-plan__price">
                <b key={p}>{pl.price[p]}</b>
                <small>{units[p]}</small>
              </div>
              <p>{pl.body}</p>
              <ul>
                {pl.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
              {pl.quota && (
                <div className="nc-quota" style={{ ['--q' as string]: `${Math.max(4, Math.min(100, pl.quota.pct))}%` }}>
                  <div>
                    <span>{pl.quota.label}</span>
                    <b>{pl.quota.value}</b>
                  </div>
                  <i aria-hidden="true">
                    <em />
                  </i>
                </div>
              )}
              <span className="nc-plan__cta">{pl.cta}</span>
            </Reveal>
          ))}
        </div>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
