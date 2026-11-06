import { Reveal } from '../../../deck/primitives'
import { Icon } from '../../Icon'
import type { IconName } from '../../icon-set'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from '../../shared'

export interface HairlineItem {
  icon: IconName
  /** ≤ 10 CJK characters. */
  title: string
  /** 18–40 CJK characters, keep cells similar. */
  body: string
  /** Mono tag, ≤ 16 characters: a file, key or command. */
  tag?: string
}

export interface HairlineGridProps extends SlideBase {
  /** 4 or 6 cells (2 or 3 columns × 2 rows). */
  items: HairlineItem[]
  /** Index of the one cell that glows. Defaults to 0. */
  focus?: number
}

/**
 * Dark feature list on a hairline grid: cells split by 1px lines, a warm glow
 * under the one focus cell. title ≤ 1 line × 14 CJK characters (or 2 × 8).
 */
export function HairlineGrid({ kicker, title, lead, source, hint, items, focus = 0 }: HairlineGridProps) {
  const cols = items.length > 4 ? 3 : 2
  return (
    <section className="slide">
      <Hint id="hairlinegrid">{hint}</Hint>
      <div className="frame wdh">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="wdh__grid" style={vars({ '--cols': cols })}>
          {items.map((it, i) => (
            <Reveal key={it.title} build i={3 + i * 0.4} className={i === focus ? 'wdh__cell is-focus' : 'wdh__cell'}>
              <div className="wdh__top">
                <Icon name={it.icon} size={40} tone={i === focus ? 'accent' : 'mute'} />
                {it.tag && <code>{it.tag}</code>}
              </div>
              <b>{it.title}</b>
              <p>{it.body}</p>
            </Reveal>
          ))}
        </div>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
