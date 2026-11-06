# 内容

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 9 个模板。返回索引：[../templates.md](../templates.md)。

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
