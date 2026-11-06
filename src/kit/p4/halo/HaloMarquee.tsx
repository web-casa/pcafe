import { Kicker, Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot } from '../../shared'

export interface HaloWork {
  /** Imported real screenshot (or decor- illustration). */
  src: string
  alt: string
  /** ≤ 16 CJK characters. */
  title: string
  /** 1–3 tags, each ≤ 8 characters. */
  tags: string[]
}

export interface HaloMarqueeProps {
  kicker: string
  /** The scrolling band phrase, ≤ 6 CJK characters. */
  band: string
  /** Exactly 2 works. */
  items: HaloWork[]
  source?: string
  hint?: string
}

/** An oversized phrase scrolls across the top as a marquee; below, two large image cards with a title and grey tag chips. */
export function HaloMarquee({ kicker, band, items, source, hint }: HaloMarqueeProps) {
  const run = Array.from({ length: 6 }, () => band)
  return (
    <section className="slide">
      <Hint id="halomarquee">{hint}</Hint>
      <div className="frame s-hmarq">
        <Reveal i={0}>
          <Kicker>{kicker}</Kicker>
        </Reveal>
        <Reveal i={1} className="hmarq__band" y={0}>
          <div className="hmarq__track" data-crop aria-hidden>
            <div className="hmarq__run">
              {[...run, ...run].map((t, i) => (
                <span key={i}>
                  {t}
                  <i>—</i>
                </span>
              ))}
            </div>
          </div>
        </Reveal>
        <div className="hmarq__grid">
          {items.slice(0, 2).map((w, i) => (
            <Reveal key={w.title} i={2 + i} build className="hwork">
              <div className="hwork__img" data-crop>
                <img src={w.src} alt={w.alt} />
              </div>
              <h3>{w.title}</h3>
              <div className="hwork__tags">
                {w.tags.slice(0, 3).map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
        <SlideFoot source={source} i={6} />
      </div>
    </section>
  )
}
