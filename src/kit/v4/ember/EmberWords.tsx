import { useEffect, useState, type CSSProperties } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot } from '../../shared'
import type { PhotoImage } from '../../v2/p1/img'
import { Dot } from './parts'

export interface EmberQuote {
  /** ≤ 40 字. */
  quote: string
  name: string
  /** e.g. "产品负责人 · 远舟数据", ≤ 16 字. */
  role: string
  avatar?: PhotoImage
  /** Big result, e.g. "26%" or "3×"; the number counts up. ≤ 5 个字符. */
  value: string
  /** ≤ 8 字. */
  label: string
}

export interface EmberWordsProps {
  dot?: string
  /** ≤ 12 字. */
  title: string
  /** Exactly 2 quotes. */
  quotes: EmberQuote[]
  source?: string
  hint?: string
}

function Count({ value }: { value: string }) {
  const m = value.match(/^(\D*)([\d.]+)(.*)$/)
  const target = m ? parseFloat(m[2]) : 0
  const dec = m && m[2].includes('.') ? m[2].split('.')[1].length : 0
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!m) return
    let raf = 0
    const t0 = performance.now() + 700
    const tick = (t: number) => {
      const p = Math.min(1, Math.max(0, (t - t0) / 1400))
      setV(target * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target]) // eslint-disable-line react-hooks/exhaustive-deps
  if (!m) return <>{value}</>
  return (
    <>
      {m[1]}
      {v.toFixed(dec)}
      {m[3] && <span className="eb-unit">{m[3]}</span>}
    </>
  )
}

/** Two testimonials on dark cards under an ember glow; each ends in a big serif result that counts up, and a light follows the pointer across the card. */
export function EmberWords({ dot, title, quotes, source, hint }: EmberWordsProps) {
  return (
    <section className="slide eb">
      <Hint id="emberwords">{hint}</Hint>
      <div className="eb-glow" aria-hidden="true" />
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
      <div className="eb-tqs">
        {quotes.slice(0, 2).map((q, i) => (
          <Reveal key={i} i={1 + i * 0.4}>
            <figure
              className="eb-tq"
              onPointerMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect()
                e.currentTarget.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`)
                e.currentTarget.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`)
              }}
              style={{ '--mx': '80%', '--my': '0%' } as CSSProperties}
            >
              <blockquote>“{q.quote}”</blockquote>
              <figcaption>
                <span className="eb-tq__p">
                  {q.avatar && <img src={q.avatar.src} alt={q.avatar.alt} draggable={false} />}
                  <span>
                    {q.name}
                    <small>{q.role}</small>
                  </span>
                </span>
                <span className="eb-tq__n">
                  <b>
                    <Count value={q.value} />
                  </b>
                  <small>{q.label}</small>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
      <div className="eb-foot">
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
