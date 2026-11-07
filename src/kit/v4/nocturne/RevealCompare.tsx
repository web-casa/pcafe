import { useRef, useState, type PointerEvent } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint, Lines, SlideFoot, type Text } from '../../shared'
import { type PhotoImage } from '../../v2/p1/img'

export interface RevealCompareProps {
  kicker: string
  /** ≤ 2 lines × 8 字. */
  title: Text
  /** ≤ 40 字. */
  lead?: string
  /** 2–4 spec rows: label ≤ 8 字, value ≤ 12 个字符. */
  specs?: { label: string; value: string }[]
  /** Same framing, portrait. Drag the handle to compare. */
  before: PhotoImage
  after: PhotoImage
  /** Corner labels, each ≤ 8 个字符. */
  labels?: [string, string]
  source?: string
  hint?: string
}

/** Before and after in one frame: drag the divider across a portrait; the specs that matter sit at the left. Made for `nocturne`, works in any style. */
export function RevealCompare({ kicker, title, lead, specs = [], before, after, labels, source, hint }: RevealCompareProps) {
  const [x, setX] = useState(50)
  const box = useRef<HTMLDivElement>(null)
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (e.buttons !== 1 && e.type !== 'pointerdown') return
    const r = box.current!.getBoundingClientRect()
    setX(Math.max(4, Math.min(96, ((e.clientX - r.left) / r.width) * 100)))
  }
  return (
    <section className="slide">
      <Hint id="revealcompare">{hint}</Hint>
      <div className="nc-glow" aria-hidden="true" />
      <div className="frame nc-cmp" style={{ ['--x' as string]: `${x}%` }}>
        <div className="nc-cmp__l">
          <Reveal i={0} className="nc-pill is-left">
            {kicker}
          </Reveal>
          <Reveal i={1}>
            <h2 className="nc-title">
              <Lines text={title} />
            </h2>
          </Reveal>
          {lead && (
            <Reveal i={2}>
              <p className="nc-lead">{lead}</p>
            </Reveal>
          )}
          {labels && (
            <Reveal i={3} className="nc-track" aria-hidden="true">
              <span>{labels[0]}</span>
              <i>
                <em />
              </i>
              <span>{labels[1]}</span>
              <b>{Math.round(100 - x)}%</b>
            </Reveal>
          )}
          <div className="nc-specs">
            {specs.map((s, i) => (
              <Reveal key={s.label} i={4 + i} className="nc-spec">
                <b>{s.value}</b>
                <span>{s.label}</span>
              </Reveal>
            ))}
          </div>
          <SlideFoot source={source} />
        </div>
        <div
          ref={box}
          className="nc-slider"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId)
            move(e)
          }}
          onPointerMove={move}
          role="slider"
          aria-label="前后对比"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(x)}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') setX((v) => Math.max(4, v - 5))
            if (e.key === 'ArrowRight') setX((v) => Math.min(96, v + 5))
          }}
        >
          <img src={after.src} alt={after.alt} draggable={false} />
          <div className="nc-slider__before">
            <img src={before.src} alt={before.alt} draggable={false} />
          </div>
          {labels && (
            <>
              <span className="nc-chip is-tl">{labels[0]}</span>
              <span className="nc-chip is-tr">{labels[1]}</span>
            </>
          )}
          <i className="nc-slider__bar" aria-hidden="true">
            <span>⇆</span>
          </i>
        </div>
      </div>
    </section>
  )
}
