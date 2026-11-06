import { Reveal } from '../../../deck/primitives'
import { Icon } from '../../Icon'
import type { IconName } from '../../icon-set'
import { Hint, SlideFoot, SlideHead, type SlideBase } from '../../shared'

export interface TabPanel {
  /** Tab label, ≤ 6 字. */
  tab: string
  icon?: IconName
  /** Panel heading, ≤ 20 字. */
  title: string
  /** ≤ 80 字. */
  body: string
  /** 0–3 points, each ≤ 22 字. */
  points?: string[]
  /** One figure on the right, value ≤ 8 个字符, label ≤ 12 字. */
  stat?: { value: string; label: string }
}

export interface TabPanelsProps extends SlideBase {
  /** 3–5 tabs. With build: 'focus' each → selects the next tab. */
  tabs: TabPanel[]
  /** Tab shown when fully built (no build, overview, print). Default 0. */
  open?: number
}

/** A tab bar with a sliding underline; each build step selects the next tab and swaps the panel below. */
export function TabPanels({ kicker, title, lead, tabs, open = 0, source, hint }: TabPanelsProps) {
  return (
    <section className="slide">
      <Hint id="tabpanels">{hint}</Hint>
      <div className="frame d1-frame">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className="d1tab" style={{ ['--n' as string]: tabs.length }}>
          <div className="d1tab__bar" role="tablist">
            {tabs.map((t, i) => (
              <div key={i} role="tab" className={`d1tab__tab${i === open ? ' is-open' : ''}`} data-build={`t${i}`}>
                {t.icon && <Icon name={t.icon} size={30} />}
                <span>{t.tab}</span>
              </div>
            ))}
          </div>
          <div className="d1tab__stack">
            {tabs.map((t, i) => (
              <div key={i} role="tabpanel" className={`d1tab__panel${i === open ? ' is-open' : ''}`} data-build={`t${i}`}>
                <div className="d1tab__copy">
                  <span className="d1tab__no">
                    {String(i + 1).padStart(2, '0')} / {String(tabs.length).padStart(2, '0')}
                  </span>
                  <h3>{t.title}</h3>
                  <p>{t.body}</p>
                  {t.points?.length ? (
                    <ul>
                      {t.points.map((p, k) => (
                        <li key={k}>{p}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                {t.stat ? (
                  <div className="d1tab__stat">
                    <b>{t.stat.value}</b>
                    <span>{t.stat.label}</span>
                  </div>
                ) : (
                  <span className="d1tab__big" aria-hidden>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                )}
              </div>
            ))}
          </div>
        </Reveal>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
