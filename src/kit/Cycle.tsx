import { Reveal } from '../deck/primitives'
import { Icon, type IconName } from './Icon'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from './shared'

export interface CycleNode {
  icon: IconName
  /** ≤ 8 characters. Sits beside the ring. */
  title: string
  /** Beside the ring in the list on the right, ≤ 36 CJK characters. */
  body: string
  /** Mono chip in the list, ≤ 14 characters. */
  tag?: string
}

export interface CycleProps extends SlideBase {
  /** 3–6 stages, clockwise from the top. The last one feeds the first. */
  nodes: CycleNode[]
  /** Centre of the ring: a short figure or word (≤ 6 characters) and a caption (≤ 12 CJK characters). */
  hub: { value: string; caption: string }
  /** The stage the slide is about: accent tile. */
  focus?: number
}

/** A loop: stages around a ring with a marker running through them, details listed alongside. */
export function Cycle({ kicker, title, lead, source, hint, nodes, hub, focus }: CycleProps) {
  const n = nodes.length
  return (
    <section className="slide">
      <Hint id="cycle">{hint}</Hint>
      <div className="frame s-cycle">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="cycle__body">
          <Reveal i={3} className="cycle" y={16}>
            <span className="cycle__ring" aria-hidden />
            <span className="cycle__runner" aria-hidden />
            <div className="cycle__hub">
              <b>{hub.value}</b>
              <span>{hub.caption}</span>
            </div>
            {nodes.map((d, i) => {
              const a = (i / n) * Math.PI * 2 - Math.PI / 2
              return (
                <span
                  key={d.title}
                  className={`cycle__node${focus === i ? ' is-focus' : ''}`}
                  style={vars({ '--x': Math.cos(a).toFixed(4), '--y': Math.sin(a).toFixed(4), animationDelay: `${520 + i * 120}ms` })}
                >
                  <span className="cycle__tile">
                    <Icon name={d.icon} size={38} tone={focus === i ? 'accent' : 'ink'} />
                  </span>
                  <b className={Math.cos(a) < -0.2 ? 'is-left' : Math.cos(a) > 0.2 ? 'is-right' : Math.sin(a) < 0 ? 'is-top' : 'is-bottom'}>{d.title}</b>
                </span>
              )
            })}
          </Reveal>
          <ol className="cycle__list">
            {nodes.map((d, i) => (
              <Reveal key={d.title} build i={i * 0.6 + 4} className={`cycle__item${focus === i ? ' is-focus' : ''}`}>
                <span className="cycle__n">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3>
                    {d.title}
                    {d.tag && <code>{d.tag}</code>}
                  </h3>
                  <p>{d.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
        <SlideFoot source={source} i={9} />
      </div>
    </section>
  )
}
