import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot } from '../../shared'
import { Dot } from './parts'

export type SlateVis = 'bars' | 'gauge' | 'wave' | 'donut' | 'rows' | 'nodes'

export interface SlateStep {
  /** Accent tag, e.g. "步骤 1", ≤ 6 字. */
  tag: string
  /** ≤ 10 字. */
  title: string
  /** ≤ 34 字. */
  body: string
  /** Which little picture to draw on top of the card. */
  vis: SlateVis
  /** Number shown in the gauge or donut, 0–100. */
  value?: number
}

export interface SlateStepsProps {
  dot?: string
  /** 1–2 lines × ≤ 10 字. */
  title: string[]
  /** ≤ 30 字. */
  lead?: string
  /** Exactly 3 steps. */
  steps: SlateStep[]
  source?: string
  hint?: string
}

function Vis({ vis, value = 80 }: { vis: SlateVis; value?: number }) {
  if (vis === 'bars')
    return (
      <div className="sl-vb">
        <span>
          <i>30</i>
          <i>20</i>
          <i>10</i>
        </span>
        {[40, 92, 58].map((h, i) => (
          <i key={i} className={i === 1 ? 'is-on' : ''} style={{ ['--h' as string]: `${h}%`, animationDelay: `${0.6 + i * 0.12}s` }} />
        ))}
      </div>
    )
  if (vis === 'gauge')
    return (
      <div className="sl-gauge" style={{ ['--v' as string]: value }}>
        <i />
        <b>{value}%</b>
      </div>
    )
  if (vis === 'donut')
    return (
      <div className="sl-donut" style={{ ['--v' as string]: value }}>
        <b>{value}%</b>
      </div>
    )
  if (vis === 'rows')
    return (
      <div className="sl-rows">
        {[88, 64, 46, 30].map((w, i) => (
          <i key={i} className={i === 0 ? 'is-on' : ''} style={{ ['--w' as string]: `${w}%`, animationDelay: `${0.6 + i * 0.1}s` }} />
        ))}
      </div>
    )
  if (vis === 'nodes')
    return (
      <svg className="sl-nodes" viewBox="0 0 300 200" aria-hidden="true">
        <path d="M60 100 C110 100 110 50 150 50 M60 100 C110 100 110 150 150 150 M150 50 C200 50 200 100 240 100 M150 150 C200 150 200 100 240 100" />
        <circle cx="60" cy="100" r="16" />
        <circle cx="150" cy="50" r="14" />
        <circle cx="150" cy="150" r="14" />
        <circle className="is-on" cx="240" cy="100" r="18" />
      </svg>
    )
  const hs = [40, 90, 60, 140, 100, 170, 80, 120, 190, 110, 150, 70, 130, 50, 100]
  return (
    <div className="sl-wave">
      {hs.map((h, i) => (
        <i key={i} style={{ height: `calc(${h} * var(--u))`, animationDelay: `${(i % 5) * 0.15}s` }} />
      ))}
    </div>
  )
}

/** A process in three white cards, each topped with a small live picture (bars, gauge, wave, donut, rows or nodes) that animates in; cards lift on hover. */
export function SlateSteps({ dot, title, lead, steps, source, hint }: SlateStepsProps) {
  return (
    <section className="slide sl">
      <Hint id="slatesteps">{hint}</Hint>
      <div className="sl-center">
        {dot && (
          <Reveal i={0}>
            <Dot>{dot}</Dot>
          </Reveal>
        )}
        <Reveal i={0.5}>
          <h2 className="sl-h2">
            {title.slice(0, 2).map((l, i) => (
              <span key={i}>{l}</span>
            ))}
          </h2>
        </Reveal>
        {lead && (
          <Reveal i={1}>
            <p className="sl-sub">{lead}</p>
          </Reveal>
        )}
      </div>
      <div className="sl-steps">
        {steps.slice(0, 3).map((s, i) => (
          <Reveal i={1.5 + i * 0.5} y={30} key={s.title}>
            <article className="sl-step">
              <div className="sl-step__vis">
                <Vis vis={s.vis} value={s.value} />
              </div>
              <em>{s.tag}</em>
              <b>{s.title}</b>
              <small>{s.body}</small>
            </article>
          </Reveal>
        ))}
      </div>
      <div className="sl-foot">
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
