// Pop deck for phase 4, in the `pop` preset. Figures come from this project's
// own files on 2026-10-30. The badge tilt and halftone dots are decoration.

import type { DeckDef } from '../../kit'
import { BarChart, BlockStats, Checklist, Closing, NumberedColumns, PopPoster, Statement } from '../../kit'

export const deck: DeckDef = {
  title: 'PCafe 波普',
  iconStyle: 'line-duotone',
  theme: 'amber',
  style: 'pop',
  slides: [
    {
      id: 'poster',
      label: '封面',
      render: () => (
        <PopPoster
          kicker="交付规则"
          title={['不出 PASS，', '就不交付']}
          mark="PASS"
          badge={{ value: '4', label: '种窗口' }}
          tags={['1920×1080', '1366×768', '2560×1440', '1440×900']}
          source="AGENTS.md；docs/README.md 第 8 节"
        />
      ),
    },
    {
      id: 'numbers',
      label: '四个数',
      build: 'reveal',
      render: () => (
        <BlockStats
          kicker="硬指标"
          title={['四个数，', '每页都要守住']}
          lead="这些数写在模板和 QA 里，内容只要不超上限就不会碰到。"
          stats={[
            { value: '17', unit: 'u', label: '最小字号', note: 'QA 逐页检查，更小就报错' },
            { value: '72', unit: 'u', label: '左右边距', note: '内容不能越过两侧安全线' },
            { value: '140', unit: 'u', label: '顶部边距', note: '给页眉和页码留出位置' },
            { value: '96', unit: 'u', label: '底部边距', note: '给来源和进度条留出位置' },
          ]}
          source="docs/README.md 第 6 节；src/styles/slides.css .frame"
        />
      ),
    },
    {
      id: 'copy',
      label: '文案规则',
      build: 'reveal',
      render: () => (
        <NumberedColumns
          kicker="文案规则"
          title="三个字段，三种写法"
          items={[
            { tag: 'title ≤ 16 字', title: '标题是观点', body: '标题写这一页要证明的结论，不写话题。' },
            { tag: 'kicker 2–8 字', title: '小标签是话题', body: '标题上方的小字只写话题，例如“支持周期”“升级前”。' },
            { tag: 'lead ≤ 60 字', title: '导语是证据', body: '一到两句证据或背景，不要把标题换个说法再讲一遍。' },
          ]}
          source="docs/README.md 第 5 节"
        />
      ),
    },
    {
      id: 'twice',
      label: '用两次',
      render: () => (
        <PopPoster
          kicker="选模板"
          title={['同一个模板，', '最多用两次']}
          mark="两次"
          badge={{ value: '1', label: '次 Bento' }}
          tags={['相邻页不重复', '章节页每章一次']}
          source="docs/README.md 第 1、2 节"
        />
      ),
    },
    {
      id: 'growth',
      label: '模板数',
      render: () => (
        <BarChart
          kicker="模板数"
          title={['三期下来，', '模板到了 103 个']}
          categories={['第 1 期', '第 2 期', '第 3 期']}
          series={[{ name: '模板总数', values: [67, 86, 103] }]}
          unit=" 个"
          focus={2}
          note="每期结束时的累计数。"
          source="src/decks/mono、src/decks/toy3d 封面；src/kit/catalog.ts"
        />
      ),
    },
    {
      id: 'checks',
      label: '交付前',
      build: 'reveal',
      render: () => (
        <Checklist
          kicker="交付前"
          title="交付之前，逐项打勾"
          items={[
            { title: '每个事实都有出处', cmd: "source: 'docs/README.md 第 5 节'", note: '查不到的不写，估算标明' },
            { title: '字段不超内容上限', cmd: 'docs/components.md', note: '放不下就拆页，不要缩字号' },
            { title: '图标只用精选集', cmd: '#/kit/icons', note: '名称写错会报类型错误' },
            { title: '颜色交给配色', cmd: "theme: 'amber'", note: '不在 deck 或模板里写死颜色' },
            { title: '自动检查通过', cmd: 'npm run check', note: '最后一行输出 PASS' },
            { title: '逐页看过截图', cmd: 'qa/slide-NN-1920x1080.png', note: '不空、不挤、重点突出' },
          ]}
          source="AGENTS.md；docs/README.md 第 1、8 节"
        />
      ),
    },
    {
      id: 'split',
      label: '一句话',
      tone: 'accent',
      render: () => (
        <Statement
          kicker="放不下"
          text={['放不下就拆页，', '不要缩字号。']}
          marks={['拆页']}
          sub="每页只证明一个观点。"
          source="AGENTS.md；docs/README.md 第 2 节"
        />
      ),
    },
    {
      id: 'close',
      label: '结论',
      render: () => (
        <Closing
          kicker="结论"
          mark="4"
          statement="看到 PASS 再交付。"
          follow="然后逐页看一遍截图。"
          takeaways={[
            '字号、边距、内容上限都写在模板里，内容守住上限就不会破版。',
            '同一个模板最多用两次，相邻两页的模板不要重复。',
            '放不下就拆页，每页只证明一个观点，不要缩字号硬塞。',
          ]}
          refs={['AGENTS.md', 'docs/README.md §1–§8', 'docs/components.md']}
        />
      ),
    },
  ],
}
