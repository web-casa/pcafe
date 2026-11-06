// PCafe home page as a deck, `nuance` variant (designer-portfolio look:
// warm paper, serif headlines, tilted orange label, dotted canvas). Facts come
// from this repository's own files on 2026-10-30.

import type { DeckDef } from '../../kit'
import { ArcCards, CaseCard, Closing, Contrast, IconGrid, SketchCover, StatRow, Statement, StepTrack, Terminal } from '../../kit'
import shotKit from '../studio/assets/shot-kit.webp'
import shotOverview from '../studio/assets/shot-overview.webp'

export const deck: DeckDef = {
  title: 'PCafe · 画板版主页',
  iconStyle: 'line-duotone',
  theme: 'amber',
  style: 'nuance',
  slides: [
    {
      id: 'cover',
      label: '封面',
      render: () => (
        <SketchCover
          kicker="开源 · CPAL-1.0"
          pre="让 AI 做"
          tag="演示"
          line="每一页都整整齐齐"
          lead="固定模板、内容上限和自动检查，让 AI 写的幻灯片不走样。交付物是一个离线 HTML 文件。"
          canvas="npx @pcafe/pcafe init my-talk"
          chips={['231 个模板', '23 种风格', '5 套配色', '4 种语言文档']}
          source="src/kit/catalog.ts；src/kit/theme.ts；docs/；LICENSE"
        />
      ),
    },
    {
      id: 'problem',
      label: '问题',
      build: 'reveal',
      render: () => (
        <Contrast
          kicker="问题"
          before={{ label: '自由排版', text: '每页都由 AI 现排，字号随手改' }}
          after={{ label: '固定模板', text: 'AI 只填内容，版式交给模板' }}
          sub="放不下就拆页，不缩字号。这条写进了给 AI 的规则里。"
          source="AGENTS.md"
        />
      ),
    },
    {
      id: 'how',
      label: '怎么做到',
      render: () => (
        <ArcCards
          kicker="怎么做到"
          title={['五条规则，', '管住每一页']}
          cards={[
            { icon: 'layers', title: '固定模板', text: '只组合 src/kit 里的模板，不写自定义 CSS。' },
            { icon: 'ranking', title: '内容上限', text: '每个字段都有字数上限，放不下就拆页。' },
            { icon: 'bookmark', title: '事实有出处', text: '每条事实写 source，查不到的不写。' },
            { icon: 'gallery', title: '图片分三类', text: '真实截图当证据，图库照片和装饰图只做氛围。' },
            { icon: 'verified', title: '自动检查', text: '类型检查、构建、截图 QA，看到 PASS 才算完。' },
          ]}
          source="AGENTS.md"
        />
      ),
    },
    {
      id: 'numbers',
      label: '规模',
      render: () => (
        <StatRow
          kicker="规模"
          title="四个数，说清这套引擎"
          stats={[
            { value: '251', label: 'templates', note: '每个模板都写好用途和内容上限' },
            { value: '33', label: 'styles', note: '换一行 style，整份演示换风格' },
            { value: '5', label: 'themes', note: '绯红、橙、钴蓝、翠绿、紫' },
            { value: '4', label: 'languages', note: '简体中文、繁體中文、English、Deutsch' },
          ]}
          names={['CPAL-1.0', 'React', 'Vite', 'Playwright']}
          source="src/kit/catalog.ts；src/kit/theme.ts；docs/；LICENSE；package.json"
        />
      ),
    },
    {
      id: 'gallery',
      label: '模板库',
      render: () => (
        <CaseCard
          kicker="模板与风格"
          title={['231 个模板，', '先看样张再选']}
          lead="组件库页面列出每个模板的用途、内容上限和示例页。顶部的风格切换器可以把整页换成任意一种风格来对比。"
          image={shotKit}
          alt="组件库页面截图"
          tags={['#/kit', '23 种风格', '5 套配色']}
          ticker={['TEMPLATES', 'STYLES', 'THEMES']}
          source="截图：本项目组件库页面（可能略旧）；src/kit/catalog.ts；src/kit/theme.ts"
        />
      ),
    },
    {
      id: 'qa',
      label: '自动检查',
      render: () => (
        <Terminal
          kicker="交付标准"
          title={['只有 PASS，', '才算做完']}
          window="~/my-talk"
          prompt="$"
          steps={[
            { cmd: 'npx pcafe check my-talk', out: ['# typecheck + build + Playwright QA'], note: '类型检查、构建，再用浏览器逐页检查。' },
            { cmd: 'ls qa/', out: ['# one screenshot per slide'], note: '在 4 种窗口尺寸下截图，每页一张。' },
            { cmd: 'npx pcafe build my-talk', out: ['# dist/my-talk.html'], note: '最后一行是 PASS，再导出离线单文件。' },
          ]}
          source="docs/zh-CN/guide.md；README.md"
        />
      ),
    },
    {
      id: 'present',
      label: '放映',
      render: () => (
        <IconGrid
          kicker="放映"
          title="讲的时候，按一个键就够"
          items={[
            { icon: 'monitor', title: '演讲者视图', tag: 'S', body: '新窗口里有备注、计时器和下一页。' },
            { icon: 'target', title: '激光笔', tag: 'L', body: '在画面上指出正在讲的地方。' },
            { icon: 'pen', title: '画笔', tag: 'D', body: '直接在页面上圈画，按 C 清除。' },
            { icon: 'search', title: '放大', tag: 'Z', body: '把一处细节放大给后排的人看。' },
            { icon: 'widget', title: '总览', tag: 'G', body: '所有页面平铺，点一下就跳过去。' },
            { icon: 'window', title: '全屏', tag: 'F', body: '投影时按一下，整屏只剩幻灯片。' },
            { icon: 'clock', title: '自动播放', tag: 'P', body: '按固定间隔自动往下翻页。' },
            { icon: 'download', title: '导出 PDF', tag: '#/print', body: '打开打印页，用浏览器另存为 PDF。' },
          ]}
          source="docs/zh-CN/presenting.md"
        />
      ),
    },
    {
      id: 'ai',
      label: 'AI 工具',
      render: () => (
        <Statement
          kicker="配合 AI 工具"
          text={['AI 先读规则，', '再动手写演示']}
          marks={['规则']}
          sub="Claude Code、Codex、Cursor 都会读 AGENTS.md 和 skills/pcafe。"
          source="AGENTS.md；skills/pcafe/SKILL.md"
        />
      ),
    },
    {
      id: 'start',
      label: '快速开始',
      render: () => (
        <StepTrack
          kicker="快速开始"
          title="四条命令，从空目录到一个文件"
          steps={[
            { title: '建项目', body: '生成项目和示例演示。', cmd: 'npx @pcafe/pcafe init my-talk' },
            { title: '边写边看', body: '本地预览，改了就刷新。', cmd: 'npx pcafe dev my-talk' },
            { title: '跑检查', body: '最后一行要是 PASS。', cmd: 'npx pcafe check my-talk' },
            { title: '导出', body: '得到一个离线 HTML 文件。', cmd: 'npx pcafe build my-talk' },
          ]}
          source="README.md；docs/zh-CN/guide.md"
        />
      ),
    },
    {
      id: 'overview',
      label: '总览',
      render: () => (
        <CaseCard
          kicker="成品"
          title={['一份演示，', '一个 HTML 文件']}
          lead="build 把字体、脚本和图片都打进 dist 下的单个文件。双击就能放映，发给别人也不需要联网。"
          image={shotOverview}
          alt="演示总览页面截图"
          tags={['离线', '单文件', 'CPAL-1.0']}
          ticker={['SINGLE FILE', 'OFFLINE', 'OPEN SOURCE']}
          source="截图：本项目总览视图（可能略旧）；docs/zh-CN/guide.md；LICENSE"
        />
      ),
    },
    {
      id: 'close',
      label: '开始',
      render: () => (
        <Closing
          kicker="现在开始"
          statement="一条命令，开始你的演示。"
          follow="npx @pcafe/pcafe init my-talk"
          takeaways={[
            'AI 只填内容，231 个模板负责版式，放不下就拆页。',
            '每条事实写出处，check 的最后一行是 PASS 才交付。',
            '成品是一个离线 HTML 文件，CPAL-1.0 许可，可以随意修改。',
          ]}
          refs={['github.com/Web-Casa/pcafe', 'p.cafe', 'AGENTS.md']}
        />
      ),
    },
  ],
}
