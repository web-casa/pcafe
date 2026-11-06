import { Reveal } from '../deck/primitives'
import { Icon, type IconName } from './Icon'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from './shared'

export type RoadStatus = 'done' | 'doing' | 'next'

export interface RoadItem {
  /** Index into `tracks`. */
  track: number
  /** First period (index into `periods`). */
  from: number
  /** Last period, inclusive. Defaults to `from`. */
  to?: number
  /** ≤ 12 CJK characters (≤ 8 when it spans one period). */
  title: string
  status: RoadStatus
}

export interface RoadmapProps extends SlideBase {
  /** 3–5 columns: quarters, halves, releases. ≤ 8 characters each. */
  periods: string[]
  /** 2–4 rows: workstreams. Label ≤ 6 CJK characters. */
  tracks: { label: string; icon?: IconName }[]
  /** 4–12 items. At most two may overlap in the same track and period. */
  items: RoadItem[]
  /** Where "today" falls, in periods from the left edge, e.g. 1.5 = halfway through the second period. */
  now?: number
  /** Legend overrides. */
  labels?: Partial<Record<RoadStatus, string>>
}

const LABELS: Record<RoadStatus, string> = { done: '已完成', doing: '进行中', next: '计划' }

/** A coarse roadmap: workstreams by period, each item marked done, in progress or planned. */
export function Roadmap({ kicker, title, lead, source, hint, periods, tracks, items, now, labels }: RoadmapProps) {
  const names = { ...LABELS, ...labels }
  const n = periods.length
  return (
    <section className="slide">
      <Hint id="roadmap">{hint}</Hint>
      <div className="frame s-road">
        <SlideHead
          kicker={kicker}
          title={title}
          lead={lead}
          aside={
            <ul className="road__legend">
              {(['done', 'doing', 'next'] as const).map((s) => (
                <li key={s} className={`is-${s}`}>
                  {names[s]}
                </li>
              ))}
            </ul>
          }
        />
        <Reveal i={3} className="road" y={16} style={vars({ '--n': n })}>
          <div className="road__head">
            <span />
            {periods.map((p) => (
              <span key={p}>{p}</span>
            ))}
          </div>
          <div className="road__rows">
            {now !== undefined && (
              <span className="road__now" style={vars({ '--at': now / n })}>
                <b>今天</b>
              </span>
            )}
            {tracks.map((t, ti) => (
              <div key={t.label} className="road__track" data-build>
                <span className="road__label">
                  {t.icon && <Icon name={t.icon} size={28} tone="mute" />}
                  {t.label}
                </span>
                <div className="road__lane">
                  {items
                    .filter((it) => it.track === ti)
                    .map((it, k) => (
                      <span
                        key={it.title}
                        className={`road__item is-${it.status}`}
                        style={vars({ gridColumn: `${it.from + 1} / ${(it.to ?? it.from) + 2}`, animationDelay: `${500 + ti * 160 + k * 90}ms` })}
                      >
                        {it.status === 'done' && <Icon name="check" size={22} tone="mute" />}
                        {it.status === 'doing' && <i aria-hidden />}
                        {it.title}
                      </span>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
        <SlideFoot source={source} i={9} />
      </div>
    </section>
  )
}
