import { Reveal } from '../deck/primitives'
import { Icon, type IconName } from './Icon'
import { Hint, SlideFoot, SlideHead, type SlideBase } from './shared'

export interface SpecRow {
  /** ≤ 12 characters. */
  name: string
  /** Old version; omit for something new. ≤ 10 characters. */
  from?: string
  /** New version, ≤ 10 characters. */
  to: string
  /** A major-version jump: the new value turns accent. */
  major?: boolean
}

export interface SpecGroup {
  /** ≤ 8 CJK characters. */
  label: string
  icon?: IconName
  /** 3–6 rows. Groups should be within 1 row of each other. */
  rows: SpecRow[]
}

export interface SpecSheetProps extends SlideBase {
  /** 2–3 groups shown as columns. */
  groups: SpecGroup[]
  /** Column headings for the two versions, e.g. ['Lumen 12', 'Lumen 13']. */
  columns: [string, string]
}

/** Version upgrades grouped by area: old → new, with major jumps highlighted. */
export function SpecSheet({ kicker, title, lead, source, hint, groups, columns }: SpecSheetProps) {
  return (
    <section className="slide">
      <Hint id="spec">{hint}</Hint>
      <div className="frame s-spec">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="spec" style={{ gridTemplateColumns: `repeat(${groups.length}, minmax(0, 1fr))` }}>
          {groups.map((g, c) => (
            <Reveal key={g.label} build i={c * 0.8 + 3} className="spec__group">
              <h3>
                {g.icon && <Icon name={g.icon} size={30} />}
                {g.label}
              </h3>
              <div className="spec__th">
                <span />
                <span>{columns[0]}</span>
                <span>{columns[1]}</span>
              </div>
              {g.rows.map((r) => (
                <div key={r.name} className={`spec__row${r.major ? ' is-major' : ''}`}>
                  <span>{r.name}</span>
                  <span className="spec__from">{r.from ?? '—'}</span>
                  <span className="spec__to">{r.to}</span>
                </div>
              ))}
            </Reveal>
          ))}
        </div>
        <Reveal i={groups.length * 0.8 + 3} className="spec__key">
          <i /> 大版本升级
        </Reveal>
        <SlideFoot source={source} i={9} />
      </div>
    </section>
  )
}
