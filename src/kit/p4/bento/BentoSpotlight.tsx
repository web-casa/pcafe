import { Reveal } from '../../../deck/primitives'
import { Icon, type IconName } from '../../Icon'
import { Hint, SlideFoot, SlideHead, type SlideBase } from '../../shared'

export interface BentoSpotlightProps extends SlideBase {
  /** Tall tile on the left: title ≤ 10 CJK characters, text ≤ 60 CJK characters. */
  hero: { icon: IconName; label: string; title: string; text: string }
  /** Exactly 2 small tiles: label ≤ 14 characters, value ≤ 8 characters, note ≤ 18 CJK characters. */
  cells: [{ label: string; value: string; note: string }, { label: string; value: string; note: string }]
  /** Wide tile of key/value rows: 3–4 rows, k ≤ 16 characters (mono), v ≤ 22 CJK characters. */
  rows: { label: string; items: { k: string; v: string }[] }
}

/** One feature explained in a bento: a tall hero tile, two small figure tiles and a wide tile of mono key/value rows. */
export function BentoSpotlight({ kicker, title, lead, source, hint, hero, cells, rows }: BentoSpotlightProps) {
  return (
    <section className="slide">
      <Hint id="bentospotlight">{hint}</Hint>
      <div className="frame bf">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="bf__grid">
          <Reveal build i={3} className="bb__tile bf__hero">
            <span className="bf__icon" aria-hidden>
              <Icon name={hero.icon} size={56} />
            </span>
            <span className="bb__label">{hero.label}</span>
            <h3>{hero.title}</h3>
            <p>{hero.text}</p>
          </Reveal>
          {cells.map((c, i) => (
            <Reveal key={c.label} build i={4 + i} className={`bb__tile bf__cell bf__cell--${i}`}>
              <span className="bb__label">{c.label}</span>
              <b>{c.value}</b>
              <span className="bb__note">{c.note}</span>
            </Reveal>
          ))}
          <Reveal build i={6} className="bb__tile bf__rows">
            <span className="bb__label">{rows.label}</span>
            <dl>
              {rows.items.map((r) => (
                <div key={r.k}>
                  <dt>{r.k}</dt>
                  <dd>{r.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
