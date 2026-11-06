// Keynote deck for phase 4, in the `keynote` preset (dark by default). Figures
// come from this project's own files on 2026-10-30.

import type { DeckDef } from '../../kit'
import { RevealStatement, BarChart, Closing, CountCompare, KeyReveal, KeySpec, StatRow, Statement } from '../../kit'

export const deck: DeckDef = {
  title: 'PCafe 发布',
  iconStyle: 'line-duotone',
  theme: 'violet',
  style: 'keynote',
  transition: 'zoom',
  slides: [
    {
      id: 'reveal',
      label: '封面',
      render: () => (
        <KeyReveal
          kicker="PCafe · 第 4 期"
          title={['十种新风格，', '一个文件。']}
          marks={['十种新风格']}
          sub="同一套模板，换一行 style 就换一身衣服。"
          facts={[
            { value: '103', label: '个模板' },
            { value: '121', label: '个图标' },
            { value: '6.1 MB', label: '单文件' },
          ]}
          source="src/kit/catalog.ts；src/kit/icon-set.ts；npm run check 构建输出"
        />
      ),
    },
    {
      id: 'scale',
      label: '规模',
      render: () => (
        <StatRow
          kicker="规模"
          title={['四个数，', '说清这套模板']}
          stats={[
            { value: '103', label: 'templates', note: '第 4 期开始前的模板总数' },
            { value: '121', label: 'icons', note: '精选图标，名称写在 icon-set.ts' },
            { value: '6', label: 'icon series', note: '整份演示统一一种图标系列' },
            { value: '5', label: 'themes', note: '绯红、橙、钴蓝、翠绿、紫' },
          ]}
          names={['React 19', 'Vite 8', 'motion']}
          source="src/kit/catalog.ts；src/kit/icon-set.ts；src/kit/Icon.tsx；src/kit/theme.ts；package.json"
        />
      ),
    },
    {
      id: 'size',
      label: '单文件',
      build: 'reveal',
      render: () => (
        <KeySpec
          kicker="单文件"
          title="整份演示，就是一个 HTML"
          value="6.1"
          unit="MB"
          caption="dist/index.html，字体、脚本、截图全部内嵌"
          specs={[
            { value: '≈3.6 MB', label: '内嵌字体' },
            { value: '0', label: '远程请求' },
            { value: '1920×1080', label: '固定画布' },
          ]}
          source="npm run check 构建输出；docs/README.md 第 6 节"
        />
      ),
    },
    {
      id: 'offline',
      label: '一句话',
      render: () => (
        <Statement
          kicker="放映"
          text={['双击打开，', '离线就能放映。']}
          marks={['离线']}
          sub="构建产物可以直接发给别人，用浏览器打开。"
          source="docs/README.md 第 9 节"
        />
      ),
    },
    {
      id: 'reveal',
      label: '逐字',
      render: () => <RevealStatement kicker="一句话" text={['把演示做成', '一个单文件 HTML']} sub="离线打开，不需要网络。" source="docs/README.md 第 9 节" />,
    },
    {
      id: 'decks',
      label: '参考演示',
      render: () => (
        <BarChart
          kicker="参考演示"
          title={['最长的一份，', '写了 31 页']}
          categories={['Lumen', 'GEO', 'GTM', 'Launch', 'Mono', 'Toy3d']}
          series={[{ name: '页数', values: [25, 31, 30, 13, 13, 10] }]}
          unit=" 页"
          focus={1}
          note="长版分章写，短版 6–8 页就够。"
          source="docs/README.md 文档表"
        />
      ),
    },
    {
      id: 'font',
      label: '最小字号',
      tone: 'light',
      build: 'reveal',
      render: () => (
        <KeySpec
          kicker="QA"
          title="字再小，也不低于这个数"
          value="17"
          unit="u"
          caption="最小字号，QA 在每一页上自动检查"
          specs={[
            { value: '4', label: '种窗口尺寸' },
            { value: '72u', label: '左右安全边距' },
            { value: '140u', label: '顶部安全边距' },
          ]}
          source="docs/README.md 第 6、8 节；src/styles/slides.css .frame"
        />
      ),
    },
    {
      id: 'styles',
      label: '风格数',
      render: () => (
        <CountCompare
          kicker="这一期"
          title={['风格从 9 种，', '增加到 19 种']}
          before={{ label: '第 3 期结束', value: 9, unit: '种', note: 'standard 到 wallpaper' }}
          after={{ label: '第 4 期结束', value: 19, unit: '种', note: '第 4 期新增十种' }}
          change="+10 种"
          source="src/kit/theme.ts STYLES；src/kit/styles/"
        />
      ),
    },
    {
      id: 'close',
      label: '结论',
      render: () => (
        <Closing
          kicker="结论"
          mark="19"
          statement="换风格，只改一行。"
          follow="先在 #/kit/styles 看样张，再写 DeckDef.style。"
          takeaways={[
            '风格只换标题字体、圆角和底色，模板的内容上限照旧有效。',
            '发布风格默认整份深色，个别页写 tone: light 换回白底。',
            '交付前跑 npm run check，看到 PASS 再逐页看截图。',
          ]}
          refs={['docs/README.md §13', 'src/kit/theme.ts', 'AGENTS.md']}
        />
      ),
    },
  ],
}
