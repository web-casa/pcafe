import { Reveal } from '../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from './shared'

export interface WaterfallStep {
  /** ≤ 6 CJK characters. */
  label: string
  /** Signed change: positive adds, negative subtracts. */
  value: number
}

export interface WaterfallProps extends SlideBase {
  /** Opening total. */
  start: { label: string; value: number }
  /** 3–6 changes in the order they apply. */
  steps: WaterfallStep[]
  /** Label of the computed closing total. */
  end: string
  /** Unit after numbers, e.g. '万元'. */
  unit?: string
  /** Decimal places for labels. Default 0. */
  digits?: number
  /** Right-hand reading: 2–3 lines, key ≤ 8, text ≤ 30 CJK characters. */
  notes?: { key: string; text: string }[]
}

/** A bridge chart: an opening total, the changes that move it, the closing total. */
export function Waterfall({ kicker, title, lead, source, hint, start, steps, end, unit = '', digits = 0, notes }: WaterfallProps) {
  const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })
  let run = start.value
  const bars = [
    { label: start.label, lo: 0, hi: start.value, kind: 'total', text: fmt(start.value) },
    ...steps.map((s) => {
      const from = run
      run += s.value
      return { label: s.label, lo: Math.min(from, run), hi: Math.max(from, run), kind: s.value >= 0 ? 'up' : 'down', text: `${s.value >= 0 ? '+' : '−'}${fmt(Math.abs(s.value))}` }
    }),
    { label: end, lo: 0, hi: run, kind: 'total is-end', text: fmt(run) },
  ]
  const max = Math.max(...bars.map((b) => b.hi)) * 1.08
  return (
    <section className="slide">
      <Hint id="waterfall">{hint}</Hint>
      <div className="frame s-fall">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="fall__body">
          <Reveal i={3} className="fall" y={16}>
            <div className="fall__plot" style={vars({ '--n': bars.length })}>
              {bars.map((b, i) => (
                <div key={b.label} className={`fall__col is-${b.kind}`} data-build>
                  <span className="fall__bar" style={vars({ '--lo': `${(b.lo / max) * 100}%`, '--h': `${((b.hi - b.lo) / max) * 100}%`, animationDelay: `${500 + i * 120}ms` })}>
                    <b>{b.text}</b>
                  </span>
                  {i < bars.length - 1 && <span className="fall__link" style={vars({ '--at': `${((b.kind === 'down' ? b.lo : b.hi) / max) * 100}%` })} aria-hidden />}
                </div>
              ))}
            </div>
            <div className="fall__labels" style={vars({ '--n': bars.length })}>
              {bars.map((b) => (
                <span key={b.label}>{b.label}</span>
              ))}
            </div>
            {unit && <span className="fall__unit">单位 · {unit}</span>}
          </Reveal>
          {notes && (
            <dl className="fall__notes">
              {notes.map((n, i) => (
                <Reveal key={n.key} i={i + 6}>
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
