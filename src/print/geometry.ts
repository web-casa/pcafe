import { handScale, phoneScale, standingScale } from './legibility'
import { MARK_GAP_MM, MARK_LEN_MM, PRESETS, SLUG_MM, TRIFOLD_A4, isLong, type PhysicalPreset } from './presets'
import type { PrintDef, Viewing } from './types'

export const PX_PER_MM = 96 / 25.4
export const mmToPx = (mm: number) => mm * PX_PER_MM

/** Which box the page shows. proof: the finished piece. bleed: trim + bleed. print: bleed, marks and the room they need. */
export type PageMode = 'proof' | 'bleed' | 'print'

export interface PageGeom {
  id: string
  label: string
  /** Fold positions from the left edge of the trim, in mm. */
  folds: number[]
}

export interface Geometry {
  format: PrintDef['format']
  preset: string
  label: string
  trimW: number
  trimH: number
  bleed: number
  safe: number
  dpi: number
  pngDpi: number
  /** Roll-up: what the hardware hides. Zero elsewhere. */
  hiddenBottom: number
  topBar: number
  visibleH: number
  slug: number
  markGap: number
  markLen: number
  pages: PageGeom[]
  viewing?: Viewing
  /** Font-size floors in mm, the ones the templates build from. */
  tiers: { head: number; headLatin: number; read: number; fine: number }
  /** Padding of the live area from the trim, in mm. */
  inset: { top: number; right: number; bottom: number; left: number }
}

export function geometry(def: PrintDef): Geometry {
  const preset = PRESETS[def.preset]
  if (!preset) throw new Error(`unknown print preset "${def.preset}". See src/print/presets.ts.`)
  if (preset.format !== def.format) throw new Error(`preset "${def.preset}" is for ${preset.format}, the item is ${def.format}`)
  const base = { slug: SLUG_MM, markGap: MARK_GAP_MM, markLen: MARK_LEN_MM, preset: def.preset, label: preset.label, format: def.format }
  if (isLong(preset)) {
    const w = preset.widthPx / PX_PER_MM
    return { ...base, trimW: w, trimH: 0, bleed: 0, safe: 0, dpi: def.targetDpi ?? 96, pngDpi: 96, hiddenBottom: 0, topBar: 0, visibleH: 0, pages: [{ id: 'long', label: '长图', folds: [] }], tiers: phoneScale(preset.widthPx), inset: { top: 0, right: 0, bottom: 0, left: 0 } }
  }
  const p = preset as PhysicalPreset
  const dpi = def.targetDpi ?? p.dpi
  if (def.format === 'rollup') {
    const hiddenBottom = def.hiddenBottomMm ?? p.hiddenBottomMm ?? 0
    const topBar = def.topBarMm ?? p.topBarMm ?? 0
    const trimH = p.heightMm + hiddenBottom + topBar
    return { ...base, trimW: p.widthMm, trimH, bleed: p.bleedMm, safe: p.safeMm, dpi, pngDpi: p.pngDpi, hiddenBottom, topBar, visibleH: p.heightMm, pages: [{ id: 'front', label: '正面', folds: [] }], viewing: def.viewing, tiers: standingScale(def.viewing, 2), inset: { top: topBar + p.safeMm, right: p.safeMm, bottom: hiddenBottom + p.safeMm, left: p.safeMm } }
  }
  if (def.format === 'trifold') {
    const o = TRIFOLD_A4.outside
    const i = TRIFOLD_A4.inside
    return { ...base, trimW: p.widthMm, trimH: p.heightMm, bleed: p.bleedMm, safe: p.safeMm, dpi, pngDpi: p.pngDpi, hiddenBottom: 0, topBar: 0, visibleH: p.heightMm, pages: [{ id: 'outside', label: '外面（封面朝上）', folds: [o.flap, o.flap + o.back] }, { id: 'inside', label: '里面（翻开后）', folds: [i.left, i.left + i.middle] }], tiers: handScale(), inset: { top: p.safeMm, right: p.safeMm, bottom: p.safeMm, left: p.safeMm } }
  }
  const viewing = def.format === 'poster' ? def.viewing : undefined
  return { ...base, trimW: p.widthMm, trimH: p.heightMm, bleed: p.bleedMm, safe: p.safeMm, dpi, pngDpi: p.pngDpi, hiddenBottom: 0, topBar: 0, visibleH: p.heightMm, pages: [{ id: 'front', label: '正面', folds: [] }], viewing, tiers: standingScale(viewing!, viewing?.baselineM ?? 1.4), inset: { top: p.safeMm, right: p.safeMm, bottom: p.safeMm, left: p.safeMm } }
}

/** Page size and where the trim sits on it, in mm. */
export function pageBox(g: Geometry, mode: PageMode, longH?: number) {
  const off = mode === 'print' ? g.bleed + g.slug : mode === 'bleed' ? g.bleed : 0
  const trimH = g.format === 'long' ? (longH ?? 0) : g.trimH
  // A roll-up's proof shows what people will see: no top bar, no cassette.
  const cut = mode === 'proof' && g.format === 'rollup'
  return { w: g.trimW + 2 * off, h: cut ? g.visibleH : trimH + 2 * off, x: off, y: cut ? -g.topBar : off }
}
