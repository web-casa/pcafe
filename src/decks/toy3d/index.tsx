// Toy3d deck for phase 3, in the `toy3d` preset. Figures come from this
// project's own files on 2026-10-30. The 3D objects are CSS decoration only.

import type { DeckDef } from '../../kit'
import { Closing, Concentric, DecisionTree, DuoCards, FloatCover, GlowStack, Pyramid, ServiceIndex, TileWall, Venn } from '../../kit'

export const deck: DeckDef = {
  title: 'PCafe 几何',
  iconStyle: 'line-duotone',
  theme: 'amber',
  style: 'toy3d',
  transition: 'slide',
  slides: [
    {
      id: 'cover',
      notes: '开场先说数字：第 3 期结束时一共 103 个模板。',
      label: '封面',
      render: () => (
        <FloatCover
          kicker="第 3 期 · 2026 年 10 月"
          title={['给演示加点', '立体的玩具']}
          lead="这一期加了两种风格、17 个模板：3D 几何、系统桌面和九种结构图。"
          marquee="PCAFE"
          card={{ label: 'TEMPLATES', value: '103', note: '模板总数，第 2 期结束时是 86' }}
          source="src/kit/catalog.ts，2026-10-30 统计"
        />
      ),
    },
    {
      id: 'parts',
      label: '新零件',
      build: 'reveal',
      render: () => (
        <TileWall
          kicker="新零件"
          title={['九个零件，', '模板拿来就用']}
          lead="都用 CSS 画成，不需要图片。它们只做装饰，不承载事实。"
          tiles={[
            { icon: 'planet', label: '球体' },
            { icon: 'box', label: '立方体' },
            { icon: 'refresh', label: '圆环' },
            { icon: 'bolt', label: '胶囊' },
            { icon: 'text', label: '跑马灯' },
            { icon: 'window', label: '系统窗口' },
            { icon: 'tuning', label: '开关' },
            { icon: 'widget', label: '程序坞' },
            { icon: 'folder', label: '桌面图标' },
          ]}
          source="src/kit/shapes.tsx"
        />
      ),
    },
    {
      id: 'steps',
      notes: '强调第四步：PASS 之后还要人工逐页看截图。',
      label: '做一页',
      build: 'reveal',
      render: () => (
        <ServiceIndex
          kicker="工作流"
          title="做好一页，按四步走"
          items={[
            { title: '收集事实', text: '每个数字、日期、版本号连同出处整理好，查不到出处的不写。' },
            { title: '选模板', text: '按决策表给每页挑模板，同一个模板一份演示里最多用两次。' },
            { title: '跑检查', text: '运行 npm run check，只要出现 FAIL 就一定要修。' },
            { title: '看截图', text: '逐页看 qa 目录里的截图，确认不空、不挤、重点突出。' },
          ]}
          source="docs/README.md 第 1 节"
        />
      ),
    },
    {
      id: 'next',
      label: '本期与下期',
      render: () => (
        <GlowStack
          kicker="路线"
          title={['这一期做完，', '下一期接着来']}
          lead="五期计划里，前三期做风格和模板，第五期补放映功能和每种风格的示例。"
          front={{ label: 'PHASE 3 · 本期', title: '几何与桌面', items: ['toy3d、wallpaper 两种风格', '8 个风格模板', '9 种结构图'] }}
          back={{ label: 'PHASE 4 · 下期', title: '十种新风格' }}
          source="项目路线图，2026-10-30"
        />
      ),
    },
    {
      id: 'outputs',
      label: '两种用法',
      build: 'reveal',
      render: () => (
        <DuoCards
          kicker="两种用法"
          title="发出去，或者边改边看"
          cards={[
            { name: '单文件', value: '6.1', unit: 'MB', note: 'dist/index.html，双击就能离线放映', items: ['字体、图片全部内嵌', '不发任何网络请求', '可以直接发给别人'] },
            { name: '开发服务器', value: '5173', unit: '端口', note: 'npm run dev，改完内容立刻刷新', items: ['#/kit 查看组件库', '#/N 跳到第 N 页', 'G 键打开总览'] },
          ]}
          source="npm run check 构建输出；docs/README.md 第 9 节"
        />
      ),
    },
    {
      id: 'ship',
      label: '交付条件',
      build: 'reveal',
      render: () => (
        <Pyramid
          kicker="交付条件"
          title={['一页能交付，', '要先站稳底层']}
          levels={[
            { label: '人工看图', note: '逐页看过 1920×1080 截图，没有空白过多或塞太满' },
            { label: 'QA 通过', note: 'npm run check 最后输出 PASS' },
            { label: '守内容上限', note: '每个字段不超过 components.md 写的上限，放不下就拆页' },
            { label: '事实有出处', note: '每个事实写进 source，估算或示意要标明' },
          ]}
          source="AGENTS.md；docs/README.md 第 1、7 节"
        />
      ),
    },
    {
      id: 'parts-of-deck',
      label: '三个开关',
      build: 'reveal',
      render: () => (
        <Venn
          kicker="三个开关"
          title={['三个设置，', '叠出一份演示']}
          lead="模板写在每页，风格写在 DeckDef.style，配色写在 DeckDef.theme。三者互不干扰，可以随意组合。"
          sets={[
            { label: '模板', note: '布局与内容上限' },
            { label: '风格', note: '字体与圆角' },
            { label: '配色', note: '主色与浅底' },
          ]}
          overlap="一份演示"
          source="AGENTS.md；src/kit/theme.ts"
        />
      ),
    },
    {
      id: 'rings',
      label: '项目结构',
      build: 'reveal',
      render: () => (
        <Concentric
          kicker="项目结构"
          title={['由内到外，', '四层目录']}
          rings={[
            { label: '模板', note: 'src/kit：模板和零件，写演示时不改' },
            { label: '演示', note: 'src/decks：每份演示一个文件夹，只组合模板' },
            { label: '文档', note: 'docs：工作流、规则和模板目录' },
            { label: '脚本', note: 'scripts：字体子集、生成文档、QA 检查' },
          ]}
          source="项目目录，2026-10-30"
        />
      ),
    },
    {
      id: 'chart-pick',
      label: '选图表',
      build: 'reveal',
      render: () => (
        <DecisionTree
          kicker="选图表"
          title="想比的是什么？"
          root={{
            q: '数据跟时间有关吗？',
            yes: { q: '只有两个时间点吗？', yes: { leaf: 'SlopeRank', note: '前后排名变化' }, no: { leaf: 'LineChart', note: '连续走势' } },
            no: { q: '是整体里的占比吗？', yes: { leaf: 'Donut', note: '各部分加起来是整体' }, no: { leaf: 'BarChart', note: '几项数量比大小' } },
          }}
          source="docs/components.md 各图表模板的适用场景"
        />
      ),
    },
    {
      id: 'close',
      notes: '收尾时打开 #/kit 现场演示风格切换器。',
      label: '结尾',
      render: () => (
        <Closing
          kicker="最后"
          mark="103"
          statement="装饰可以好玩，事实必须有出处"
          follow="打开 #/kit 看全部模板，挑一个开始"
          takeaways={[
            '3D 几何、跑马灯都是 CSS 画的装饰，只放在不承载事实的位置',
            '九种结构图各有内容上限，放不下就拆成两页，不要缩小字号',
            '每一页都要跑 npm run check 并逐页看截图，PASS 之后才算完成',
          ]}
          refs={['docs/README.md', 'docs/components.md', 'AGENTS.md']}
        />
      ),
    },
  ],
}
