# 分布

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 1 个模板。返回索引：[../templates.md](../templates.md)。

### `Heatmap` 热力表（分布 · 两个维度交叉的数值）
- 适合：分批留存（签约月份 × 第几个月）；渠道 × 漏斗阶段的转化率、功能 × 客户群的使用率
- 不适合：只有一行或一列：用 MetricBars；要看精确比较而非整体规律：用 Matrix
- 上限：cols 3–8 列，每个 ≤ 6 个字符；rows 3–7 行；label ≤ 8 字；sub ≤ 10 个字符；数值 ≤ 4 位（含小数），单位用 unit；notes 2–3 条：key ≤ 8 字，text ≤ 30 字
- 参考：src/decks/gtm 的 `cohort` 页；docs/zh-CN/components.md#heatmap；交互：格子沿对角线依次弹出；悬停格子时放大，悬停一行时行名变为强调色。
