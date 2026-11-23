# 趋势

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 2 个模板。返回索引：[../templates.md](../templates.md)。

### `LineChart` 折线图（趋势 · 随时间的变化）
- 适合：4–12 个时间点的变化：版本、年份、季度、月份；要指出某个时间点发生了什么
- 不适合：只有 2–3 个点：用 MetricBars 或 DeltaBars；比较的是同一时刻的不同对象：用 MetricBars；各期之间是加减关系：用 Waterfall
- 上限：x 4–12 个标签，每个 ≤ 6 个字符；series 1–3 条，且只有一条 focus；近似值用 labels 照原文写，如 43,000+；annotations ≤ 2 条，text ≤ 16 字，不要放在最后一个点上；yFrom 默认 0；抬高坐标起点要在 lead 里说明；notes 2–3 条：key ≤ 8 字，text ≤ 30 字
- 参考：src/decks/release 的 `packages` 页；docs/zh-CN/components.md#line-chart；交互：折线从左向右展开，数据点依次弹出，注释最后淡入。

### `SlateTrend` 立体看板趋势（趋势 · 多指标走势）
- 适合：复盘一年或一个季度的增长；2–4 个指标想放在同一页轮流看
- 不适合：只有一个数字：用大数字类模板；要同时比较多条曲线：用数据类多序列图表
- 上限：title ≤ 14 字；series 2–4 个：label ≤ 8 字，value ≤ 8 个字符，delta ≤ 6 个字符，points 与 xs 等长；xs 6–14 个 × ≤ 4 个字符；note ≤ 30 字
- 参考：src/decks/sig-slate 的 `trend` 页；docs/zh-CN/components.md#slate-trend；交互：曲线从左往右画出；点指标卡换曲线；末端圆点和气泡弹出
