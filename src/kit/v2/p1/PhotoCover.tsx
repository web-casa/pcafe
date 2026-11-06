import { Kicker, Reveal } from '../../../deck/primitives'
import { Hint, Lines, type Text } from '../../shared'
import { Photo, type PhotoImage } from './img'

export interface PhotoCoverProps {
  image: PhotoImage
  kicker: string
  /** ≤ 2 lines × 10 CJK characters. */
  title: Text
  /** ≤ 40 CJK characters. */
  sub?: string
  /** 0–3 small meta items along the bottom (date, speaker, place), each ≤ 12 字. */
  meta?: string[]
  source?: string
  hint?: string
}

/** Full-bleed photo cover: vignette plus a bottom-left gradient keep white type legible. Use tone: 'dark'. */
export function PhotoCover({ image, kicker, title, sub, meta = [], source, hint }: PhotoCoverProps) {
  return (
    <section className="slide v21-pcover">
      <Hint id="photocover">{hint}</Hint>
      <Reveal i={0} y={0} className="v21-pcover__img">
        <Photo image={{ ...image, credit: undefined }} />
        <div className="v21-pcover__shade" aria-hidden />
      </Reveal>
      <div className="frame v21-pcover__frame">
        <Reveal i={2}>
          <Kicker>{kicker}</Kicker>
        </Reveal>
        <Reveal i={3}>
          <h1 className="v21-pcover__title s-title">
            <Lines text={title} />
          </h1>
        </Reveal>
        {sub && (
          <Reveal i={4}>
            <p className="v21-pcover__sub">{sub}</p>
          </Reveal>
        )}
        {(meta.length > 0 || source || image.credit) && (
          <Reveal i={5} className="v21-pcover__meta">
            {meta.map((m) => (
              <span key={m}>{m}</span>
            ))}
            {(source || image.credit) && <small>{[image.credit, source].filter(Boolean).join(' · ')}</small>}
          </Reveal>
        )}
      </div>
    </section>
  )
}
