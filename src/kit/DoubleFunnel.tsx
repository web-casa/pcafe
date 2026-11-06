import { Reveal } from '../deck/primitives'
import { fmt } from './chart-util'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from './shared'

export interface FunnelSide {
  /** ≤ 8 CJK characters. */
  name: string
  /** One value per stage, same order as `stages`, non-increasing. */
  values: number[]
}

export interface DoubleFunnelProps extends SlideBase {
  /** 3–5 stage names, each ≤ 8 CJK characters, shared by both sides. */
  stages: string[]
  left: FunnelSide
  right: FunnelSide
  unit?: string
}

/** Two funnels back to back with the stage names down the middle: compare how two groups narrow through the same steps. */
export function DoubleFunnel({ kicker, title, lead, source, hint, stages, left, right, unit }: DoubleFunnelProps) {
  const max = Math.max(...left.values, ...right.values, 1)
  const bar = (v: number, first: number, side: 'l' | 'r', k: number) => (
    <Reveal build={`st${k}`} i={3 + k * 0.4} className={`dfunnel__bar dfunnel__bar--${side}`} style={vars({ '--w': v / max })}>
      <b>{fmt(v)}</b>
      {k > 0 && <span>{Math.round((v / Math.max(1, first)) * 100)}%</span>}
    </Reveal>
  )
  return (
    <section className="slide">
      <Hint id="doublefunnel">{hint}</Hint>
      <div className="frame s-dfunnel">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="dfunnel">
          <b className="dfunnel__name dfunnel__name--l">{left.name}</b>
          <span className="dfunnel__unit">{unit}</span>
          <b className="dfunnel__name dfunnel__name--r">{right.name}</b>
          {stages.map((s, k) => (
            <div key={s} className="dfunnel__row">
              {bar(left.values[k], left.values[0], 'l', k)}
              <Reveal build={`st${k}`} i={3 + k * 0.4} className="dfunnel__stage">
                {s}
              </Reveal>
              {bar(right.values[k], right.values[0], 'r', k)}
            </div>
          ))}
        </div>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
