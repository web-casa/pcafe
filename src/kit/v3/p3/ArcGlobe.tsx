import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from '../../shared'
import { GlobeBase, arcPath, point, type LonLat } from './globe'

export interface ArcPlace {
  /** ≤ 6 CJK characters. */
  name: string
  lon: number
  lat: number
  /** ≤ 14 CJK characters, shown in the list. */
  note?: string
}

export interface ArcGlobeProps extends SlideBase {
  /** Where every arc starts. name ≤ 6 CJK characters. */
  hub: ArcPlace
  /** 2–8 destinations on the side of the globe that faces `center`. With build, each arc and its row arrive together. */
  places: ArcPlace[]
  /** Longitude/latitude the globe faces; defaults to the hub. */
  center?: LonLat
  /** Heading above the list, ≤ 10 CJK characters. */
  listTitle?: string
}

const R = 300

/** An offline dot globe with glowing great-circle arcs from one hub to several places, plus a list. */
export function ArcGlobe({ kicker, title, lead, source, hint, hub, places, center, listTitle }: ArcGlobeProps) {
  const c: LonLat = center ?? [hub.lon, hub.lat]
  const h = point(c, [hub.lon, hub.lat], R)
  return (
    <section className="slide">
      <Hint id="arcglobe">{hint}</Hint>
      <div className="frame s-chart">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="v33-arcg">
          <Reveal i={3} className="v33-arcg__map">
            <svg viewBox={`${-R * 1.25} ${-R * 1.25} ${R * 2.5} ${R * 2.5}`} className="nglobe" aria-hidden>
              <circle r={R * 1.18} className="nglobe__halo" />
              <GlobeBase center={c} R={R} />
              {places.map((p, i) => {
                const q = point(c, [p.lon, p.lat], R)
                return (
                  <g key={p.name} data-build={`arc-${i}`} style={vars({ '--k': i })}>
                    <path d={arcPath(c, [hub.lon, hub.lat], [p.lon, p.lat], R)} pathLength={1} className="nglobe__arc" />
                    <circle cx={q.x} cy={q.y} r={6} className="nglobe__pt" />
                  </g>
                )
              })}
              <circle cx={h.x} cy={h.y} r={11} className="nglobe__hub" />
            </svg>
          </Reveal>
          <div className="v33-arcg__list">
            {listTitle && (
              <Reveal i={4} className="v33-arcg__lt">
                {listTitle}
              </Reveal>
            )}
            <Reveal i={4} className="v33-arcg__hub">
              <i aria-hidden />
              <span>{hub.name}</span>
              {hub.note && <em>{hub.note}</em>}
            </Reveal>
            <ol>
              {places.map((p, i) => (
                <li key={p.name} data-build={`arc-${i}`}>
                  <b>{i + 1}</b>
                  <span>{p.name}</span>
                  {p.note && <em>{p.note}</em>}
                </li>
              ))}
            </ol>
          </div>
        </div>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
