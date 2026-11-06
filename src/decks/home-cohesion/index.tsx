// PCafe homepage as a deck, `cohesion` variant: white page, giant black
// marquee wordmark, floating 3D CSS shapes, big faint service numbers, orange
// pill accents (style `toy3d`, theme `amber`). Facts come from this repo's
// own files on 2026-10-30. Screenshots are reused from src/decks/studio.

import type { DeckDef } from '../../kit'
import { Closing, DuoCards, FloatCover, GlowStack, Screenshot, ServiceIndex, Statement, StatRow, Terminal, TileWall } from '../../kit'
import kitShot from '../studio/assets/shot-kit.webp'

export const deck: DeckDef = {
  title: 'PCafe',
  iconStyle: 'line-duotone',
  theme: 'amber',
  style: 'toy3d',
  transition: 'slide',
  slides: [
    {
      id: 'cover',
      label: '封面',
      notes: '一句话：开源的 HTML 演示引擎，专门让 AI 做出整齐的幻灯片。',
      render: () => (
        <FloatCover
          kicker="开源 · CPAL-1.0"
          title={['AI 做的演示，', '也能很整齐']}
          lead="固定模板加自动检查，AI 写的内容也能直接上台放映。"
          marquee="PCAFE"
          card={{ label: 'TEMPLATES', value: '251', note: '个固定模板，每个都写明内容上限' }}
          source="src/kit/catalog.ts；LICENSE"
        />
      ),
    },
    {
      id: 'problem',
      label: '问题',
      render: () => (
        <Statement
          kicker="问题"
          text={['让 AI 直接写幻灯片，', '版面常常一页一个样']}
          marks={['一页一个样']}
          sub="字号忽大忽小、文字溢出、配色随意，改起来比重做还慢。"
        />
      ),
    },
    {
      id: 'how',
      label: '做法',
      build: 'reveal',
      render: () => (
        <ServiceIndex
          kicker="做法"
          title="把自由度收进四条规则"
          items={[
            { title: '固定模板', text: '只组合现成模板，不写自定义 CSS，版式由模板负责。' },
            { title: '内容上限', text: '每个字段写明字数上限，放不下就拆页，不缩字号。' },
            { title: '事实出处', text: '每个数字都要写 source，查不到出处的不写。' },
            { title: '自动检查', text: 'check 跑类型检查、构建和截图 QA，最后输出 PASS 或 FAIL。' },
          ]}
          source="AGENTS.md；skills/pcafe/SKILL.md"
        />
      ),
    },
    {
      id: 'numbers',
      label: '数字',
      build: 'reveal',
      render: () => (
        <StatRow
          kicker="规模"
          title="四个数说清这套引擎"
          stats={[
            { label: 'templates', value: '251', note: '个模板，覆盖封面、数据、流程和收尾' },
            { label: 'styles', value: '33', note: '种标题与版式风格，一行切换' },
            { label: 'themes', value: '5', note: '套配色，颜色不写死在演示里' },
            { label: 'languages', value: '4', note: '种语言的文档：简中、繁中、英、德' },
          ]}
          names={['CPAL-1.0', 'React', 'Vite', 'Playwright']}
          source="src/kit/catalog.ts；src/kit/theme.ts；docs/"
        />
      ),
    },
    {
      id: 'kit',
      label: '组件库',
      build: 'reveal',
      render: () => (
        <Screenshot
          kicker="模板与风格"
          title="先在组件库里挑模板"
          src={kitShot}
          alt="#/kit 组件库页面截图"
          ratio={1600 / 1000}
          url="#/kit"
          callouts={[
            { x: 20, y: 10, title: '风格切换', body: '23 种风格，同一页内容即时重排。' },
            { x: 50, y: 45, title: '实时预览', body: '每个模板都是一张真实渲染的幻灯片。' },
            { x: 80, y: 80, title: '内容上限', body: '字段上限写在 components.md 里。' },
          ]}
          source="本项目截图（src/decks/studio/assets，2026-10-30，可能略旧）"
        />
      ),
    },
    {
      id: 'qa',
      label: '检查',
      build: 'reveal',
      render: () => (
        <DuoCards
          kicker="自动检查"
          title="交付之前，只看最后一行"
          cards={[
            { name: '检查通过', value: 'PASS', note: '可以交付，再逐页看一遍截图', items: ['类型检查通过', '构建成功', '4 种窗口尺寸都不破版'] },
            { name: '检查失败', value: 'FAIL', note: '按报错修改内容，直到通过', items: ['文字溢出或被裁切', '字号低于下限', '每页截图存进 qa/'] },
          ]}
          source="README.md；scripts/qa.mjs"
        />
      ),
    },
    {
      id: 'present',
      label: '放映',
      build: 'reveal',
      render: () => (
        <TileWall
          kicker="放映"
          title={['讲的时候，', '一个键就够']}
          lead="S 演讲者视图，L 激光笔，D 画笔，C 清除，Z 放大，G 总览，F 全屏，P 自动播放。"
          tiles={[
            { icon: 'user-speak', label: '演讲者视图' },
            { icon: 'target', label: '激光笔' },
            { icon: 'pen', label: '画笔' },
            { icon: 'close', label: '清除' },
            { icon: 'search', label: '放大' },
            { icon: 'widget', label: '总览' },
            { icon: 'monitor', label: '全屏' },
            { icon: 'clock', label: '自动播放' },
            { icon: 'document', label: '打印 PDF' },
          ]}
          shape="torus"
          source="docs/zh-CN/presenting.md"
        />
      ),
    },
    {
      id: 'ai',
      label: 'AI 工具',
      render: () => (
        <GlowStack
          kicker="AI 工具"
          title={['让 AI 读规则，', '再动手']}
          lead="项目自带 AGENTS.md 和 skills/pcafe，AI 工具打开项目就知道怎么写。"
          front={{ label: 'WORKS WITH', title: '常用的 AI 编程工具', items: ['Claude Code', 'Codex', 'Cursor'] }}
          back={{ label: 'RULES', title: '写作规则' }}
          source="AGENTS.md；skills/pcafe/SKILL.md"
        />
      ),
    },
    {
      id: 'start',
      label: '上手',
      render: () => (
        <Terminal
          kicker="快速开始"
          title="四条命令，从零到单文件"
          window="~/talks"
          prompt="$"
          steps={[
            { cmd: 'npx @pcafe/pcafe init my-talk', note: '新建项目，自带模板、文档和 AI 规则。' },
            { cmd: 'npx pcafe dev <deck>', note: '本地预览，改完内容立刻刷新。' },
            { cmd: 'npx pcafe check <deck>', note: '类型检查、构建和截图 QA，看最后一行。' },
            { cmd: 'npx pcafe build <deck>', note: '输出 dist/<deck>.html，离线单文件。' },
          ]}
          source="README.md CLI 说明"
        />
      ),
    },
    {
      id: 'closing',
      label: '开始',
      render: () => (
        <Closing
          kicker="现在开始"
          mark="251"
          statement="下一份演示，交给 AI 和模板。"
          follow="运行 npx @pcafe/pcafe init my-talk"
          takeaways={[
            '只组合固定模板，每个字段都有内容上限，版面不会乱。',
            'check 最后一行是 PASS 才交付，每页截图都能逐页复查。',
            '一个 HTML 文件离线放映，演讲者视图、画笔、总览都内置。',
          ]}
          refs={['github.com/Web-Casa/pcafe', 'p.cafe']}
        />
      ),
    },
  ],
}
