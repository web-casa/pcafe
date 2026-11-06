# 社交卡片

给社交平台用的图文和封面。一份源文件产出三样东西：每张卡片一张 PNG，尺寸是平台要求的像素；一个图库页面，可以看封面在信息流里的大小；LinkedIn 文档还会多出一份 PDF。

```bash
npx pcafe cards new solar-post       # 生成 src/cardsets/solar-post/index.tsx
npx pcafe cards dev solar-post       # 在图库里预览
npx pcafe cards check solar-post     # 类型检查、导出、QA，最后一行是 PASS 或 FAIL
npx pcafe cards build solar-post     # 输出 dist/cards/solar-post.html 和 dist/cards/solar-post/ 里的 PNG
```

文件放在 `src/cardsets/<name>/index.tsx`。写完要跑到 `PASS`，并按原尺寸看过 `dist/cards/<name>/` 里的每张 PNG，再看每张 `qa/cards/<name>/feed-NN-<preset>.png`，这是封面缩到估算的信息流宽度后的样子。

`check` 需要 Playwright 的 Chromium（`npx playwright install chromium`），依次运行类型检查 → 导出 → QA。首次运行若没装浏览器，会打印这条安装命令并以非零状态退出。检查和构建都不再需要 Python 或系统字体：CJK 子集随仓库提交，`npm run fonts:verify` 负责校验；`npm run fonts` 只给维护者重新生成子集。`build` 不跑 QA，所以要在 `check` 之后用，不能代替它。

## 一组卡片

```tsx
import type { CardSetDef } from '../../cards'

export const set: CardSetDef = {
  title: '我的卡片',
  preset: 'xhs-portrait',      // 每张卡片的尺寸，单张可以用自己的 `preset` 覆盖
  theme: 'cobalt',
  cards: [
    { t: 'cover', lines: ['三五个字', '说清钩子'], mark: [1], hint: '左滑', source: null },
    { t: 'number', value: '2,779', unit: 'TWh', label: '这个数字是什么', source: '发布方，年份' },
    { t: 'ending', lines: ['最后一张'], cta: '只提一个要求', source: null },
  ],
}
```

`CardSetDef` 还可以写 `style`、`iconStyle`、`lang`（`zh` 或 `en`）、`handle`（每张卡片上的账号名，≤ 14）和 `pages`（内页页码）。

在图库里，“信息流大小”按估算的信息流宽度显示每张封面，“安全区”在卡片上画出安全区、遮挡条和裁切范围。

## 尺寸预设

| `preset` | 位置 | 像素 | 比例 | 依据 | 信息流宽度 |
| --- | --- | --- | --- | --- | --- |
| `xhs-portrait` | 小红书 竖版 | 1080×1440 | 3:4 | community | 180 |
| `xhs-square` | 小红书 方形 | 1080×1080 | 1:1 | community | 180 |
| `xhs-landscape` * | 小红书 横版 | 1440×1080 | 4:3 | community | 180 |
| `bili-wide` * | B站 封面 | 1920×1080 | 16:9 | conflict | 180 |
| `bili-mobile` * | B站 封面 | 1200×900 | 4:3 | unconfirmed | 180 |
| `douyin-cover` * | 抖音 封面 | 1080×1920 | 9:16 | community | 128 |
| `channels-portrait` * | 视频号 竖版封面 | 1080×1260 | 6:7 | community | 128 |
| `channels-wide` * | 视频号 横版封面 | 1080×608 | 16:9 | community | 128 |
| `wechat-head` * | 公众号 头条 | 900×383 | 2.35:1 | community | 350 |
| `wechat-thumb` * | 公众号 次条 | 200×200 | 1:1 | community | 60 |
| `weibo-square` | 微博 九宫格 | 1080×1080 | 1:1 | community | 120 |
| `weibo-article` * | 微博 文章头图 | 980×550 | 16:9 | community | 350 |
| `ig-portrait` | Instagram 轮播 | 1080×1350 | 4:5 | community | 128 |
| `ig-tall` | Instagram 轮播 | 1080×1440 | 3:4 | community | 128 |
| `linkedin-doc` | LinkedIn 文档，同时输出 PDF | 1080×1350 | 4:5 | community | 360 |
| `yt-thumb` * | YouTube 缩略图 | 1280×720 | 16:9 | official | 168 |
| `og-image` * | Open Graph | 1200×630 | 1.91:1 | official | 360 |
| `x-card` * | X 链接卡片 | 1200×628 | 1.91:1 | conflict | 360 |

\* 只作封面：这个预设上的每张卡片都要过信息流检查。信息流宽度的单位是 390 px 宽手机上的 CSS px，每个值都是估算。

“依据”的含义：

- `official`：在平台自己的页面或它的搜索摘要里读到。`yt-thumb` 只有比例和最小宽度是官方的，1280×720 和右下角的时长位置来自第三方。`og-image` 的 Meta 页面只读到了搜索摘要。
- `community`：第三方指南说法一致，平台没有确认。
- `conflict`：来源矛盾，这个值是我们的选择。B站的来源有 16:9、16:10 和 4:3，所以 `src/cardsets/solar-bili` 导出了两种尺寸。
- `unconfirmed`：只有一个来源，或者是我们自己的观察。

每个值的依据写在代码仓库的 `plans/research-cards.md`。平台随时可能改规格，要依赖某个值之前，先到 App 里确认。

## 模板

