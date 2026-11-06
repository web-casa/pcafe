// Bento deck for phase 4, in the `bento` preset. Figures come from this
// project's own files on 2026-10-30.

import type { DeckDef } from '../../kit'
import { BentoBoard, BentoSpotlight, Closing, Cover, Donut, IconGrid, StepTrack } from '../../kit'

export const deck: DeckDef = {
  title: 'PCafe 格子',
  iconStyle: 'line-duotone',
  theme: 'cobalt',
  style: 'bento',
  slides: [
    {
      id: 'cover',
      label: '封面',
      render: () => (
        <Cover
          kicker="第 4 期 · 格子风格"
          title={['一格，', '说一件事']}
          lead="浅灰底、白方块、等宽小标签。这份演示用格子风格介绍 PCafe 的家底。"
          numeral="103"
          facts={[
            { label: '模板', value: '103 个' },
            { label: '配色', value: '5 套' },
            { label: '单文件', value: '≈6.1 MB' },
          ]}
          hint="按 → 翻页"
        />
      ),
    },
    {
      id: 'board',
      label: '全貌',
      build: 'reveal',
      render: () => (
        <BentoBoard
          kicker="全貌"
          title={['一个文件，', '装下整份演示']}
          lead="模板、字体、图标都打进同一个 HTML，双击就能放映。"
          stats={[
            { label: 'TEMPLATES', value: '103', unit: '个', note: '第 4 期之前的模板总数' },
            { label: 'DEV PORT', value: '5173', note: '本地开发服务器端口' },
            { label: 'SINGLE FILE', value: '6.1', unit: 'MB', note: '约数，其中字体约 3.6 MB' },
          ]}
          note={{ label: 'RULE', text: '每个字段都有内容上限。放不下就拆页，不缩字号，也不写自定义 CSS。' }}
          chips={{
            label: 'KEYS',
            items: [
              { icon: 'monitor', label: '全屏 F' },
              { icon: 'restart', label: '自动播放 P' },
              { icon: 'widget', label: '总览 G' },
              { icon: 'home', label: '首页 Home' },
              { icon: 'flag', label: '末页 End' },
            ],
          }}
          source="docs/README.md 第 6、9 节；vite 开发配置；构建输出"
        />
      ),
    },
    {
      id: 'single-file',
      label: '单文件',
      build: 'reveal',
      render: () => (
        <BentoSpotlight
          kicker="构建"
          title="断网也能放映"
          lead="构建产物是 dist/index.html 一个文件，不引用任何远程资源。"
          hero={{
            icon: 'file-check',
            label: 'dist/index.html',
            title: '一个离线文件',
            text: '字体、脚本和样式全部内嵌，双击就能在浏览器里放映，不发任何网络请求。',
          }}
          cells={[
            { label: 'BUILD SIZE', value: '≈6.1 MB', note: '整个单文件的大小' },
            { label: 'FONTS', value: '≈3.6 MB', note: '其中字体占的部分' },
          ]}
          rows={{
            label: 'NPM SCRIPTS',
            items: [
              { k: 'npm run check', v: '类型检查、构建、QA' },
              { k: 'npm run docs', v: '改了 catalog.ts 后重新生成文档' },
              { k: 'npm run dev', v: '开发服务器，端口 5173' },
            ],
          }}
          source="package.json scripts；docs/README.md 第 6、9 节；构建输出"
        />
      ),
    },
    {
      id: 'weight',
      label: '体积构成',
      render: () => (
        <Donut
          kicker="体积"
          title={['一半以上的体积，', '是字体']}
          lead="单文件约 6.1 MB，字体约 3.6 MB，其余是脚本、样式和图标。"
          segments={[
            { label: '字体', value: 3.6, note: '中西文子集' },
            { label: '其余', value: 2.5, note: '脚本、样式、图标' },
          ]}
          center={{ value: '59%', label: '字体占比' }}
          unit="MB"
          decimals={1}
          focus={0}
          source="npm run check 构建输出，约数"
        />
      ),
    },
    {
      id: 'rules',
      label: '六条规则',
      build: 'reveal',
      render: () => (
        <IconGrid
          kicker="规则"
          title="写演示时，只守这六条"
          items={[
            { icon: 'layers', title: '只组合模板', tag: 'src/kit', body: '只组合现有模板，不改模板，不写自定义 CSS。' },
            { icon: 'text', title: '守内容上限', tag: 'components.md', body: '每个字段都有字数上限，放不下就拆成两页。' },
            { icon: 'file-search', title: '事实有出处', tag: 'source', body: '每个事实都写清出处，估算或示意要明确标出来。' },
            { icon: 'stars', title: '只用内置图标', tag: 'icon-set.ts', body: '图标只用内置名称，不放图片、别的图标库或 emoji。' },
            { icon: 'tuning', title: '配色写在主题', tag: 'theme', body: '颜色只在 DeckDef.theme 里选，不在演示里写死。' },
            { icon: 'test', title: '检查到 PASS', tag: 'npm run check', body: '最后一行是 PASS，并逐页看过截图才算完成。' },
          ]}
          source="AGENTS.md"
        />
      ),
    },
    {
      id: 'steps',
      label: '四步',
      build: 'reveal',
      render: () => (
        <StepTrack
          kicker="工作流"
          title="一份演示，四步做完"
          steps={[
            { title: '收集事实', body: '每个数字、日期连同出处一起整理好。' },
            { title: '写故事线', body: '先写最后一页的那句结论，再排页序。' },
            { title: '选模板填内容', body: '对照内容上限，逐页自查。', cmd: 'src/decks/<name>/index.tsx', config: true },
            { title: '检查', body: '出现 FAIL 就修，再逐页看截图。', cmd: 'npm run check' },
          ]}
          source="docs/README.md 第 1 节"
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
          statement="格子换了，规则没变"
          follow="在 #/kit 用风格切换器看看格子风格"
          takeaways={[
            '格子风格只改底色、圆角、字体和小标签，模板的内容上限一个都不变',
            '一页最多六格：一格标题，三格数字，一格文字，一格图标',
            '数字照样写进 source，估算的数字在格子里也要标成约数',
          ]}
          refs={['docs/README.md', 'docs/components.md', 'AGENTS.md']}
        />
      ),
    },
  ],
}
