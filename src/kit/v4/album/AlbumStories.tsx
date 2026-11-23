import { useState } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot } from '../../shared'
import type { PhotoImage } from '../../v2/p1/img'
import { Glow } from './parts'

export interface AlbumStory {
  image: PhotoImage
  /** Caption on the front, ≤ 8 字. */
  caption: string
  /** Written on the back, ≤ 44 字. */
  note: string
  /** ≤ 6 字. */
  name: string
  /** e.g. "用了 2 年", ≤ 10 字. */
  meta?: string
}

export interface AlbumStoriesProps {
  kicker?: string
  /** 1 line ≤ 14 字. */
  title: string
  /** Exactly 3 prints; click one to turn it over and read the back. */
  stories: AlbumStory[]
  source?: string
  hint?: string
}

/** Three people's stories as three large prints; click a print to flip it and read what they wrote on the back. */
export function AlbumStories({ kicker, title, stories, source, hint }: AlbumStoriesProps) {
  const list = stories.slice(0, 3)
  const [flip, setFlip] = useState<boolean[]>(() => list.map((_, k) => k === 1))
  return (
    <section className="slide al">
      <Hint id="albumstories">{hint}</Hint>
      <Glow at="center" />
      <div className="al-center al-stories__head">
        {kicker && (
          <Reveal i={0} className="al-k">
            {kicker}
          </Reveal>
        )}
        <Reveal i={0.5}>
          <h2 className="al-h2 is-one">{title}</h2>
        </Reveal>
      </div>
      <div className="al-stories">
        {list.map((s, k) => (
          <Reveal i={1.5 + k * 0.5} y={30} key={s.name}>
            <div
              className={`al-flip${flip[k] ? ' is-flipped' : ''}`}
              style={{ ['--r' as string]: `${[-4, 2, 5][k]}deg` }}
              onClick={() => setFlip((f) => f.map((v, i) => (i === k ? !v : v)))}
            >
              <div className="al-flip__in">
                <figure className="al-print al-flip__front" aria-hidden={flip[k] ? true : undefined}>
                  <img src={s.image.src} alt={s.image.alt} draggable={false} style={{ objectPosition: s.image.focus ?? 'center' }} />
                  <figcaption>{s.caption}</figcaption>
                </figure>
                <div className="al-flip__back" aria-hidden={flip[k] ? undefined : true}>
                  <p>{s.note}</p>
                  <div>
                    <b>— {s.name}</b>
                    {s.meta && <small>{s.meta}</small>}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <div className="al-stories__foot">
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
