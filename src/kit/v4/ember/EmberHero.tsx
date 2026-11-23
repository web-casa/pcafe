import { useState, type CSSProperties } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint } from '../../shared'
import type { PhotoImage } from '../../v2/p1/img'
import { EmberAsk, type EmberAskProps } from './parts'

export interface EmberHeroProps {
  /** Accent tag and the news after it, e.g. ["新", "4.1 版支持多代理协作"]; tag ≤ 2 字, news ≤ 18 字. */
  badge?: [string, string]
  /** 2 lines × ≤ 9 字, set large in serif. */
  title: string[]
  /** Full-bleed dark picture behind everything, lit from one side. */
  image: PhotoImage
  ask: EmberAskProps
  hint?: string
}

/** A dark AI-product opening: a full-bleed lit silhouette that drifts with the pointer, a big serif headline and a prompt box that types example requests. */
export function EmberHero({ badge, title, image, ask, hint }: EmberHeroProps) {
  const [p, setP] = useState({ x: 0, y: 0 })
  return (
    <section
      className="slide eb"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        setP({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 })
      }}
      onPointerLeave={() => setP({ x: 0, y: 0 })}
      style={{ '--px': p.x.toFixed(3), '--py': p.y.toFixed(3) } as CSSProperties}
    >
      <Hint id="emberhero">{hint}</Hint>
      <div className="eb-bg" aria-hidden="true" data-crop>
        <img src={image.src} alt="" draggable={false} style={{ objectPosition: image.focus ?? 'center' }} />
      </div>
      <div className="eb-veil" aria-hidden="true" />
      <div className="eb-hero">
        {badge && (
          <Reveal i={0}>
            <span className="eb-badge">
              <b>{badge[0]}</b>
              {badge[1]} →
            </span>
          </Reveal>
        )}
        <Reveal i={0.6}>
          <h1 className="eb-h1">
            {title.slice(0, 2).map((l, i) => (
              <span key={i}>{l}</span>
            ))}
          </h1>
        </Reveal>
        <Reveal i={1.3}>
          <EmberAsk {...ask} />
        </Reveal>
      </div>
    </section>
  )
}
