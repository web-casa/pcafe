import { useId } from 'react'
import { Kicker, Reveal } from '../../../deck/primitives'
import { Hint, Lines, SlideFoot, type Text } from '../../shared'

export interface HalftoneProps {
  /** 2–8 characters. */
  kicker: string
  /** 1–3 lines × ≤ 8 CJK characters. */
  title: Text
  /** ≤ 60 CJK characters. */
  lead?: string
  /** Imported image (decor- or a real screenshot). */
  image: string
  alt: string
  /** 'dots' = newspaper halftone, 'dither' = 1-bit noise dither. Default 'dots'. */
  mode?: 'dots' | 'dither'
  /** Dot cell size in px of the 1920 stage, 8–24. Default 14. */
  cell?: number
  /** 0–3 short facts below the lead: value ≤ 6 characters, label ≤ 12 CJK characters. */
  facts?: { value: string; label: string }[]
  /** Image credit, e.g. "图：AI 生成装饰图". */
  credit?: string
  source?: string
  hint?: string
}

function dotTile(cell: number) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${cell}' height='${cell}'><defs><radialGradient id='g'><stop offset='0' stop-color='#fff'/><stop offset='1' stop-color='#000'/></radialGradient></defs><rect width='100%' height='100%' fill='#000'/><circle cx='${cell / 2}' cy='${cell / 2}' r='${cell * 0.72}' fill='url(#g)'/></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

/** Text on the left; on the right the image re-printed as accent-coloured halftone dots or a 1-bit dither (SVG filter, no extra asset). */
export function Halftone({ kicker, title, lead, image, alt, mode = 'dots', cell = 14, facts = [], credit, source, hint }: HalftoneProps) {
  const id = useId().replace(/:/g, '')
  const c = Math.max(8, Math.min(24, cell))
  return (
    <section className="slide">
      <Hint id="halftone">{hint}</Hint>
      <div className="frame s-htone">
        <div className="htone__text">
          <Reveal i={0}>
            <Kicker>{kicker}</Kicker>
          </Reveal>
          <Reveal i={1}>
            <h2 className="s-title htone__title">
              <Lines text={title} />
            </h2>
          </Reveal>
          {lead && (
            <Reveal i={2}>
              <p className="s-lead">{lead}</p>
            </Reveal>
          )}
          {facts.length > 0 && (
            <div className="htone__facts">
              {facts.slice(0, 3).map((f, k) => (
                <Reveal key={k} i={3 + k} build className="htone__fact">
                  <b>{f.value}</b>
                  <span>{f.label}</span>
                </Reveal>
              ))}
            </div>
          )}
        </div>
        <Reveal i={2} className="htone__art" y={0}>
          <svg className="htone__svg" viewBox="0 0 900 820" preserveAspectRatio="xMidYMid slice" role="img" aria-label={alt}>
            <defs>
              <filter id={`ht${id}`} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
                {/* luminance → R */}
                <feColorMatrix in="SourceGraphic" type="matrix" values="0.36 0.7 0.13 0 0.08  0.36 0.7 0.13 0 0.08  0.36 0.7 0.13 0 0.08  0 0 0 1 0" result="lum" />
                {mode === 'dots' ? (
                  <>
                    <feImage href={dotTile(c)} x="0" y="0" width={c} height={c} result="dot" />
                    <feTile in="dot" result="screen" />
                  </>
                ) : (
                  <>
                    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="3" result="noise" />
                    <feColorMatrix in="noise" type="matrix" values="1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 1" result="screen" />
                  </>
                )}
                {/* compare luminance with the threshold screen, then snap to 1 bit */}
                <feComposite in="lum" in2="screen" operator="arithmetic" k2="1" k3="-1" k4="0.5" result="diff" />
                <feComponentTransfer in="diff" result="bit">
                  <feFuncR type="discrete" tableValues="0 1" />
                </feComponentTransfer>
                {/* dark parts become ink: alpha = 1 − bit */}
                <feColorMatrix in="bit" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -1 0 0 0 1" result="mask" />
                <feFlood floodColor="currentColor" />
                <feComposite in2="mask" operator="in" />
              </filter>
            </defs>
            <rect className="htone__paper" width="900" height="820" />
            <image href={image} width="900" height="820" preserveAspectRatio="xMidYMid slice" filter={`url(#ht${id})`} />
          </svg>
          {credit && <span className="htone__credit">{credit}</span>}
        </Reveal>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
