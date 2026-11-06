import { Reveal } from '../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from './shared'

export interface ConvergeShot {
  /** Imported image (real screenshot or labelled photo). 16:9 works best. */
  src: string
  alt: string
  /** ≤ 10 CJK characters, shown under each picture while they are spread out. */
  label: string
}

export interface ConvergeShotsProps extends SlideBase {
  /** 3–4 pictures. */
  shots: ConvergeShot[]
  /** Which picture ends up in front. Default 0. */
  focus?: number
  /** ≤ 36 CJK characters, appears on the second press. */
  caption?: string
}

// Picture size once it is in focus, in u. The row layout scales it down.
const W = 1000
const ROW = 1680

/**
 * Several pictures side by side gather into one focus picture, the rest stacked behind it.
 * With `build: 'reveal'`: press 1 gathers, press 2 shows the caption. Without build the gathered state shows.
 */
export function ConvergeShots({ kicker, title, lead, source, hint = '按 → 汇聚到一张', shots, focus = 0, caption }: ConvergeShotsProps) {
  const n = shots.length
  const step = ROW / n
  const scale = (step - 36) / W
  // Order of the others behind the focus: nearest first, alternating sides.
  const behind = shots.map((_, i) => i).filter((i) => i !== focus)
  return (
    <section className="slide">
      <Hint id="convergeshots">{hint}</Hint>
      <div className="frame s-cv">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} y={24} className="cv__wrap">
          <div className="cv__stage" data-build={0}>
            {shots.map((s, i) => {
              const k = behind.indexOf(i)
              const side = k % 2 === 0 ? 1 : -1
              const depth = Math.floor(k / 2) + 1
              return (
                <figure
                  key={s.label}
                  className={`cv__shot${i === focus ? ' is-focus' : ''}`}
                  style={vars({
                    '--sx': `calc(${(i - (n - 1) / 2) * step} * var(--u))`,
                    '--ss': scale,
                    '--bx': `calc(${side * (90 + depth * 50)} * var(--u))`,
                    '--by': `calc(${-depth * 26} * var(--u))`,
                    '--br': `${side * (2 + depth * 2)}deg`,
                    '--bs': 0.9 - depth * 0.06,
                    '--z': i === focus ? 10 : 5 - depth,
                  })}
                >
                  <img src={s.src} alt={s.alt} draggable={false} />
                  <figcaption>{s.label}</figcaption>
                </figure>
              )
            })}
          </div>
          {caption && (
            <p className="cv__cap" data-build={1}>
              {caption}
            </p>
          )}
        </Reveal>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
