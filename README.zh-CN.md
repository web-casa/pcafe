# PCafe

[English](README.md) · **简体中文** · [繁體中文](README.zh-TW.md)

给 AI 做演示用的 HTML 幻灯片引擎。251 个固定模板、33 种风格、5 套配色，输出一个可以离线打开的单文件 HTML。

版式、字体、配色和动效都已经在模板里定好。写演示的人（或 AI 助手）只做三件事：选模板、填内容、跑检查。只要不改模板、不写自定义 CSS、遵守每个模板的内容上限，效果就和示例演示一致。

## 功能

- **251 个模板**：封面、章节页、数据图表（柱状、折线、环形、瀑布、漏斗、热力表……）、对比、结构图（金字塔、维恩图、鱼骨图、泳道……）、时间线与路线图、截图标注、节奏页
- **33 种风格 × 5 套配色**：从正式汇报到发布会、产品介绍、轻松分享，任意组合；风格只改字体、圆角、底色和装饰，内容上限不变
- **每个模板都有内容上限**：每个字段写多少字、几条都有明确规定，写在 [模板参考](docs/zh-CN/components.md) 里
- **自动 QA**：在四种窗口尺寸下逐页检查文字溢出、重叠、裁切、字号和远程请求，最后一行输出 `PASS` 或 `FAIL`
- **放映功能**：逐条展开、总览、演讲者视图和备注、激光笔、画笔、局部放大、自动播放、导出 PDF
- **单文件离线**：字体、图标、图片全部内联，发给别人用浏览器直接打开

## 快速开始

需要 Node.js 20.19 或更高版本。

```bash
npx @pcafe/pcafe init my-talk      # 生成项目
cd my-talk && npm install
npx pcafe new q3-review     # 新建 src/decks/q3-review/index.tsx
npx pcafe dev q3-review     # 开发预览
npx pcafe check q3-review   # 类型检查 + 构建 + QA，最后一行是 PASS / FAIL
npx pcafe build q3-review   # 产出 dist/q3-review.html
```

| 命令 | 作用 |
| --- | --- |
| `npx @pcafe/pcafe init <dir>` | 在 `<dir>` 生成一个新项目 |
| `npx pcafe new <name>` | 从起步模板生成 `src/decks/<name>/index.tsx` |
| `npx pcafe dev <name>` | 开发预览，`#/kit` 浏览模板库 |
| `npx pcafe check <name>` | 类型检查、构建、自动 QA |
| `npx pcafe build <name>` | 产出 `dist/<name>.html`（单文件，离线） |
| `npx pcafe docs` | 重新生成模板参考 |
| `npx pcafe photos` | 用你自己的 Unsplash key 下载可选的氛围照片 |

## 配合 AI 助手使用

- [`AGENTS.md`](AGENTS.md)（Claude Code 读 [`CLAUDE.md`](CLAUDE.md)）写着 AI 助手必须遵守的规则：只组合模板、遵守内容上限、事实要有出处、`check` 输出 `PASS` 才算完成。
- [`skills/pcafe/`](skills/pcafe/) 是一份写演示的 skill：故事线、按内容形状挑模板、把文字压进上限、选风格、检查与看图。可以装进支持 skill 的工具，也可以让任何 AI 直接读。参考表在 `skills/pcafe/references/`。

把资料交给 AI 助手，说“用 PCafe 做一份 10 页的季度汇报”，它会新建 deck、填内容、反复运行 `npx pcafe check` 直到 `PASS`。

### 把 skill 装进你的 Agent

这个 skill 在 PCafe 项目外也能用：在空文件夹里被触发时，它会先用 `npx @pcafe/pcafe init` 新建项目。

- **Claude Code**（插件）：`/plugin marketplace add Web-Casa/pcafe`，再 `/plugin install pcafe@pcafe`
- **支持 skills 的 Agent**（Codex、OpenClaw、Cursor 等）：`npx skills add Web-Casa/pcafe`，或把 [`skills/pcafe/`](skills/pcafe/) 复制到它的技能目录（`~/.claude/skills/`、`~/.agents/skills/`、`~/.openclaw/skills/`）
- **办公 Agent**（WorkBuddy、千问办公、豆包工作、Kimi Work）：在技能管理里上传 [pcafe-skill.zip](https://p.cafe/downloads/pcafe-skill.zip)

每个工具的详细步骤见 [p.cafe/skills](https://p.cafe/skills/)。

## 图片规则

图片只有三类，都用 `import` 引入：

| 类型 | 文件名 | 用途 |
| --- | --- | --- |
| 真实截图 | 任意，放在 deck 目录的 `assets/` | 可以当证据 |
| 图库照片 | `photo-` 开头，放在 `src/assets/photos/` | 只营造氛围，不能冒充你的客户、团队、产品或办公室；`source` 写“图：Unsplash / 作者名” |
| 装饰插图 | `decor-` 开头 | AI 生成，只做装饰，不能冒充截图或证据 |

照片不随项目分发。需要时运行 `npx pcafe photos`，用你自己的 `UNSPLASH_ACCESS_KEY` 下载，作者和原链接会写进 `src/assets/photos/credits.json`。

## 文档

- [入门](docs/zh-CN/README.md)
- [写演示：流程与规则](docs/zh-CN/guide.md)
- [模板参考](docs/zh-CN/components.md)
- [放映、演讲者视图与导出](docs/zh-CN/presenting.md)
- [参与贡献](docs/zh-CN/contributing.md)

## 署名

使用 PCafe 制作的作品（演示、报告、卡片、课程、屏幕、印刷、视频）会保留「由 PCafe 制作」署名，并链接到 https://p.cafe：演示在第一页和最后一页的页眉以及控制栏显示，其他格式显示在页脚。

`DeckDef.attribution: false`（以及其他格式定义里的同名选项）只在安装 `@pcafe/pro` 并持有有效的 PCafe Pro 许可时生效；没有 Pro 时这个选项会被忽略，控制台会说明原因。

CPAL-1.0 第 15 条：把作品发布到网站上属于 External Deployment（对外部署）。未修改引擎文件的用户，链接到公开仓库即可满足源码要求；修改过引擎文件的用户，需要公开修改过的文件。你自己的幻灯片内容不受影响。

## 许可证

开源（CPAL-1.0），可免费商用，作品需保留「由 PCafe 制作」署名和链接；Pro 可去掉署名。见 [LICENSE](LICENSE)。第三方字体、图标等的许可见 [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md)。
