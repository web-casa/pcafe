// Wallpaper deck for phase 3, in the `wallpaper` preset. Figures come from
// this project's own files on 2026-10-30. Window chrome, the dock and the
// switches are decoration; the switches flip but control nothing.

import type { DeckDef } from '../../kit'
import { ArchLayers, Balance, Closing, Desktop, DoubleFunnel, Fishbone, Swimlane, ToggleCard, WindowStack } from '../../kit'

export const deck: DeckDef = {
  title: 'PCafe 桌面',
  iconStyle: 'line-duotone',
  theme: 'violet',
  style: 'wallpaper',
  slides: [
    {
      id: 'desktop',
      label: '封面',
      render: () => (
        <Desktop
          kicker="第 3 期"
          title={['把演示', '放进桌面']}
          lead="壁纸、窗口、程序坞都是 CSS 画的。内容还是那些模板，只是换了一身衣服。"
          file="phase-3.deck"
          apps={[
            { icon: 'window', label: '窗口' },
            { icon: 'tuning', label: '开关' },
            { icon: 'structure', label: '结构图' },
            { icon: 'diagram', label: '泳道' },
            { icon: 'layers', label: '分层' },
            { icon: 'weight-scale', label: '天平' },
            { icon: 'filter', label: '双漏斗' },
            { icon: 'bug', label: '鱼骨图' },
          ]}
          dock={[
            { icon: 'code', label: 'src/kit' },
            { icon: 'documents', label: 'docs' },
            { icon: 'test', label: 'qa' },
            { icon: 'presentation', label: 'decks' },
            { icon: 'settings', label: 'scripts' },
          ]}
          clock={{ time: '10.30', date: '2026 年 · 星期五' }}
        />
      ),
    },
    {
      id: 'windows',
      label: '三个窗口',
      build: 'reveal',
      render: () => (
        <WindowStack
          kicker="一页怎么来"
          title={['三个窗口，', '一页演示']}
          lead="写内容、跑检查、看截图，每一步都在自己的窗口里完成。"
          windows={[
            { title: 'index.tsx', heading: '写内容', lines: ['在 src/decks 里组合模板，填好每个字段', '不改模板，不写自定义 CSS'] },
            { title: 'npm run check', heading: '跑检查', lines: ['类型检查、构建、QA 依次执行', '最后一行是 PASS 才算通过'] },
            { title: 'slide-01.png', heading: '看截图', lines: ['qa 目录里每页一张 1920×1080 截图', '逐页看，空白多了或太挤都要改'] },
          ]}
          source="AGENTS.md；docs/README.md 第 1 节"
        />
      ),
    },
    {
      id: 'toggles',
      label: '放映开关',
      render: () => (
        <ToggleCard
          kicker="放映"
          title={['放映时，', '这几样随时开关']}
          lead="下面是放映时可用的功能和按键。右边的开关可以点，只是演示，不会真的切换。"
          hint="点开关试试"
          file="放映设置"
          rows={[
            { icon: 'restart', label: '自动播放', note: 'P 键，每 8 秒前进一步', on: false },
            { icon: 'monitor', label: '全屏', note: 'F 键，或控制栏右侧按钮', on: true },
            { icon: 'widget', label: '总览', note: 'G 键，方向键选页，Enter 打开', on: false },
            { icon: 'cursor', label: '控制栏', note: '移动鼠标出现，静止 2.4 秒后隐藏', on: true },
          ]}
          source="docs/README.md 第 9 节"
        />
      ),
    },
    {
      id: 'fishbone',
      label: '页面乱的原因',
      build: 'reveal',
      render: () => (
        <Fishbone
          kicker="排查"
          title="一页看起来乱，原因多半在这里"
          problem="页面看起来乱"
          bones={[
            { label: '文字', causes: ['标题太长换成两行', '正文堆了长英文标识符'] },
            { label: '条目', causes: ['某一列条目太多', '各列项数相差超过 1'] },
            { label: '样式', causes: ['自定义了小字号'] },
            { label: '字体', causes: ['新字不在字体子集里', '粗细不一或出现方框'] },
            { label: '留白', causes: ['下半页基本是空的', '最后一行只剩一两个字'] },
            { label: '资源', causes: ['引用了远程图片或字体'] },
          ]}
          source="docs/README.md 第 8 节"
        />
      ),
    },
    {
      id: 'swimlane',
      label: '谁做什么',
      build: 'reveal',
      render: () => (
        <Swimlane
          kicker="分工"
          title="一份演示里，谁做哪一步"
          lanes={['作者', 'AI 助手', '检查脚本']}
          steps={[
            { lane: 0, text: '给出事实和出处' },
            { lane: 1, text: '排故事线' },
            { lane: 1, text: '选模板填内容' },
            { lane: 2, text: '构建并检查' },
            { lane: 1, text: '修 FAIL' },
            { lane: 1, text: '逐页看截图' },
            { lane: 0, text: '确认交付' },
          ]}
          source="docs/README.md 第 1 节；AGENTS.md"
        />
      ),
    },
    {
      id: 'layers',
      label: '分层',
      build: 'reveal',
      render: () => (
        <ArchLayers
          kicker="架构"
          title="四层，写演示只碰最上面一层"
          focus={0}
          layers={[
            { name: '演示', tag: 'src/decks', items: ['index.tsx', 'assets/', 'active.ts'] },
            { name: '放映', tag: 'src/deck', items: ['Deck', 'Overview', 'Stage', 'Controls'] },
            { name: '模板', tag: 'src/kit', items: ['103 个模板', 'shapes', 'decor', 'theme'] },
            { name: '构建与检查', tag: 'scripts', items: ['vite build', 'qa.mjs', 'subset-fonts.py', 'gen-docs.mjs'] },
          ]}
          source="项目目录，2026-10-30"
        />
      ),
    },
    {
      id: 'balance',
      label: '内嵌字体',
      render: () => (
        <Balance
          kicker="取舍"
          title="字体内嵌进文件，值不值？"
          lead="单文件约 6.1 MB，其中字体约 3.6 MB。我们选择保留：离线放映比文件小更重要。"
          left={{ label: '代价', items: ['文件大约多出 3.6 MB', '发邮件可能超附件上限'], weight: 1 }}
          right={{ label: '好处', items: ['断网也能放映', '每台电脑字形一致', '不发任何网络请求'], weight: 2 }}
          source="npm run check 构建输出；天平倾斜是示意，不是测量"
        />
      ),
    },
    {
      id: 'funnel',
      label: '两份演示',
      build: 'reveal',
      render: () => (
        <DoubleFunnel
          kicker="对比"
          title={['两份长演示，', '逐条展开用得差很多']}
          unit="页"
          stages={['全部页面', '写了出处', '出处 + 逐条展开']}
          left={{ name: 'GEO 演示', values: [31, 24, 4] }}
          right={{ name: 'GTM 演示', values: [30, 23, 10] }}
          source="src/decks/geo、gtm 的 index.tsx，2026-10-30 统计"
        />
      ),
    },
    {
      id: 'close',
      label: '结尾',
      render: () => (
        <Closing
          kicker="最后"
          mark="3"
          statement="衣服可以换，规则不变"
          follow="在 #/kit 用风格切换器看看桌面风格"
          takeaways={[
            '壁纸、窗口、程序坞和开关都是装饰，事实照样写进 source',
            '九种结构图能套进任何风格，包括这份演示用的桌面风格',
            '风格只改字体、圆角和底色，模板的内容上限一个都不变',
          ]}
          refs={['docs/README.md', 'docs/components.md', 'AGENTS.md']}
        />
      ),
    },
  ],
}
