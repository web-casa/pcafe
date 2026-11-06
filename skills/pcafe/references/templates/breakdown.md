# 拆解

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 1 个模板。返回索引：[../templates.md](../templates.md)。

### `Waterfall` 收入桥（拆解 · 从期初到期末）
- 适合：ARR、利润、预算、人数等从期初到期末的变化拆解；想说明“增长被什么吃掉了”
- 不适合：各项之间不是加减关系：用 MetricBars 或 DeltaBars；变化项超过 6 个：合并小项
- 上限：steps 3–6 项，正数加、负数减；期末自动计算；label ≤ 6 字；end ≤ 6 字；notes 2–3 条：key ≤ 8 字（可含一个数字），text ≤ 30 字；数值保持在 5 位数以内，用 unit 写万元、千人
- 参考：src/decks/gtm 的 `bridge` 页；docs/zh-CN/components.md#waterfall；交互：柱子依次升起（减少项从上往下落）。
