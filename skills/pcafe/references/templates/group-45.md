# 内容

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 12 个模板。返回索引：[../templates.md](../templates.md)。

### `ServiceList` 巨字服务列表（内容 · 4–6 件事，一行一个大字）
- 适合：我们做什么、流程有哪几步；每项能用一个词说清
- 不适合：每项要两句以上：用 NumberedColumns；有严格顺序和细节：用 StepTrack
- 上限：items 4–6 个：word ≤ 6 字或 12 个字母，note ≤ 24 字
- 参考：src/decks/mono 的 `services` 页；docs/zh-CN/components.md#service-list

### `QuoteArc` 弧形引语卡（内容 · 三句有出处的原话）
- 适合：三句能逐字引用、有出处的原话；用名言或客户原话给观点背书
- 不适合：只有一句：用 QuoteHero；原话查不到出处
- 上限：quotes 恰好 3 句：text ≤ 48 字，name ≤ 12 字符，role ≤ 20 字；source 必填
- 参考：src/decks/mono 的 `quotes` 页；docs/zh-CN/components.md#quote-arc

### `WorkCards` 色块作品卡（内容 · 3–4 个项目或方案）
- 适合：作品集、方案、产品线并列展示；每项一句话就够
- 不适合：需要说明文字：用 IconGrid；要对比优劣：用 VerdictColumns
- 上限：cards 3–4 张：title ≤ 12 字，tag ≤ 8 字；src 必须是真实截图或 decor- 装饰插图
- 参考：src/decks/mono 的 `styles` 页；docs/zh-CN/components.md#work-cards

### `WordBlocks` 彩色词块（内容 · 4–10 个关键词）
- 适合：技能、主题、能力清单；每项一个词就够
- 不适合：每项要解释：用 IconGrid；有先后顺序：用 StepTrack
- 上限：words 4–10 个，各 ≤ 6 字或 12 个字母
- 参考：src/decks/sticker 的 `blocks` 页；docs/zh-CN/components.md#word-blocks

### `FolderCards` 文件夹叠卡（内容 · 3–4 个项目，一次看一个）
- 适合：3–4 个项目或模块，要逐个讲；每个都有截图
- 不适合：要并排比较：用 PanelCards；超过 4 个
- 上限：items 3–4 个：tab ≤ 10 字符，title ≤ 14 字，body ≤ 60 字，points 0–3 条各 ≤ 16 字；src 必须是真实截图
- 参考：src/decks/sticker 的 `folders` 页；docs/zh-CN/components.md#folder-cards；交互：build 设为 focus：当前文件夹翻到最前。

### `AgencyRows` 编号服务行（内容 · 4–5 件事，一行一件）
- 适合：我们做什么、做法有哪几条；每项一句标题加一句短注
- 不适合：每项要两句以上：用 NumberedColumns；有先后步骤：用 StepTrack
- 上限：title ≤ 2 行 × 12 字；more ≤ 10 个字符；items 4–5 行：title ≤ 14 字，note ≤ 22 字
- 参考：src/decks/home-northbound 的 `how` 页；docs/zh-CN/components.md#agency-rows

### `NumberTiles` 数字色块（内容 · 3–4 块高色块，各带一个超大编号）
- 适合：原则、规矩、阶段，3–4 条；每条一句话就能说清
- 不适合：每条要展开讲：用 NumberedColumns；超过 4 条
- 上限：tiles 3–4 块；title ≤ 10 字；body ≤ 36 字；页标题 ≤ 22 字
- 参考：src/decks/sig-stencil 的 `tiles` 页；docs/zh-CN/components.md#number-tiles；交互：按 → 逐块出现

### `IndexList` 分栏索引（内容 · 两栏编号条目，细线分隔）
- 适合：目录、索引、六个入口；几个并列的主题，每个一句话
- 不适合：条目有先后顺序：用 Process 类模板；每条要展开：拆页
- 上限：entries 4–6 条；title ≤ 12 字；body ≤ 40 字；页标题 ≤ 22 字
- 参考：src/decks/sig-cobalt-grid 的 `index` 页；docs/zh-CN/components.md#index-list；交互：按 → 逐条出现

### `PriorityColumns` 三栏重点（内容 · 三根通栏，超大编号，一栏用主题色）
- 适合：三条优先事项、底线、承诺；动员、宣言、季度重点
- 不适合：不是正好三条：用 NumberedColumns；需要数据支撑：用 KpiBoard
- 上限：items 正好 3 个；tag ≤ 6 字，title ≤ 10 字，body ≤ 40 字；title 1–2 行，每行 ≤ 8 字；lead ≤ 50 字
- 参考：src/decks/sig-platform 的 `priorities` 页；docs/zh-CN/components.md#priority-columns；交互：按 → 逐栏出现

### `MarkerLog` 记号笔随笔（内容 · 日志与文章列表）
- 适合：随笔、更新日志、读书笔记；想展示近期在想什么
- 不适合：版本更新要分类：用 Changelog；条目超过 6 条：分两页
- 上限：kicker ≤ 8 字，meta ≤ 14 字；entries 3–6 条：date ≤ 6 个字符，title ≤ 20 字，tag ≤ 4 字，body ≤ 50 字
- 参考：src/decks/sig-marker 的 `log` 页；docs/zh-CN/components.md#marker-log；交互：点击一行展开摘要，箭头旋转；悬停行轻推

### `AlbumWeek` 相册一周（内容 · 一周图记）
- 适合：一周、一次旅行、一个项目的逐日回顾；每天一张图加一句话
- 不适合：超过 7 天：用 Timeline；图要大看：用 DiptychWorks
- 上限：kicker ≤ 12 字；title 1 行 ≤ 12 字；days 5–7 天：day ≤ 3 字，date ≤ 8 字，caption ≤ 6 字，note ≤ 40 字，place ≤ 10 字
- 参考：src/decks/sig-album 的 `week` 页；docs/zh-CN/components.md#album-week；交互：照片在绳上晃动落定；点击放大选中那天，下方文字淡入

### `SocialFeed` 个人主页动态流（内容 · 个人或品牌主页式的近况）
- 适合：独立开发者、设计师、创作者介绍自己近况；想用“刷动态”的方式讲一段经历
- 不适合：正式汇报：用 Timeline；动态超过 3 条：拆页
- 上限：profile.name ≤ 6 字，role ≤ 10 字；menu 4–6 项 × ≤ 5 字；posts 2–3 条：text ≤ 34 字，time ≤ 6 字；只有第一条显示 0–2 张图；stories 0–4 个 × ≤ 3 字；boxes 0–2 个，各 2 条：title ≤ 12 字，note ≤ 10 字；say ≤ 26 字；clock.city ≤ 4 字
- 参考：src/decks/mockui 的 `feed` 页；docs/zh-CN/components.md#social-feed；交互：点 ♡ 点赞并弹跳计数；点彩圈头像标为已看；菜单点击切换高亮；时钟冒号闪烁；动态依次滑入
