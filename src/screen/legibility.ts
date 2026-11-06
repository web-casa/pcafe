import type { Venue } from './types'

// The size rule. Sources and reasoning are in plans/research-screen.md §1.
// scripts/screen-qa.mjs recomputes this on its own, so a mistake here cannot pass itself.

/** 2010 ADA Standards, Table 703.5.5: height of an uppercase "I" in mm. */
export function adaHeightMm(distanceMm: number, baselineMm: number) {
  const per = (over: number) => (Math.max(0, over) / 305) * 3.2
  if (baselineMm <= 1780) return distanceMm < 1830 ? 16 : 16 + per(distanceMm - 1830)
  if (baselineMm <= 3050) return distanceMm < 4570 ? 51 : 51 + per(distanceMm - 4570)
  return distanceMm < 6400 ? 75 : 75 + per(distanceMm - 6400)
}

/** Zhang et al. 2020: Chinese characters need to be 1.54 times larger for the same acuity reserve. */
export const CJK_FACTOR = 1.54

/** 16 arcmin at the near distance: Chen et al. 2023, floor for simplified Chinese on in-vehicle displays. */
export const FINE_ARCMIN = 16
/** Our own floor, so small print still has enough pixels on a coarse LED wall. Not from a standard. */
export const FINE_MIN_PX = 22

/** Physical size of one design pixel. The 1920 side of the design canvas is the panel's long edge. */
export function mmPerDesignPx(v: Venue) {
  const long = v.longEdgeMm ?? (v.diagonalIn ?? 55) * 25.4 * (16 / Math.hypot(16, 9))
  return long / 1920
}

/** Minimum glyph heights in mm for this venue. */
export function minHeights(v: Venue) {
  const ada = adaHeightMm(v.distanceM * 1000, (v.baselineM ?? 1.4) * 1000)
  const near = (v.nearM ?? 1.5) * 1000
  return { latin: ada, cjk: ada * CJK_FACTOR, fine: 2 * near * Math.tan(((FINE_ARCMIN / 60) * Math.PI) / 360) }
}

// Glyph height as a share of the font size, slightly under what the embedded faces measure, so
// the computed font size clears the rule.
const CJK_RATIO = 0.84
const LATIN_RATIO = 0.68

/** Font sizes in design px for this venue. The templates build everything from these. */
export function typeScale(v: Venue) {
  const k = mmPerDesignPx(v)
  const h = minHeights(v)
  return {
    read: Math.ceil(h.cjk / k / CJK_RATIO),
    readLatin: Math.ceil(h.latin / k / LATIN_RATIO),
    fine: Math.max(FINE_MIN_PX, Math.ceil(h.fine / k / CJK_RATIO)),
  }
}
