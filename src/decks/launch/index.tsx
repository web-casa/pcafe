// Launch deck for phase 1 of the style plan, in the `calm` preset. Every
// figure is about this project and comes from its own files: src/kit/catalog.ts,
// src/kit/theme.ts, src/decks/*, scripts/qa.mjs, package.json, docs/README.md.

import type { DeckDef } from '../../kit'
import {
  AskAnswer,
  ChapterProgress,
  ContactPanel,
  Contrast,
  HangingCover,
  IndexStack,
  NumberOpener,
  Orbit,
  PanelCards,
  ProofSplit,
  Question,
  Recap,
  Statement,
} from '../../kit'

const CH = ['风格引擎', '面板模板', '节奏页', '检查与放映']

export const deck: DeckDef = {
  title: 'PCafe 2.0',
  iconStyle: 'line-duotone',
  theme: 'cobalt',
  style: 'calm',
  slides: [
    {
      id: 'cover',
      label: '封面',
      render: () => (
        <HangingCover
          tag={{ label: '第 1 期', text: '风格引擎与面板模板' }}
          title={['同一份内容，', '换一种气质']}
          mark="气质"
          lead="风格只管外观：字体、圆角、底色和卡片质感。内容、版式和字数上限都不动。"
          icons={['tuning', 'layers', 'chart', 'presentation', 'widget', 'shield', 'stars', 'gallery']}
          pills={['13 页', '2026 年 10 月']}
        />
      ),
    },
    {
      id: 'count',
      label: '模板数',
      render: () => (
        <NumberOpener
          kicker="这一期之后"
          value="67"
          unit="个"
          text={['固定模板，', '每个都写明内容上限']}
          sub="49 个原有模板加上这一期的 18 个。字段放不下就拆页，不缩字号。"
          source="src/kit/catalog.ts · docs/components.md"
        />
      ),
    },
    {
      id: 'promise',
      label: '一句话',
      render: () => (
        <Statement
          kicker="这一期的约定"
          text={['换风格只改一行，', '内容和上限都不动']}
          icons={{ 风格: 'tuning', 内容: 'document' }}
          marks={['一行']}
          sub="DeckDef.style 决定整份演示的外观；模板的字段和内容上限与风格无关。"
          source="docs/README.md §13 · src/kit/theme.ts"
        />
      ),
    },
    {
      id: 'ch2',
      label: '面板模板',
      render: () => (
        <ChapterProgress
          kicker="第二部分"
          title={['面板模板']}
          lead="从产品官网常见的做法里提炼出来：浅灰卡片里放一小块能看懂的界面，比整段文字更快说明一件事。"
          chapters={CH}
          current={1}
        />
      ),
    },
    {
      id: 'panels',
      build: 'reveal',
      label: '面板卡片',
      render: () => (
        <PanelCards
          kicker="面板卡片"
          title="一张卡，一小块界面"
          lead="卡片里的迷你界面有六种：列表、大数字、柱图、进度、换算和标签。下面四张都是本项目自己的数据。"
          cards={[
            {
              eyebrow: 'scripts/qa.mjs',
              title: '检查视口',
              ui: {
                kind: 'list',
                rows: [
                  { label: '1920 × 1080', value: '截图' },
                  { label: '1366 × 768', value: '截图' },
                  { label: '2560 × 1440', value: '排版' },
                  { label: '1440 × 900', value: '排版' },
                ],
              },
            },
            { eyebrow: 'npm run check', title: '打包体积', ui: { kind: 'figure', value: '5.9 MB', note: '单个 HTML 文件，断网也能打开' } },
            { eyebrow: 'src/decks', title: '参考演示', ui: { kind: 'bars', values: [25, 31, 30], label: 'Lumen · GEO · GTM', value: '86 页' } },
            {
              eyebrow: 'src/kit/theme.ts',
              title: '风格预设',
              ui: {
                kind: 'chips',
                items: [
                  { icon: 'document', label: '商务' },
                  { icon: 'book', label: '编辑' },
                  { icon: 'presentation', label: '海报' },
                  { icon: 'widget', label: '静谧' },
                  { icon: 'monitor', label: '工作室' },
                ],
              },
            },
          ]}
          source="scripts/qa.mjs · npm run check 输出 · src/decks · src/kit/theme.ts"
        />
      ),
    },
    {
      id: 'stack',
      build: 'focus',
      label: '目录叠卡',
      render: () => (
        <IndexStack
          kicker="目录叠卡"
          title="一页讲四件事，一次只看一件"
          lead="左边是目录，右边的卡片像文件夹一样叠着；按 → 把下一张翻到最前。"
          items={[
            {
              label: '风格令牌',
              icon: 'tuning',
              title: '风格令牌',
              body: '风格预设统一管理圆角系数、底色、卡片色和标题字体，模板只读变量。',
              ui: {
                kind: 'progress',
                rows: [
                  { label: '静谧 · 圆角系数', value: 1.45, max: 2, display: '1.45×' },
                  { label: '工作室 · 圆角系数', value: 1.7, max: 2, display: '1.7×' },
                ],
              },
            },
            {
              label: '面板模板',
              icon: 'widget',
              title: '面板模板',
              body: '七个模板来自产品官网常见的版式：悬挂图标、面板卡片、问答、证明、叠卡、联系、轨道。',
              ui: { kind: 'figure', value: '7 个', note: 'HangingCover 等' },
            },
            {
              label: '节奏页',
              icon: 'presentation',
              title: '节奏页',
              body: '大数字开场、章节进度、问题、对照、整页图片、小结、致谢：给密集内容之间留停顿。',
              ui: { kind: 'figure', value: '7 个', note: 'NumberOpener 等' },
            },
            {
              label: '工作室模板',
              icon: 'monitor',
              title: '工作室模板',
              body: '深色主卡封面、分段截图、品牌规范和荣誉，适合工具和平台发布。',
              ui: { kind: 'figure', value: '4 个', note: 'HeroPanel 等' },
            },
          ]}
          source="src/kit/theme.ts · src/kit/catalog.ts"
        />
      ),
    },
    {
      id: 'ask',
      build: 'reveal',
      label: '问答',
      render: () => (
        <AskAnswer
          kicker="问答卡"
          title={['把一个问题，', '变成三张卡']}
          lead="适合演示工具能回答什么：右上角是问题，下面是答案，每张卡一个数字加一组小柱。"
          question="三份参考演示，每一章各有几页？"
          found="找到 3 份演示，共 86 页"
          notes={['柱子是各章页数，按顺序', '数据来自 src/decks']}
          results={[
            { name: 'Lumen', sub: '绯红 · 商务', value: '25 页', bars: [7, 8, 5, 3], note: '最长一章 8 页' },
            { name: 'GEO', sub: '橙 · 编辑', value: '31 页', bars: [8, 8, 5, 8], note: '最长一章 8 页' },
            { name: 'GTM', sub: '钴蓝 · 海报', value: '30 页', bars: [5, 6, 6, 11], note: '最长一章 11 页' },
          ]}
          source="src/decks/release · geo · gtm 的目录页（各章起始页）"
        />
      ),
    },
    {
      id: 'proof',
      label: '检查',
      render: () => (
        <ProofSplit
          kicker="检查"
          title={['每次构建，', '都自己检查一遍']}
          lead="npm run check 会逐页截图、量字号、找重叠，再用键盘从第一页翻到最后一页。"
          icon="shield"
          rows={[
            { label: 'FONT', value: '≥ 16.5u' },
            { label: 'VIEWPORTS', value: '4 种' },
            { label: 'REMOTE', value: '禁止' },
            { label: 'WALKTHROUGH', value: '→ 到最后一页' },
          ]}
          stats={[
            { value: '16.5u', label: '最小字号' },
            { value: '4', label: '检查的视口' },
          ]}
          checks={['文字重叠和溢出直接判失败', '构建时禁止引用远程资源']}
          source="scripts/qa.mjs · vite.config.ts（forbid-remote-urls）"
        />
      ),
    },
    {
      id: 'orbit',
      build: 'reveal',
      label: '技术栈',
      render: () => (
        <Orbit
          kicker="技术栈"
          title={['一个文件，', '背后这几样']}
          lead="全部打包进一个离线 HTML。字体按用到的字裁剪后内嵌。"
          center={{ icon: 'presentation', label: 'PCafe' }}
          nodes={[
            { icon: 'code', label: 'React 19' },
            { icon: 'bolt', label: 'Vite 8' },
            { icon: 'stars', label: 'motion' },
            { icon: 'test', label: 'Playwright' },
            { icon: 'widget', label: 'Solar 图标' },
            { icon: 'text', label: '思源黑体' },
            { icon: 'cpu', label: 'TypeScript' },
          ]}
          points={['单文件输出：vite-plugin-singlefile', '中文字体按用字裁剪']}
          source="package.json · scripts/subset-fonts.py"
        />
      ),
    },
    {
      id: 'why',
      label: '问题',
      render: () => <Question kicker="为什么不现场设计" question={['为什么不让 AI', '每次现场设计？']} sub="现场设计上限高，但每次结果不同，也没有出处和字数检查。" />,
    },
    {
      id: 'contrast',
      build: 'reveal',
      label: '对照',
      render: () => (
        <Contrast
          kicker="换风格的成本"
          before={{ label: '过去', text: '换风格，等于重写每一页' }}
          after={{ label: '现在', text: '换风格，只改一行 style' }}
          sub="字段、内容上限和出处都留在原处，所以检查结果也一样有效。"
          source="docs/README.md §13 风格预设"
        />
      ),
    },
    {
      id: 'recap',
      build: 'reveal',
      label: '小结',
      render: () => (
        <Recap
          kicker="小结"
          title="这一期留下的三件事"
          points={[
            { title: '风格令牌', body: '圆角、底色、卡片和标题字体由预设统一给出，模板只读变量。' },
            { title: '18 个新模板', body: '七个面板模板、四个工作室模板、七个节奏页，都带内容上限。' },
            { title: '样张先行', body: '在 #/kit 用“风格”切换器对比，再决定整份演示用哪种。' },
          ]}
          next={{ label: '下一期', title: '等宽黑底与贴纸风' }}
          source="src/kit/catalog.ts · docs/README.md"
        />
      ),
    },
    {
      id: 'contact',
      label: '开始用',
      render: () => (
        <ContactPanel
          kicker="开始用"
          title={['挑一种风格，', '写下一份演示']}
          lead="新演示放在 src/decks/<name>/index.tsx，在 DeckDef 里写 theme 和 style。"
          checks={['所有模板都能换风格', '检查通过才算完成']}
          fields={[
            { icon: 'gallery', label: '组件库', value: '#/kit' },
            { icon: 'book', label: '写作规则', value: 'docs/README.md' },
            { icon: 'list', label: '模板目录', value: 'docs/components.md' },
            { icon: 'command', label: '完成标准', value: 'npm run check → PASS' },
          ]}
          action="打开组件库挑风格"
        />
      ),
    },
  ],
}
