// PCafe introduction: a 7-slide deck about this project, built only from
// the project's own docs (docs/README.md, docs/components.md) and the
// build output. Bento is intentionally not used.

import type { DeckDef } from '../../kit'
import { Checklist, Closing, Cover, KeyValue, NumberedColumns, SpotlightList, StepTrack, VerdictColumns } from '../../kit'

const README = 'docs/README.md'

export const deck: DeckDef = {
  title: 'PCafe Introduction',
  slides: [
    {
      id: 'cover',
      label: '封面',
      render: () => (
        <Cover
          kicker="PCafe · 项目介绍"
          title="PCafe"
          subtitle="templates"
          lead="用 12 个固定模板拼出 16:9 的 HTML 演示，输出一个可以离线打开的文件。"
          facts={[
            { label: '模板', value: '12 个' },
            { label: '画布', value: '1920×1080' },
            { label: '输出', value: '单个文件' },
          ]}
          numeral="12"
          note={['出处 docs/README.md', '与 docs/components.md']}
          hint={
            <>
              按 <kbd>→</kbd> 翻页
            </>
          }
        />
      ),
    },
    {
      id: 'spec',
      label: '规格',
      render: () => (
        <SpotlightList
          kicker="规格"
          title={['版式固定，', '规格有硬指标']}
          lead="画布 1920 × 1080 等比缩放，QA 在 4 种窗口下逐页检查，最小字号 17u。"
          items={[
            { name: '固定模板', value: '12', tag: '不改模板' },
            { name: 'QA 窗口', value: '4 种' },
            { name: '最小字号', value: '17u' },
            { name: '参考演示', value: '12 页' },
          ]}
          detail={
            <KeyValue
              rows={[
                { key: '画布', value: '1920 × 1080，等比缩放' },
                { key: '产物', value: 'dist/index.html，约 3.14 MB' },
                { key: '网络请求', value: '0 个，可离线打开' },
              ]}
            />
          }
          source={`${README} §6 · §8；产物大小为 npm run build 的 dist/index.html 实测`}
        />
      ),
    },
    {
      id: 'modules',
      label: '模板',
      render: () => (
        <NumberedColumns
          kicker="模板"
          title={['12 个模板，', '各管一类页面']}
          lead="按用途分四组。每个模板都是一页的完整版式，内容全部通过 props 传入。"
          items={[
            { tag: 'Overview', title: '开场与总览', body: 'Cover 封面给出主题，Bento 用 6 张卡片概括全局。' },
            { tag: 'Data', title: '数据与时间', body: 'MetricBars 比较数量，SpotlightList 突出一项，Timeline 排周期。' },
            { tag: 'Compare', title: '对比与要点', body: 'CompareTable 逐行对比，VerdictColumns 给结论。' },
            { tag: 'Action', title: '操作与收尾', body: 'Checklist 逐项勾选，StepTrack 排顺序，Teaser 预告，Closing 收尾。' },
          ]}
          source="docs/components.md"
        />
      ),
    },
    {
      id: 'rules',
      label: '写法',
      render: () => (
        <VerdictColumns
          kicker="写法"
          title={['照着模板写，', '效果才一致']}
          lead="规则来自手册：不改模板，字号不够就拆页，每条事实都要有出处。"
          groups={[
            {
              tone: 'go',
              label: '直接做',
              items: [
                { title: '选模板、填 props', body: '内容通过 props 传入，不改模板本身。' },
                { title: '按上限自查', body: '对照 components.md 的内容上限逐页检查。' },
              ],
            },
            {
              tone: 'plan',
              label: '先拆页',
              items: [
                { title: '内容超出上限', body: '拆成两页，不要缩小字号硬塞。' },
                { title: '一页讲两个观点', body: '每页只证明一个观点，超出就拆页。' },
              ],
            },
            {
              tone: 'stop',
              label: '不要做',
              items: [
                { title: '自定义 CSS 或内联样式', body: '字号、间距、颜色都在模板里。' },
                { title: '图片、图标库或 emoji', body: '图形全部用 DOM 与 CSS 绘制。' },
              ],
            },
          ]}
          source={`${README} §2 · §5 · §6 · §8`}
        />
      ),
    },
    {
      id: 'workflow',
      label: '工作流',
      render: () => (
        <StepTrack
          kicker="工作流"
          title="五步完成，以 PASS 结束"
          lead="按顺序做，不要跳步。第五步输出 PASS，才算一份演示完成。"
          steps={[
            { title: '收集事实', body: '每个数字、日期、版本号都要带出处。' },
            { title: '写故事线', body: '先写听众要记住的一句话，再排各页。' },
            { title: '选模板', body: '用决策表选模板，相邻两页不要重复。' },
            { title: '填内容', body: '每页填完，对照内容上限自查一遍。' },
            { title: '跑检查', body: '运行检查命令，输出 PASS 才算通过。', cmd: 'npm run check' },
          ]}
          after={{ label: '常用命令', cmds: ['npm run dev', 'npm run check', 'npm run docs'] }}
          source={`${README} §0 · §1`}
        />
      ),
    },
    {
      id: 'checklist',
      label: '交付前',
      render: () => (
        <Checklist
          kicker="交付前"
          title="交付前，逐项确认"
          items={[
            { title: '每条事实都有出处', note: 'source 写明文档名与章节' },
            { title: '没有自定义 CSS 和内联样式', note: '样式全部来自模板' },
            { title: '强调色每页只出现在一个焦点', note: '不要在文字里另加颜色' },
            { title: '检查命令输出 PASS', cmd: 'npm run check', note: 'FAIL 时按手册第 8 节修复' },
            { title: '逐页看过截图', cmd: 'qa/slide-01-1920x1080.png', note: '确认没有空白过多或一页塞太满' },
            { title: '拿不准的写法', cmd: 'npm run dev', note: '打开 #/kit 组件库或参考演示' },
          ]}
          source={`${README} §1 · §6 · §8`}
        />
      ),
    },
    {
      id: 'closing',
      label: '结论',
      render: () => (
        <Closing
          kicker="结论"
          mark="12"
          statement="用模板填内容，不写新版式。"
          follow="放不下就拆页，字号不缩小。"
          takeaways={['选模板、填内容、跑检查，三步完成一份演示。', '不改模板、不写自定义 CSS，效果与参考一致。', '拿不准的写法，打开 #/kit 或参考演示 src/decks/release。']}
          refs={['docs/README.md', 'docs/components.md', 'src/decks/release/index.tsx']}
        />
      ),
    },
  ],
}
