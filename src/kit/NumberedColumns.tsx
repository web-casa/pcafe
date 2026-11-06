import { Reveal } from '../deck/primitives'
import { Icon, type IconName } from './Icon'
import { Hint, SlideFoot, SlideHead, type SlideBase } from './shared'

export interface NumberedItem {
  /** Mono chip above the title: the keyword, package or flag. ≤ 20 characters. */
  tag: string
  /** ≤ 10 CJK characters so it stays on one line. */
  title: string
  /** 1–2 sentences, 24–40 CJK characters. Long Latin identifiers belong in `tag`. */
  body: string
  /** Optional icon tile beside the tag. Give every item one or none. */
  icon?: IconName
}

export interface NumberedColumnsProps extends SlideBase {
  /** Exactly 3 or 4 parallel points of equal weight. */
  items: NumberedItem[]
}

/** Parallel points of equal weight. Hovering a column lights its numeral. */
export function NumberedColumns({ kicker, title, lead, source, hint, items }: NumberedColumnsProps) {
  return (
    <section className="slide">
      <Hint id="numbered">{hint}</Hint>
      <div className="frame s-hard">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="hard__cols" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
          {items.map((h, i) => (
            <Reveal key={h.title} build i={i + 3} className="hard__col">
              {h.icon ? (
                <span className="hard__tagrow">
                  <span className="hard__icon">
                    <Icon name={h.icon} size={34} />
                  </span>
                  <code>{h.tag}</code>
                </span>
              ) : (
                <code>{h.tag}</code>
              )}
              <h3>{h.title}</h3>
              <p>{h.body}</p>
              <span className="hard__num" aria-hidden>
                {i + 1}
              </span>
            </Reveal>
          ))}
        </div>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
