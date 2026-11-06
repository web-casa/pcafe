import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from '../../shared'

export interface DepthItem {
  /** ≤ 6 characters, e.g. a year. */
  mark: string
  /** ≤ 8 CJK characters. */
  title: string
  /** ≤ 40 CJK characters. */
  body: string
}

export interface DepthCarouselProps extends SlideBase {
  /** 3–6 stations. Each build step brings the next one to the front; the others recede in depth. */
  items: DepthItem[]
}

/** 3D depth carousel: stations sit on a receding track; each step pulls the next one to the front and pushes the rest back. */
export function DepthCarousel({ kicker, title, lead, items, source, hint }: DepthCarouselProps) {
  return (
    <section className="slide">
      <Hint id="depthcarousel">{hint}</Hint>
      <div className="frame c3-frame">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className="c3depth" style={vars({ '--last': items.length - 1 })}>
          <div className="c3depth__stage">
            {items.map((it, i) => (
              <div key={i} className="c3depth__card" data-build="" style={vars({ '--k': i })}>
                <div className="c3depth__inner">
                  <span className="c3depth__no">{String(i + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span>
                  <b>{it.mark}</b>
                  <h3>{it.title}</h3>
                  <p>{it.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="c3depth__track" aria-hidden>
            {items.map((it, i) => (
              <span key={i} style={vars({ '--k': i })}>{it.mark}</span>
            ))}
          </div>
        </Reveal>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
