import { useState } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint } from '../../shared'
import { Glow, Grad, type AlbumPrint } from './parts'

export interface AlbumCloseProps {
  /** Handwritten-feel line, ≤ 16 字. */
  hand?: string
  /** 2 lines × ≤ 8 字. */
  title: string[]
  /** Word at the end of the last line in italic serif gradient, ≤ 4 字. */
  grad?: string
  /** ≤ 40 字. */
  lead?: string
  /** Main button and a plain link, each ≤ 8 字. */
  ctas?: [string, string?]
  /** Small line under the buttons, ≤ 24 字. */
  note?: string
  /** 3–8 prints in a pile; click the pile to deal the top one to the back. */
  prints: AlbumPrint[]
  hint?: string
}

/** A warm close: the promise and buttons on the left, a pile of prints on the right that shuffles one card to the back each time you click it. */
export function AlbumClose({ hand, title, grad, lead, ctas, note, prints, hint }: AlbumCloseProps) {
  const list = prints.slice(0, 8)
  const n = list.length
  const [top, setTop] = useState(0)
  const [out, setOut] = useState(-1)
  const deal = () => {
    setOut(top)
    window.setTimeout(() => setOut(-1), 520)
    setTop((t) => (t + 1) % n)
  }
  return (
    <section className="slide al">
      <Hint id="albumclose">{hint}</Hint>
      <Glow at="right" />
      <div className="al-close__l">
        {hand && (
          <Reveal i={0} className="al-hand is-left">
            {hand}
          </Reveal>
        )}
        <Reveal i={0.5}>
          <h2 className="al-h1 is-left">
            {title.slice(0, 2).map((l, k) => (
              <span key={k}>{k === Math.min(title.length, 2) - 1 ? <Grad line={l} word={grad} /> : l}</span>
            ))}
          </h2>
        </Reveal>
        {lead && (
          <Reveal i={1}>
            <p className="al-lead is-left">{lead}</p>
          </Reveal>
        )}
        {ctas && (
          <Reveal i={1.5} className="al-ctas">
            <span className="al-btn">{ctas[0]}</span>
            {ctas[1] && <u>{ctas[1]}</u>}
          </Reveal>
        )}
        {note && (
          <Reveal i={2} className="al-note">
            {note}
          </Reveal>
        )}
      </div>
      <button type="button" className="al-pile" onClick={deal} aria-label="换一张">
        {list.map((p, k) => {
          const depth = (k - top + n) % n
          return (
            <figure
              key={k}
              className={`al-print${k === out ? ' is-out' : ''}`}
              style={{
                zIndex: n - depth,
                rotate: `${[-3, 4, -7, 6, -2, 8, -5, 3][k % 8]}deg`,
                translate: `calc(${depth * 6} * var(--u)) calc(${depth * 5} * var(--u))`,
                opacity: depth > 4 ? 0 : 1,
              }}
              aria-hidden={depth === 0 ? undefined : true}
            >
              <img src={p.image.src} alt={depth === 0 ? p.image.alt : ''} draggable={false} style={{ objectPosition: p.image.focus ?? 'center' }} />
              {p.caption && <figcaption>{p.caption}</figcaption>}
            </figure>
          )
        })}
        <span className="al-pile__count">
          {String(top + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
        </span>
      </button>
    </section>
  )
}
