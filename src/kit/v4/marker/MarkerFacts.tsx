import { useEffect, useRef, useState } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint } from '../../shared'
import { Brackets, Corners, Mark, type MarkerCorners } from './parts'

export interface MarkerFact {
  /** Whole number to count up to. */
  value: number
  /** Suffix after the number, ≤ 3 个字符. */
  unit?: string
  /** ≤ 10 字. */
  label: string
}

export interface MarkerFactsProps {
  /** A sentence over the numbers; ==…== to mark. ≤ 2 lines × 18 字. */
  say: string
  /** 3–4 figures that count up when the slide opens. */
  facts: MarkerFact[]
  /** Mono note under the boxes, ≤ 24 字. */
  note?: string
  corners?: MarkerCorners
  hint?: string
}

function Count({ to, delay }: { to: number; delay: number }) {
  const [v, setV] = useState(0)
  const raf = useRef(0)
  useEffect(() => {
    const start = performance.now() + delay * 1000
    const dur = 1400
    const step = (now: number) => {
      const p = Math.min(1, Math.max(0, (now - start) / dur))
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf.current)
  }, [to, delay])
  return <>{v.toLocaleString('en-US')}</>
}

/** A marked sentence over three or four bracketed figures that count up. */
export function MarkerFacts({ say, facts, note, corners, hint }: MarkerFactsProps) {
  const list = facts.slice(0, 4)
  return (
    <section className="slide mr">
      <Hint id="markerfacts">{hint}</Hint>
      <div className="mr-col mr-wide mr-facts">
        <Reveal i={0}>
          <p className="mr-say is-mid">
            <Mark text={say} from={0.6} />
          </p>
        </Reveal>
        <div className="mr-facts__row" style={{ gridTemplateColumns: `repeat(${list.length}, 1fr)` }}>
          {list.map((f, k) => (
            <Reveal i={2 + k * 0.4} y={20} key={f.label}>
              <Brackets className="mr-fact">
                <b>
                  <Count to={f.value} delay={0.6 + k * 0.15} />
                  {f.unit && <small>{f.unit}</small>}
                </b>
                <span>{f.label}</span>
              </Brackets>
            </Reveal>
          ))}
        </div>
        {note && (
          <Reveal i={4} className="mr-k is-foot">
            {note}
          </Reveal>
        )}
      </div>
      {corners && <Corners {...corners} />}
    </section>
  )
}
