# 诊断

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 1 个模板。返回索引：[../templates.md](../templates.md)。

### `Funnel` 转化漏斗（诊断 · 逐级转化与最该修的一级）
- 适合：注册、激活、付费这类逐级转化的流程；想说明“先修哪一级”，而不只是展示数字
- 不适合：各阶段不是包含关系（后一级不是前一级的子集）：用 MetricBars；只有两级：直接写一个 BigStat
- 上限：stages 4–6 级，数值逐级递减；label ≤ 8 字；note ≤ 18 字；leak 指向要先修的那一步（第 leak 级到下一级）；leakLabel ≤ 6 字；aside.title ≤ 14 字；aside.body ≤ 60 字；条宽只表示顺序，数据看数字和转化率
- 参考：src/decks/gtm 的 `funnel` 页；docs/zh-CN/components.md#funnel；交互：横条从中间展开，转化率标签依次出现；悬停一级时横条加深。
