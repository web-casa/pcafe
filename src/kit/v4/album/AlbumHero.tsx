import { Reveal } from '../../../deck/primitives'
import { Hint } from '../../shared'
import { Glow, Grad, Print, type AlbumPrint } from './parts'

export interface AlbumHeroProps {
  /** Small pill on top, ≤ 8 字. */
  badge?: string
  /** Handwritten-feel line above the title, ≤ 18 字. */
  hand?: string
  /** 2 lines × ≤ 9 字. */
  title: string[]
  /** A word at the end of the last line set in italic serif with a warm gradient, ≤ 4 字. */
  grad?: string
  /** ≤ 40 字. */
  lead?: string
  /** Button, ≤ 6 字. */
  cta?: string
  /** 5–9 prints fanned in an arc along the foot. */
  prints: AlbumPrint[]
  /** Up to 3 small floating chips, each ≤ 10 字. */
  chips?: string[]
  hint?: string
}

const CHIP_AT = [
  { left: 640, top: 690, rotate: -4 },
  { left: 1160, top: 682, rotate: 3 },
  { left: 1470, top: 790, rotate: 9 },
]

/** A warm, private-feeling opening: a centred promise under a sunrise glow, and a fan of prints dealt out in an arc that lift when you point at them. */
export function AlbumHero({ badge, hand, title, grad, lead, cta, prints, chips = [], hint }: AlbumHeroProps) {
  const list = prints.slice(0, 9)
  const n = list.length
  const step = n > 1 ? Math.min(8.5, 60 / (n - 1)) : 0
  return (
    <section className="slide al">
      <Hint id="albumhero">{hint}</Hint>
      <Glow />
      <div className="al-hero">
        {badge && (
          <Reveal i={0} className="al-badge">
            <i />
            {badge}
          </Reveal>
        )}
        {hand && (
          <Reveal i={0.5} className="al-hand">
            {hand}
          </Reveal>
        )}
        <Reveal i={1}>
          <h1 className="al-h1">
            {title.slice(0, 2).map((l, k) => (
              <span key={k}>{k === Math.min(title.length, 2) - 1 ? <Grad line={l} word={grad} /> : l}</span>
            ))}
          </h1>
        </Reveal>
        {lead && (
          <Reveal i={2}>
            <p className="al-lead">{lead}</p>
          </Reveal>
        )}
        {cta && (
          <Reveal i={3}>
            <span className="al-btn">{cta}</span>
          </Reveal>
        )}
      </div>
      <div className="al-fan" data-crop aria-hidden="true">
        {list.map((p, k) => {
          const a = (k - (n - 1) / 2) * step
          return (
            <div className="al-fan__arm" key={k} style={{ ['--a' as string]: `${a}deg`, animationDelay: `${0.5 + k * 0.07}s` }}>
              <Print print={p} hideAlt />
            </div>
          )
        })}
      </div>
      {chips.slice(0, 3).map((c, k) => (
        <span
          className="al-chip"
          key={c}
          style={{
            left: `calc(${CHIP_AT[k].left} * var(--u))`,
            top: `calc(${CHIP_AT[k].top} * var(--u))`,
            rotate: `${CHIP_AT[k].rotate}deg`,
            animationDelay: `${1.3 + k * 0.15}s, ${k * 0.8}s`,
          }}
        >
          {c}
        </span>
      ))}
    </section>
  )
}
