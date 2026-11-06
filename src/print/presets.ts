import type { PrintFormat, SliceName } from './types'

// Every size in millimetres is the source of truth. Reasons and sources for each number are in
// plans/research-print.md. scripts/print-qa.mjs keeps its own copy of this table on purpose, so a
// typo here cannot pass itself.

export interface PhysicalPreset {
  format: Exclude<PrintFormat, 'long'>
  label: string
  /** Finished size after cutting, in mm. A roll-up's trim adds what the hardware hides. */
  widthMm: number
  heightMm: number
  bleedMm: number
  /** Text and anything that matters stays this far inside the trim. */
  safeMm: number
  /** Effective resolution every raster in the PDF has to reach. */
  dpi: number
  /** Resolution of the exported PNG. It is a preview; the PDF is the print master. */
  pngDpi: number
  /** Roll-up only: what the cassette swallows and what the top bar holds. */
  hiddenBottomMm?: number
  topBarMm?: number
}

export interface LongPreset {
  format: 'long'
  label: string
  widthPx: number
}

export const PRESETS: Record<string, PhysicalPreset | LongPreset> = {
  'poster-a3': { format: 'poster', label: 'A3', widthMm: 297, heightMm: 420, bleedMm: 3, safeMm: 8, dpi: 300, pngDpi: 300 },
  'poster-a2': { format: 'poster', label: 'A2', widthMm: 420, heightMm: 594, bleedMm: 3, safeMm: 10, dpi: 200, pngDpi: 200 },
  'poster-a1': { format: 'poster', label: 'A1', widthMm: 594, heightMm: 841, bleedMm: 3, safeMm: 12, dpi: 150, pngDpi: 150 },
  'poster-50x70': { format: 'poster', label: '50 × 70 cm', widthMm: 500, heightMm: 700, bleedMm: 3, safeMm: 12, dpi: 150, pngDpi: 150 },
  'rollup-80x200': { format: 'rollup', label: '易拉宝 80 × 200 cm', widthMm: 800, heightMm: 2000, bleedMm: 3, safeMm: 30, dpi: 150, pngDpi: 100, hiddenBottomMm: 150, topBarMm: 10 },
  'rollup-60x160': { format: 'rollup', label: '易拉宝 60 × 160 cm', widthMm: 600, heightMm: 1600, bleedMm: 3, safeMm: 25, dpi: 150, pngDpi: 100, hiddenBottomMm: 150, topBarMm: 10 },
  'rollup-85x200': { format: 'rollup', label: '易拉宝 85 × 200 cm', widthMm: 850, heightMm: 2000, bleedMm: 3, safeMm: 30, dpi: 150, pngDpi: 100, hiddenBottomMm: 150, topBarMm: 10 },
  'trifold-a4': { format: 'trifold', label: 'A4 三折页', widthMm: 297, heightMm: 210, bleedMm: 3, safeMm: 5, dpi: 300, pngDpi: 300 },
  'long-1080': { format: 'long', label: '信息长图 1080 px', widthPx: 1080 },
  'long-750': { format: 'long', label: '信息长图 750 px', widthPx: 750 },
}

/** A4 tri-fold, flat, left to right. The fold-in panel is 3 mm narrower. plans/research-print.md §4. */
export const TRIFOLD_A4 = {
  outside: { flap: 97, back: 100, cover: 100 },
  inside: { left: 100, middle: 100, right: 97 },
  /** Text stays this far from a fold on both sides. Ours, not a standard. */
  foldClearMm: 4,
}

/** Room outside the bleed for the crop marks. Marks must not sit inside the bleed, or they would print. */
export const SLUG_MM = 8
/** Crop marks start this far from the bleed edge and run this long. */
export const MARK_GAP_MM = 1
export const MARK_LEN_MM = 5

/** Slice profiles for a long image. `exact` means every slice has that height; otherwise it is a ceiling. */
export const SLICES: Record<SliceName, { label: string; widthPx?: number; maxH: number; exact: boolean; maxCount?: number }> = {
  wechat: { label: '公众号，段内每张 ≤ 3000 px', maxH: 3000, exact: false },
  xhs: { label: '小红书 3:4，1080 × 1440，最多 18 张', widthPx: 1080, maxH: 1440, exact: true, maxCount: 18 },
}

export const isLong = (p: PhysicalPreset | LongPreset): p is LongPreset => p.format === 'long'
