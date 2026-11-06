// Starter deck: copy this folder to start a new deck (docs/README.md §4).
// It imports nothing but the kit, so it compiles as-is. Replace every
// string, keep each field inside the limits in docs/components.md, and add
// slides from the reference deck (src/decks/release/index.tsx) as needed.

import type { DeckDef } from '../../kit'
import { Closing, Cover, NumberedColumns } from '../../kit'

export const deck: DeckDef = {
  title: 'Starter Deck',
  slides: [
    {
      id: 'cover',
      label: '封面',
      render: () => (
        <Cover
          kicker="Briefing · 主题简报"
          title="主题名称"
          subtitle="codename"
          lead="一句话说明这份演示讲什么、给谁看、看完能做什么。"
          facts={[
            { label: '日期', value: '2026.10' },
            { label: '页数', value: '3 页' },
            { label: '用时', value: '5 分钟' },
          ]}
          numeral="01"
          hint={
            <>
              按 <kbd>→</kbd> 或 <kbd>Space</kbd> 翻页
            </>
          }
        />
      ),
    },
    {
      id: 'points',
      label: '要点',
      render: () => (
        <NumberedColumns
          kicker="要点"
          title="标题写观点，不写话题"
          lead="导语给出背景或证据，一到两句。"
          items={[
            { tag: 'keyword-one', title: '第一个要点', body: '用一到两句话说明这个要点，写具体的名词和数字，不写空话。' },
            { tag: 'keyword-two', title: '第二个要点', body: '三个要点的分量相当，长度也尽量接近，这样三列的底边才整齐。' },
            { tag: 'keyword-three', title: '第三个要点', body: '有先后顺序的内容改用 StepTrack，有轻重之分的改用 SpotlightList。' },
          ]}
          source="docs/README.md §3"
        />
      ),
    },
    {
      id: 'closing',
      label: '结论',
      render: () => (
        <Closing
          kicker="结论"
          mark="01"
          statement="一句话写出要让听众记住的结论。"
          follow="第二句写行动：接下来谁做什么。"
          takeaways={['第一条要点，对应前面某一页。', '第二条要点，对应前面某一页。', '第三条要点，对应前面某一页。']}
          refs={['docs/README.md', 'docs/components.md']}
        />
      ),
    },
  ],
}
