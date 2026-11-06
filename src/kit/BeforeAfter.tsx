import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { useReducedMotion } from 'motion/react'
import { Reveal } from '../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from './shared'

export interface BeforeAfterSide {
  /** Corner label, ≤ 10 CJK characters. */
  label: string
  /** Imported image. Both sides must be the same size and framing. */
  src: string
}

export interface BeforeAfterProps extends SlideBase {
  /** Left of the divider. */
  before: BeforeAfterSide
  /** Right of the divider. */
  after: BeforeAfterSide
  /** What the two images show, for screen readers. */
  alt: string
  /** Image width ÷ height. Default 16 / 9. */
  ratio?: number
  /** Where the divider settles, 0–100. Default 50. */
  start?: number
  /** Right-hand reading: 2–3 lines, key ≤ 8, text ≤ 30 CJK characters. */
  notes?: { key: string; text: string }[]
}

const clamp = (n: number) => Math.max(2, Math.min(98, n))

/** Two images of the same view, compared with a draggable divider. ← → move it when the handle has focus. */
export function BeforeAfter({ kicker, title, lead, source, hint = '拖动中线对比，聚焦后可用 ← → 微调', before, after, alt, ratio = 16 / 9, start = 50, notes }: BeforeAfterProps) {
  const reduce = useReducedMotion()
  const [pos, setPos] = useState(reduce ? start : 88)
  const view = useRef<HTMLDivElement>(null)

  // Entrance: the divider sweeps in from the right so the comparison reads as one.
  useEffect(() => {
    if (reduce) return
    let raf = 0
    const t0 = performance.now() + 450
    const tick = (now: number) => {
      const t = Math.max(0, Math.min(1, (now - t0) / 900))
      const e = 1 - Math.pow(1 - t, 3)
      setPos(88 + (start - 88) * e)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [start, reduce])

  const fromPointer = (e: PointerEvent) => {
    const r = view.current!.getBoundingClientRect()
    setPos(clamp(((e.clientX - r.left) / r.width) * 100))
  }
  const onKey = (e: KeyboardEvent) => {
    const d = e.key === 'ArrowLeft' ? -4 : e.key === 'ArrowRight' ? 4 : 0
    if (!d) return
    e.preventDefault()
    e.stopPropagation()
    setPos((p) => clamp(p + d))
  }

  return (
    <section className="slide">
      <Hint id="before-after">{hint}</Hint>
      <div className="frame s-ba">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className={`ba__body${notes ? ' has-notes' : ''}`}>
          <Reveal i={3} className="ba" y={16} style={vars({ '--ar': ratio })}>
            <div
              ref={view}
              className="ba__view"
              role="img"
              aria-label={alt}
              style={vars({ '--pos': `${pos}%` })}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId)
                fromPointer(e)
              }}
              onPointerMove={(e) => e.buttons && fromPointer(e)}
            >
              <img src={after.src} alt="" draggable={false} />
              <img className="ba__before" src={before.src} alt="" draggable={false} />
              <span className="ba__tag is-before">{before.label}</span>
              <span className="ba__tag is-after">{after.label}</span>
              <span className="ba__divider" aria-hidden />
              <button
                type="button"
                className="ba__handle"
                role="slider"
                aria-label="对比分隔线"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(pos)}
                onKeyDown={onKey}
              >
                <svg viewBox="0 0 24 24" aria-hidden>
                  <path d="M9 6l-5 6 5 6M15 6l5 6-5 6" />
                </svg>
              </button>
            </div>
          </Reveal>
          {notes && (
            <dl className="ba__notes">
              {notes.map((n, i) => (
                <Reveal key={n.key} build i={i + 6}>
                  <dt>{n.key}</dt>
                  <dd>{n.text}</dd>
                </Reveal>
              ))}
            </dl>
          )}
        </div>
        <SlideFoot source={source} i={9} />
      </div>
    </section>
  )
}
