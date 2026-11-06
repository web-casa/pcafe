import { Reveal } from '../deck/primitives'
import { Shape3D, type ShapeKind } from './shapes'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from './shared'

export interface ServiceIndexItem {
  /** ≤ 10 CJK characters. */
  title: string
  /** ≤ 44 CJK characters. */
  text: string
}

export interface ServiceIndexProps extends SlideBase {
  /** 3–4 services or steps. */
  items: ServiceIndexItem[]
  /** Small object in the top right. Defaults to a cube. */
  shape?: ShapeKind
}

/** Services or steps in columns, each sitting on a huge faint number, with a small 3D object as an accent. */
export function ServiceIndex({ kicker, title, lead, source, hint, items, shape = 'cube' }: ServiceIndexProps) {
  return (
    <section className="slide">
      <Hint id="serviceindex">{hint}</Hint>
      <div className="frame s-svcindex">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Shape3D kind={shape} spot={4} size={120} x={92} y={6} />
        <ol className="svcindex" style={vars({ '--n': items.length })}>
          {items.map((it, i) => (
            <Reveal key={it.title} build i={3 + i * 0.5} className="svcindex__item">
              <span className="svcindex__num" aria-hidden>
                {String(i + 1).padStart(2, '0')}
              </span>
              <b>{it.title}</b>
              <p>{it.text}</p>
            </Reveal>
          ))}
        </ol>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
