// Mono deck for phase 2, in the `mono-studio` preset (dark by default).
// Every figure is measured from this project on 2026-10-30:
// - pages, tones, builds and template kinds: counted in src/decks/{release,geo,gtm,launch,studio}/index.tsx
// - bundle parts: sizes inside dist/index.html after `vite build` (base64 included)
// Screenshots are the real captures in ../studio/assets.

import type { DeckDef } from '../../kit'
import { BarChart, Bubble, CountCompare, Donut, Gauge, PillAgenda, QuoteArc, RepeatClosing, ServiceList, SplitWord, StatRow, WorkCards } from '../../kit'
import kit from '../studio/assets/shot-kit.webp'
import overview from '../studio/assets/shot-overview.webp'
import slide from '../studio/assets/shot-slide.webp'

const COUNTED = 'src/decks/release · geo · gtm · launch · studio 的 index.tsx，2026-10-30 统计'
const CH = ['规模', '构成', '节奏', '取舍']

export const deck: DeckDef = {
  title: 'PCafe / Mono',
  iconStyle: 'line-duotone',
  theme: 'crimson',
  style: 'mono-studio',
  slides: [
    {
      id: 'cover',
      label: '封面',
      render: () => (
        <SplitWord
          kicker="第 2 期 · 等宽黑"
          words={['DECK', 'KIT']}
          cards={[
            { label: '组件库', src: kit, alt: '组件库首页截图' },
            { label: '放映', src: slide, alt: 'GTM 演示封面的放映截图' },
            { label: '总览', src: overview, alt: '按 G 打开的总览截图' },
          ]}
          lead="用数字看这套模板：多少、由什么组成、节奏怎么排。"
          source="截图为本项目截图，2026-10-30"
        />
      ),
    },
    {
      id: 'ch1',
      label: '规模',
      render: () => <PillAgenda kicker="第一部分" chapters={CH} current={0} title={['先看规模']} lead="模板、演示、风格和图标，各有多少。下面的数字都来自项目文件，不是估算。" />,
    },
    {
      id: 'stats',
      build: 'reveal',
      label: '四个数',
      render: () => (
        <StatRow
          kicker="规模"
          title="四个数说清这套模板"
          stats={[
            { label: 'templates', value: '86', note: '每个都写明内容上限，放不下就拆页' },
            { label: 'decks', value: '7', note: '五份参考演示，加这一期的两份' },
            { label: 'styles', value: '7', note: '一行 style 切换，内容不动' },
            { label: 'icons', value: '121', note: 'Solar 图标，六个系列可选' },
          ]}
          names={['React 19', 'Vite 8', 'motion', 'Playwright', 'Solar Icons', '思源黑体', 'Geist']}
          source="src/kit/catalog.ts · src/kit/theme.ts · src/kit/icon-set.ts · package.json"
        />
      ),
    },
    {
      id: 'growth',
      label: '增长',
      render: () => (
        <CountCompare
          kicker="这一期"
          title="模板从 67 个增加到 86 个"
          lead="新增 8 个图表和 11 个等宽黑、贴纸风模板。"
          before={{ label: '第 1 期结束', value: 67, unit: '个', note: '面板与节奏页' }}
          after={{ label: '第 2 期结束', value: 86, unit: '个', note: '加上图表和两种新风格' }}
          change="+19 个"
          source="src/kit/catalog.ts"
        />
      ),
    },
    {
      id: 'ch2',
      label: '构成',
      render: () => <PillAgenda kicker="第二部分" chapters={CH} current={1} title={['它由什么组成']} lead="一个离线 HTML 文件里装了什么；五份参考演示各用了哪些页面。" />,
    },
    {
      id: 'bundle',
      build: 'reveal',
      label: '打包构成',
      render: () => (
        <Donut
          kicker="打包构成"
          title="一个文件，六成是字体"
          lead="中文字体已经按用到的字裁剪，仍是最大的一块。"
          center={{ value: '6.0', label: 'MB · 单个 HTML' }}
          segments={[
            { label: '字体', value: 3.6, note: '思源黑体、宋体等，已裁剪' },
            { label: '脚本', value: 1.8, note: 'React、动效和全部模板' },
            { label: '截图', value: 0.4, note: 'WebP，内嵌' },
            { label: '样式', value: 0.2 },
          ]}
          unit=" MB"
          decimals={1}
          source="dist/index.html，vite build 后按内嵌内容分类统计（含 base64 开销，1 MB = 1024² 字节，与 npm run check 一致），2026-10-30"
        />
      ),
    },
    {
      id: 'tones',
      build: 'reveal',
      label: '明暗',
      render: () => (
        <BarChart
          kicker="明暗"
          title="深色页集中在 GTM"
          lead="每份演示里浅色、深色和强调色整页各有几页。"
          categories={['Lumen', 'GEO', 'GTM', 'Launch', 'Studio']}
          series={[
            { name: '浅色页', values: [24, 30, 23, 13, 6] },
            { name: '深色页', values: [1, 1, 5, 0, 1] },
            { name: '强调色页', values: [0, 0, 2, 0, 0] },
          ]}
          mode="stack"
          unit=" 页"
          focus={2}
          source={COUNTED}
        />
      ),
    },
    {
      id: 'variety',
      label: '页数与模板',
      render: () => (
        <Bubble
          kicker="页数与模板"
          title="页数越多，用到的模板越多"
          points={[
            { label: 'Lumen', x: 25, y: 23, size: 3 },
            { label: 'GEO', x: 31, y: 25, size: 4, side: 'right' },
            { label: 'GTM', x: 30, y: 26, size: 10, side: 'left' },
            { label: 'Launch', x: 13, y: 13, size: 6 },
            { label: 'Studio', x: 7, y: 7, size: 1 },
          ]}
          x={{ label: '页数', min: 0, max: 35 }}
          y={{ label: '模板种类', min: 0, max: 30 }}
          sizeLabel="气泡大小：逐条展开的页数"
          focus="GTM"
          note="GTM 用了 26 种模板，逐条展开的页也最多，共 10 页。"
          source={COUNTED}
        />
      ),
    },
    {
      id: 'budget',
      label: '体积',
      render: () => (
        <Gauge
          kicker="体积"
          title="离预估上限还有余量"
          lead="规划时预估做完五期后单文件在 7–8 MB，这里按 8 MB 画刻度。"
          value={6.0}
          max={8}
          decimals={1}
          unit=" MB"
          label="当前单文件体积"
          target={{ value: 7, label: '预估下限 7 MB' }}
          points={[
            { label: '字体', value: '3.6 MB' },
            { label: '脚本', value: '1.8 MB' },
            { label: '截图与样式', value: '0.6 MB' },
          ]}
          source="dist/index.html，2026-10-30；7–8 MB 为第 2 期规划时的估算"
        />
      ),
    },
    {
      id: 'services',
      build: 'reveal',
      label: '流程',
      render: () => (
        <ServiceList
          kicker="怎么用"
          items={[
            { word: '挑模板', icon: 'widget', note: '在 #/kit 按适合 / 避免 / 上限挑' },
            { word: '填内容', icon: 'pen', note: '每个事实都写 source' },
            { word: '跑检查', icon: 'test', note: 'npm run check 最后一行是 PASS' },
            { word: '去放映', icon: 'presentation', note: 'G 总览，P 自动播放，F 全屏' },
          ]}
          source="docs/README.md"
        />
      ),
    },
    {
      id: 'quotes',
      build: 'reveal',
      label: '取舍',
      render: () => (
        <QuoteArc
          kicker="取舍"
          title="删到不能再删，再把数据摆出来"
          quotes={[
            { text: '少，但更好。', name: 'Dieter Rams', role: '《Weniger, aber besser》，1995' },
            { text: '最重要的是，展示数据。', name: 'Edward Tufte', role: '《The Visual Display of Quantitative Information》，1983' },
            { text: '完美不在于无可增添，而在于无可删减。', name: '圣埃克苏佩里', role: '《人类的大地》，1939' },
          ]}
          source="引文见各卡片所列著作；中文为本文译"
        />
      ),
    },
    {
      id: 'styles',
      build: 'reveal',
      label: '四种新风格',
      render: () => (
        <WorkCards
          kicker="风格"
          title="两期新增的四种风格"
          cards={[
            { title: '静谧', tag: 'calm', icon: 'widget', spot: 1 },
            { title: '工作室', tag: 'studio-dark', icon: 'monitor', spot: 3 },
            { title: '等宽黑', tag: 'mono-studio', icon: 'code', spot: 6 },
            { title: '贴纸', tag: 'sticker', icon: 'stars', spot: 5 },
          ]}
          source="src/kit/theme.ts"
        />
      ),
    },
    {
      id: 'closing',
      label: '结束',
      render: () => <RepeatClosing word="THANK YOU" title={['谢谢']} sub="下一期：3D 几何与壁纸桌面 · 结构类图表" chat={{ name: 'PCafe', text: '有问题，现在问' }} />,
    },
  ],
}
