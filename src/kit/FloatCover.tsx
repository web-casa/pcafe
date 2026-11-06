import { Kicker, Reveal } from '../deck/primitives'
import { Marquee, Shape3D, type ShapeSpec } from './shapes'
import { Hint, Lines, SlideFoot, type SlideBase } from './shared'

export interface FloatCard {
  /** Mono caption, ≤ 12 characters. */
  label: string
  /** ≤ 8 characters. */
  value: string
  /** ≤ 24 CJK characters. */
  note: string
}

export interface FloatCoverProps extends SlideBase {
  /** One short word or phrase repeated in the sliding band behind the card, ≤ 10 characters. */
  marquee: string
  card: FloatCard
  /** Override the four default objects around the card. */
  shapes?: ShapeSpec[]
}

const DEFAULT_SHAPES: ShapeSpec[] = [
  { kind: 'sphere', spot: 3, size: 170, x: 15, y: 36 },
  { kind: 'cube', spot: 4, size: 130, x: 85, y: 28 },
  { kind: 'torus', spot: 2, size: 190, x: 80, y: 74, rot: -18 },
  { kind: 'capsule', spot: 1, size: 140, x: 23, y: 72, rot: 32 },
]

/** Opening slide: huge heading, one fact card in the middle, toy 3D objects floating round it, a sliding word band behind. */
export function FloatCover({ kicker, title, lead, source, hint, marquee, card, shapes = DEFAULT_SHAPES }: FloatCoverProps) {
  return (
    <section className="slide">
      <Hint id="floatcover">{hint}</Hint>
      <Marquee text={marquee} className="float__band" />
      <div className="float__shapes">
        {shapes.map((s, i) => (
          <Shape3D key={i} {...s} />
        ))}
      </div>
      <div className="frame s-float">
        <Reveal i={0}>
          <Kicker>{kicker}</Kicker>
        </Reveal>
        <Reveal i={1}>
          <h1 className="float__title">
            <Lines text={title} />
          </h1>
        </Reveal>
        {lead && (
          <Reveal i={2}>
            <p className="float__lead">{lead}</p>
          </Reveal>
        )}
        <Reveal i={3} className="float__card">
          <span>{card.label}</span>
          <b>{card.value}</b>
          <p>{card.note}</p>
        </Reveal>
        <SlideFoot source={source} i={6} />
      </div>
    </section>
  )
}
