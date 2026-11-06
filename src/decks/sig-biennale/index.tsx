import type { DeckDef } from '../../kit'
import { ExhibitCover, YearBars } from '../../kit'
import { WORLD_SOLAR } from '../v2-p4/data'

const OWID = 'Our World in Data，基于 Ember（2026）与 Energy Institute《世界能源统计年鉴》（2026）'
const ODD = [0, 2, 4, 6, 8, 10]

export const deck: DeckDef = {
  title: '双年展 · 专属版式',
  iconStyle: 'line-duotone',
  theme: 'cobalt',
  style: 'biennale',
  slides: [
    {
      id: 'cover',
      label: '展览封面',
      render: () => (
        <ExhibitCover
          kicker="风格样张 · 双年展"
          title={['太阳能的', '十年']}
          badge={['2015 —', '2025']}
          meta={[
            { label: '风格', value: 'biennale，窄衬线大标题' },
            { label: '版式来源', value: 'beautiful-html-templates（MIT）' },
            { label: '数据', value: 'Our World in Data' },
            { label: '模板', value: 'ExhibitCover、YearBars' },
          ]}
        />
      ),
    },
    {
      id: 'bars',
      label: '数字配年份条',
      render: () => (
        <YearBars
          kicker="全球太阳能发电"
          title="十年涨到约 11 倍"
          lead="左边两个大数字，右边按年份排的细条，最新一年高亮。"
          stats={[
            { value: '2,779', unit: 'TWh', label: '2025 年发电量', body: '2015 年是 256 TWh。' },
            { value: '8.7', unit: '%', label: '2025 年占全球发电', body: '2015 年约 1.1%。' },
          ]}
          bars={ODD.map((i) => ({ year: String(2015 + i), value: WORLD_SOLAR[i] }))}
          source={OWID}
        />
      ),
    },
  ],
}
