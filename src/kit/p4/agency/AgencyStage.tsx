import { useState, type CSSProperties } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint } from '../../shared'
import type { PhotoImage } from '../../v2/p1/img'

export interface AgencyStageProps {
  /** 2 lines × ≤ 9 字, set large and light. */
  title: string[]
  /** White pill button under the title, ≤ 8 字. */
  cta: string
  /** Frosted card on the right: a photo, a ≤ 8 字 title and a ≤ 40 字 note. */
  card: { image: PhotoImage; title: string; body: string }
  /** 2–4 round faces and a two-line note, each line ≤ 12 字. */
  trust?: { faces: PhotoImage[]; text: [string, string?] }
  /** The giant wordmark that bleeds off the bottom, 3–7 Latin letters. */
  word: string
  /** Tiny mark after the wordmark. Default "®"; pass "" to hide it. */
  mark?: string
  hint?: string
}

/** Electric-blue agency opening: a glowing gradient that follows the pointer, a light two-line headline with a pill button, a frosted photo card, a row of faces and a giant wordmark bleeding off the bottom whose letters rise one by one. */
export function AgencyStage({ title, cta, card, trust, word, mark = '®', hint }: AgencyStageProps) {
  const [p, setP] = useState({ x: 0.82, y: 0 })
  const letters = [...word.slice(0, 7)]
  // Fill ~1800u with the wordmark: Geist bold caps run ≈ 0.66em wide.
  const size = Math.min(600, Math.round(1780 / (letters.length * 0.66)))
  return (
    <section
      className="slide ag-blue"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        setP({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height })
      }}
      style={{ '--gx': `${(p.x * 100).toFixed(1)}%`, '--gy': `${(p.y * 100).toFixed(1)}%` } as CSSProperties}
    >
      <Hint id="agencystage">{hint}</Hint>
      <div className="ag-blue__fx" aria-hidden="true" data-crop>
        <i className="ag-blue__glow" />
      </div>
      <div className="ag-st">
        <Reveal i={0} y={30}>
          <h1 className="ag-st__h1">
            {title.slice(0, 2).map((l, i) => (
              <span key={i}>{l}</span>
            ))}
          </h1>
        </Reveal>
        <Reveal i={1}>
          <span className="ag-go">
            <i aria-hidden="true">→</i>
            {cta}
          </span>
        </Reveal>
      </div>
      <Reveal i={1.6} className="ag-st__card">
        <div className="ag-glass">
          <div className="ag-glass__img" data-crop>
            <img src={card.image.src} alt={card.image.alt} draggable={false} style={{ objectPosition: card.image.focus ?? 'center' }} />
          </div>
          <b>{card.title}</b>
          <p>{card.body}</p>
        </div>
      </Reveal>
      {trust && (
        <Reveal i={2.2} className="ag-st__trust">
          <span className="ag-faces">
            {trust.faces.slice(0, 4).map((f, i) => (
              <img key={i} src={f.src} alt={f.alt} draggable={false} style={{ objectPosition: f.focus ?? 'center' }} />
            ))}
          </span>
          <span>
            {trust.text[0]}
            {trust.text[1] && (
              <>
                <br />
                {trust.text[1]}
              </>
            )}
          </span>
        </Reveal>
      )}
      <div className="ag-st__word" aria-hidden="true" data-crop style={{ '--ws': `calc(${size} * var(--u))` } as CSSProperties}>
        <span>
          {letters.map((c, i) => (
            <b key={i} style={{ '--i': i } as CSSProperties}>
              {c}
            </b>
          ))}
          {mark && <sup>{mark}</sup>}
        </span>
      </div>
    </section>
  )
}
