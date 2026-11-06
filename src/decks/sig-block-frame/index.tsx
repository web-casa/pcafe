import type { DeckDef } from '../../kit'
import { FramedStats, Statement } from '../../kit'
import { freeCatalog } from '../../kit/catalog'
import { STYLES, THEMES } from '../../kit/theme'

export const deck: DeckDef = {
  title: '粗框 · 专属版式',
  iconStyle: 'line-duotone',
  style: 'block-frame',
  slides: [
    {
      id: 'stats',
      label: '粗框数字',
      render: () => (
        <FramedStats
          kicker="一眼看全"
          title="这个引擎里有什么"
          lead="数字由组件目录和配置自动计数，模板增删后会跟着变。"
          stats={[
            { value: String(freeCatalog.length), label: '个模板' },
            { value: String(Object.keys(STYLES).length), label: '种风格' },
            { value: String(Object.keys(THEMES).length), label: '套配色' },
            { value: '4', label: '种语言的文档' },
          ]}
          source="src/kit/catalog.ts、src/kit/theme.ts；docs/ 下四种语言"
        />
      ),
    },
    {
      id: 'about',
      label: '这种风格',
      render: () => (
        <Statement
          kicker="粗框 · FramedStats"
          text={['粗黑边框，', '硬投影。']}
          sub="适合活动、产品发布这类要“大声说”的场合，数字盒配强调色圆点。"
        />
      ),
    },
  ],
}
