import { Kicker, Reveal } from '../../../deck/primitives'
import { Hint, Lines, SlideFoot, type SlideBase } from '../../shared'

export interface RibbonCoverProps extends SlideBase {
  /** Word or short phrase repeated along the big ribbon, ≤ 12 characters. Decorative; repeat a word already on the slide. */
  band: string
  /** Word on the dark crossing ribbon, ≤ 12 characters. Defaults to `band`. */
  band2?: string
}

const REPEAT = 8

function Band({ text, className }: { text: string; className: string }) {
  return (
    <div className={className}>
      <span>
        {Array.from({ length: REPEAT }, (_, i) => (
          <em key={i}>{text}</em>
        ))}
      </span>
    </div>
  )
}

/**
 * Opening slide: big friendly title top-left, two bold diagonal ribbons crossing the
 * lower right, one carrying a repeated word, plus a thin lime streamer.
 * title ≤ 2 lines × 8 CJK characters; lead ≤ 40.
 */
export function RibbonCover({ kicker, title, lead, source, hint, band, band2 }: RibbonCoverProps) {
  return (
    <section className="slide">
      <Hint id="ribboncover">{hint}</Hint>
      <div className="rbc__bands" aria-hidden data-crop>
        <Reveal i={3} y={0} className="rbc__wrap">
          <div className="rbc__thin" />
          <Band text={band2 ?? band} className="rbc__band rbc__band--ink" />
          <Band text={band} className="rbc__band rbc__band--accent" />
        </Reveal>
      </div>
      <div className="frame rbc">
        <Reveal i={0}>
          <Kicker>{kicker}</Kicker>
        </Reveal>
        <Reveal i={1}>
          <h1 className="rbc__title">
            <Lines text={title} />
          </h1>
        </Reveal>
        {lead && (
          <Reveal i={2}>
            <p className="rbc__lead">{lead}</p>
          </Reveal>
        )}
        <SlideFoot source={source} i={6} />
      </div>
    </section>
  )
}
