import { Kicker, Reveal } from '../../../deck/primitives'
import { Icon, type IconName } from '../../Icon'
import { Hint, Lines, SlideFoot, type SlideBase } from '../../shared'

export interface BoardStat {
  /** Mono label, ≤ 14 characters. */
  label: string
  /** ≤ 6 characters. */
  value: string
  /** ≤ 4 characters, e.g. MB, 个. */
  unit?: string
  /** ≤ 20 CJK characters. */
  note: string
}

export interface BentoBoardProps extends SlideBase {
  /** Exactly 3 stat tiles; the last one is filled with the accent. */
  stats: [BoardStat, BoardStat, BoardStat]
  /** Tall text tile: label ≤ 14 characters, text ≤ 70 CJK characters. */
  note: { label: string; text: string }
  /** Wide icon tile: label ≤ 14 characters, 4–6 items, each label ≤ 6 CJK characters. */
  chips: { label: string; items: { icon: IconName; label: string }[] }
}

/** An asymmetric bento of six fixed tiles: a big title tile, three stats, a tall text tile and a wide icon tile. Overview of a product or a project at a glance. */
export function BentoBoard({ kicker, title, lead, source, hint, stats, note, chips }: BentoBoardProps) {
  return (
    <section className="slide">
      <Hint id="bentoboard">{hint}</Hint>
      <div className="frame bb">
        <Reveal i={0} className="bb__tile bb__head">
          <Kicker>{kicker}</Kicker>
          <h2 className="s-title">
            <Lines text={title} />
          </h2>
          {lead && <p className="s-lead">{lead}</p>}
          <SlideFoot source={source} i={8} />
        </Reveal>
        {stats.map((s, i) => (
          <Reveal key={s.label} build i={2 + i} className={`bb__tile bb__stat bb__stat--${i}`}>
            <span className="bb__label">{s.label}</span>
            <b className="bb__value">
              {s.value}
              {s.unit && <small>{s.unit}</small>}
            </b>
            <span className="bb__note">{s.note}</span>
          </Reveal>
        ))}
        <Reveal build i={5} className="bb__tile bb__text">
          <span className="bb__label">{note.label}</span>
          <p>{note.text}</p>
        </Reveal>
        <Reveal build i={6} className="bb__tile bb__chips">
          <span className="bb__label">{chips.label}</span>
          <ul>
            {chips.items.map((c) => (
              <li key={c.label}>
                <Icon name={c.icon} size={34} />
                <span>{c.label}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
