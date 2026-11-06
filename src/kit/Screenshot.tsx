import { useState } from 'react'
import { Reveal } from '../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from './shared'

export interface Callout {
  /** Pin position as a percentage of the image, 0–100. Keep pins ≥ 8 apart. */
  x: number
  y: number
  /** ≤ 10 CJK characters. */
  title: string
  /** ≤ 36 CJK characters. */
  body: string
}

export interface ScreenshotProps extends SlideBase {
  /** Imported image (WebP or PNG in the deck folder). A real capture of a real product; never a mock-up passed off as one. */
  src: string
  alt: string
  /** Image width ÷ height. Default 16 / 10. */
  ratio?: number
  /** Address shown in the browser bar. Omit for a plain frame without browser chrome. */
  url?: string
  /** 3–5 numbered callouts, listed on the right in the same order. */
  callouts: Callout[]
}

/** A product screenshot with numbered pins and the explanation beside it. Hover a pin or a note to pair them. */
export function Screenshot({ kicker, title, lead, source, hint = '悬停编号查看对应说明', src, alt, ratio = 16 / 10, url, callouts }: ScreenshotProps) {
  const [on, setOn] = useState<number | null>(null)
  return (
    <section className="slide">
      <Hint id="shot">{hint}</Hint>
      <div className="frame s-shot">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="shot__body">
          <Reveal i={3} className={`shot${url ? ' has-bar' : ''}`} y={16} style={vars({ '--ar': ratio })}>
            {url && (
              <div className="shot__bar" aria-hidden>
                <i />
                <i />
                <i />
                <span>{url}</span>
              </div>
            )}
            <div className="shot__view">
              <img src={src} alt={alt} draggable={false} />
              {callouts.map((c, i) => (
                <button
                  key={c.title}
                  type="button"
                  tabIndex={-1}
                  className={`shot__pin${on === i ? ' is-on' : ''}`}
                  style={vars({ left: `${c.x}%`, top: `${c.y}%`, animationDelay: `${700 + i * 120}ms` })}
                  onMouseEnter={() => setOn(i)}
                  onMouseLeave={() => setOn(null)}
                  aria-label={c.title}
                  data-build={i}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </Reveal>
          <ol className="shot__notes">
            {callouts.map((c, i) => (
              <li key={c.title} data-build={i} className={on === i ? 'is-on' : undefined} onMouseEnter={() => setOn(i)} onMouseLeave={() => setOn(null)}>
                <Reveal i={i * 0.6 + 5}>
                  <span className="shot__n">{i + 1}</span>
                  <div>
                    <h3>{c.title}</h3>
                    <p>{c.body}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
        <SlideFoot source={source} i={9} />
      </div>
    </section>
  )
}
