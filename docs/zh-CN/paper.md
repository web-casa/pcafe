# 报告与简历

演示之外，同一套工具还能写 A4 文档。一份源文件同时产出三样东西：可以滚动阅读的网页、和打印结果一致的 A4 分页视图，以及 PDF。

```bash
npx pcafe paper new q3-review            # 报告
npx pcafe paper new my-cv --resume       # 简历
npx pcafe paper dev q3-review            # 预览
npx pcafe paper check q3-review          # 类型检查、构建、QA、PDF，最后一行是 PASS 或 FAIL
npx pcafe paper build q3-review          # 输出 dist/q3-review.html 和 dist/q3-review.pdf
```

文件放在 `src/papers/<name>/index.tsx`。写完要跑到 `PASS`，并逐页看过 `qa/<name>/page-NN.png`。

## 报告

`ReportDef.blocks` 是从上到下的一列版块。分页自动完成，不用手动排。

| 版块 | 用途 | 跨页规则 |
| --- | --- | --- |
| `Cover` | 封面，独占一页 | 不跨页 |
| `Toc` | 目录，页码自动填写 | 不跨页 |
| `H1` `H2` | 自动编号的标题 | 不会单独留在页底 |
| `P` | 正文，支持 `**粗体**`、`` `代码` ``、`[^来源]`、`[文字](网址)` | 在行之间分开，每边至少两行 |
| `List` | 列表 | 在条目之间分开 |
| `Stats` | 2–4 个关键数字，`source` 必填 | 不跨页 |
| `Figure` | 带编号的图，`source` 必填 | 不跨页 |
| `Table` | 带编号的表，`source` 必填，阅读视图可排序 | 超过 12 行才跨页，并重复表头 |
| `Callout` | 重点框 | 不跨页 |
| `Steps` | 3–5 步的步骤条，放在细节之前，先给全貌 | 不跨页 |
| `Chat` | 手搓的聊天窗口，标着「示意界面」，`caption` 必填 | 不跨页 |
| `Apps` | 1–3 个填好内容的应用面板，标着「示意界面」，`caption` 必填 | 不跨页 |
| `SlidePage` | 把任意幻灯片模板放进一张横向页 | 独占一页 |
| `SourceList` | 按 `[^key]` 首次出现的顺序生成来源列表 | 在条目之间分开 |
| `PageBreak` | 强制换页 | |

图表：`DocLine` 折线、`DocBars` 排名条、`DocStack` 百分比条、`DocArea` 百分比面积。它们的文字总是真实字号，所以手机上也看得清。

幻灯片模板是为投影设计的，字号相对页面很大，直接缩进 A4 纵向一栏会小到看不清，所以报告里的图用上面四种，大图表才用 `SlidePage`。

**网页阅读版**：写 `view: 'read'`，报告默认以网页文章打开：栏更宽、开头更大，手机和电脑都好读，仍然可以切到纸张视图或存成 PDF。适合产品介绍、项目复盘、对外分享。配合 `Steps`、`Chat`、`Apps` 用界面代替文字描述（思路来自 oil-html，MIT）。示例：`src/papers/web-guide`。

引用写成 `[^key]`，在 `sources` 里登记，文末用 `<SourceList />` 列出。引用了没登记的来源，QA 直接判 FAIL。

## 简历

`ResumeDef` 只有数据，换 `layout` 和 `theme` 就换了样子，内容不用动。

| `layout` | 适合 |
| --- | --- |
| `classic` | 单栏。最稳妥，投递系统也最容易读取 |
| `sidebar` | 深色侧栏放联系方式和技能，适合经历较多的人 |
| `banner` | 彩色页头带关键数字，适合有明确成果的人 |
| `ledger` | 日期放在页边，大字号姓名，适合设计和内容岗位 |
| `showcase` | 工牌、关键数字趋势、职业轨迹和成果对比，适合产品和运营 |
| `console` | 真实的终端组件放在深色页头，加指标仪表和技术热力格，适合工程师 |
| `portfolio` | 第二页放真实演示页面的缩略图，适合设计和内容岗位 |

这三种版式用了组件，额外的板块类型是 `track`（职业轨迹，从第一段工作经历生成）、`impact`（前后对比）、`heat`（使用年份）、`gauges`（指标仪表）和 `projects`（项目卡片）。`badge` 和 `terminal` 写在 `ResumeDef` 顶层，趋势写在 `highlights[].trend`。

每份这样的简历都能生成投递版：页面顶部切换，或者打开时加 `?plain=1`。同一份数据变成单栏文字，组件内容转成列表，放不下的板块自动移到第二页。`paper build` 会同时输出 `dist/<name>-plain.pdf`，网申系统请用这个文件。

规则：

- 放不下就删内容，或者给板块写 `page: 2` 放到第二页，最多两页。字号不会自动缩小。
- 内容少时，段距会自动放宽，让页面看起来舒展。
- 不要用技能百分比条，这种数字对读者没有意义。
- `highlights` 只写面试时讲得清楚的数字。
- `note` 用来标注示例，真实简历不要写。

## QA 检查什么

文字是否超出纸张或正文区、标题是否落单、引用是否都有来源、图表是否都有出处、最小字号不低于 8pt、PDF 页数与分页视图一致、字体已嵌入、PDF 文字可以提取、简历不超过两页、阅读视图在手机上不横向滚动。

## 已知限制

- 目前只有 A4 一种纸张。
- Chrome 生成的 PDF 把这些字体嵌成 Type 3。文字可以选中和复制，打印也是矢量，但个别 PDF 阅读器里屏幕显示可能略细。
- `sidebar`、`banner`、`showcase`、`console` 和 `portfolio` 是多栏版式，投递系统提取文字的顺序可能和视觉顺序不同。要过自动筛选时用 `classic` 或投递版。
