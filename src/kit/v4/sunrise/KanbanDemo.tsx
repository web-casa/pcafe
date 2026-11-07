import { useState } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint, Lines, type Text } from '../../shared'
import { type PhotoImage } from '../../v2/p1/img'

export interface KanbanCard {
  /** ≤ 4 字. */
  tag: string
  tone?: 'accent' | 'lime' | 'sun' | 'coral'
  /** ≤ 12 字. */
  title: string
  /** Shown while not done, ≤ 8 个字符. */
  due?: string
  /** 0–100; shows a progress bar. */
  progress?: number
  face?: PhotoImage
}

export interface KanbanDemoProps {
  kicker?: string
  /** ≤ 2 lines × 7 字. */
  title: Text
  /** ≤ 36 字. */
  lead?: string
  /** 2–4 ticks, each ≤ 16 字. */
  points?: string[]
  /** Exactly 3 columns: name ≤ 4 字, `count` is the number shown before any card moves (defaults to the cards listed), 1–3 cards each. The last column is "done". */
  columns: { name: string; count?: number; cards: KanbanCard[] }[]
  /** View tabs on the board, up to 3, each ≤ 4 字. */
  views?: string[]
  /** Teammate cursor gliding over the tabs, ≤ 4 字. */
  cursor?: string
  /** Label on finished cards, ≤ 6 字. Default '✓ 已完成'. */
  doneLabel?: string
  /** Empty slot at the bottom of each column, ≤ 6 字. Default '+ 添加任务'. */
  addLabel?: string
  faces?: PhotoImage[]
  hint?: string
}

/** A task board you can play with: click a card and it moves to the next column, counts update; the copy and ticks sit at the left. Made for `sunrise`, works in any style. */
export function KanbanDemo({ kicker, title, lead, points = [], columns, views = [], cursor, doneLabel = '✓ 已完成', addLabel = '+ 添加任务', faces = [], hint }: KanbanDemoProps) {
  const cols = columns.slice(0, 3)
  const all = cols.flatMap((c) => c.cards.slice(0, 3))
  const [where, setWhere] = useState(() => cols.flatMap((c, ci) => c.cards.slice(0, 3).map(() => ci)))
  const [moved, setMoved] = useState(-1)
  const [view, setView] = useState(0)
  const base = cols.map((c) => c.count ?? c.cards.length)
  const counts = cols.map((c, ci) => base[ci] - c.cards.slice(0, 3).length + where.filter((w) => w === ci).length)
  const last = cols.length - 1
  const step = (k: number) => {
    if (where[k] >= last) return
    setWhere((w) => w.map((x, j) => (j === k ? x + 1 : x)))
    setMoved(k)
  }
  return (
    <section className="slide">
      <Hint id="kanbandemo">{hint}</Hint>
      <div className="sr-sun is-left" aria-hidden="true" />
      <div className="frame sr-fx">
        <div className="sr-fx__l">
          {kicker && (
            <Reveal i={0} className="sr-kick">
              ◆ {kicker}
            </Reveal>
          )}
          <Reveal i={1}>
            <h2 className="sr-title sr-fx__title">
              <Lines text={title} />
            </h2>
          </Reveal>
          {lead && (
            <Reveal i={2}>
              <p className="sr-lead">{lead}</p>
            </Reveal>
          )}
          {points.length > 0 && (
            <div className="sr-ticks">
              {points.slice(0, 4).map((p, i) => (
                <Reveal key={p} i={3 + i} className="sr-tick">
                  {p}
                </Reveal>
              ))}
            </div>
          )}
        </div>
        <Reveal i={2} y={50} className="sr-board">
          <div className="sr-board__bar">
            {views.length > 0 && (
              <div className="sr-views" role="tablist">
                {views.slice(0, 3).map((v, i) => (
                  <button key={v} type="button" role="tab" aria-selected={view === i} onClick={() => setView(i)}>
                    {v}
                  </button>
                ))}
              </div>
            )}
            {faces.length > 0 && (
              <span className="sr-stack">
                {faces.slice(0, 4).map((f, i) => (
                  <img key={i} src={f.src} alt={f.alt} />
                ))}
              </span>
            )}
            {cursor && (
              <span className="sr-cur is-k" aria-hidden="true">
                <i />
                <span>{cursor}</span>
              </span>
            )}
          </div>
          <div className="sr-cols">
            {cols.map((c, ci) => (
              <div key={c.name} className="sr-col">
                <h4>
                  {c.name}
                  <em key={counts[ci]}>{counts[ci]}</em>
                </h4>
                {all.map((card, k) =>
                  where[k] !== ci ? null : (
                    <button
                      key={card.title}
                      type="button"
                      className={`sr-cd${ci === last ? ' is-done' : ''}${moved === k ? ' is-moved' : ''}`}
                      onClick={() => step(k)}
                      aria-label={ci < last ? `${card.title} → ${cols[ci + 1].name}` : card.title}
                    >
                      <span className={`sr-tg is-${card.tone ?? 'accent'}`}>{card.tag}</span>
                      <b>{card.title}</b>
                      {ci < last && card.progress != null && (
                        <span className="sr-cd__bar">
                          <i style={{ width: `${card.progress}%` }} />
                        </span>
                      )}
                      <span className="sr-cd__ft">
                        <span>{ci === last ? doneLabel : card.progress != null ? `${card.progress}%` : card.due}</span>
                        {card.face && <img src={card.face.src} alt={card.face.alt} />}
                      </span>
                    </button>
                  ),
                )}
                <span className="sr-add">{addLabel}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
