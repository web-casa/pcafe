import { Reveal } from '../deck/primitives'
import { Hint, SlideFoot, SlideHead, type SlideBase } from './shared'

export interface IndexListProps extends SlideBase {
  /** 4–6 entries, read down the left column then the right. title ≤ 12 CJK characters, body ≤ 40. */
  entries: { title: string; body: string }[]
}

/** A journal-style index: numbered entries in two ruled columns. Made for `cobalt-grid`, works in any style. */
export function IndexList({ kicker, title, lead, source, hint, entries }: IndexListProps) {
  return (
    <section className="slide">
      <Hint id="indexlist">{hint}</Hint>
      <div className="frame s-il">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <ol className="il__list" style={{ gridTemplateRows: `repeat(${Math.ceil(entries.length / 2)}, auto)` }}>
          {entries.map((e, i) => (
            <li key={e.title} data-build={i}>
              <Reveal i={3 + i * 0.4} y={16} className="il__in">
                <span className="il__n">{String(i + 1).padStart(2, '0')}.</span>
                <div>
                  <h3>{e.title}</h3>
                  <p>{e.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
