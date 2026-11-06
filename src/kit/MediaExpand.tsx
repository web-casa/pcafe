import { Kicker, Reveal } from '../deck/primitives'
import { Hint, Lines, SlideFoot, type SlideBase } from './shared'

export interface MediaExpandProps extends SlideBase {
  /** A real screenshot or photo. Shown cropped to the stage, so keep the subject away from the edges. */
  src: string
  alt: string
  /** ≤ 24 CJK characters. Shown on the image once it fills the stage. */
  caption: string
}

/**
 * The image starts as a small window beside the title; one press (with `build: 'reveal'`)
 * grows it to fill the stage while the text steps aside. Without `build`, or when jumped to,
 * the slide shows the expanded image.
 */
export function MediaExpand({ kicker, title, lead, source, hint = '按 → 放大画面', src, alt, caption }: MediaExpandProps) {
  return (
    <section className="slide">
      <Hint id="mediaexpand">{hint}</Hint>
      <div className="frame s-mx">
        <div className="mx__copy">
          <Reveal i={0}>
            <Kicker>{kicker}</Kicker>
          </Reveal>
          <Reveal i={1}>
            <h2 className="s-title">
              <Lines text={title} />
            </h2>
          </Reveal>
          {lead && (
            <Reveal i={2}>
              <p className="s-lead">{lead}</p>
            </Reveal>
          )}
        </div>
        <figure className="mx__media" data-build={0}>
          <img src={src} alt={alt} draggable={false} />
          <figcaption className="mx__cap">{caption}</figcaption>
        </figure>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
