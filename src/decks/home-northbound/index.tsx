// PCafe homepage as a deck, variant `northbound`: the `agency` style
// (white page, giant tight headlines, pill buttons, lime badge). Facts come
// from this repo's own files on 2026-10-30.

import type { DeckDef } from '../../kit'
import { AgencyHero, AgencyManifesto, AgencyRows, Closing, IconGrid, NumberedColumns, ProofSplit, StatRow, TabbedShot, Terminal } from '../../kit'
import kitShot from './assets/shot-kit.webp'
import overviewShot from './assets/shot-overview.webp'
import slideShot from './assets/shot-slide.webp'

const SHOTS = '本项目截图（src/decks/studio/assets），界面可能略旧于当前版本'

export const deck: DeckDef = {
  title: 'PCafe',
  iconStyle: 'line-duotone',
  theme: 'cobalt',
  style: 'agency',
  slides: [
    {
      id: 'hero',
      label: '首页',
      render: () => (
        <AgencyHero
          badge="开源 · CPAL-1.0 · 写给 AI 用的演示引擎"
          lines={[{ text: '让 AI 做的', icon: 'magic' }, { text: '幻灯片' }, { text: '页页整齐', icon: 'presentation' }]}
          tag="PCafe · HTML 演示引擎"
          lead="231 个固定模板，每个字段都有内容上限。AI 只负责把内容填进去，排版交给模板，最后输出一个能离线放映的 HTML 文件。"
          actions={['开始使用', 'GitHub']}
          namesLabel="AI 工具直接读项目里的说明"
          names={['Claude Code', 'Codex', 'Cursor']}
          source="src/kit/catalog.ts；LICENSE；AGENTS.md"
        />
      ),
    },
    {
      id: 'problem',
      label: '问题',
      render: () => (
        <AgencyManifesto
          label="我们的看法"
          icon="danger"
          text="让 AI 直接写幻灯片，结果常是字号忽大忽小、文字挤出边框、每页一个样。问题不在 AI 的文笔，而在它没有一套固定的版式可遵守。"
          marks={['固定的版式']}
        />
      ),
    },
    {
      id: 'how',
      label: '做法',
      build: 'reveal',
      render: () => (
        <AgencyRows
          kicker="01 做法"
          title={['模板管排版，', 'AI 只管内容']}
          more="看模板目录"
          items={[
            { title: '只组合现成模板', note: '不写自定义 CSS，不改模板', icon: 'widget' },
            { title: '每个字段有上限', note: '放不下就拆页，不缩字号', icon: 'tuning' },
            { title: '事实都写出处', note: '查不到的不写，估算要标明', icon: 'bookmark' },
            { title: '图片分三类', note: '截图作证据，图库与装饰只营造氛围', icon: 'gallery' },
            { title: '自动检查再交付', note: '最后一行 PASS 才算完成', icon: 'verified' },
          ]}
          source="AGENTS.md；docs/zh-CN/guide.md"
        />
      ),
    },
    {
      id: 'numbers',
      label: '数字',
      render: () => (
        <StatRow
          kicker="02 规模"
          title="四个数，说清这套引擎"
          stats={[
            { value: '251', label: 'templates', note: '每个模板都写明适合、避免和内容上限' },
            { value: '33', label: 'styles', note: '整套风格，换一行 style 就换一身' },
            { value: '5', label: 'themes', note: '绯红、橙、钴蓝、翠绿、紫' },
            { value: '4', label: 'languages', note: '简体中文、繁體中文、English、Deutsch' },
          ]}
          names={['CPAL-1.0', 'React', 'Vite', 'Playwright']}
          source="src/kit/catalog.ts；src/kit/theme.ts；docs/；LICENSE；package.json"
        />
      ),
    },
    {
      id: 'showcase',
      label: '模板与风格',
      render: () => (
        <TabbedShot
          kicker="03 模板与风格"
          title="先挑模板，再换风格"
          lead="组件库里能看到每个模板的样张和上限；放映页就是成品；按 G 看全部页面。"
          tabs={[
            { label: '组件库', icon: 'gallery', src: kitShot, alt: '组件库页面截图' },
            { label: '放映', icon: 'presentation', src: slideShot, alt: '一页演示的放映截图' },
            { label: '总览', icon: 'widget', src: overviewShot, alt: '按 G 打开的全部页面总览截图' },
          ]}
          source={SHOTS}
        />
      ),
    },
    {
      id: 'qa',
      label: '检查',
      render: () => (
        <ProofSplit
          kicker="04 检查"
          title={['交付之前，', '先过一遍检查']}
          lead="check 依次做类型检查、构建，再用 Playwright 在四种窗口尺寸下逐页截图检查。"
          icon="shield"
          rows={[
            { label: '类型检查', value: 'tsc' },
            { label: '构建', value: 'vite build' },
            { label: '窗口尺寸', value: '4 种' },
            { label: '截图', value: 'qa/' },
          ]}
          stats={[
            { value: '4', label: '种窗口尺寸' },
            { value: 'PASS', label: '最后一行才算完成' },
          ]}
          checks={['最后一行只有 PASS 或 FAIL', '每页截图都要亲眼看过']}
          source="AGENTS.md；docs/zh-CN/guide.md"
        />
      ),
    },
    {
      id: 'present',
      label: '放映',
      render: () => (
        <IconGrid
          kicker="05 放映"
          title="讲的时候，一个键就够"
          items={[
            { icon: 'user-speak', title: '演讲者视图', tag: 'S', body: '另开窗口显示备注、计时器和下一页预览。' },
            { icon: 'target', title: '激光笔', tag: 'L', body: '鼠标变成红点，指着要讲的地方。' },
            { icon: 'pen', title: '画笔', tag: 'D', body: '直接在页面上画线圈重点，讲完再清掉。' },
            { icon: 'refresh', title: '清除', tag: 'C', body: '一键擦掉这一页上画过的所有笔迹。' },
            { icon: 'search', title: '放大', tag: 'Z', body: '放大页面的局部，让后排也看得清细节。' },
            { icon: 'widget', title: '总览', tag: 'G', body: '所有页面平铺成网格，点一下就跳过去。' },
            { icon: 'monitor', title: '全屏', tag: 'F', body: '浏览器切到全屏，页面按比例铺满屏幕。' },
            { icon: 'clock', title: '自动播放', tag: 'P', body: '按固定间隔自动翻页；打印 PDF 用 #/print。' },
          ]}
          source="docs/zh-CN/presenting.md"
        />
      ),
    },
    {
      id: 'ai',
      label: 'AI 工具',
      render: () => (
        <NumberedColumns
          kicker="06 AI 工具"
          title="你常用的 AI 工具，读得懂它"
          items={[
            { tag: 'AGENTS.md', icon: 'document', title: '一份项目说明', body: '规则写在仓库根目录，AI 打开项目就能读到：只用模板、守上限、写出处。' },
            { tag: 'skills/pcafe', icon: 'brain', title: '一套写作流程', body: '技能文件教 AI 把内容对上模板，从故事线到每页该选哪个模板。' },
            { tag: 'Claude Code · Codex', icon: 'code', title: '常见工具都能用', body: 'Claude Code、Codex、Cursor 这类工具都会读这两份文件。' },
          ]}
          source="AGENTS.md；skills/pcafe/SKILL.md"
        />
      ),
    },
    {
      id: 'start',
      label: '快速开始',
      render: () => (
        <Terminal
          kicker="07 快速开始"
          title="四条命令，从零到一个文件"
          window="~/my-talk"
          prompt="$"
          steps={[
            { cmd: 'npx @pcafe/pcafe init my-talk', note: '新建项目，带上说明和技能文件' },
            { cmd: 'npx pcafe dev my-talk', note: '本地预览，改内容立刻刷新' },
            { cmd: 'npx pcafe check my-talk', out: ['# last line: PASS or FAIL'], note: '类型检查、构建、四种尺寸逐页截图' },
            { cmd: 'npx pcafe build my-talk', out: ['# -> dist/my-talk.html'], note: '输出一个能离线打开的 HTML 文件' },
          ]}
          source="PCafe CLI；docs/zh-CN/guide.md"
        />
      ),
    },
    {
      id: 'cta',
      label: '开始',
      render: () => (
        <Closing
          kicker="08 开始"
          statement="下一份演示，交给模板。"
          follow="npx @pcafe/pcafe init my-talk"
          takeaways={[
            '231 个模板、每个字段有上限，AI 填内容，排版不会乱。',
            'check 最后一行是 PASS 才交付，四种窗口尺寸逐页截图。',
            'build 输出一个 HTML 文件，离线双击就能放映，CPAL-1.0 开源。',
          ]}
          refs={['github.com/Web-Casa/pcafe', 'p.cafe']}
        />
      ),
    },
  ],
}
