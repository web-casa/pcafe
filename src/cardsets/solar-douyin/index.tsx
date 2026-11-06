// 抖音 and 视频号 covers. Three-column profile grids are the smallest place these appear,
// so the longest line is kept to four characters.
import type { CardSetDef, CardDef } from '../../cards'
import { SOLAR } from '../solar-story'

const cover: CardDef = {
  t: 'cover',
  kicker: '全球电力数据',
  lines: ['太阳能', '十年涨到', '约 11 倍'],
  mark: [2],
  sub: '可煤电比十年前还多',
  motif: { kind: 'bars', values: SOLAR, ends: ['2015', '2025'] },
  source: '2015–2025 年发电量。数据：Our World in Data',
}

export const set: CardSetDef = {
  title: '太阳能十年：抖音与视频号封面',
  preset: 'douyin-cover',
  theme: 'amber',
  cards: [
    cover,
    { ...cover, preset: 'channels-portrait' },
  ],
}
