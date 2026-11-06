// B站 cover. Sources conflict on the size (see plans/research-cards.md), so it ships in both ratios.
import type { CardSetDef, CardDef } from '../../cards'
import { SOLAR, SRC_ZH } from '../solar-story'

const cover: CardDef = {
  t: 'wide',
  lines: ['太阳能 ×11', '煤电反而更多'],
  sub: '全球发电量，2015–2025',
  mark: [1],
  motif: { kind: 'bars', values: SOLAR },
  source: `约 10.9 倍。${SRC_ZH}`,
}

export const set: CardSetDef = {
  title: '太阳能十年：B站封面',
  preset: 'bili-wide',
  theme: 'amber',
  cards: [cover, { ...cover, preset: 'bili-mobile' }],
}
