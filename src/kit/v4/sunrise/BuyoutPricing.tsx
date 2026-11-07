import { useState } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint, Lines, type Text } from '../../shared'
import { type PhotoImage } from '../../v2/p1/img'

export interface BuyoutPlan {
  /** ≤ 4 字. */
  name: string
  /** ≤ 6 个字符. */
  price: string
  /** After the price, ≤ 4 字. */
  unit?: string
  /** One line under the price, ≤ 20 字. */
  body?: string
  /** 3–4 items, each ≤ 10 字. */
  items: string[]
  /** 2 facts in boxes above the button: label ≤ 4 字, value ≤ 6 字. */
  facts?: { label: string; value: string }[]
  /** ≤ 6 字. */
  cta: string
  /** Badge next to the name, ≤ 3 字. Marks the plan picked at the start. */
  badge?: string
}

export interface BuyoutPricingProps {
  kicker?: string
  /** 1 line ≤ 10 字. */
  title: Text
  /** Exactly 2 plans. Click a plan to pick it. */
  plans: BuyoutPlan[]
  /** The sun-coloured closing card: title ≤ 2 lines × 6 字, body ≤ 36 字, 2–3 ticked points ≤ 12 字, faces, a count (value ≤ 7 个字符, label ≤ 6 字) and a button ≤ 6 字. */
  close: { title: Text; body?: string; points?: string[]; faces?: PhotoImage[]; count?: { value: string; label: string }; cta: string }
  source?: string
  hint?: string
}

/** One-time pricing: two plans you can click between, and a sun-yellow card that closes the pitch with faces and a count. Made for `sunrise`, works in any style. */
export function BuyoutPricing({ kicker, title, plans, close, source, hint }: BuyoutPricingProps) {
  const ps = plans.slice(0, 2)
  const [on, setOn] = useState(() => Math.max(0, ps.findIndex((p) => p.badge)))
  return (
    <section className="slide">
      <Hint id="buyoutpricing">{hint}</Hint>
      <div className="sr-sun is-right" aria-hidden="true" />
      <div className="frame sr-pz">
        <div className="sr-center">
          {kicker && (
            <Reveal i={0} className="sr-kick">
              ◆ {kicker}
            </Reveal>
          )}
          <Reveal i={1}>
            <h2 className="sr-title">
              <Lines text={title} />
            </h2>
          </Reveal>
        </div>
        <div className="sr-pz__row">
          {ps.map((p, i) => (
            <Reveal key={p.name} i={2 + i} y={40} className={`sr-pp${on === i ? ' is-on' : ''}`}>
              <button type="button" aria-pressed={on === i} onClick={() => setOn(i)}>
                <span className="sr-pp__nm">
                  {p.name}
                  {p.badge && <em>{p.badge}</em>}
                </span>
                <span className="sr-pp__pr">
                  {p.price}
                  {p.unit && <small>{p.unit}</small>}
                </span>
                {p.body && <span className="sr-pp__body">{p.body}</span>}
                <span className="sr-pp__list">
                  {p.items.slice(0, 4).map((it) => (
                    <span key={it}>{it}</span>
                  ))}
                </span>
                {p.facts && (
                  <span className="sr-pp__facts">
                    {p.facts.slice(0, 2).map((f) => (
                      <span key={f.label}>
                        <small>{f.label}</small>
                        <b>{f.value}</b>
                      </span>
                    ))}
                  </span>
                )}
                <span className="sr-pp__go">{p.cta}</span>
              </button>
            </Reveal>
          ))}
          <Reveal i={4} y={40} className="sr-cta2">
            <div className="sr-cta2__bg" aria-hidden="true" data-crop>
              <i />
            </div>
            <h3>
              <Lines text={close.title} />
            </h3>
            {close.body && <p>{close.body}</p>}
            {close.points && close.points.length > 0 && (
              <div className="sr-cta2__pts">
                {close.points.slice(0, 3).map((pt) => (
                  <span key={pt}>{pt}</span>
                ))}
              </div>
            )}
            <div className="sr-cta2__ft">
              {close.faces && close.faces.length > 0 && (
                <span className="sr-stack is-sun">
                  {close.faces.slice(0, 5).map((f, i) => (
                    <img key={i} src={f.src} alt={f.alt} />
                  ))}
                </span>
              )}
              {close.count && (
                <span className="sr-cta2__n">
                  <b>{close.count.value}</b>
                  {close.count.label}
                </span>
              )}
            </div>
            <span className="sr-cta2__go">{close.cta} →</span>
          </Reveal>
        </div>
        {source && <small className="sr-src-note">{source}</small>}
      </div>
    </section>
  )
}
