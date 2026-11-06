// Sticker deck for phase 2, in the `sticker` preset (grid paper).
// Figures are counted from this project's deck files on 2026-10-30; per-page
// character counts are CJK characters in each slide's block of index.tsx
// (sources and alt text included). Screenshots are real, from ../studio/assets.

import type { DeckDef } from '../../kit'
import { FolderCards, Pictogram, PixelClosing, SlopeRank, SparkCards, StickerCover, WordBlocks } from '../../kit'
import kit from '../studio/assets/shot-kit.webp'
import kitEntry from '../studio/assets/shot-kit-entry.webp'
import overview from '../studio/assets/shot-overview.webp'
import slide from '../studio/assets/shot-slide.webp'

const COUNTED = 'src/decks/release · geo · gtm · launch · studio 的 index.tsx，2026-10-30 统计'

export const deck: DeckDef = {
  title: 'PCafe 贴纸本',
  iconStyle: 'line-duotone',
  theme: 'cobalt',
  style: 'sticker',
  slides: [
    {
      id: 'cover',
      label: '封面',
      render: () => (
        <StickerCover
          title={['写演示，', '像贴贴纸']}
          lead="挑一张模板贴上去，填好内容，跑一遍检查。字数放不下就再贴一页。"
          note="这就是标题"
          stickers={[{ text: '86 个模板' }, { text: '7 种风格' }, { text: '离线单文件' }]}
          shot={{ src: kit, alt: '组件库首页截图', caption: '组件库 #/kit', file: 'KIT.WEBP' }}
          pills={['第 2 期', '2026 年 10 月']}
        />
      ),
    },
    {
      id: 'blocks',
      build: 'reveal',
      label: '能做什么',
      render: () => (
        <WordBlocks
          kicker="能做什么"
          title="这些页面，都有现成的模板"
          lead="每块对应一组模板，在 #/kit 里能看到实时预览。"
          words={[
            { word: '封面' },
            { word: '数据图表' },
            { word: '流程' },
            { word: '对比' },
            { word: '截图标注' },
            { word: '路线图' },
            { word: '引语' },
            { word: '结束页' },
          ]}
          source="src/kit/catalog.ts"
        />
      ),
    },
    {
      id: 'folders',
      build: 'focus',
      label: '三种视图',
      render: () => (
        <FolderCards
          kicker="三种视图"
          title="一个文件夹一个入口"
          lead="按 → 翻到下一个文件夹。"
          items={[
            {
              tab: 'KIT',
              title: '组件库',
              body: '每个模板的实时预览，写着适合什么、避免什么、每个字段最多几个字。',
              points: ['风格样张墙 #/kit/styles', '图标索引，点击复制名称'],
              src: kitEntry,
              alt: '组件库中一个模板条目的截图',
              file: 'ENTRY.WEBP',
            },
            {
              tab: 'SLIDE',
              title: '放映',
              body: '1920×1080 的画布按窗口等比缩放，翻页时同名元素平滑衔接。',
              points: ['→ 逐条展开', 'P 自动播放，F 全屏'],
              src: slide,
              alt: 'GTM 演示封面的放映截图',
              file: 'SLIDE.WEBP',
            },
            {
              tab: 'OVERVIEW',
              title: '总览',
              body: '按 G 打开全部页面的缩略图，方向键选择，Enter 打开。',
              points: ['缩略图是实时渲染的页面'],
              src: overview,
              alt: '按 G 打开的总览截图',
              file: 'OVERVIEW.WEBP',
            },
          ]}
          source="本项目截图，2026-10-30"
        />
      ),
    },
    {
      id: 'density',
      build: 'reveal',
      label: '文字密度',
      render: () => (
        <SparkCards
          kicker="文字密度"
          title="每页写多少字，起伏比平均数重要"
          lead="小线是每份演示逐页的中文字数，从第一页到最后一页。"
          cards={[
            {
              label: 'Lumen 解读',
              value: '101',
              unit: '字/页',
              delta: { text: '最多 191', tone: 'down' },
              series: [74, 115, 52, 8, 82, 141, 75, 138, 97, 62, 124, 53, 73, 81, 116, 123, 126, 59, 170, 132, 131, 191, 138, 83, 71],
              note: '25 页',
            },
            {
              label: 'GEO 简报',
              value: '139',
              unit: '字/页',
              delta: { text: '最多 244', tone: 'down' },
              series: [94, 120, 55, 107, 211, 115, 101, 244, 50, 228, 65, 168, 139, 189, 101, 164, 108, 174, 76, 239, 139, 137, 178, 59, 92, 135, 209, 124, 190, 188, 125],
              note: '31 页',
            },
            {
              label: 'GTM 手册',
              value: '130',
              unit: '字/页',
              delta: { text: '最多 254', tone: 'down' },
              series: [88, 141, 69, 125, 129, 97, 254, 64, 147, 190, 90, 36, 216, 63, 127, 116, 165, 214, 116, 70, 137, 139, 192, 129, 97, 153, 124, 119, 189, 111],
              note: '30 页',
            },
            {
              label: 'Launch 发布',
              value: '81',
              unit: '字/页',
              delta: { text: '最多 216', tone: 'down' },
              series: [57, 46, 54, 54, 103, 216, 121, 80, 56, 45, 58, 103, 66],
              note: '13 页',
            },
          ]}
          source={`${COUNTED.replace(' · studio', '')}；字数含出处与图片说明`}
        />
      ),
    },
    {
      id: 'share',
      build: 'reveal',
      label: '页面类型',
      render: () => (
        <Pictogram
          kicker="页面类型"
          title={['每 100 页里，', '23 页逐条展开']}
          lead="五份参考演示共 106 页，换算成每 100 页。"
          of={100}
          parts={[
            { label: '逐条展开', value: 23 },
            { label: '深色或强调色整页', value: 9 },
          ]}
          rest="静态浅色页"
          source={`${COUNTED}；按百分比四舍五入`}
        />
      ),
    },
    {
      id: 'rank',
      label: '两种排名',
      render: () => (
        <SlopeRank
          kicker="两种排名"
          title="按页数排第二，按模板种类排第一"
          periods={['按页数', '按模板种类']}
          items={[
            { name: 'GEO 简报', from: 1, to: 2 },
            { name: 'GTM 手册', from: 2, to: 1 },
            { name: 'Lumen 解读', from: 3, to: 3 },
            { name: 'Launch 发布', from: 4, to: 4 },
            { name: 'Studio 工作室', from: 5, to: 5 },
          ]}
          focus="GTM 手册"
          note="GTM 有 30 页，比 GEO 少 1 页，却用了 26 种模板，比 GEO 多 1 种。"
          source={COUNTED}
        />
      ),
    },
    {
      id: 'closing',
      label: '结束',
      render: () => (
        <PixelClosing
          big="LET'S TALK"
          action="打开 #/kit 试试"
          sub="风格样张墙在 #/kit/styles，七种风格并排看。"
          contacts={[
            { label: '规则', value: 'docs/README.md' },
            { label: '目录', value: 'docs/components.md' },
          ]}
        />
      ),
    },
  ],
}
