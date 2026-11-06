import { Reveal } from '../deck/primitives'
import { Icon } from './Icon'
import { Hint, SlideFoot, SlideHead, type SlideBase } from './shared'

export interface Tier {
  /** ≤ 6 characters. */
  name: string
  /** As it should read: '¥0', '¥399', '询价'. ≤ 6 characters. */
  price: string
  /** After the price, e.g. '/ 席位 / 月'. ≤ 10 characters. */
  unit?: string
  /** Who it is for, ≤ 16 CJK characters. */
  for: string
  /** 3–5 lines, ≤ 16 CJK characters each. The first tier lists its own; later tiers start with '包含上一档'. */
  features: string[]
  /** The tier you steer people to: dark card, raised. */
  focus?: boolean
  /** Corner badge on the focus tier, ≤ 6 CJK characters. */
  badge?: string
}

export interface PricingTiersProps extends SlideBase {
  /** 3 or 4 tiers, cheapest first. */
  tiers: Tier[]
  /** One line under the cards: the value metric and the rule for upgrading. ≤ 50 CJK characters. */
  footnote?: string
}

/** Good / better / best packaging. The recommended tier is a dark, raised card. */
export function PricingTiers({ kicker, title, lead, source, hint, tiers, footnote }: PricingTiersProps) {
  return (
    <section className="slide">
      <Hint id="pricing">{hint}</Hint>
      <div className="frame s-price">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="price" style={{ gridTemplateColumns: `repeat(${tiers.length}, minmax(0, 1fr))` }}>
          {tiers.map((t, i) => (
            <Reveal key={t.name} build i={i * 0.7 + 3} className={`price__card${t.focus ? ' is-focus' : ''}`}>
              <div className="price__top">
                <h3>{t.name}</h3>
                {t.focus && t.badge && <span className="price__badge">{t.badge}</span>}
              </div>
              <p className="price__for">{t.for}</p>
              <p className="price__amt">
                {t.price}
                {t.unit && <small>{t.unit}</small>}
              </p>
              <ul>
                {t.features.map((f) => (
                  <li key={f}>
                    <Icon name="check" size={24} tone={t.focus ? 'accent' : 'mute'} />
                    {f}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
        {footnote && (
          <Reveal i={tiers.length * 0.7 + 4} className="mx__foot">
            {footnote}
          </Reveal>
        )}
        <SlideFoot source={source} i={tiers.length * 0.7 + 5} />
      </div>
    </section>
  )
}
