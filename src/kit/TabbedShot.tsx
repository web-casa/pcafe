import { useState } from 'react'
import { Kicker, Reveal } from '../deck/primitives'
import { Icon, type IconName } from './Icon'
import { Hint, Lines, SlideFoot, type SlideBase } from './shared'

export interface ShotTab {
  /** ≤ 6 CJK characters. */
  label: string
  icon?: IconName
  /** A real screenshot for this tab. */
  src: string
  alt: string
}

export interface TabbedShotProps extends SlideBase {
  /** 2–4 tabs. Click a tab to switch; the slide opens on the first. */
  tabs: ShotTab[]
}

/** A centred head, a segmented control and one large screenshot per segment. */
export function TabbedShot({ kicker, title, lead, source, hint = '点击分段切换截图', tabs }: TabbedShotProps) {
  const [on, setOn] = useState(0)
  return (
    <section className="slide">
      <Hint id="tabshot">{hint}</Hint>
      <div className="frame s-tabshot">
        <div className="tabshot__head">
          <Reveal i={0}>
            <Kicker>{kicker}</Kicker>
          </Reveal>
          <Reveal i={1}>
            <h2 className="s-title">
              <Lines text={title} />
            </h2>
          </Reveal>
          {lead && (
            <Reveal i={2} className="s-lead">
              {lead}
            </Reveal>
          )}
        </div>
        <Reveal i={3} className="tabshot__tabs">
          <div role="tablist">
            {tabs.map((t, i) => (
              <button key={t.label} type="button" role="tab" tabIndex={-1} aria-selected={on === i} className={on === i ? 'is-on' : undefined} onClick={() => setOn(i)}>
                {t.label}
                {t.icon && <Icon name={t.icon} size={22} />}
              </button>
            ))}
          </div>
        </Reveal>
        <Reveal i={4} y={24} className="tabshot__view">
          {/* The shot is cropped at the bottom on purpose; data-crop tells QA. */}
          <div className="tabshot__crop" data-crop>
            {tabs.map((t, i) => (
              <img key={t.label} src={t.src} alt={t.alt} draggable={false} className={on === i ? 'is-on' : undefined} />
            ))}
          </div>
        </Reveal>
        <SlideFoot source={source} i={9} />
      </div>
    </section>
  )
}
