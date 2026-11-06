import { Reveal } from '../../../deck/primitives'
import { fmt } from '../../chart-util'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from '../../shared'
import { WORLD_GRID, WORLD_ROWS } from './world-dots'

export interface MapMarker {
  /** ≤ 6 CJK characters. */
  name: string
  lon: number
  lat: number
  /** Sets the marker size (area ∝ value) and is printed in the list. */
  value?: number
}

export interface DotMapProps extends SlideBase {
  /** 1–8 markers. With build, each marker and its list row arrive together. */
  markers: MapMarker[]
  unit?: string
  decimals?: number
  /** Heading above the list, ≤ 10 CJK characters. */
  listTitle?: string
}

const { step, lat0, lon0, cols, rows } = WORLD_GRID
const W = cols * 10
const H = rows * 10

// Land cells as one path of tiny round dots: one element instead of thousands.
const DOTS = WORLD_ROWS.map((hex, r) => {
  const bits = BigInt(`0x${hex}`).toString(2).padStart(cols, '0')
  let d = ''
  for (let c = 0; c < cols; c++) if (bits[c] === '1') d += `M${c * 10 + 5},${r * 10 + 5}h0`
  return d
}).join('')

const project = (lon: number, lat: number) => ({ x: ((lon - lon0) / (step * cols)) * W, y: ((lat0 - lat) / (step * rows)) * H })

/** An offline dot-grid world map (Natural Earth land, public domain) with sized markers and a ranked list. */
export function DotMap({ kicker, title, lead, source, hint, markers, unit = '', decimals = 0, listTitle }: DotMapProps) {
  const max = Math.max(1, ...markers.map((m) => m.value ?? 1))
  return (
    <section className="slide">
      <Hint id="dotmap">{hint}</Hint>
      <div className="frame s-chart">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="dmap">
          <Reveal i={3} className="dmap__map">
            <svg viewBox={`0 0 ${W} ${H}`} aria-hidden>
              <path d={DOTS} className="dmap__land" />
            </svg>
            {markers.map((m, i) => {
              const p = project(m.lon, m.lat)
              return (
                <span key={m.name} className="dmap__mk" data-build={`mk-${i}`} style={vars({ '--x': p.x / W, '--y': p.y / H, '--s': Math.sqrt((m.value ?? max) / max), '--k': i })}>
                  <i aria-hidden />
                  <b>{i + 1}</b>
                </span>
              )
            })}
          </Reveal>
          <div className="dmap__list">
            {listTitle && (
              <Reveal i={4} className="dmap__lt">
                {listTitle}
              </Reveal>
            )}
            <ol>
              {markers.map((m, i) => (
                <li key={m.name} data-build={`mk-${i}`}>
                  <b>{i + 1}</b>
                  <span>{m.name}</span>
                  {m.value !== undefined && (
                    <em>
                      {fmt(m.value, decimals)}
                      {unit}
                    </em>
                  )}
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
