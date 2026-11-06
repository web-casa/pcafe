import { useRef } from 'react'
import { Reveal } from '../../../deck/primitives'
import { fmt } from '../../chart-util'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from '../../shared'
import { useStepCount } from './util'

export interface RaceItem {
  /** ≤ 8 CJK characters. */
  name: string
  /** One value per period; null = not yet in the race. */
  values: (number | null)[]
}

export interface RankingRaceProps extends SlideBase {
  /** 3–8 periods (years), ≤ 6 characters each. */
  periods: string[]
  /** 5–12 items; the top `show` of each period are drawn. */
  items: RaceItem[]
  /** Rows on screen, 5–8. Default 6. */
  show?: number
  /** Unit after each value, ≤ 4 characters. */
  unit?: string
  decimals?: number
  /** Item drawn in the accent. */
  focus?: string
  /** One note per period, ≤ 28 CJK characters each; shown under the board. */
  notes?: string[]
}

/** A bar ranking that re-sorts itself each build step: every → moves to the next period. */
export function RankingRace({ kicker, title, lead, source, hint, periods, items, show = 6, unit = '', decimals = 0, focus, notes }: RankingRaceProps) {
  const ref = useRef<HTMLDivElement>(null)
  const k = Math.min(periods.length - 1, useStepCount(ref))
  const at = items.map((it) => ({ it, v: it.values[k] ?? null }))
  const ranked = at.filter((a) => a.v !== null).sort((a, b) => b.v! - a.v!)
  const max = ranked[0]?.v || 1
  const rank = new Map(ranked.map((a, r) => [a.it.name, r]))
  return (
    <section className="slide">
      <Hint id="race">{hint}</Hint>
      <div className="frame s-chart" ref={ref}>
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className="race" style={vars({ '--n': show })}>
          <div className="race__board">
            {items.map((it) => {
              const r = rank.get(it.name)
              const v = it.values[k]
              const on = r !== undefined && r < show
              return (
                <div
                  key={it.name}
                  className={`race__row${it.name === focus ? ' is-focus' : ''}${on ? '' : ' is-out'}`}
                  style={vars({ '--r': on ? r : show, '--w': on && v ? v / max : 0 })}
                >
                  <span className="race__rank">{on ? r + 1 : ''}</span>
                  <span className="race__name">{it.name}</span>
                  <span className="race__track">
                    <i />
                    <b>{v === null || v === undefined ? '' : `${fmt(v, decimals)}${unit}`}</b>
                  </span>
                </div>
              )
            })}
          </div>
          <ol className="race__periods">
            {periods.map((p, i) => (
              <li key={p} className={i === k ? 'is-on' : i < k ? 'is-past' : undefined} data-build={i ? `race-${i}` : undefined} data-step={i ? '' : undefined}>
                {p}
              </li>
            ))}
            <li className="race__year" aria-hidden>
              {periods[k]}
            </li>
          </ol>
          {notes?.[k] && <p className="race__note">{notes[k]}</p>}
        </Reveal>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
