// Playful deck for phase 4, in the `playful` preset. Facts come from this
// project's own docs and files on 2026-10-30.

import type { DeckDef } from '../../kit'
import { ChatThread, Closing, Cover, NoteCards, StatRow, Statement } from '../../kit'

export const deck: DeckDef = {
  title: 'PCafe 糖果',
  iconStyle: 'bold-duotone',
  theme: 'crimson',
  style: 'playful',
  slides: [
    {
      id: 'cover',
      label: '封面',
      render: () => (
        <Cover
          kicker="第 4 期 · 糖果风格"
          title="PCafe"
          subtitle="糖果"
          lead="第一次用这套模板？先听听新手最常问的几件事，再看四条视觉规则。"
          facts={[
            { label: '模板', value: '103 个' },
            { label: '配色', value: '5 套' },
            { label: '画布', value: '1920×1080' },
          ]}
          numeral="4"
          note={['第 4 期新增风格', '圆润、明快']}
        />
      ),
    },
    {
      id: 'chat',
      label: '新手问答',
      build: 'reveal',
      render: () => (
        <ChatThread
          kicker="新手问答"
          title={['第一次上手，', '先问这三句']}
          lead="问题来自工作流，回答都写在 README 和 AGENTS.md 里。"
          names={{ q: '新同事', a: '文档' }}
          messages={[
            { from: 'q', text: '新演示放在哪里？' },
            { from: 'a', text: '放在 src/decks 下自己的文件夹，在 active.ts 里切换。' },
            { from: 'q', text: '内容放不下，能缩小字号吗？' },
            { from: 'a', text: '不能。每个字段都有内容上限，放不下就拆成两页。' },
            { from: 'q', text: '什么时候算做完？' },
            { from: 'a', text: 'npm run check 最后输出 PASS，并且逐页看过截图。' },
          ]}
          source="AGENTS.md；docs/README.md 第 1、4 节"
        />
      ),
    },
    {
      id: 'rules',
      label: '视觉规则',
      build: 'reveal',
      render: () => (
        <NoteCards
          kicker="视觉规则"
          title="模板做好的事，别去破坏"
          notes={[
            { icon: 'code', title: '不写 CSS', body: '不写自定义 CSS 和内联样式，要别的效果就换模板。' },
            { icon: 'stars', title: '一页一个焦点', body: '强调色只由模板来用，内容里不另加颜色或加粗。' },
            { icon: 'widget', title: '只用内置图标', body: '图标从内置的 Solar 图标里选，不放 emoji。' },
            { icon: 'global', title: '不连网络', body: '不引用远程字体、图片和脚本，否则构建报错。' },
          ]}
          source="docs/README.md 第 6 节"
        />
      ),
    },
    {
      id: 'numbers',
      label: '数字',
      build: 'reveal',
      render: () => (
        <StatRow
          kicker="家底"
          title="可以挑的，比想象的多"
          stats={[
            { label: 'templates', value: '103', note: '第 4 期开始前的模板数' },
            { label: 'themes', value: '5', note: '强调色配色，默认绯红' },
            { label: 'icon styles', value: '6', note: '图标系列，整份演示选一种' },
            { label: 'icons', value: '121', note: '精选的 Solar 图标' },
          ]}
          names={['React 19', 'Vite', 'motion', 'Playwright', 'Solar Icons', 'Plus Jakarta Sans']}
          source="src/kit/catalog.ts · src/kit/theme.ts · src/kit/Icon.tsx · src/kit/icon-set.ts"
        />
      ),
    },
    {
      id: 'chat-style',
      label: '选风格',
      build: 'reveal',
      render: () => (
        <ChatThread
          kicker="选风格"
          title={['风格和配色，', '怎么挑？']}
          lead="两者互相独立，任意组合。先看样张再决定。"
          names={{ q: '新同事', a: '文档' }}
          messages={[
            { from: 'q', text: '风格写在哪里？' },
            { from: 'a', text: '写在 DeckDef.style，先在 #/kit 的风格切换器里看样张。' },
            { from: 'q', text: '配色呢？' },
            { from: 'a', text: '写在 DeckDef.theme，五套里选一套，默认绯红。' },
          ]}
          source="AGENTS.md；docs/README.md 第 13 节"
        />
      ),
    },
    {
      id: 'one-line',
      label: '一句话',
      tone: 'accent',
      render: () => (
        <Statement
          kicker="记住这句"
          text={['事实要有出处，', '查不到的不写']}
          marks={['出处']}
          sub="估算或示意要标明，写在每页的 source 里。"
          source="AGENTS.md；docs/README.md 第 7 节"
        />
      ),
    },
    {
      id: 'close',
      label: '结论',
      render: () => (
        <Closing
          kicker="结论"
          mark="4"
          statement="照规则来，就不会出错。"
          follow="先看文档，再动手组合模板。"
          takeaways={[
            '新演示放进 src/decks 自己的文件夹，再切换过去。',
            '放不下就拆页，每个字段都守住内容上限。',
            '检查输出 PASS，再逐页看过截图，才算完成。',
          ]}
          refs={['AGENTS.md', 'docs/README.md', 'docs/components.md']}
        />
      ),
    },
  ],
}
