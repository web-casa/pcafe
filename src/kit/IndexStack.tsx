import { Reveal } from '../deck/primitives'
import { type IconName } from './Icon'
import { IconTile, MiniUI, type PanelUI, type Spot } from './parts'
import { Hint, SlideFoot, SlideHead, type SlideBase } from './shared'

export interface IndexItem {
  /** Index label, ≤ 8 CJK characters. */
  label: string
  icon: IconName
  /** Card title, ≤ 10 CJK characters. */
  title: string
  /** ≤ 40 CJK characters, under the interface. */
  body: string
  ui: PanelUI
}

export interface IndexStackProps extends SlideBase {
  /** 3–5 items. Set build: 'focus' on the slide: each → brings the next card to the front. */
  items: IndexItem[]
}

/** A table of contents on the left; cards stacked like folders on the right, the current one in front. */
export function IndexStack({ kicker, title, lead, source, hint = '按 → 逐张翻到最前', items }: IndexStackProps) {
  return (
    <section className="slide">
      <Hint id="istack">{hint}</Hint>
      <div className="frame s-istack">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="istack">
          <Reveal i={3} className="istack__index">
            <ol>
              {items.map((it, i) => (
                <li key={it.label} data-build={i}>
                  {it.label}
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal i={4} y={18} className="istack__deck">
            {items.map((it, i) => (
              <article key={it.label} className="istack__card" data-build={i} style={{ ['--k' as string]: i }}>
                <header>
                  <IconTile icon={it.icon} spot={((i % 6) + 1) as Spot} size={44} />
                  <h3>{it.title}</h3>
                </header>
                <div className="istack__ui">
                  <MiniUI ui={it.ui} />
                </div>
                <p>{it.body}</p>
              </article>
            ))}
          </Reveal>
        </div>
        <SlideFoot source={source} i={9} />
      </div>
    </section>
  )
}
