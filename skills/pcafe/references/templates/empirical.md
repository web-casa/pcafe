# 实证

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 1 个模板。返回索引：[../templates.md](../templates.md)。

### `BeforeAfter` 前后对比（实证 · 同一画面的两种状态）
- 适合：改版前后、优化前后；同一页面在两种条件下的样子：开关 JavaScript、桌面与移动、两个版本
- 不适合：两张图构图不同：分开放或用 Screenshot；差别要靠文字说明而不是看出来：用 CompareTable
- 上限：两张图尺寸和构图必须一致，ratio 填真实宽高比；label ≤ 10 字；notes 2–3 条：key ≤ 8 字，text ≤ 30 字；必须是真实截图，source 写明怎么截的
- 参考：src/decks/geo 的 `csr` 页；docs/zh-CN/components.md#before-after；交互：拖动或点击画面移动分隔线；手柄获得焦点后 ← → 微调，不会翻页。
