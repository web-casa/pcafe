// Link and video previews in English: YouTube, Open Graph, X. Left-aligned, because no central crop applies.
import type { CardDef, CardSetDef } from '../../cards'
import { COAL, SOLAR, SRC_EN } from '../solar-story'

const card: CardDef = {
  t: 'wide',
  align: 'left',
  // Both ratios calculated from the data: 10.86 times, and coal up 12.8%.
  lines: ['Solar ×11', `Coal +${Math.round((COAL[10] / COAL[0] - 1) * 100)}%`],
  mark: [0],
  sub: 'Global electricity, 2015–2025',
  motif: { kind: 'bars', values: SOLAR },
  source: `Solar about 10.9x. ${SRC_EN}`,
}

export const set: CardSetDef = {
  title: 'Solar in ten years: link and video previews',
  preset: 'yt-thumb',
  theme: 'amber',
  lang: 'en',
  cards: [card, { ...card, preset: 'og-image' }, { ...card, preset: 'x-card' }],
}
