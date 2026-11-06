import { Reveal } from '../deck/primitives'
import { useCount } from './chart-util'
import { Hint, SlideFoot, SlideHead, type SlideBase } from './shared'

export interface CountSide {
  /** ≤ 8 CJK characters, e.g. '上一期'. */
  label: string
  value: number
  decimals?: number
  /** ≤ 4 characters. */
  unit?: string
  /** One muted line, ≤ 20 CJK characters. */
  note?: string
}

export interface CountCompareProps extends SlideBase {
  before: CountSide
  after: CountSide
  /** The change between them, e.g. '+76%' or '少 3 步', ≤ 8 characters. */
  change: string
}

function Side({ side, now, delay }: { side: CountSide; now?: boolean; delay: number }) {
  const v = useCount(side.value, { decimals: side.decimals, delay })
  return (
    <div className={`count__side${now ? ' is-now' : ''}`}>
      <span className="count__label">{side.label}</span>
      <b className="count__value">
        {v}
        {side.unit && <small>{side.unit}</small>}
      </b>
      {side.note && <span className="count__note">{side.note}</span>}
    </div>
  )
}

/** Two numbers side by side that count up on entry, with the change between them. */
export function CountCompare({ kicker, title, lead, source, hint, before, after, change }: CountCompareProps) {
  return (
    <section className="slide">
      <Hint id="count">{hint}</Hint>
      <div className="frame s-chart">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className="count">
          <Side side={before} delay={500} />
          <div className="count__change">
            <span className="arrow">→</span>
            <b>{change}</b>
          </div>
          <Side side={after} now delay={900} />
        </Reveal>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
