// Retro desktop deck for phase 4, in the `desktop` preset. Figures come from
// this project's own files on 2026-10-30. Window chrome is decoration.

import type { DeckDef } from '../../kit'
import { Checklist, Closing, Cover, PixelClosing, RetroLog, RetroTabs, Statement } from '../../kit'

export const deck: DeckDef = {
  title: 'PCafe 复古',
  iconStyle: 'line-duotone',
  theme: 'amber',
  style: 'desktop',
  slides: [
    {
      id: 'cover',
      label: '封面',
      render: () => (
        <Cover
          kicker="第 4 期 · 复古风格"
          title={['老式窗口，', '装新模板']}
          lead="粗黑边框、条纹标题栏、像素小字。这份演示用复古风格回顾四期的变化。"
          numeral="4"
          facts={[
            { label: '模板', value: '103 个' },
            { label: '本期新风格', value: '10 种' },
            { label: '画布', value: '1920×1080' },
          ]}
          hint="按 → 翻页"
        />
      ),
    },
    {
      id: 'log',
      label: '更新日志',
      build: 'reveal',
      render: () => (
        <RetroLog
          kicker="更新日志"
          title="四期下来，模板从 67 到 103"
          file="CHANGELOG.txt"
          entries={[
            { ver: '第 4 期', tag: '风格', text: '一次加入十种新风格，每种一份示范演示' },
            { ver: '第 3 期', tag: '结构', text: '几何与桌面两种风格，加上结构图，共 103 个' },
            { ver: '第 2 期', tag: '图表', text: '等宽黑与贴纸两种风格，加上图表，共 86 个' },
            { ver: '第 1 期', tag: '引擎', text: '风格引擎与面板模板，模板到 67 个' },
          ]}
          note={{ title: 'NOTE.txt', lines: ['风格只换外观', '内容上限不变', '事实照样写出处'] }}
          source="src/decks 下 launch、mono、toy3d 演示；src/kit/theme.ts"
        />
      ),
    },
    {
      id: 'tabs',
      label: '三个角色',
      render: () => (
        <RetroTabs
          kicker="分工"
          title={['点开标签，', '看每一步做什么']}
          lead="写、查、放映三件事分在三个标签里，点标签可以切换。"
          hint="点标签切换"
          file="WORKFLOW.EXE"
          tabs={[
            {
              label: '写演示',
              rows: [
                { icon: 'folder', title: '新建目录', note: '在 src/decks 下建目录，写 index.tsx' },
                { icon: 'layers', title: '只组合模板', note: '不改模板，也不写自定义 CSS' },
                { icon: 'file-search', title: '写出处', note: '每个事实都要有 source，示意要标明' },
              ],
            },
            {
              label: '跑检查',
              rows: [
                { icon: 'test', title: 'npm run check', note: '类型检查、构建、QA 依次执行' },
                { icon: 'monitor', title: '四种窗口', note: 'QA 在四种窗口尺寸下逐页检查' },
                { icon: 'gallery', title: '逐页看截图', note: '每页一张 1920×1080 截图，逐页看' },
              ],
            },
            {
              label: '放映',
              rows: [
                { icon: 'monitor', title: '全屏 F', note: '或点控制栏右侧的按钮' },
                { icon: 'widget', title: '总览 G', note: '方向键选页，Enter 打开，Esc 返回' },
                { icon: 'restart', title: '自动播放 P', note: '每 8 秒前进一步，到最后一页自动停' },
              ],
            },
          ]}
          source="AGENTS.md；docs/README.md 第 1、8、9 节"
        />
      ),
    },
    {
      id: 'styles',
      label: '第 4 期风格',
      render: () => (
        <Statement
          kicker="新风格"
          text={['十种新风格，', '守同一套内容上限']}
          marks={['同一套']}
          sub="第 4 期在 theme.ts 里一次登记了十种风格，模板的字数上限一个都没改。"
          source="src/kit/theme.ts 的 STYLES；docs/components.md"
        />
      ),
    },
    {
      id: 'checklist',
      label: '交付前',
      render: () => (
        <Checklist
          kicker="交付前"
          title="交付前，逐项勾一遍"
          items={[
            { title: '检查通过', cmd: 'npm run check', note: '最后一行输出 PASS' },
            { title: '看过截图', cmd: 'qa/slide-NN-1920x1080.png', note: '逐页看，不留空白过多的页' },
            { title: '事实有出处', cmd: 'source="docs/README.md 第 9 节"', note: '估算和示意要标明' },
            { title: '图标在列表里', cmd: 'src/kit/icon-set.ts', note: '在 #/kit/icons 查名称' },
            { title: '配色写在主题', cmd: "theme: 'amber'", note: '演示和模板里不写死颜色' },
            { title: '文档已更新', cmd: 'npm run docs', note: '改了 catalog.ts 之后运行' },
          ]}
          source="AGENTS.md"
        />
      ),
    },
    {
      id: 'pixel',
      label: '试试看',
      render: () => (
        <PixelClosing
          big="BOOT UP"
          action="打开 #/kit 试试"
          sub="风格切换器里选“复古”，所有模板都换上老式窗口。"
          contacts={[
            { label: '规则', value: 'docs/README.md' },
            { label: '目录', value: 'docs/components.md' },
          ]}
          icon="monitor"
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
          statement="窗口变老了，检查一项不少"
          follow="在 #/kit 用风格切换器看看复古风格"
          takeaways={[
            '粗黑边框、条纹标题栏和硬投影只是装饰，窗口里写的都是真实的规则',
            '更新日志写的是每一期的模板总数，出处是各期的示范演示',
            '复古风格只改字体、底色、边框和阴影，内容上限一个都不变',
          ]}
          refs={['docs/README.md', 'docs/components.md', 'AGENTS.md']}
        />
      ),
    },
  ],
}
