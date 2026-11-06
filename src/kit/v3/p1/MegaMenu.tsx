import { Reveal } from '../../../deck/primitives'
import { Icon } from '../../Icon'
import type { IconName } from '../../icon-set'
import { Hint, SlideFoot, SlideHead, type SlideBase } from '../../shared'

export interface MegaColumn {
  /** ≤ 8 字. */
  heading: string
  icon?: IconName
  /** 2–5 entries: name ≤ 14 个字符, desc ≤ 16 字. */
  items: { name: string; desc?: string }[]
}

export interface MegaMenuProps extends SlideBase {
  /** Wordmark text at the left of the bar, ≤ 10 个字符 (text only, no logo). */
  brand: string
  /** 3–6 menu items, each ≤ 6 字. */
  menu: string[]
  /** Which menu item is open. Default 0. */
  active?: number
  /** 2–4 columns in the open panel; each is one build step. */
  columns: MegaColumn[]
}

/** A website navigation bar with one dropdown open: columns of grouped entries, as an overview of a family of things. */
export function MegaMenu({ kicker, title, lead, brand, menu, active = 0, columns, source, hint }: MegaMenuProps) {
  return (
    <section className="slide">
      <Hint id="megamenu">{hint}</Hint>
      <div className="frame d1-frame">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className="d1mega">
          <div className="d1mega__bar">
            <b className="d1mega__brand">{brand}</b>
            <div className="d1mega__menu">
              {menu.map((m, i) => (
                <span key={i} className={i === active ? 'is-on' : ''}>
                  {m}
                  <i aria-hidden>{i === active ? '⌃' : '⌄'}</i>
                </span>
              ))}
            </div>
          </div>
          <div className="d1mega__panel" style={{ ['--n' as string]: columns.length }}>
            {columns.map((c, i) => (
              <div key={i} className="d1mega__col" data-build="">
                <h3>
                  {c.icon && <Icon name={c.icon} size={28} />}
                  {c.heading}
                </h3>
                <ul>
                  {c.items.map((it, k) => (
                    <li key={k}>
                      <b>{it.name}</b>
                      {it.desc && <span>{it.desc}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
