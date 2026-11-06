import { Reveal } from '../deck/primitives'
import { Icon, type IconName } from './Icon'
import { Hint, SlideFoot, SlideHead, type SlideBase } from './shared'

export interface FlowNode {
  icon: IconName
  /** ≤ 8 CJK characters. */
  title: string
  /** ≤ 30 CJK characters. */
  body: string
  /** Up to 3 short labels under the body (≤ 12 CJK characters each): the parts this stage splits into. */
  parts?: string[]
  /** Highlight this stage in accent, e.g. "the stage you can influence". */
  focus?: boolean
}

export interface FlowBand {
  /** ≤ 10 CJK characters, e.g. '你能影响的来源'. */
  label: string
  /** 3–4 inputs: title ≤ 6, body ≤ 14 CJK characters. */
  items: { icon: IconName; title: string; body: string }[]
}

export interface FlowDiagramProps extends SlideBase {
  /** 3–5 stages, left to right. */
  nodes: FlowNode[]
  /** Optional strip along the bottom: what feeds the focused stage. */
  band?: FlowBand
}

/** How something works, stage by stage: a left-to-right pipeline with an optional input strip. */
export function FlowDiagram({ kicker, title, lead, source, hint, nodes, band }: FlowDiagramProps) {
  return (
    <section className="slide">
      <Hint id="flow">{hint}</Hint>
      <div className="frame s-flow">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <ol className="flow" style={{ gridTemplateColumns: `repeat(${nodes.length}, minmax(0, 1fr))` }}>
          {nodes.map((n, i) => (
            <li key={n.title} className={`flow__node${n.focus ? ' is-focus' : ''}`} data-build>
              <Reveal i={i * 1.2 + 3}>
                <div className="flow__head">
                  <span className="flow__icon">
                    <Icon name={n.icon} size={44} tone={n.focus ? 'accent' : 'ink'} />
                  </span>
                  {i < nodes.length - 1 && <span className="flow__arrow" aria-hidden style={{ animationDelay: `${600 + i * 160}ms` }} />}
                </div>
                <h3>{n.title}</h3>
                <p>{n.body}</p>
                {n.parts && (
                  <ul className="flow__parts">
                    {n.parts.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                )}
              </Reveal>
            </li>
          ))}
        </ol>
        {band && (
          <Reveal i={nodes.length * 1.2 + 3} className="flow__band">
            <span className="flow__band-label">{band.label}</span>
            <ul style={{ gridTemplateColumns: `repeat(${band.items.length}, minmax(0, 1fr))` }}>
              {band.items.map((b) => (
                <li key={b.title}>
                  <Icon name={b.icon} size={36} />
                  <span>
                    <b>{b.title}</b>
                    {b.body}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
        <SlideFoot source={source} i={nodes.length * 1.2 + 4} />
      </div>
    </section>
  )
}
