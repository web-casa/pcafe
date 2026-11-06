import { useRef } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from '../../shared'
import { useStepCount } from '../../v2/p4/util'

export interface DialStop {
  value: number
  /** ≤ 8 CJK characters. */
  label: string
  /** ≤ 36 CJK characters. */
  note: string
}

export interface EffortDialProps extends SlideBase {
  /** Parameter name under the dial, ≤ 20 characters, e.g. 'reasoning_effort'. */
  param: string
  min: number
  max: number
  /** 2–4 stops; each is a build step and swings the needle there. */
  stops: DialStop[]
}

/** A half-circle dial for a tunable model setting; each step swings the needle to the next stop and highlights its note. */
export function EffortDial({ kicker, title, lead, source, hint, param, min, max, stops }: EffortDialProps) {
  const ref = useRef<HTMLDivElement>(null)
  const k = Math.max(0, Math.min(stops.length, useStepCount(ref)) - 1)
  const t = (v: number) => (v - min) / (max - min || 1)
  const cur = stops[k]
  return (
    <section className="slide">
      <Hint id="dial">{hint}</Hint>
      <div className="frame s-chart" ref={ref}>
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className="dial">
          <figure className="dial__fig" style={vars({ '--t': t(cur.value) })}>
            <svg viewBox="0 0 400 220" aria-hidden>
              <path className="dial__arc" d="M30 200 A170 170 0 0 1 370 200" pathLength={1} />
              <path className="dial__fill" d="M30 200 A170 170 0 0 1 370 200" pathLength={1} />
              {stops.map((s) => {
                const a = Math.PI * (1 - t(s.value))
                return <circle key={s.value} className="dial__dot" cx={200 + 170 * Math.cos(a)} cy={200 - 170 * Math.sin(a)} r={7} />
              })}
            </svg>
            <span className="dial__needle" aria-hidden />
            <p className="dial__value">
              <b>{cur.value}</b>
              <span>{param}</span>
            </p>
            <p className="dial__ends" aria-hidden>
              <span>{min}</span>
              <span>{max}</span>
            </p>
          </figure>
          <ol className="dial__stops">
            {stops.map((s, i) => (
              <li key={s.value} className={i === k ? 'is-on' : undefined} data-build={`dial-${i}`} data-step="">
                <b>
                  <span>{s.value}</span>
                  {s.label}
                </b>
                <p>{s.note}</p>
              </li>
            ))}
          </ol>
        </Reveal>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
