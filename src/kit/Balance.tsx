import { Reveal } from '../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from './shared'

export interface Pan {
  /** ≤ 6 CJK characters. */
  label: string
  /** 1–3 points, each ≤ 14 CJK characters. */
  items: string[]
  /** Relative weight; the heavier pan sinks. Mark it as 示意 unless measured. */
  weight: number
}

export interface BalanceProps extends SlideBase {
  left: Pan
  right: Pan
}

/** A beam balance weighing two sides, e.g. pros and cons: the heavier pan sinks, both pans hang straight down. */
export function Balance({ kicker, title, lead, source, hint, left, right }: BalanceProps) {
  const total = Math.max(1, left.weight + right.weight)
  // Positive tilt = right side down. At most 9° so the pans stay readable.
  const tilt = Math.max(-9, Math.min(9, ((right.weight - left.weight) / total) * 18))
  const pan = (p: Pan, side: 'l' | 'r') => (
    <div className={`balance__pan balance__pan--${side}`}>
      <i className="balance__strings" aria-hidden />
      <div className="balance__dish">
        <b>{p.label}</b>
        <ul>
          {p.items.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </div>
  )
  return (
    <section className="slide">
      <Hint id="balance">{hint}</Hint>
      <div className="frame s-balance">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className="balance" style={vars({ '--tilt': `${tilt}deg` })}>
          <i className="balance__post" aria-hidden />
          <div className="balance__beam">
            {pan(left, 'l')}
            {pan(right, 'r')}
          </div>
        </Reveal>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
