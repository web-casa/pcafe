import { useState } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Icon, type IconName } from '../../Icon'
import { Hint, SlideFoot, SlideHead, type SlideBase } from '../../shared'
import { RetroWin } from './RetroWin'

export interface RetroRow {
  icon: IconName
  /** ≤ 10 CJK characters. */
  title: string
  /** ≤ 26 CJK characters. */
  note: string
}

export interface RetroTab {
  /** ≤ 6 CJK characters. */
  label: string
  /** 3–4 rows. */
  rows: RetroRow[]
}

export interface RetroTabsProps extends SlideBase {
  /** Window title, ≤ 20 characters. */
  file: string
  /** 2–4 tabs; the presenter can click between them. */
  tabs: RetroTab[]
  /** Tab open at first. Default 0. */
  open?: number
}

/** A chunky retro window with clickable folder tabs, each holding 3–4 icon rows. Group related lists (by audience, by phase) on one slide. */
export function RetroTabs({ kicker, title, lead, source, hint, file, tabs, open = 0 }: RetroTabsProps) {
  const [on, setOn] = useState(open)
  return (
    <section className="slide">
      <Hint id="retrotabs">{hint}</Hint>
      <div className="frame frame--split s-rtabs">
        <div className="rtabs__text">
          <SlideHead kicker={kicker} title={title} lead={lead} />
          <SlideFoot source={source} i={8} />
        </div>
        <Reveal i={3} className="rtabs">
          <RetroWin title={file}>
            <div className="rtabs__tabs" role="tablist">
              {tabs.map((t, i) => (
                <button key={t.label} type="button" role="tab" aria-selected={i === on} className={i === on ? 'is-on' : undefined} onClick={() => setOn(i)}>
                  {t.label}
                </button>
              ))}
            </div>
            <ul className="rtabs__rows" role="tabpanel">
              {tabs[on].rows.map((r) => (
                <li key={r.title}>
                  <span className="rtabs__icon" aria-hidden>
                    <Icon name={r.icon} size={34} />
                  </span>
                  <div>
                    <b>{r.title}</b>
                    <span>{r.note}</span>
                  </div>
                </li>
              ))}
            </ul>
          </RetroWin>
        </Reveal>
      </div>
    </section>
  )
}
