import { Reveal } from '../deck/primitives'
import type { IconName } from './Icon'
import { IconTile, type Spot } from './parts'
import { Toggle, Window } from './shapes'
import { Hint, SlideFoot, SlideHead, type SlideBase } from './shared'

export interface ToggleRow {
  icon: IconName
  /** ≤ 10 CJK characters. */
  label: string
  /** ≤ 24 CJK characters. */
  note: string
  on: boolean
  spot?: Spot
}

export interface ToggleCardProps extends SlideBase {
  /** Window title, ≤ 16 characters. */
  file: string
  /** 3–5 settings. */
  rows: ToggleRow[]
}

/** Options as a settings window with switches the presenter can flip live: defaults, feature flags, what is on and off. */
export function ToggleCard({ kicker, title, lead, source, hint, file, rows }: ToggleCardProps) {
  return (
    <section className="slide">
      <Hint id="togglecard">{hint}</Hint>
      <div className="frame frame--split s-toggles">
        <div>
          <SlideHead kicker={kicker} title={title} lead={lead} />
          <SlideFoot source={source} i={8} />
        </div>
        <Reveal i={3} className="toggles">
          <Window title={file}>
            <ul>
              {rows.map((r, i) => (
                <li key={r.label}>
                  <IconTile icon={r.icon} spot={r.spot ?? (((i % 5) + 1) as Spot)} size={60} />
                  <div>
                    <b>{r.label}</b>
                    <span>{r.note}</span>
                  </div>
                  <Toggle on={r.on} label={r.label} />
                </li>
              ))}
            </ul>
          </Window>
        </Reveal>
      </div>
    </section>
  )
}
