# 分析

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 3 个模板。返回索引：[../templates.md](../templates.md)。

### `IssueTree` 议题树（分析 · 把问题拆开）
- 适合：复盘或诊断：指标为什么变了；咨询式分析的第一页：先把问题拆成互不重叠的几块
- 不适合：分支之间有先后顺序：用 FlowDiagram；已经有答案：直接用 BigStat 或 NumberedColumns 给结论
- 上限：branches 2–4 个；每个 leaves 2–3 个；root.title ≤ 12 字；note ≤ 16 字；branch.title ≤ 10 字；note ≤ 16 字；leaf ≤ 14 字（4 个分支时 ≤ 10 字）；分支要互不重叠、合起来覆盖整个问题
- 参考：src/decks/gtm 的 `diagnose` 页；docs/zh-CN/components.md#issue-tree；交互：分支依次出现，原因标签随后弹出；悬停分支时卡片变为强调色浅底。

### `DecisionTree` 决策树（分析 · 什么情况选哪个）
- 适合：根据条件选方案、选工具；每个问题都能用是 / 否回答
- 不适合：问题超过两层：拆成两页；要拆解原因：用 IssueTree
- 上限：q ≤ 14 字，leaf ≤ 8 字，note ≤ 14 字；最多两层问题、4 个结果
- 参考：src/decks/toy3d 的 `chart-pick` 页；docs/zh-CN/components.md#decision-tree

### `Fishbone` 鱼骨图（分析 · 一个问题的成因）
- 适合：排查问题、复盘事故；原因能归成 4–6 类
- 不适合：原因有层层因果：用 IssueTree；少于 4 类
- 上限：problem ≤ 10 字；bones 4 或 6 根：label ≤ 6 字，causes 1–3 条各 ≤ 12 字
- 参考：src/decks/wallpaper 的 `fishbone` 页；docs/zh-CN/components.md#fishbone
