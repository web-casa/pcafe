# 方法

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 2 个模板。返回索引：[../templates.md](../templates.md)。

### `RangeBars` 区间估计（方法 · 数字有多可靠）
- 适合：讲抽样误差、置信区间、预测范围；说明“样本量要多大才够”
- 不适合：数据没有误差范围：用 MetricBars；区间来自你自己的估算却没有标明：在 source 里写清计算方法
- 上限：rows 3–6 行：label ≤ 8 个字符，note ≤ 8 个字符；axis.ticks 3–5 个；focusLabel ≤ 8 字；example.text ≤ 48 个字符（等宽两行）
- 参考：src/decks/geo 的 `sampling` 页；docs/zh-CN/components.md#range-bars；交互：区间从中心向两侧展开。

### `ProcessQuote` 流程配客户评价（方法 · 合作步骤加一句评价）
- 适合：讲合作流程，同时给一句客户背书；服务型生意的“怎么合作”页
- 不适合：步骤要配图：用 StepGrid；只有评价没有流程：用 QuoteHero
- 上限：title ≤ 2 行 × 8 字；steps 3–5 行：title ≤ 8 字，body ≤ 26 字，time ≤ 6 字；rating ≤ 14 个字符；quote.text ≤ 48 字，by ≤ 6 字，role ≤ 14 字
- 参考：src/decks/sig-atelier 的 `process` 页；docs/zh-CN/components.md#process-quote；交互：build：步骤逐行出现
