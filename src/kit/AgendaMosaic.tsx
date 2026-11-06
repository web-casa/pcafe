import { Kicker, Reveal } from '../deck/primitives'
import { Hint, Lines, type Text } from './shared'

export interface AgendaMosaicProps {
  kicker: string
  title: Text
  /** Small right-aligned note beside the title, ≤ 16 characters: "五个议题 · 九十分钟". */
  aside?: string
  /** Exactly 5 items; the first gets the tall tile. title ≤ 12 CJK characters, tag ≤ 6. */
  items: { title: string; tag: string }[]
  hint?: React.ReactNode
}

/** An agenda as uneven tiles: one tall tile, four small ones in two tones. Made for `forest`, works in any style. */
export function AgendaMosaic({ kicker, title, aside, items, hint }: AgendaMosaicProps) {
  return (
    <section className="slide">
      <Hint id="agendamosaic">{hint}</Hint>
      <div className="frame s-am">
        <div className="am__head">
          <div>
            <Reveal i={0}><Kicker>{kicker}</Kicker></Reveal>
            <Reveal i={1}><h2 className="s-title"><Lines text={title} /></h2></Reveal>
          </div>
          {aside && <Reveal i={2}><p className="am__aside">{aside}</p></Reveal>}
        </div>
        <div className="am__grid">
          {items.map((it, i) => (
            <Reveal key={it.title} i={3 + i * 0.4} y={20} className={`am__tile is-${i}`}>
              <span className="am__n">{String(i + 1).padStart(2, '0')}</span>
              <h3>{it.title}</h3>
              <span className="am__tag">{it.tag}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
