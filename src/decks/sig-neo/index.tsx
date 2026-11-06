import type { DeckDef } from '../../kit'
import { MetricMosaic, StepGrid } from '../../kit'

const OWID = 'Our World in Data，基于 Ember（2026）与 Energy Institute《世界能源统计年鉴》（2026）'

export const deck: DeckDef = {
  title: '荧光格 · 专属版式',
  iconStyle: 'line-duotone',
  theme: 'emerald',
  style: 'neo-grid',
  slides: [
    {
      id: 'mosaic',
      label: '数字拼格',
      render: () => (
        <MetricMosaic
          kicker="全球太阳能 · 2025"
          title={['十年，', '约十一倍']}
          lead="一张长条、一块标题、几块小数字和一块大数字，拼成一页。"
          side={{ value: '11×', label: '2015→2025 发电量' }}
          small={[
            { value: '8.7%', label: '占全球发电' },
            { value: '636', label: '2025 年新增 TWh' },
          ]}
          hero={{ value: '2,779', label: '2025 年发电量 · TWh' }}
          source={OWID}
        />
      ),
    },
    {
      id: 'steps',
      label: '下一步拼格',
      build: 'reveal',
      render: () => (
        <StepGrid
          kicker="下一步"
          title="三步做一份"
          steps={[
            { when: '今天', title: '建一个项目', body: '运行 init，在 src/decks 里新建一份演示。', meta: 'pcafe init' },
            { when: '写完后', title: '跑一遍检查', body: '直到最后一行输出 PASS，再逐页看截图。', meta: 'pcafe check' },
            { when: '演讲前', title: '导出备份', body: '带上 HTML，另存 PDF 或 PPTX 以防万一。', meta: 'pcafe pptx' },
          ]}
          source="docs/zh-CN/presenting.md"
        />
      ),
    },
  ],
}
