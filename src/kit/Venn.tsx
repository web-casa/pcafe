import { Reveal } from '../deck/primitives'
import type { Spot } from './parts'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from './shared'

export interface VennSet {
  /** ≤ 8 CJK characters. */
  label: string
  /** ≤ 20 CJK characters. */
  note: string
  spot?: Spot
}

export interface VennProps extends SlideBase {
  /** 2 or 3 sets. */
  sets: VennSet[]
  /** What sits where they all overlap, ≤ 8 CJK characters. */
  overlap: string
}

/** Two or three overlapping circles with the shared middle named: where qualities meet. */
export function Venn({ kicker, title, lead, source, hint, sets, overlap }: VennProps) {
  const three = sets.length === 3
  return (
    <section className="slide">
      <Hint id="venn">{hint}</Hint>
      <div className="frame frame--split s-venn">
        <div>
          <SlideHead kicker={kicker} title={title} lead={lead} />
          <SlideFoot source={source} i={8} />
        </div>
        <div className={`venn venn--${sets.length}`}>
          {sets.map((s, i) => (
            <Reveal key={s.label} build i={3 + i * 0.5} className={`venn__set venn__set--${i + 1}`} style={vars({ '--c': `var(--spot-${s.spot ?? [1, 4, 2][i]})` })}>
              <i aria-hidden />
              <div className="venn__label">
                <b>{s.label}</b>
                <span>{s.note}</span>
              </div>
            </Reveal>
          ))}
          <Reveal build i={5} className={`venn__mid${three ? ' venn__mid--3' : ''}`}>
            {overlap}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
