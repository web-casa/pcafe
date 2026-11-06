# 并列

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 9 个模板。返回索引：[../templates.md](../templates.md)。

### `IconGrid` 图标卡片（并列 · 6–8 个对象）
- 适合：6 或 8 个并列对象：平台、产品、角色、地区；每个对象一两句话就能说清
- 不适合：3–4 个对象：用 NumberedColumns，每项能写得更充分；对象之间要比较数值：用 MetricBars 或 Matrix
- 上限：items 正好 6 或 8 个；title ≤ 8 字；body 18–40 字，各卡长度尽量接近；tag ≤ 12 个字符；没有就省略，不要编；图标按含义挑，同一页不要重复
- 参考：src/decks/geo 的 `platforms` 页；docs/zh-CN/components.md#icon-grid；交互：悬停卡片：抬起 6u，阴影加深，图标格换成强调底色。

### `TileWall` 图标砖墙（并列 · 6–9 个功能或零件）
- 适合：6 或 9 个并列的功能、集成、零件；每项一个词就能说清
- 不适合：每项需要一句解释：用 IconGrid；少于 6 项
- 上限：tiles 6 或 9 个，label ≤ 6 字；title ≤ 2 行 × 8 字；lead ≤ 40 字
- 参考：src/decks/toy3d 的 `parts` 页；docs/zh-CN/components.md#tile-wall

### `GradientCards` 渐变功能卡（并列 · 3 个功能或选项）
- 适合：3 个并列的功能、开关、选项；每项一两句说明
- 不适合：有先后：用 StepTrack；超过 3 项：用 IconGrid
- 上限：items 正好 3 个：title ≤ 10 字，body 24–48 字，tag ≤ 18 字符；title ≤ 2 行 × 9 字；lead ≤ 60 字
- 参考：src/decks/gradient 的 `switches` 页；docs/zh-CN/components.md#gradient-cards

### `HairlineGrid` 细线功能格（并列 · 4 或 6 个功能）
- 适合：4 或 6 个并列的功能、字段、能力；其中一项最重要
- 不适合：每项一个词就够：用 TileWall；要讲先后：用 StepTrack
- 上限：items 4 或 6 个：title ≤ 10 字，body 18–40 字，tag ≤ 16 个字符；title ≤ 1 行 × 14 字
- 参考：src/decks/warm-dark 的 `switches` 页；docs/zh-CN/components.md#hairline-grid

### `NoteCards` 歪斜便签（并列 · 3–4 条规则或提示）
- 适合：3–4 条规则、小贴士、注意事项；轻松的分享会
- 不适合：正式场合：用 NumberedColumns；超过 4 项：用 IconGrid
- 上限：notes 3–4 张：title ≤ 8 字，body 20–40 字；title ≤ 1 行 × 14 字
- 参考：src/decks/playful 的 `rules` 页；docs/zh-CN/components.md#note-cards

### `ArcCards` 弧形深色卡（并列 · 五个同等重要的机制或服务）
- 适合：正好 5 个并列的机制、服务或功能；每项一句话说得清
- 不适合：3–4 项：用 NumberedColumns；6–8 项：用 IconGrid；各项有先后：用 StepTrack
- 上限：cards 正好 5 张：title ≤ 8 字，text 16–34 字；title ≤ 2 行 × 16 字；图标同页不重复
- 参考：src/decks/home-nuance 的 `how` 页；docs/zh-CN/components.md#arc-cards

### `HaloRows` 细线条目列表（并列 · 3–6 个功能、规则或快捷键）
- 适合：3–6 条并列的功能、规则、快捷键；每条一个短标题加一句短说明
- 不适合：每条要两句以上：用 NumberedColumns；有先后顺序：用 StepTrack
- 上限：items 3–6 条：title ≤ 12 字，detail ≤ 22 字；title ≤ 2 行 × 9 字；lead ≤ 40 字
- 参考：src/decks/home-nutshell 的 `present` 页；docs/zh-CN/components.md#halo-rows

### `FanCarousel` 扇形卡片（并列 · 4–6 个要点逐个讲）
- 适合：4–6 个并列的小知识、数字；想让一页更像“道具”而不是表格
- 不适合：要同时比较所有项：用 StatRow 或 PanelCards；每项文字超过 30 字
- 上限：cards 4–6 张；mark ≤ 6 个字符；title ≤ 8 字；body ≤ 30 字；icon 用 icon-set 名称
- 参考：src/decks/v2-p3 的 `a4` 页；docs/zh-CN/components.md#fan-carousel；交互：build: reveal 时第 0 步扇面收拢，之后每步转到下一张；完成态停在最后一张

### `TabSpec` 标签切换卡（并列 · 2–4 个选项逐个介绍）
- 适合：2–4 个产品、方案、开源项目逐个介绍；每项有一段说明和 2–4 个参数
- 不适合：要同时比较：用 CompareTable；打印时需要每项都可见：拆成多页
- 上限：items 2–4 个；tab ≤ 12 个拉丁字符或 ≤ 6 字；name ≤ 16 字；body ≤ 60 字；specs 2–4 行：label ≤ 4 字，value ≤ 22 字
- 参考：src/decks/v3-p5 的 `oss` 页；docs/zh-CN/components.md#tab-spec；交互：build: reveal 时每步切换一个标签；完整状态（打印）显示最后一项
