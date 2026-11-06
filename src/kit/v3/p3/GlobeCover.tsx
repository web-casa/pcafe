import { Kicker, Reveal } from '../../../deck/primitives'
import { Hint, Lines, vars, type Text } from '../../shared'
import { GlobeBase, arcPath, point, type LonLat } from './globe'

export interface GlobeCoverProps {
  kicker: string
  /** ≤ 2 lines × 10 CJK characters. */
  title: Text
  /** ≤ 50 CJK characters. */
  lead?: string
  /** 0–3 facts along the bottom: value ≤ 8 characters, label ≤ 10 CJK characters. */
  facts?: { value: string; label: string }[]
  /** Longitude/latitude the globe faces. */
  center: LonLat
  /** 0–8 decorative glowing arcs between places on the visible side. */
  arcs?: { from: LonLat; to: LonLat }[]
  source?: string
  hint?: string
}

const R = 400

/** Cover with an offline dot globe and slowly pulsing glowing arcs. The globe is decoration only. */
export function GlobeCover({ kicker, title, lead, facts = [], center, arcs = [], source, hint }: GlobeCoverProps) {
  return (
    <section className="slide v33-gcover">
      <Hint id="globecover">{hint}</Hint>
      <Reveal i={0} y={0} className="v33-gcover__globe">
        <div data-crop aria-hidden className="v33-gcover__clip">
        <svg viewBox={`${-R * 1.3} ${-R * 1.3} ${R * 2.6} ${R * 2.6}`} aria-hidden className="nglobe">
          <circle r={R * 1.22} className="nglobe__halo" />
          <GlobeBase center={center} R={R} />
          {arcs.map((a, i) => {
            const p = point(center, a.to, R)
            const q = point(center, a.from, R)
            return (
              <g key={i} style={vars({ '--k': i })}>
                <path d={arcPath(center, a.from, a.to, R)} pathLength={1} className="nglobe__arc nglobe__arc--loop" />
                <circle cx={q.x} cy={q.y} r={7} className="nglobe__pt" />
                <circle cx={p.x} cy={p.y} r={7} className="nglobe__pt" />
              </g>
            )
          })}
        </svg>
        </div>
      </Reveal>
      <div className="frame v33-gcover__frame">
        <Reveal i={1}>
          <Kicker>{kicker}</Kicker>
        </Reveal>
        <Reveal i={2}>
          <h1 className="s-title v33-gcover__title">
            <Lines text={title} />
          </h1>
        </Reveal>
        {lead && (
          <Reveal i={3}>
            <p className="s-lead v33-gcover__lead">{lead}</p>
          </Reveal>
        )}
        {facts.length > 0 && (
          <Reveal i={4} className="v33-gcover__facts">
            {facts.map((f) => (
              <div key={f.label}>
                <b>{f.value}</b>
                <span>{f.label}</span>
              </div>
            ))}
          </Reveal>
        )}
        {source && (
          <Reveal i={5} className="v33-gcover__src">
            <p className="s-source">来源 · {source}</p>
          </Reveal>
        )}
      </div>
    </section>
  )
}
