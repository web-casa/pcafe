// PCafe home page as a deck, `halo` style (minimal creative-agency look).
// Facts come from this repo's own files on 2026-10-30.

import type { DeckDef } from '../../kit'
import { HaloHero, HaloMarquee, HaloRows, StatRow, Statement, Terminal } from '../../kit'
import shotKit from './assets/shot-kit.webp'
import shotOverview from './assets/shot-overview.webp'

export const deck: DeckDef = {
  title: 'PCafe',
  iconStyle: 'linear',
  theme: 'violet',
  style: 'halo',
  transition: 'fade',
  slides: [
    {
      id: 'cover',
      label: '封面',
      render: () => (
        <HaloHero
          kicker="你好，这是 PCafe"
          lines={['让 AI 做演示', '每一页都整齐', '还能直接放映。']}
          serif="整齐"
          lead="开源的 HTML 演示引擎：AI 只挑模板、填内容，排版和动效已经定好。"
          source="README.md；LICENSE（CPAL-1.0）"
        />
      ),
    },
    {
      id: 'problem',
      label: '问题',
      render: () => (
        <Statement
          kicker="问题"
          text={['AI 写得出内容，', '却排不好版面。']}
          marks={['排不好版面']}
          sub="字挤出框、字号被缩小、每页风格不同，是常见的三种乱。"
          source="AGENTS.md 规则所针对的问题"
        />
      ),
    },
    {
      id: 'how',
      label: '做法',
      build: 'reveal',
      render: () => (
        <HaloRows
          kicker="怎么做到"
          title={['固定模板，', '加上内容上限']}
          lead="版式、字号、配色和动效都在模板里定好，写的人只管内容。"
          items={[
            { icon: 'widget', title: '只组合模板', detail: '不改模板，不写自定义 CSS' },
            { icon: 'text', title: '每个字段有上限', detail: '写在 components.md' },
            { icon: 'layers', title: '放不下就拆页', detail: '不缩字号' },
            { icon: 'bookmark', title: '事实带出处', detail: '每页的 source 字段' },
            { icon: 'gallery', title: '图片分三类', detail: '截图、图库照片、装饰插图' },
          ]}
          source="AGENTS.md；docs/zh-CN/guide.md"
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
            { value: '251', label: 'templates', note: '每个都写明用途和内容上限' },
            { value: '33', label: 'styles', note: '换一行 style 就换一身衣服' },
            { value: '5', label: 'themes', note: '配色和风格可以任意组合' },
            { value: '4', label: 'languages', note: '简中、繁中、英文、德文文档' },
          ]}
          names={['CPAL-1.0', 'React', 'Vite', 'Playwright']}
          source="src/kit/catalog.ts；src/kit/theme.ts；docs/；LICENSE；package.json（第 4 期新增风格之前的数）"
        />
      ),
    },
    {
      id: 'showcase',
      label: '模板与风格',
      build: 'reveal',
      render: () => (
        <HaloMarquee
          kicker="模板与风格"
          band="挑一个模板"
          items={[
            { src: shotKit, alt: '模板目录页截图', title: '模板目录：每个模板一页样张', tags: ['#/kit', '内容上限'] },
            { src: shotOverview, alt: '演示总览截图', title: '总览：按 G 看全部页面', tags: ['放映', '总览'] },
          ]}
          source="真实截图，src/decks/studio/assets（界面可能略旧）"
        />
      ),
    },
    {
      id: 'qa',
      label: '检查',
      tone: 'dark',
      render: () => (
        <Statement
          kicker="自动检查"
          text={['最后一行是 PASS，', '才算做完。']}
          marks={['PASS']}
          sub="类型检查、构建，再用浏览器在 4 种窗口尺寸下逐页检查并截图。"
          source="README.md；docs/zh-CN/guide.md"
        />
      ),
    },
    {
      id: 'present',
      label: '放映',
      build: 'reveal',
      render: () => (
        <HaloRows
          kicker="放映"
          title={['讲的时候，', '工具都在键盘上']}
          lead="一个 HTML 文件双击打开，离线就能放映。"
          items={[
            { icon: 'presentation', title: '演讲者视图', detail: 'S：备注、计时、下一页' },
            { icon: 'pen', title: '激光笔与画笔', detail: 'L 激光笔 · D 画笔 · C 清除' },
            { icon: 'search', title: '放大与总览', detail: 'Z 放大 · G 总览' },
            { icon: 'clock', title: '自动播放', detail: 'P' },
            { icon: 'monitor', title: '全屏', detail: 'F' },
            { icon: 'document', title: '导出 PDF', detail: '打开 #/print 再打印' },
          ]}
          source="docs/zh-CN/presenting.md"
        />
      ),
    },
    {
      id: 'ai',
      label: 'AI 工具',
      build: 'reveal',
      render: () => (
        <HaloRows
          kicker="配合 AI 工具"
          title={['让你的 AI 助手', '先读两份说明']}
          lead="规则写在仓库里，AI 每次动手前都会读到。"
          items={[
            { icon: 'document', title: 'AGENTS.md', detail: '必须遵守的规则' },
            { icon: 'book', title: 'skills/pcafe', detail: '把内容对上模板的流程' },
            { icon: 'code', title: 'Claude Code', detail: '读 AGENTS.md 和技能' },
            { icon: 'command', title: 'Codex', detail: '读 AGENTS.md' },
            { icon: 'cursor', title: 'Cursor', detail: '读 AGENTS.md' },
          ]}
          source="AGENTS.md；skills/pcafe/SKILL.md"
        />
      ),
    },
    {
      id: 'start',
      label: '开始',
      render: () => (
        <Terminal
          kicker="快速开始"
          title="四条命令，从空白到单文件"
          window="~/talks"
          prompt="$"
          steps={[
            { cmd: 'npx @pcafe/pcafe init my-talk', note: '新建项目，带好模板和说明文件' },
            { cmd: 'npx pcafe dev my-talk', note: '本地预览，边改边看' },
            { cmd: 'npx pcafe check my-talk', out: ['# last line: PASS or FAIL'], note: '检查全部页面，截图放在 qa/' },
            { cmd: 'npx pcafe build my-talk', out: ['# dist/my-talk.html'], note: '打包成一个离线 HTML 文件' },
          ]}
          source="README.md；skills/pcafe/SKILL.md"
        />
      ),
    },
    {
      id: 'closing',
      label: '结尾',
      render: () => (
        <HaloHero
          kicker="开源 · CPAL-1.0"
          lines={['下一份演示', '交给 AI 和模板']}
          serif="模板"
          command="npx @pcafe/pcafe init my-talk"
          link="github.com/Web-Casa/pcafe"
          source="README.md；LICENSE"
        />
      ),
    },
  ],
}
