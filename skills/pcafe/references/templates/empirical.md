# 实证

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 2 个模板。返回索引：[../templates.md](../templates.md)。

### `BeforeAfter` 前后对比（实证 · 同一画面的两种状态）
- 适合：改版前后、优化前后；同一页面在两种条件下的样子：开关 JavaScript、桌面与移动、两个版本
- 不适合：两张图构图不同：分开放或用 Screenshot；差别要靠文字说明而不是看出来：用 CompareTable
- 上限：两张图尺寸和构图必须一致，ratio 填真实宽高比；label ≤ 10 字；notes 2–3 条：key ≤ 8 字，text ≤ 30 字；必须是真实截图，source 写明怎么截的
- 参考：src/decks/geo 的 `csr` 页；docs/zh-CN/components.md#before-after；交互：拖动或点击画面移动分隔线；手柄获得焦点后 ← → 微调，不会翻页。

### `WhyStats` 为什么选我们（实证 · 三个数字）
- 适合：“为什么选我们”，用三个数字撑腰；一段话加数字的成果页
- 不适合：数字超过 3 个：用 StatRow 或 KpiBoard；要比较前后变化：用 CountCompare
- 上限：title ≤ 2 行 × 5 字；reasons 3–5 条 × ≤ 6 字；lead ≤ 60 字；quote.text ≤ 34 字，by ≤ 16 字；stats 正好 3 个：value ≤ 5 个字符，label ≤ 14 字，meter 0–100
- 参考：src/decks/sig-monograph 的 `why` 页；docs/zh-CN/components.md#why-stats
