import { useEffect, useRef, useState } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint, SlideHead, SlideFoot, vars, type SlideBase } from '../../shared'
import type { PhotoImage } from './img'

export interface CompareSide {
  image: PhotoImage
  /** Corner label, ≤ 8 字. */
  label: string
}

export interface CompareStop {
  /** Divider position after this step, 0–100 (% of width showing `before`). */
  at: number
  /** What to look at in this step, ≤ 24 字. */
  note: string
}

export interface CompareSliderProps extends SlideBase {
  /** Two images of the same size and framing. */
  before: CompareSide
  after: CompareSide
  /** Where the divider sits before any step. Default 50. */
  start?: number
  /** 1–3 steps; each → moves the divider and highlights its note. Without build the last position shows. */
  stops: CompareStop[]
}

/** Before/after image comparison. The divider slides to a new position on every build step. */
export function CompareSlider({ kicker, title, lead, before, after, start = 50, stops, source, hint }: CompareSliderProps) {
  const ref = useRef<HTMLElement>(null)
  const last = stops.length ? stops[stops.length - 1].at : start
  const [at, setAt] = useState(last)
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const read = () => {
      const notes = [...root.querySelectorAll<HTMLElement>('.v21-cmp__note')]
      if (notes.every((n) => !n.dataset.buildState)) return setAt(last)
      const k = notes.filter((n) => n.dataset.buildState !== 'pending').length - 1
      setAt(k < 0 ? start : stops[k].at)
    }
    read()
    const mo = new MutationObserver(read)
    mo.observe(root, { subtree: true, attributes: true, attributeFilter: ['data-build-state'] })
    return () => mo.disconnect()
  }, [stops, start, last])
  return (
    <section className="slide" ref={ref}>
      <Hint id="compareslider">{hint}</Hint>
      <div className="frame v21-cmp">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} y={30} className="v21-cmp__view">
          <div className="v21-cmp__pane" data-crop style={vars({ '--at': `${at}%` })}>
            <img className="v21-cmp__after" src={after.image.src} alt={after.image.alt} draggable={false} />
            <div className="v21-cmp__before" data-crop>
              <img src={before.image.src} alt={before.image.alt} draggable={false} />
            </div>
            <i className="v21-cmp__bar" aria-hidden>
              <b />
            </i>
            <span className="v21-cmp__tag v21-cmp__tag--l">{before.label}</span>
            <span className="v21-cmp__tag v21-cmp__tag--r">{after.label}</span>
          </div>
        </Reveal>
        <ol className="v21-cmp__notes" style={{ gridTemplateColumns: `repeat(${stops.length}, 1fr)` }}>
          {stops.map((s, i) => (
            <Reveal key={i} i={4 + i} build className="v21-cmp__note">
              <li>
                <b>{String(i + 1).padStart(2, '0')}</b>
                {s.note}
              </li>
            </Reveal>
          ))}
        </ol>
        <SlideFoot source={[before.image.credit, source].filter(Boolean).join(' · ') || undefined} />
      </div>
    </section>
  )
}
