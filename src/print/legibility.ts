import { CJK_FACTOR, FINE_ARCMIN, adaHeightMm } from '../screen/legibility'
import type { Viewing } from './types'

// The size rule. Sources and reasoning are in plans/research-print.md §5.
// scripts/print-qa.mjs recomputes this on its own, so a mistake here cannot pass itself.

const CJK_RATIO = 0.84
const LATIN_RATIO = 0.68
const PT = 25.4 / 72

/** Glyph height in mm for `arcmin` at `distanceM`. */
export const arcminMm = (distanceM: number, arcmin = FINE_ARCMIN) => 2 * distanceM * 1000 * Math.tan(((arcmin / 60) * Math.PI) / 360)

/** Font sizes in mm for a piece read standing in front of it. */
export function standingScale(v: Viewing, baselineM: number) {
  const ada = adaHeightMm(v.distanceM * 1000, baselineM * 1000)
  const read = arcminMm(v.readM ?? 1.5)
  const fine = arcminMm(v.nearM ?? 0.8)
  return {
    head: Math.ceil(((ada * CJK_FACTOR) / CJK_RATIO) * 10) / 10,
    headLatin: Math.ceil((ada / LATIN_RATIO) * 10) / 10,
    read: Math.ceil((read / CJK_RATIO) * 10) / 10,
    fine: Math.ceil((fine / CJK_RATIO) * 10) / 10,
  }
}

/** A tri-fold is held in the hand, so its floors are print-trade point sizes rather than a distance. */
export const handScale = () => ({ head: 14 * PT, headLatin: 14 * PT, read: 9 * PT, fine: 7 * PT })

/** A long image is read full screen on a 390 px phone: the same floors as social cards (11 and 8 CSS px). */
export function phoneScale(widthPx: number) {
  const px = (css: number) => (css * (widthPx / 390) * 25.4) / 96
  return { head: px(24), headLatin: px(24), read: px(11.5), fine: px(8.5) }
}
