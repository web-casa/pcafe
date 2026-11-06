import { Kicker, Reveal } from '../deck/primitives'
import type { IconName } from './Icon'
import { IconTile, type Spot } from './parts'
import { Hint, SlideFoot } from './shared'

export interface ServiceItem {
  /** The giant word, ≤ 6 CJK or 12 Latin characters. */
  word: string
  icon: IconName
  /** Mono note on the right, ≤ 24 CJK characters. */
  note: string
}

export interface ServiceListProps {
  kicker: string
  /** 4–6 rows. */
  items: ServiceItem[]
  source?: string
  hint?: string
}

/** What we do, as a column of giant words alternating ink and accent, each with an icon and a note. */
export function ServiceList({ kicker, items, source, hint }: ServiceListProps) {
  return (
    <section className="slide">
      <Hint id="services">{hint}</Hint>
      <div className="frame s-services">
        <Reveal i={0}>
          <Kicker>{kicker}</Kicker>
        </Reveal>
        <ol className={`services services--${items.length}`}>
          {items.map((it, i) => (
            <Reveal key={it.word} build i={1 + i * 0.5} className={`services__row${i % 2 ? ' is-alt' : ''}`}>
              <IconTile icon={it.icon} spot={((i % 5) + 1) as Spot} size={72} />
              <b className="services__word">{it.word}</b>
              <span className="services__note">{it.note}</span>
            </Reveal>
          ))}
        </ol>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
