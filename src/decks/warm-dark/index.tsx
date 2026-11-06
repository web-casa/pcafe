// Warm-dark deck for phase 4, in the `warm-dark` preset (dark by default).
// Figures come from this project's own files on 2026-10-30.

import type { DeckDef } from '../../kit'
import { Closing, Cover, Faq, GlowMetric, HairlineGrid, QuoteHero, SectionBreak, Statement } from '../../kit'

export const deck: DeckDef = {
  title: 'PCafe 暖夜',
  iconStyle: 'line-duotone',
  theme: 'amber',
  style: 'warm-dark',
  texture: 'grain',
  slides: [
    {
      id: 'cover',
      label: '封面',
      render: () => (
        <Cover
          kicker="Phase 4 · 暖夜风格"
          title="PCafe"
          subtitle="暖夜"
          lead="一份离线 HTML 演示模板。这一页起，用暖调深色讲清它装了什么、怎么交付。"
          facts={[
            { label: '模板', value: '103 个' },
            { label: '配色', value: '5 套' },
            { label: '端口', value: '5173' },
          ]}
          numeral="04"
          note={['第 4 期新增风格', '整份默认深色']}
        />
      ),
    },
    {
      id: 'size',
      label: '单文件',
      build: 'reveal',
      render: () => (
        <GlowMetric
          kicker="交付物"
          title={['整份演示，', '只有一个文件']}
          lead="构建出的 dist/index.html 内嵌了字体、图片和脚本，双击就能离线放映。"
          figure="6.1"
          unit="MB"
          caption="单文件构建的大小，第 4 期开始前"
          subs={[
            { value: '3.6 MB', label: '其中是内嵌字体' },
            { value: '103', label: '第 4 期前的模板数' },
            { value: '0', label: '放映时的网络请求' },
          ]}
          source="npm run check 构建输出；docs/README.md 第 6 节（不引用远程资源）"
        />
      ),
    },
    {
      id: 'switches',
      label: '六个开关',
      build: 'reveal',
      render: () => (
        <HairlineGrid
          kicker="六个开关"
          title="一份演示，六个字段定风格"
          lead="内容写在模板里，外观由 DeckDef 和 SlideDef 上的字段决定，不写自定义 CSS。"
          focus={0}
          items={[
            { icon: 'tuning', title: '风格', tag: 'DeckDef.style', body: '标题字体、圆角和底色，本页用的就是暖夜。' },
            { icon: 'stars', title: '配色', tag: 'DeckDef.theme', body: '五套强调色，默认绯红，这份演示用橙色。' },
            { icon: 'widget', title: '图标系列', tag: 'iconStyle', body: '整份演示统一一个图标系列，默认 line-duotone。' },
            { icon: 'layers', title: '明暗', tag: 'SlideDef.tone', body: '单页设为深色或强调色整页，只用于指定模板。' },
            { icon: 'list', title: '逐条展开', tag: 'SlideDef.build', body: '设为 reveal 后，翻页键一条一条显示要点。' },
            { icon: 'bookmark', title: '出处', tag: 'source', body: '每个事实写明来源，估算或示意要标出来。' },
          ]}
          source="AGENTS.md；docs/README.md 第 13、14 节"
        />
      ),
    },
    {
      id: 'fonts',
      label: '字体',
      tone: 'accent',
      render: () => (
        <Statement
          kicker="打包构成"
          text={['6.1 MB 里，', '3.6 MB 是字体']}
          marks={['3.6 MB']}
          sub="中文字体已经按用到的字裁剪，仍是单文件里最大的一块。"
          source="npm run check 构建输出，第 4 期开始前"
        />
      ),
    },
    {
      id: 'ch-check',
      label: '交付',
      render: () => (
        <SectionBreak
          kicker="第二部分"
          index={2}
          icon="verified"
          title={['怎样才算', '做完']}
          lead="写完内容不算完成。检查通过、逐页看过截图，才能交出去。"
          contents={['完成的标准', '常被问到的事', '结论']}
        />
      ),
    },
    {
      id: 'rule',
      label: '标准',
      render: () => (
        <QuoteHero
          kicker="完成的标准"
          quote={['npm run check 最后输出 PASS，', '并且逐页看过 1920×1080 的截图。']}
          marks={['PASS']}
          cite="AGENTS.md"
          notes={[
            { icon: 'monitor', label: '四种窗口', text: 'QA 在四种窗口尺寸下逐页检查。' },
            { icon: 'text', label: '最小字号', text: '画布上的字不小于 17u，QA 会检查。' },
            { icon: 'global', label: '不联网', text: '引用远程字体、图片或脚本时构建报错。' },
          ]}
          source="AGENTS.md；docs/README.md 第 6、8 节"
        />
      ),
    },
    {
      id: 'faq',
      label: '常见问题',
      build: 'reveal',
      render: () => (
        <Faq
          kicker="常见问题"
          title="动手前常被问到的六件事"
          items={[
            { q: '内容放不下怎么办？', a: '拆成两页。不要缩小字号，每个字段都有内容上限。', tag: 'components.md' },
            { q: '能自己写 CSS 吗？', a: '不能。只组合 src/kit 里的模板，需要别的效果就换模板。', tag: 'AGENTS.md' },
            { q: '可以放图片吗？', a: '只放真实截图，放在演示目录的 assets 下用 import 引入。', tag: 'README §15' },
            { q: '深色页能用多少？', a: '一份演示里不超过三分之一，最好放在每章的首尾。', tag: 'README §13' },
            { q: '图标从哪里选？', a: '只用 src/kit/icon-set.ts 里的名称，在 #/kit/icons 可以查到。', tag: 'AGENTS.md' },
            { q: '改了模板目录之后呢？', a: '改了 src/kit/catalog.ts 之后，运行一次命令重新生成文档。', tag: 'npm run docs' },
          ]}
          source="AGENTS.md；docs/README.md 第 6、13、15 节；src/kit/icon-set.ts"
        />
      ),
    },
    {
      id: 'close',
      label: '结论',
      render: () => (
        <Closing
          kicker="结论"
          mark="04"
          statement="选风格，填事实，跑检查。"
          follow="外观交给预设，页面只写有出处的内容。"
          takeaways={[
            '风格写在 DeckDef.style，暖夜整份默认深色。',
            '每个字段守住内容上限，放不下就拆成两页。',
            '检查输出 PASS，再逐页看过截图，才算完成。',
          ]}
          refs={['AGENTS.md', 'docs/README.md', 'docs/components.md']}
        />
      ),
    },
  ],
}
