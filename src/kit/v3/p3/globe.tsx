// Offline orthographic dot globe shared by GlobeCover and ArcGlobe.
// Land comes from the DotMap grid (Natural Earth 1:110m land, public domain).

import { WORLD_GRID, WORLD_ROWS } from '../../v2/p4/world-dots'

export type LonLat = [number, number]

const RAD = Math.PI / 180
const { step, lat0, lon0, cols } = WORLD_GRID

/** Land cell centres, decoded once. */
const LAND: LonLat[] = WORLD_ROWS.flatMap((hex, r) => {
  const bits = BigInt(`0x${hex}`).toString(2).padStart(cols, '0')
  const out: LonLat[] = []
  for (let c = 0; c < cols; c++) if (bits[c] === '1') out.push([lon0 + (c + 0.5) * step, lat0 - (r + 0.5) * step])
  return out
})

const vec = ([lon, lat]: LonLat) => [Math.cos(lat * RAD) * Math.cos(lon * RAD), Math.cos(lat * RAD) * Math.sin(lon * RAD), Math.sin(lat * RAD)]

/** Orthographic projection onto a unit disc; z > 0 is the visible side. */
export function makeProjection(center: LonLat) {
  const l0 = center[0] * RAD
  const p0 = center[1] * RAD
  const fromVec = ([vx, vy, vz]: number[]) => {
    const lat = Math.asin(Math.max(-1, Math.min(1, vz)))
    const lon = Math.atan2(vy, vx)
    const x = Math.cos(lat) * Math.sin(lon - l0)
    const y = Math.cos(p0) * Math.sin(lat) - Math.sin(p0) * Math.cos(lat) * Math.cos(lon - l0)
    const z = Math.sin(p0) * Math.sin(lat) + Math.cos(p0) * Math.cos(lat) * Math.cos(lon - l0)
    return { x, y: -y, z }
  }
  return { project: (p: LonLat) => fromVec(vec(p)), fromVec }
}

/** Land dots split into three depth bands (front, middle, limb) as single paths. */
export function landPaths(center: LonLat, R: number) {
  const { project } = makeProjection(center)
  const bands = ['', '', '']
  for (const p of LAND) {
    const q = project(p)
    if (q.z <= 0.02) continue
    const b = q.z > 0.6 ? 0 : q.z > 0.3 ? 1 : 2
    bands[b] += `M${(q.x * R).toFixed(1)},${(q.y * R).toFixed(1)}h0`
  }
  return bands
}

/** A great-circle arc from a to b, lifted off the surface, as an SVG path. */
export function arcPath(center: LonLat, a: LonLat, b: LonLat, R: number) {
  const { fromVec } = makeProjection(center)
  const va = vec(a)
  const vb = vec(b)
  const dot = Math.max(-1, Math.min(1, va[0] * vb[0] + va[1] * vb[1] + va[2] * vb[2]))
  const ang = Math.acos(dot) || 1e-6
  const lift = 0.04 + 0.22 * (ang / Math.PI)
  let d = ''
  const N = 48
  for (let i = 0; i <= N; i++) {
    const t = i / N
    const s1 = Math.sin((1 - t) * ang) / Math.sin(ang)
    const s2 = Math.sin(t * ang) / Math.sin(ang)
    const v = [0, 1, 2].map((k) => s1 * va[k] + s2 * vb[k])
    const q = fromVec(v)
    const r = R * (1 + lift * Math.sin(Math.PI * t))
    d += `${i ? 'L' : 'M'}${(q.x * r).toFixed(1)},${(q.y * r).toFixed(1)}`
  }
  return d
}

export function point(center: LonLat, p: LonLat, R: number) {
  const q = makeProjection(center).project(p)
  return { x: q.x * R, y: q.y * R, visible: q.z > 0 }
}

/** The globe disc, graticule-free: rim, depth-banded land dots. Decorative. */
export function GlobeBase({ center, R }: { center: LonLat; R: number }) {
  const [front, mid, limb] = landPaths(center, R)
  return (
    <>
      <circle r={R} className="nglobe__disc" />
      <path d={limb} className="nglobe__land nglobe__land--limb" />
      <path d={mid} className="nglobe__land nglobe__land--mid" />
      <path d={front} className="nglobe__land" />
      <circle r={R} className="nglobe__rim" />
    </>
  )
}