| `t` | 用途 | 字段与上限 | 形状 |
| --- | --- | --- | --- |
| `cover` | 大字封面 | `lines` 1–3 行，`mark`，`sub` ≤ 24，`motif`，`hint` ≤ 8 | 超长、竖版、方形 |
| `wide` | 宽比例封面 | `lines` 1–2 行（16:9 每行 ≤ 8，`wechat-head` 每行 ≤ 4），`mark`，`sub` ≤ 20，`motif`，`align` | 横版、宽版、横幅 |
| `number` | 一个数字就是重点 | `value` ≤ 7，`unit` ≤ 6，`label` ≤ 22，`note` ≤ 40，`bars` | 除横幅外都可以 |
| `chart` | 一张图和它证明的一句话 | `title` ≤ 22，`takeaway` ≤ 40，`chart` | 除横幅外都可以 |
| `compare` | 2–3 项并排对比 | `title` ≤ 22，`items`（`label` ≤ 12，`value` ≤ 7，`unit`，`num`，`note` ≤ 22，`focus`），`verdict` ≤ 36 | 除横幅外都可以 |
| `quote` | 一句有署名的话 | `text` ≤ 44，`by` ≤ 24 | 除横幅外都可以 |
| `list` | 要点 | `title` ≤ 22，`items`（`head` ≤ 14，`body` ≤ 40，`icon`）：竖版 3–5 条，方形和 4:3 为 3 条 | 超长、竖版、方形、横版 |
| `steps` | 有先后的步骤 | `title` ≤ 22，`steps`（`head`、`body`）：竖版 3–4 步，方形 3 步 | 超长、竖版、方形 |
| `text` | 图表说不清的观点 | `title` ≤ 22，`paras` 1–3 段，每段 ≤ 70 | 超长、竖版、方形 |
| `image` | 截图、照片或装饰图 | `image`，`title` ≤ 22，`caption` ≤ 40 | 超长、竖版、方形 |
| `ending` | 最后一张 | `lines` 1–2 行，每行 ≤ 8，`mark`，`takeaways` 0–3 条，每条 ≤ 24，`cta` ≤ 22，`sources` 0–3 条，每条 ≤ 44 | 超长、竖版、方形 |

封面的 `motif` 有三种：`{ kind: 'bars', values }`、`{ kind: 'icon', icon }`，以及贴纸式的 `{ kind: 'emoji', e: '🎤', around: ['✨', '💡'] }`。任何文字字段也都可以直接打 emoji，见 [guide](guide.md) 的 Emoji 一节。

每张卡片还有 `source`（≤ 44，或者 `null`）、`kicker`（≤ 14）、`tone`（`paper`、`ink`、`accent`、`wash`）、`preset` 和 `cover`。

形状：超长是 9:16，竖版到 6:7 为止，横版是 4:3，宽版到 2:1 为止，横幅比这更宽（`wechat-head`）。模板用在没有对应版式的形状上，QA 会点名报错。

`chart` 可以是 `line`（1–3 条线）、`bars`（≤ 12 根）或 `rank`（竖版 ≤ 8 行，方形和宽版 ≤ 5 行，名称 ≤ 6）。

## 规则

- 上限这样算：一个汉字算 1，一个英文字母或数字算 0.5。QA 会数标题、正文字段、`kicker` 和 `source`。大标题不计数，它的字号由最长一行决定，太小时 QA 判 FAIL。正文不会自动缩小，放不下就删字或拆卡片。
- 封面大标题每行放得下的字数：小红书约 6 个汉字，抖音和其他三列宫格约 5 个，`wechat-thumb` 只有 2–4 个。每一处换行都自己定。不要重复帖子标题，平台通常已经把它印在封面旁边。
- 第一张是封面，标了 * 的预设上每张都是封面。封面必须有大标题，所以只能用 `cover`、`wide` 或 `number`。要在这种预设上放别的模板，给那张卡片写 `cover: false`。
- 事实必须有出处。在 `source` 写明发布方，算出来的数字要标明。只有不陈述事实的卡片才写 `null`。QA 只能在卡片含有数字时发现缺出处，用文字写的事实要自己查。查不到出处的事实不要写。
- `quote` 的 `by` 必须是真实的署名，不要替别人编话。
- `image.kind` 遵守项目的图片规则：`screenshot` 是你自己作品的截图，可以当证据；`photo` 只营造氛围，并印出 `credit`；`decor` 只做装饰。

## QA 检查什么

文字是否超出卡片、进入安全区或压在遮挡条下面。文件里的文字是否小于 10 px，全屏打开时在手机上是否太小。最后一行是否只剩一个字。文字重叠、内容溢出、内容被裁掉、图表被压得太扁。内容上限。有数字没出处、声明了出处却没印在卡片上、照片没有署名、图片没加载。把 PNG 缩到信息流宽度后测量大标题的字号和对比度，以及大标题在居中裁切后是否还在。原尺寸的对比度。是否回退到系统字体。从文件读取每张 PNG 的准确像素。PDF 页数（需要安装 `pdfinfo`）。图库在手机上是否横向滚动，页面错误和网络请求。

结果在 `qa/cards/<name>/report.json`。

## 已知限制

- 这里没有一个中国平台的规格得到官方确认。小红书、抖音、视频号和 B站都没有找到公开的官方页面，试过的微信文档页面返回 404。
- 信息流宽度是估算，来自算术或观察。大标题的最小字号（信息流大小下 16 CSS px，`wechat-thumb` 为 14）是判断，不是标准。安全区、遮挡条和居中裁切都是工作假设。
- 没有在真实 App 里发布测试过。第一次发布后要到 App 里看一眼。
- QA 能发现一行只剩一个字，发现不了一个词被拆到两行，所以每张卡片还是要有人看。
