import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from '../../shared'

export interface ContextMark {
  /** Position on the bar, in the same unit as `total`. */
  value: number
  /** ≤ 8 characters, e.g. '384K'. */
  label: string
  /** ≤ 20 CJK characters. */
  note: string
}

export interface ContextWindowProps extends SlideBase {
  /** Capacity of the window, e.g. 1000 (K tokens). */
  total: number
  /** Big label for the whole bar, ≤ 8 characters, e.g. '1M tokens'. */
  totalLabel: string
  /** Scale ticks, 3–6 values with their labels (≤ 6 characters). */
  ticks: { value: number; label: string }[]
  /** 1–4 spans drawn on the bar from 0, each a build step. */
  spans: ContextMark[]
}

/** One long context-window bar with a scale; spans fill in from the left one step at a time, each with a label and note. */
export function ContextWindow({ kicker, title, lead, source, hint, total, totalLabel, ticks, spans }: ContextWindowProps) {
  return (
    <section className="slide">
      <Hint id="ctx">{hint}</Hint>
      <div className="frame s-chart">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className="ctxw" style={vars({ '--n': spans.length })}>
          <p className="ctxw__total">
            <span>上下文窗口</span>
            <b>{totalLabel}</b>
          </p>
          <div className="ctxw__bar">
            {[...spans]
              .map((s, i) => ({ s, i }))
              .sort((a, b) => b.s.value - a.s.value)
              .map(({ s, i }) => (
                <span key={i} className={`ctxw__span ctxw__span--${i}`} data-build={`ctx-${i}`} style={vars({ '--w': s.value / total })} aria-hidden />
              ))}
          </div>
          <div className="ctxw__scale" aria-hidden>
            {ticks.map((t) => (
              <span key={t.value} style={vars({ '--x': t.value / total })}>
                {t.label}
              </span>
            ))}
          </div>
          <ol className="ctxw__legend">
            {spans.map((s, i) => (
              <li key={i} data-build={`ctx-${i}`}>
                <i className={`ctxw__span--${i}`} aria-hidden />
                <b>{s.label}</b>
                <span>{s.note}</span>
              </li>
            ))}
          </ol>
        </Reveal>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
