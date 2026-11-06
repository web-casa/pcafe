import { Reveal } from '../../../deck/primitives'
import { fmt } from '../../chart-util'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from '../../shared'

export interface PopGroup {
  /** ≤ 8 CJK characters. */
  name: string
  count: number
}

export interface PopGridProps extends SlideBase {
  /** 2–8 groups; counts sum to 20–500. With build, each group's dots and legend row arrive together. */
  groups: PopGroup[]
  /** Label under the total, ≤ 10 CJK characters. */
  totalLabel: string
  /** Unit after each count, ≤ 2 characters. */
  unit?: string
}

/** One glowing dot per site, coloured by group, with a legend and the total. Reads as "this many, spread like this". */
export function PopGrid({ kicker, title, lead, source, hint, groups, totalLabel, unit = '' }: PopGridProps) {
  const total = groups.reduce((s, g) => s + g.count, 0)
  // One hue, stepped from full accent to a faint tint: groups stay readable as contiguous blocks.
  const color = (gi: number) => `color-mix(in srgb, var(--accent) ${Math.round(100 - (gi * 68) / Math.max(1, groups.length - 1))}%, var(--canvas))`
  const cols = Math.max(10, Math.ceil(Math.sqrt(total * 2.4)))
  return (
    <section className="slide">
      <Hint id="popgrid">{hint}</Hint>
      <div className="frame s-chart">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="v33-pop">
          <Reveal i={3} className="v33-pop__grid" style={vars({ '--cols': cols })}>
            {groups.flatMap((g, gi) =>
              Array.from({ length: g.count }, (_, k) => <i key={`${gi}-${k}`} data-build={`g-${gi}`} aria-hidden style={vars({ '--c': color(gi), '--k': (k % 17) / 17 })} />),
            )}
          </Reveal>
          <div className="v33-pop__side">
            <Reveal i={4} className="v33-pop__total">
              <b>{fmt(total, 0)}</b>
              <span>{totalLabel}</span>
            </Reveal>
            <ul>
              {groups.map((g, gi) => (
                <li key={g.name} data-build={`g-${gi}`} style={vars({ '--c': color(gi) })}>
                  <i aria-hidden />
                  <span>{g.name}</span>
                  <em>
                    {g.count}
                    {unit}
                  </em>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
