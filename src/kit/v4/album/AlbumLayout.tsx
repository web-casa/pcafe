import { useState } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint } from '../../shared'
import type { PhotoImage } from '../../v2/p1/img'
import { Glow, Print } from './parts'

export interface AlbumLayoutProps {
  /** 2 lines × ≤ 9 字. */
  title: string[]
  /** A word in the first line set in italic serif, ≤ 4 字. */
  em?: string
  /** Exactly 3 steps: name ≤ 10 字, note ≤ 26 字. Each step re-arranges the table. */
  steps: { name: string; note: string }[]
  /** Exactly 5 photos laid on the table. */
  photos: PhotoImage[]
  /** 0–2 loose prints floating beside the table. */
  loose?: PhotoImage[]
  hint?: string
}

type Box = [number, number, number, number, number]
/** left, top, width, height, rotate — in px inside the 900 × 660 table, one set per step. */
const LAYOUTS: Box[][] = [
  [
    [300, 150, 250, 310, -9],
    [330, 170, 250, 310, 6],
    [310, 190, 250, 310, -3],
    [350, 160, 250, 310, 11],
    [320, 200, 250, 310, 2],
  ],
  [
    [60, 60, 300, 360, -4],
    [400, 70, 180, 220, 5],
    [610, 50, 230, 190, -6],
    [130, 430, 220, 170, 7],
    [520, 320, 300, 280, -3],
  ],
  [
    [40, 40, 240, 300, 0],
    [300, 40, 240, 300, 0],
    [560, 40, 300, 250, 0],
    [40, 360, 330, 250, 0],
    [620, 330, 200, 240, 4],
  ],
]

/** How it works, told on a tilted tabletop: pick a step and the five photos on the table pile up, resize, then settle into a laid-out page. */
export function AlbumLayout({ title, em, steps, photos, loose = [], hint }: AlbumLayoutProps) {
  const [on, setOn] = useState(2)
  const list = steps.slice(0, 3)
  const boxes = LAYOUTS[on]
  return (
    <section className="slide al">
      <Hint id="albumlayout">{hint}</Hint>
      <Glow at="right" />
      <div className="al-lay__l">
        <Reveal i={0}>
          <h2 className="al-h2">
            {title.slice(0, 2).map((l, k) => (
              <span key={k}>{k === 0 && em && l.includes(em) ? <Em line={l} word={em} /> : l}</span>
            ))}
          </h2>
        </Reveal>
        <ol className="al-steps">
          {list.map((s, k) => (
            <Reveal i={1 + k * 0.5} y={12} key={s.name}>
              <li className={k === on ? 'is-on' : ''} onClick={() => setOn(k)}>
                <b>{s.name}</b>
                <small>{s.note}</small>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
      <div className="al-table" data-crop>
        {photos.slice(0, 5).map((p, k) => {
          const [x, y, w, h, r] = boxes[k]
          return (
            <img
              key={k}
              src={p.src}
              alt={p.alt}
              draggable={false}
              className={on === 2 && k === 4 ? 'is-picked' : ''}
              style={{
                left: `calc(${x} * var(--u))`,
                top: `calc(${y} * var(--u))`,
                width: `calc(${w} * var(--u))`,
                height: `calc(${h} * var(--u))`,
                rotate: `${r}deg`,
                objectPosition: p.focus ?? 'center',
                transitionDelay: `${k * 45}ms`,
              }}
            />
          )
        })}
        <div className="al-tool" aria-hidden="true">
          {['▢', '▶', '⌁', 'T', '⌗'].map((t, k) => (
            <i key={t} className={k === on ? 'is-on' : ''}>
              {t}
            </i>
          ))}
        </div>
      </div>
      {loose.slice(0, 2).map((p, k) => (
        <Print key={k} print={{ image: p }} className={`al-loose is-${k}`} />
      ))}
    </section>
  )
}

function Em({ line, word }: { line: string; word: string }) {
  const i = line.indexOf(word)
  return (
    <>
      {line.slice(0, i)}
      <em className="al-em">{word}</em>
      {line.slice(i + word.length)}
    </>
  )
}
