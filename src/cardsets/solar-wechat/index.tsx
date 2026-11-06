// 公众号 头条 and 次条. The article title sits next to the image, so the image carries only the hook.
import type { CardSetDef } from '../../cards'
import { SOLAR, SRC_ZH } from '../solar-story'

export const set: CardSetDef = {
  title: '太阳能十年：公众号封面',
  preset: 'wechat-head',
  theme: 'amber',
  cards: [
    {
      t: 'wide',
      lines: ['约 11 倍'],
      mark: [0],
      sub: '太阳能这十年',
      motif: { kind: 'bars', values: SOLAR },
      source: SRC_ZH,
    },
    {
      t: 'cover',
      preset: 'wechat-thumb',
      lines: ['11倍'],
      source: SRC_ZH,
    },
  ],
}
