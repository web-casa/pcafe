import { useEffect, useState, type CSSProperties } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot } from '../../shared'
import { Dot } from './parts'

export interface EmberStep {
  /** ≤ 10 字. */
  label: string
  /** ≤ 24 字. */
  detail: string
  /** Tool chip, ≤ 6 字. */
  tool?: string
  /** Seconds shown when the step finishes. */
  secs?: number
}

export interface EmberAgentProps {
  dot?: string
  /** 2 lines × ≤ 10 字. */
  title: string[]
  /** What the person asked for, ≤ 40 字. */
  task: string
  /** 3–6 steps the agent runs, top to bottom. */
  steps: EmberStep[]
  /** The draft that fills in as steps finish: a title ≤ 16 字 and 3–6 lines × ≤ 26 字. */
  result: { title: string; lines: string[] }
  labels?: { you: string; run: string; done: string; replay: string; log: string }
  /** Milliseconds per step. Default 1400. */
  pace?: number
  source?: string
  hint?: string
}

const L0 = { you: '你', run: '执行中', done: '已完成', replay: '再跑一次', log: '执行过程' }

/** An agent at work: the request on the left, a step list on the right that ticks off one by one, and a draft below the request that fills in as it goes. */
export function EmberAgent({ dot, title, task, steps, result, labels, pace = 1400, source, hint }: EmberAgentProps) {
  const L = { ...L0, ...labels }
  const list = steps.slice(0, 6)
  const n = list.length
  const [at, setAt] = useState(0)
  const [run, setRun] = useState(0)
  useEffect(() => {
    if (at >= n) return
    const t = window.setTimeout(() => setAt((x) => x + 1), at === 0 && run === 0 ? pace + 900 : pace)
    return () => window.clearTimeout(t)
  }, [at, n, pace, run])
  const lines = result.lines.slice(0, 6)
  const shown = Math.ceil((at / n) * lines.length)
  const total = list.slice(0, at).reduce((s, x) => s + (x.secs ?? 0), 0)
  const done = at >= n
  return (
    <section className="slide eb">
      <Hint id="emberagent">{hint}</Hint>
      <div className="eb-ag__l">
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
        <Reveal i={0.9}>
          <div className="eb-ag__task">
            <i aria-hidden="true">{L.you}</i>
            <p>{task}</p>
          </div>
        </Reveal>
        <Reveal i={1.3}>
          <div className={`eb-ag__doc${done ? ' is-done' : ''}`}>
            <b>{result.title}</b>
            <ul>
              {lines.map((l, i) => (
                <li key={`${run}-${i}`} className={i < shown ? 'is-on' : undefined}>
                  {l}
                </li>
              ))}
            </ul>
            <footer>{done ? `✓ ${L.done} · ${total}s` : `${L.run}…`}</footer>
          </div>
        </Reveal>
      </div>
      <Reveal i={0.8} className="eb-ag">
        <header>
          <b>{L.log}</b>
          <span className={done ? 'is-done' : undefined}>
            {done ? L.done : L.run} · {total}s
          </span>
          <button
            type="button"
            onClick={() => {
              setAt(0)
              setRun((r) => r + 1)
            }}
          >
            ↻ {L.replay}
          </button>
        </header>
        <ol style={{ '--n': n, '--at': Math.min(at, n - 1) } as CSSProperties}>
          {list.map((s, i) => (
            <li key={i} className={i < at ? 'is-done' : i === at ? 'is-run' : undefined}>
              <i aria-hidden="true" />
              <div>
                <b>{s.label}</b>
                <small>{s.detail}</small>
              </div>
              {s.tool && <em>{s.tool}</em>}
              <span>{i < at && s.secs != null ? `${s.secs}s` : ''}</span>
            </li>
          ))}
        </ol>
      </Reveal>
      <div className="eb-foot">
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
