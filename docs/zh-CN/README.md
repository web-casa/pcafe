# PCafe 入门

PCafe 用 251 个固定模板拼出 16:9 的 HTML 演示，最后输出一个可以离线打开的单文件 HTML。版式、字体、配色和动效都已经在模板里定好，写一份新演示只需要三步：

1. 选模板
2. 填内容
3. 跑检查

只要不改模板、不写自定义 CSS，并且遵守每个模板的内容上限，做出来的效果就和示例演示一致。这套约束也让 AI 助手能稳定地写出合格的演示。

- 251 个模板：封面、数据图表、对比、结构图、时间线、截图、节奏页等
- 33 种风格（`DeckDef.style`）× 5 套配色（`DeckDef.theme`），任意组合
- 放映功能齐全：逐条展开、总览、演讲者视图、激光笔、画笔、导出 PDF
- 自动 QA：四种窗口尺寸逐页检查溢出、重叠、字号和远程资源，最后输出 `PASS` 或 `FAIL`

## 安装

需要 Node.js 20.19 或更高版本。

```bash
npx @pcafe/pcafe init my-talk      # 在 my-talk/ 生成一个项目
cd my-talk
npm install
```

## 5 分钟做第一份演示

```bash
npx pcafe new q3-review     # 从起步模板生成 src/decks/q3-review/index.tsx
npx pcafe dev q3-review     # 打开开发预览，改文件后自动刷新
```

打开 `src/decks/q3-review/index.tsx`，每一页就是一个模板，内容都通过 props 传入：

```tsx
import type { DeckDef } from '../../kit'
import { Cover, StatRow, Closing } from '../../kit'

export const deck: DeckDef = {
  title: 'Q3 Review',
  theme: 'cobalt',        // 配色
  style: 'standard',      // 风格
  slides: [
    { id: 'cover', label: '封面', render: () => <Cover kicker="季度回顾" title="平台组 Q3" … /> },
    { id: 'numbers', label: '规模', build: 'reveal', render: () => <StatRow … source="出处" /> },
    { id: 'end', label: '结论', render: () => <Closing statement="……" … /> },
  ],
}
```

改完之后：

```bash
npx pcafe check q3-review   # 类型检查 + 构建 + 自动 QA，最后一行必须是 PASS
npx pcafe build q3-review   # 生成 dist/q3-review.html，单文件，可以直接发给别人
```

`check` 输出 `FAIL` 时按 [guide.md 第 8 节](guide.md#qa-fixes) 修复。每页截图在 `qa/slide-NN-1920x1080.png`，逐页看过才算完成。

开发预览里打开 `#/kit` 可以浏览全部模板、风格样张和图标。

## 配合 AI 助手使用

项目根目录的 `AGENTS.md`（Claude Code 读 `CLAUDE.md`）告诉 AI 助手这里的规则。`skills/pcafe/` 是一份写演示的 skill：怎么写故事线、怎么按内容形状挑模板、怎么把文字压进上限、怎么跑检查。中文版是 [SKILL.md](../../skills/pcafe/SKILL.md)，参考表在 `skills/pcafe/references/`。

常见做法：把资料交给 AI 助手，说“用 PCafe 做一份 10 页的季度汇报”，它会新建 deck、填内容、运行 `npx pcafe check` 直到 `PASS`。

## 文档导航

| 文档 | 内容 |
| --- | --- |
| [guide.md](guide.md) | 写演示的流程与规则：故事线、选模板、文案、事实来源、QA 报错怎么修、配色与风格、图片 |
| [components.md](components.md) | 每个模板的适合场景、避免场景、内容上限、props 和示例（由代码生成） |
| [presenting.md](presenting.md) | 放映、快捷键、演讲者视图、导出 PDF、纹理与翻页方式 |
| [paper.md](paper.md) | 报告与简历：A4 分页、阅读视图、PDF |
| [cards.md](cards.md) | 社交卡片和轮播图：各平台尺寸的 PNG，LinkedIn 用的 PDF |
| [video.md](video.md) | 动画视频：逐帧渲染的 MP4，16:9 或 9:16 |
| [course.md](course.md) | 用于自学的互动课程：一个带练习的离线 HTML 文件 |
| [screen.md](screen.md) | 展厅、橱窗或活动用的循环展示屏：一个离线 HTML 文件 |
| [print.md](print.md) | 海报、易拉宝、三折页和信息长图：带出血和裁切标记的 PDF，以及 PNG |
| [contributing.md](contributing.md) | 新增模板、风格和配色，QA 规则，重新生成文档 |

其他语言：[English](../en/README.md) · [繁體中文](../zh-TW/README.md)
