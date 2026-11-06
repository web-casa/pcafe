import { Kicker, Reveal } from '../../../deck/primitives'
import { Hint, Lines, SlideFoot, vars, type Text } from '../../shared'

export interface MaskStep {
  /** ≤ 8 CJK characters. */
  label: string
  /** ≤ 36 CJK characters. */
  text: string
}

export interface MaskRevealProps {
  kicker: string
  /** 1–2 lines × ≤ 8 CJK characters. */
  title: Text
  /** 2–4 steps; each build step opens the mask a bit wider. */
  steps: MaskStep[]
  image: string
  alt: string
  /** 'circle' grows a circle from the centre; 'blinds' opens vertical slats one group at a time. Default 'circle'. */
  shape?: 'circle' | 'blinds'
  credit?: string
  source?: string
  hint?: string
}

/** A ghosted image that is uncovered through a growing mask, one build step per text point on the left. Pairs with build: 'reveal'. */
export function MaskReveal({ kicker, title, steps, image, alt, shape = 'circle', credit, source, hint }: MaskRevealProps) {
  const ss = steps.slice(0, 4)
  const n = ss.length
  return (
    <section className="slide">
      <Hint id="maskreveal">{hint}</Hint>
      <div className="frame s-mrev">
        <div className="mrev__text">
          <Reveal i={0}>
            <Kicker>{kicker}</Kicker>
          </Reveal>
          <Reveal i={1}>
            <h2 className="s-title mrev__title">
              <Lines text={title} />
            </h2>
          </Reveal>
          <ol className="mrev__steps">
            {ss.map((s, k) => (
              <Reveal key={k} i={2 + k} build={`m${k}`} className="mrev__step">
                <b>{String(k + 1).padStart(2, '0')}</b>
                <div>
                  <h3>{s.label}</h3>
                  <p>{s.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
        <Reveal i={2} className={`mrev__art mrev__art--${shape}`} y={0}>
          <img className="mrev__ghost" src={image} alt={alt} data-crop />
          {ss.map((_, k) => (
            <div key={k} className="mrev__layer" data-build={`m${k}`} data-crop aria-hidden style={vars({ '--r': `${Math.round(22 + ((k + 1) / n) * 38)}%`, '--k': k, '--n': n })}>
              <img src={image} alt="" />
            </div>
          ))}
          {credit && <span className="mrev__credit">{credit}</span>}
        </Reveal>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
