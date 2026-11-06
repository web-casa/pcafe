import type { ReactNode } from 'react'
import { Kicker, Reveal } from '../deck/primitives'
import { Hint, Lines, type Text } from './shared'

export interface FullBleedProps {
  /** A real screenshot or photograph, 16:9 or wider. It is cropped to fill the page. */
  src: string
  alt: string
  kicker: string
  /** ≤ 2 lines × 12 CJK characters, set white over a dark fade at the bottom left. */
  title: Text
  /** ≤ 36 CJK characters. */
  caption?: string
  /** Where the crop keeps focus, CSS object-position. Default 'center'. */
  focus?: string
  /** Credit or where the image comes from. */
  source: string
  hint?: ReactNode
}

/** One image filling the whole page, with the title on a dark fade. Always use tone: 'dark' on this slide. */
export function FullBleed({ src, alt, kicker, title, caption, focus = 'center', source, hint }: FullBleedProps) {
  return (
    <section className="slide">
      <Hint id="bleed">{hint}</Hint>
      <Reveal i={0} y={0} className="bleed__img">
        <img src={src} alt={alt} draggable={false} style={{ objectPosition: focus }} />
      </Reveal>
      <div className="frame s-bleed">
        <Reveal i={2}>
          <Kicker>{kicker}</Kicker>
        </Reveal>
        <Reveal i={3}>
          <h2 className="bleed__title s-title">
            <Lines text={title} />
          </h2>
        </Reveal>
        {caption && (
          <Reveal i={4} className="bleed__caption">
            {caption}
          </Reveal>
        )}
        <Reveal i={6} className="s-source bleed__source">
          来源 · {source}
        </Reveal>
      </div>
    </section>
  )
}
