// PCafe home page as a deck, `electric` variant (bright blue studio-landing look).
// Facts come from this repo's own files on 2026-10-30. Screenshots are real but
// may be slightly older than the current kit.

import type { DeckDef } from '../../kit'
import { Closing, FanCover, OpenList, PanelCards, PillSentence, Screenshot, StatRow, Statement, StepTrack, Terminal } from '../../kit'
import kitEntry from './assets/shot-kit-entry.webp'
import overview from './assets/shot-overview.webp'
import slide from './assets/shot-slide.webp'

export const deck: DeckDef = {
  title: 'PCafe',
  iconStyle: 'line-duotone',
  theme: 'cobalt',
  style: 'electric',
  slides: [
    {
      id: 'cover',
      label: '封面',
      tone: 'accent',
      render: () => (
        <FanCover
          badge={{ icons: ['code', 'stars', 'check'], text: '开源 · CPAL-1.0 · 给 AI 用的演示引擎' }}
          title={['让 AI 做的演示，', '每一页都整齐']}
          lead="固定模板、内容上限、逐页自动检查，最后得到一个能离线打开的 HTML 文件。"
          actions={['npx @pcafe/pcafe init my-talk', 'GitHub 源码']}
          cards={[
            { src: kitEntry, alt: '模板库条目页截图' },
            { src: slide, alt: '一页演示的截图' },
            { src: overview, alt: '总览模式截图' },
          ]}
          source="LICENSE；README.md"
        />
      ),
    },
    {
      id: 'problem',
      label: '问题',
      render: () => (
        <PillSentence
          kicker="问题"
          parts={[
            '让 AI 直接写幻灯片，常见的结果是',
            { icons: ['text'] },
            '字号乱跳、',
            { icons: ['danger'] },
            '文字溢出、',
            { icons: ['layers'] },
            '每页都长得不一样。',
          ]}
          note={{ label: '为什么会这样', body: 'AI 每次都从一张白纸开始排版。' }}
          aside="PCafe 换了个做法：版式由人先设计好，AI 只负责把内容填进模板，再由脚本逐页检查。"
        />
      ),
    },
    {
      id: 'how',
      label: '做法',
      render: () => (
        <PanelCards
          kicker="做法"
          title={['三条规矩，', '让版式不走样']}
          lead="写在 AGENTS.md 里，AI 工具开工前先读。"
          cards={[
            { eyebrow: 'src/kit', title: '固定模板', body: '只组合现成模板，不写 CSS。', ui: { kind: 'figure', value: '251', note: '个模板可选' } },
            {
              eyebrow: 'components.md',
              title: '内容上限',
              body: '放不下就拆页，不缩字号。',
              ui: { kind: 'list', rows: [{ label: '标题', value: '有上限' }, { label: '条目数', value: '有上限' }, { label: '每条字数', value: '有上限' }] },
            },
            {
              eyebrow: 'source',
              title: '事实出处',
              body: '查不到的不写，示意要标明。',
              ui: { kind: 'chips', items: [{ icon: 'link', label: 'source' }, { icon: 'gallery', label: '真实截图' }, { icon: 'eye', label: 'photo-' }, { icon: 'magic', label: 'decor-' }] },
            },
          ]}
          source="AGENTS.md；src/kit/catalog.ts；docs/zh-CN/components.md"
        />
      ),
    },
    {
      id: 'numbers',
      label: '规模',
      render: () => (
        <StatRow
          kicker="规模"
          title="四个数字看这套引擎"
          stats={[
            { value: '251', label: 'templates', note: '每个都写明适合、避免和内容上限。' },
            { value: '5', label: 'themes', note: '强调色和底色一起换，一行配置。' },
            { value: '4', label: 'viewports', note: '检查时在四种窗口尺寸下逐页截图。' },
            { value: '4', label: 'languages', note: '文档有简体、繁体、英文和德文。' },
          ]}
          names={['CPAL-1.0', 'React 19', 'Vite 8', 'Playwright']}
          source="src/kit/catalog.ts；src/kit/theme.ts；docs/；package.json"
        />
      ),
    },
    {
      id: 'kit',
      label: '模板库',
      build: 'reveal',
      render: () => (
        <Screenshot
          kicker="模板库"
          title="每个模板都能先看再用"
          src={kitEntry}
          alt="模板库条目页截图：左侧切换器，右侧模板说明和实时预览"
          ratio={1600 / 1000}
          url="#/kit"
          callouts={[
            { x: 14, y: 12, title: '图标系列', body: '同一页换一种图标画法。' },
            { x: 14, y: 30, title: '配色', body: '五套强调色随手切换。' },
            { x: 14, y: 50, title: '风格', body: '标题字体、圆角和底色一起换。' },
            { x: 36, y: 14, title: '模板说明', body: '中文名、组件名和用途。' },
            { x: 60, y: 62, title: '实时预览', body: '预览就是真实的一页。' },
          ]}
          source="本项目截图（可能略早于当前版本）"
        />
      ),
    },
    {
      id: 'qa',
      label: '自动检查',
      render: () => (
        <Terminal
          kicker="自动检查"
          title="PASS 才算做完"
          window="my-talk: ~"
          prompt="$"
          steps={[
            { cmd: 'npx pcafe check my-talk', out: ['# typecheck + build + Playwright QA', '# last line: PASS or FAIL'], note: '类型检查、构建，再在四种窗口尺寸下逐页检查。' },
            { cmd: 'ls qa/', out: ['# one screenshot per slide'], note: '每页都有截图，人再逐张看一遍。' },
            { cmd: 'npx pcafe build my-talk', out: ['# -> dist/my-talk.html'], note: '打包成单个 HTML，断网也能放映。' },
          ]}
          source="README.md；AGENTS.md"
        />
      ),
    },
    {
      id: 'present',
      label: '放映',
      build: 'reveal',
      render: () => (
        <OpenList
          kicker="放映"
          title={['讲的时候，', '一个键就够']}
          lead="在浏览器里直接放映，常用操作都有快捷键。"
          action="#/print 导出 PDF"
          rows={[
            { key: 'S', q: '演讲者视图', a: '备注、计时器和下一页预览都在一个窗口里，观众只看到幻灯片。' },
            { key: 'L', q: '激光笔', a: '' },
            { key: 'D / C', q: '画笔与清除', a: '' },
            { key: 'Z', q: '局部放大', a: '' },
            { key: 'G', q: '总览所有页', a: '' },
            { key: 'F / P', q: '全屏与自动播放', a: '' },
          ]}
          source="docs/zh-CN/presenting.md"
        />
      ),
    },
    {
      id: 'ai',
      label: 'AI 工具',
      tone: 'accent',
      render: () => (
        <Statement
          kicker="AI 工具"
          text={['Claude Code、Codex、Cursor', '读的是同一份说明']}
          marks={['同一份说明']}
          sub="AGENTS.md 和 skills/pcafe 写清了流程、模板和上限。"
          source="AGENTS.md；skills/pcafe/SKILL.md"
        />
      ),
    },
    {
      id: 'start',
      label: '快速开始',
      build: 'reveal',
      render: () => (
        <StepTrack
          kicker="快速开始"
          title="四条命令，从零到一个文件"
          steps={[
            { title: '建项目', body: '生成项目和第一份演示。', cmd: 'npx @pcafe/pcafe init my-talk' },
            { title: '边写边看', body: '打开本地预览，改了就刷新。', cmd: 'npx pcafe dev my-talk' },
            { title: '跑检查', body: '最后一行是 PASS 才算完成。', cmd: 'npx pcafe check my-talk' },
            { title: '打包', body: '输出 dist/my-talk.html。', cmd: 'npx pcafe build my-talk' },
          ]}
          after={{ label: '还有', cmds: ['npx pcafe new <deck>', 'npx pcafe docs', 'npx pcafe photos'] }}
          source="README.md"
        />
      ),
    },
    {
      id: 'close',
      label: '开始',
      tone: 'accent',
      render: () => (
        <Closing
          kicker="开始用"
          statement="下一份演示，交给它排版。"
          follow="一行命令开始：npx @pcafe/pcafe init my-talk"
          takeaways={[
            'AI 只往固定模板里填内容，版式由模板守住。',
            '每个字段都有内容上限，放不下就拆页。',
            '检查最后一行是 PASS，再打包成一个离线 HTML 文件。',
          ]}
          refs={['github.com/Web-Casa/pcafe', 'p.cafe', 'AGENTS.md', 'LICENSE · CPAL-1.0']}
        />
      ),
    },
  ],
}
