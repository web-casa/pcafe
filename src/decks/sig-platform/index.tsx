import type { DeckDef } from '../../kit'
import { PriorityColumns, Statement } from '../../kit'

export const deck: DeckDef = {
  title: '宣言 · 专属版式',
  iconStyle: 'line-duotone',
  theme: 'cobalt',
  style: 'platform',
  slides: [
    {
      id: 'priorities',
      label: '三栏重点',
      build: 'reveal',
      render: () => (
        <PriorityColumns
          kicker="底线"
          title={['写演示的', '三条底线']}
          lead="写任何一份演示都要守住这三条，其余都可以商量。"
          items={[
            { tag: '版式', title: '只组合模板', body: '版式交给模板，不写自定义样式，不缩字号。' },
            { tag: '事实', title: '写明出处', body: '数字和引语都要有来源，查不到的不写。' },
            { tag: '质量', title: '检查通过', body: 'check 输出 PASS，再逐页看过截图。' },
          ]}
          source="skills/pcafe/SKILL.md"
        />
      ),
    },
    {
      id: 'about',
      label: '这种风格',
      render: () => (
        <Statement
          kicker="宣言 · PriorityColumns"
          text={['三件事，', '说到做到。']}
          sub="超大编号、一栏主题色，适合动员、宣言和季度重点。"
        />
      ),
    },
  ],
}
