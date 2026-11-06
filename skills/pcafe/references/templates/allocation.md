# 分配

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 1 个模板。返回索引：[../templates.md](../templates.md)。

### `ShareBar` 构成条（分配 · 一个整体怎么切分）
- 适合：预算、时间、渠道、流量的构成；几行之间比较构成怎么变化
- 不适合：各部分加起来不是 100%：用 MetricBars；只有一行：用 BigStat 写最关键的那一段
- 上限：legend 2–5 段，每段 ≤ 6 字；rows 3–6 行；每行 values 与 legend 一一对应，加起来是 100；小于 7% 的段不显示数字；label ≤ 10 字；note ≤ 16 字；footnote ≤ 50 字
- 参考：src/decks/gtm 的 `mix` 页；docs/zh-CN/components.md#share-bar；交互：横条从左生长；悬停一段时其他段变淡。
