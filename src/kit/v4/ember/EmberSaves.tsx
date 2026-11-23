import { useEffect, useState } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot } from '../../shared'
import { Dot } from './parts'

export interface EmberSavesProps {
  dot?: string
  /** 2 lines × ≤ 10 字. */
  title: string[]
  /** ≤ 40 字. */
  lead?: string
  /** 3–6 tasks with hours before and after; name ≤ 8 字. */
  tasks: { name: string; before: number; after: number }[]
  labels?: { before: string; after: string; total: string; unit: string }
  source?: string
  hint?: string
}

const L0 = { before: '自己做', after: '交给代理', total: '每周省下', unit: '小时' }

/** Time saved per task: each bar shrinks from the hand-done hours to the agent hours, a switch flips between the two, and the total counts with it. */
export function EmberSaves({ dot, title, lead, tasks, labels, source, hint }: EmberSavesProps) {
  const L = { ...L0, ...labels }
  const list = tasks.slice(0, 6)
  const [after, setAfter] = useState(false)
  useEffect(() => {
    const t = window.setTimeout(() => setAfter(true), 1600)
    return () => window.clearTimeout(t)
  }, [])
  const max = Math.max(...list.map((t) => t.before))
  const saved = list.reduce((s, t) => s + t.before - t.after, 0)
  const shown = after ? saved : 0
  return (
    <section className="slide eb">
      <Hint id="embersaves">{hint}</Hint>
      <div className="eb-sv__l">
        {dot && (
          <Reveal i={0}>
            <Dot>{dot}</Dot>
          </Reveal>
        )}
        <Reveal i={0.4}>
          <h2 className="eb-h2 is-left">
            {title.slice(0, 2).map((l, i) => (
              <span key={i}>{l}</span>
            ))}
          </h2>
        </Reveal>
        {lead && (
          <Reveal i={0.8}>
            <p className="eb-lead">{lead}</p>
          </Reveal>
        )}
        <Reveal i={1.1}>
          <div className="eb-sv__total">
            <small>{L.total}</small>
            <b key={shown}>
              {shown}
              <span>{L.unit}</span>
            </b>
          </div>
        </Reveal>
      </div>
      <Reveal i={0.9} className="eb-sv">
        <div className="eb-seg" role="group">
          <button type="button" className={!after ? 'is-on' : undefined} aria-pressed={!after} onClick={() => setAfter(false)}>
            {L.before}
          </button>
          <button type="button" className={after ? 'is-on' : undefined} aria-pressed={after} onClick={() => setAfter(true)}>
            {L.after}
          </button>
        </div>
        <ul>
          {list.map((t) => {
            const v = after ? t.after : t.before
            return (
              <li key={t.name}>
                <span>{t.name}</span>
                <div className="eb-sv__track">
                  <i className="is-ghost" style={{ width: `${(t.before / max) * 100}%` }} />
                  <i className={after ? 'is-on' : undefined} style={{ width: `${Math.max(2, (v / max) * 100)}%` }} />
                </div>
                <b>
                  {v}
                  <small>{L.unit}</small>
                </b>
              </li>
            )
          })}
        </ul>
      </Reveal>
      <div className="eb-foot">
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
