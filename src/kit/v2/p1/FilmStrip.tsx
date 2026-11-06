import { Reveal } from '../../../deck/primitives'
import { Hint, SlideHead, SlideFoot, type SlideBase } from '../../shared'
import { Photo, type PhotoImage } from './img'

export interface FilmFrame {
  image: PhotoImage
  /** Under the frame, ≤ 8 字. */
  label: string
  /** Small mono marker printed on the film edge, ≤ 6 个字符 (year, step). */
  mark?: string
}

export interface FilmStripProps extends SlideBase {
  /** 3–5 frames, one build step each. */
  frames: FilmFrame[]
}

/** Film negative strip: sprocket holes top and bottom, frames appear one by one with labels. */
export function FilmStrip({ kicker, title, lead, frames, source, hint }: FilmStripProps) {
  const f = frames.slice(0, 5)
  return (
    <section className="slide">
      <Hint id="filmstrip">{hint}</Hint>
      <div className="frame v21-film">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className="v21-film__strip" style={{ gridTemplateColumns: `repeat(${f.length}, 1fr)` }}>
          <i className="v21-film__holes v21-film__holes--top" aria-hidden />
          <i className="v21-film__holes v21-film__holes--bottom" aria-hidden />
          {f.map((fr, i) => (
            <Reveal key={i} i={4 + i} build={`f${i}`} className="v21-film__frame">
              <Photo image={fr.image} />
              {fr.mark && <span className="v21-film__mark">{fr.mark}</span>}
            </Reveal>
          ))}
        </Reveal>
        <div className="v21-film__labels" style={{ gridTemplateColumns: `repeat(${f.length}, 1fr)` }}>
          {f.map((fr, i) => (
            <Reveal key={i} i={4 + i} build={`f${i}`}>
              <p>
                <b>{String(i + 1).padStart(2, '0')}</b>
                {fr.label}
              </p>
            </Reveal>
          ))}
        </div>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
