import { Kicker, Reveal } from '../deck/primitives'
import { Icon, type IconName } from './Icon'
import { IconTile, type Spot } from './parts'
import { Hint, Lines, SlideFoot, type SlideBase } from './shared'

export interface OrbitNode {
  icon: IconName
  /** ≤ 6 CJK characters. */
  label: string
}

export interface OrbitProps extends SlideBase {
  /** The centre: what everything connects to. */
  center: { icon: IconName; label: string }
  /** 4–8 nodes, placed on two rings. */
  nodes: OrbitNode[]
  /** 0–3 points under the lead, ≤ 22 CJK characters. */
  points?: string[]
}

// Angles (deg, 0 = right, clockwise) and ring for each node, in order.
const PLACES = [
  { a: -60, r: 1 },
  { a: 20, r: 2 },
  { a: 130, r: 1 },
  { a: 200, r: 2 },
  { a: 80, r: 1 },
  { a: -110, r: 2 },
  { a: 250, r: 1 },
  { a: -15, r: 1 },
]

/** One thing at the centre and what connects to it on rings around it: an ecosystem or integrations. */
export function Orbit({ kicker, title, lead, source, hint, center, nodes, points = [] }: OrbitProps) {
  return (
    <section className="slide">
      <Hint id="orbit">{hint}</Hint>
      <div className="frame s-orbit">
        <div className="orbit__copy">
          <Reveal i={0}>
            <Kicker>{kicker}</Kicker>
          </Reveal>
          <Reveal i={1}>
            <h2 className="s-title">
              <Lines text={title} />
            </h2>
          </Reveal>
          {lead && (
            <Reveal i={2} className="s-lead">
              {lead}
            </Reveal>
          )}
          {points.length > 0 && (
            <Reveal i={3} className="orbit__points">
              {points.map((p) => (
                <span key={p}>
                  <Icon name="check" size={24} tone="accent" />
                  {p}
                </span>
              ))}
            </Reveal>
          )}
          <SlideFoot source={source} i={9} />
        </div>
        <Reveal i={2} y={0} className="orbit">
          <i className="orbit__ring orbit__ring--1" />
          <i className="orbit__ring orbit__ring--2" />
          <i className="orbit__ring orbit__ring--3" />
          <div className="orbit__center">
            <IconTile icon={center.icon} spot={6} size={96} />
            <b>{center.label}</b>
          </div>
          {nodes.slice(0, 8).map((n, i) => {
            const p = PLACES[i]
            return (
              <div key={n.label} className="orbit__node" data-build={i} style={{ ['--a' as string]: `${p.a}deg`, ['--r' as string]: p.r, ['--k' as string]: i }}>
                <IconTile icon={n.icon} spot={(((i + 1) % 6) + 1) as Spot} size={60} />
                <span>{n.label}</span>
              </div>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}
