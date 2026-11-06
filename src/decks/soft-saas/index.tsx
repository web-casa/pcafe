// Soft SaaS deck for phase 4, in the `soft-saas` preset. Figures come from
// this project's own files on 2026-10-30. The calendar on the booking slide
// is an illustration (示意), not a real schedule.

import type { DeckDef } from '../../kit'
import { Closing, Faq, HangingCover, NumberedColumns, SlotPicker, ToggleCard, UiSteps } from '../../kit'

export const deck: DeckDef = {
  title: 'PCafe 轻柔',
  iconStyle: 'line-duotone',
  theme: 'cobalt',
  style: 'soft-saas',
  slides: [
    {
      id: 'cover',
      label: '封面',
      render: () => (
        <HangingCover
          tag={{ label: '第 4 期', text: '轻柔风格' }}
          title={['做一份演示，', '像约一次会一样简单']}
          mark="简单"
          lead="白底、淡蓝、圆角卡片和小界面，讲讲怎样新建一份演示。"
          icons={['calendar', 'clock', 'check', 'presentation', 'users', 'bell', 'document', 'stars']}
          pills={['7 页', '2026 年 10 月']}
        />
      ),
    },
    {
      id: 'steps',
      label: '三步新建',
      build: 'reveal',
      render: () => (
        <UiSteps
          kicker="新建演示"
          title="三步，从空目录到 PASS"
          lead="新演示放在自己的目录里，只组合模板，不动模板。"
          steps={[
            { title: '建目录', text: '在 src/decks 下新建目录，用 index.tsx 导出 deck 对象。', ui: { kind: 'field', label: '演示文件', value: 'src/decks/demo/index.tsx' } },
            { title: '选配色', text: '在 DeckDef.theme 里选一套配色，默认是绯红。', ui: { kind: 'options', items: ['crimson', 'cobalt', 'emerald'], on: 1 } },
            { title: '跑检查', text: '运行 npm run check，最后一行输出 PASS 才算完成。', ui: { kind: 'done', text: '最后一行：PASS' } },
          ]}
          source="AGENTS.md；src/kit/theme.ts"
        />
      ),
    },
    {
      id: 'booking',
      label: '约评审',
      render: () => (
        <SlotPicker
          kicker="评审"
          title={['约个时间，', '一起逐页看截图']}
          lead="检查通过之后，还要逐页看一遍截图。日期和时间段是示意，点一下可以切换。"
          hint="点日期或时间段试试"
          card={{ title: '截图评审', meta: '30 分钟' }}
          month="2026 年 11 月"
          start={6}
          days={30}
          open={[3, 4, 5, 10, 11, 12, 17, 18]}
          day={4}
          slots={[
            { time: '10:00', note: '上午' },
            { time: '14:00', note: '下午' },
            { time: '16:30', note: '下午' },
            { time: '19:00', note: '晚上' },
          ]}
          pick={1}
          source="示意；逐页看截图的要求见 docs/README.md 第 1 节"
        />
      ),
    },
    {
      id: 'settings',
      label: '风格设置',
      render: () => (
        <ToggleCard
          kicker="设置"
          title={['整份演示，', '只写四个字段']}
          lead="外观由 DeckDef 上的几个字段决定，模板里不写颜色。开关只是演示，不会真的切换。"
          hint="点开关试试"
          file="DeckDef"
          rows={[
            { icon: 'tuning', label: 'theme', note: '配色，5 套里选一套，默认绯红', on: true },
            { icon: 'text', label: 'style', note: '字体与外观风格，这份用轻柔', on: true },
            { icon: 'stars', label: 'iconStyle', note: '图标系列，默认 line-duotone', on: true },
            { icon: 'layers', label: 'build', note: '写在每页上，逐条展开', on: false },
          ]}
          source="AGENTS.md；src/kit/theme.ts"
        />
      ),
    },
    {
      id: 'principles',
      label: '四条原则',
      build: 'reveal',
      render: () => (
        <NumberedColumns
          kicker="原则"
          title="四条原则，换风格也不变"
          items={[
            { tag: 'components.md', title: '内容有上限', body: '每个字段都有字数上限，放不下就拆页，不要缩小字号。', icon: 'text' },
            { tag: 'source', title: '事实有出处', body: '每个事实都写清出处；估算和示意的地方要明确标出来。', icon: 'file-search' },
            { tag: 'icon-set.ts', title: '图标用内置', body: '图标只用内置名称，不放图片、别的图标库或者 emoji。', icon: 'stars' },
            { tag: 'assets/', title: '图片要真实', body: '图片只放真实截图；装饰插图要以 decor- 开头命名。', icon: 'gallery' },
          ]}
          source="AGENTS.md"
        />
      ),
    },
    {
      id: 'faq',
      label: '常见问题',
      render: () => (
        <Faq
          kicker="常见问题"
          title="第一次做演示，常问这六件事"
          items={[
            { q: '可以改模板的样式吗？', a: '不可以。只组合 src/kit 里的模板，不改模板，也不写自定义 CSS。', tag: 'AGENTS.md' },
            { q: '内容放不下怎么办？', a: '拆成两页。每个字段都有内容上限，不要靠缩小字号塞进去。', tag: 'components.md' },
            { q: '本地怎么预览？', a: '运行开发服务器，在浏览器里打开 5173 端口。', tag: 'npm run dev' },
            { q: '改了模板目录要做什么？', a: '改了 catalog.ts 之后运行 npm run docs，重新生成文档。', tag: 'npm run docs' },
            { q: '图标去哪里查？', a: '打开 #/kit/icons 查看，只用 icon-set.ts 里列出的名称。', tag: 'icon-set.ts' },
            { q: '颜色可以写死吗？', a: '不可以。配色写在 DeckDef.theme，演示和模板里都不写死颜色。', tag: 'theme.ts' },
          ]}
          source="AGENTS.md；package.json scripts"
        />
      ),
    },
    {
      id: 'close',
      label: '结尾',
      render: () => (
        <Closing
          kicker="最后"
          mark="4"
          statement="界面变软了，规则还是硬的"
          follow="在 #/kit 用风格切换器看看轻柔风格"
          takeaways={[
            '日历和时间段是示意的小界面，日期不是真实日程，要在图注里写明',
            '新建演示三步走：建目录、选配色、跑检查，最后一行是 PASS',
            '轻柔风格只改字体、底色、圆角和阴影，内容上限一个都不变',
          ]}
          refs={['docs/README.md', 'docs/components.md', 'AGENTS.md']}
        />
      ),
    },
  ],
}
