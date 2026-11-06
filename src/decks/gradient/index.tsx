// Gradient deck for phase 4, in the `gradient` preset. Figures come from this
// project's own files on 2026-10-30. The orb and the card panels are decoration.

import type { DeckDef } from '../../kit'
import { Closing, Donut, GradientCards, OrbCover, Statement, StepTrack } from '../../kit'

export const deck: DeckDef = {
  title: 'PCafe 流彩',
  iconStyle: 'line-duotone',
  theme: 'cobalt',
  style: 'gradient',
  slides: [
    {
      id: 'cover',
      label: '封面',
      render: () => (
        <OrbCover
          kicker="配色 × 风格"
          title={['三个开关，', '换一身', '新衣服']}
          lead="配色、风格、图标系列各写一行，模板和页面内容都不用动。"
          chips={[
            { value: '5', label: '套配色' },
            { value: '6', label: '种图标系列' },
            { value: '33', label: '种风格' },
          ]}
          source="src/kit/theme.ts；src/kit/Icon.tsx"
        />
      ),
    },
    {
      id: 'switches',
      label: '三个开关',
      build: 'reveal',
      render: () => (
        <GradientCards
          kicker="三个开关"
          title={['整份演示的外观，', '写在三个字段里']}
          lead="三个字段互相独立，任意组合。不要在 deck 或模板里写死颜色。"
          items={[
            { icon: 'stars', tag: 'DeckDef.theme', title: '配色', body: '强调色和底色一起换，五套里选一套，不写就用默认的绯红。' },
            { icon: 'text', tag: 'DeckDef.style', title: '风格', body: '换标题字体、圆角和卡片底色，正文、字号和间距都不变。' },
            { icon: 'widget', tag: 'DeckDef.iconStyle', title: '图标系列', body: '整份演示统一用一种系列，不写时用默认的线条双色。' },
          ]}
          source="AGENTS.md；docs/README.md 第 12、13 节"
        />
      ),
    },
    {
      id: 'bundle',
      label: '打包构成',
      render: () => (
        <Donut
          kicker="打包构成"
          title={['一个文件，', '六成是字体']}
          center={{ value: '6.1', label: 'MB · 单个 HTML' }}
          segments={[
            { label: '内嵌字体', value: 3.6, note: '只裁剪用到的字' },
            { label: '其余部分', value: 2.5, note: '脚本、样式、截图' },
          ]}
          unit=" MB"
          decimals={1}
          source="npm run check 构建输出；docs/README.md 第 0 节"
        />
      ),
    },
    {
      id: 'pick',
      label: '怎么选',
      build: 'reveal',
      render: () => (
        <StepTrack
          kicker="怎么选"
          title="选风格，按四步走"
          steps={[
            { title: '看样张', body: '打开风格样张墙，同一页按每种风格各排一遍。', cmd: '#/kit/styles' },
            { title: '写风格', body: '在 deck 文件的 DeckDef 上写风格名称。', cmd: "style: 'gradient'", config: true },
            { title: '配颜色', body: '挑一套强调色，底色会跟着一起换。', cmd: "theme: 'cobalt'", config: true },
            { title: '跑检查', body: '最后一行输出 PASS 才算完成。', cmd: 'npm run check' },
          ]}
          after={{ label: '也可以单独跑', cmds: ['npm run qa', 'npm run docs'] }}
          source="docs/README.md 第 13 节；AGENTS.md"
        />
      ),
    },
    {
      id: 'tones',
      label: '三种明暗',
      build: 'reveal',
      render: () => (
        <GradientCards
          kicker="明暗"
          title={['同一页，', '三种明暗']}
          lead="明暗写在 SlideDef.tone，只用在手册列出的几个模板上。"
          items={[
            { icon: 'lightbulb', tag: 'default', title: '浅色页', body: '大多数页面的默认状态，所有模板都在浅色下检查过。' },
            { icon: 'eye', tag: "tone: 'dark'", title: '深色页', body: '放在每章的首尾形成节奏，不超过整份演示的三分之一。' },
            { icon: 'bolt', tag: "tone: 'accent'", title: '强调色整页', body: '整页铺满主题色，是最强的停顿，一份演示最多两页。' },
          ]}
          source="docs/README.md 第 13 节"
        />
      ),
    },
    {
      id: 'accent',
      label: '一句话',
      tone: 'accent',
      render: () => (
        <Statement
          kicker="停顿"
          text={['强调色整页，', '一份最多两页。']}
          marks={['两页']}
          sub="只用在 Statement、SectionBreak、Closing 上。"
          source="docs/README.md 第 13 节"
        />
      ),
    },
    {
      id: 'close',
      label: '结论',
      render: () => (
        <Closing
          kicker="结论"
          statement="外观交给三个字段。"
          follow="内容照旧守住每个模板的上限。"
          takeaways={[
            '配色、风格、图标系列各写一行，互相独立，可以任意组合。',
            '先在样张墙上并排比较，再决定用哪种风格。',
            '深色页不超过三分之一，强调色整页最多两页。',
          ]}
          refs={['docs/README.md §13', 'src/kit/theme.ts', 'AGENTS.md']}
        />
      ),
    },
  ],
}
