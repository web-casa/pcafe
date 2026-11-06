# 讲解

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 3 个模板。返回索引：[../templates.md](../templates.md)。

### `Screenshot` 截图标注（讲解 · 产品界面）
- 适合：介绍产品界面、网站结构、报表怎么读；要让听众看着真实界面找到具体位置
- 不适合：没有真实截图：不要用示意图冒充；要比较两种状态：用 BeforeAfter；要点超过 5 个：拆成两页
- 上限：callouts 3–5 个；x、y 为百分比，点与点至少相隔 8；title ≤ 10 字；body ≤ 36 字；图片放在 deck 目录下用 import 引入，WebP 优先，单张 ≤ 200 KB；ratio 填真实宽高比；url 可选，填了才显示浏览器地址栏
- 参考：src/decks/geo 的 `entry` 页；docs/zh-CN/components.md#screenshot；交互：圆点依次弹出并有呼吸光圈；悬停圆点或右侧说明时两边一起高亮。逐条展开时圆点和说明同步出现。

### `PhotoSplit` 半图半文（讲解 · 一张图配一段说明）
- 适合：介绍一个对象或概念，图片帮助理解；章节里节奏需要一张“透气”的页
- 不适合：图片是需要细看的截图：用 Screenshot 或 DeviceFrame；要点超过 3 条：拆页或用 NumberedColumns
- 上限：title ≤ 3 行 × 9 字；lead ≤ 60 字；points 0–3 条：title ≤ 10 字，body ≤ 36 字；有 lead 时 points ≤ 3 条，body 都写满时最好 ≤ 2 条
- 参考：src/decks/v2-p1 的 `animal` 页；docs/zh-CN/components.md#photo-split；交互：build：要点逐条出现

### `MagazineSpread` 杂志跨页（讲解 · 一段需要读的文字）
- 适合：解释一个概念、讲一段故事，需要两段正文；编辑风格、科普和专题
- 不适合：要点能列成条目：用 PhotoSplit；正文超过 150 字：拆页
- 上限：title ≤ 2 行 × 8 字；standfirst ≤ 40 字；body 1–2 段，合计 ≤ 150 字；pull ≤ 26 字；folio ≤ 16 字
- 参考：src/decks/v2-p1 的 `bleaching` 页；docs/zh-CN/components.md#magazine-spread；交互：build：引语最后出现
