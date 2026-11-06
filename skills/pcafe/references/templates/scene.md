# 场景

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 1 个模板。返回索引：[../templates.md](../templates.md)。

### `ShelfGallery` 画廊书架（场景 · 3–4 个带图的例子）
- 适合：3–4 个用途、场景、案例，每个配一张图；想逐个讲但让观众看到全部
- 不适合：没有图：用 PanelCards；图片是证据要看清细节：用 Screenshot
- 上限：items 3–4 张；image 只用 decor- 插图或真实截图，必须有 alt；title ≤ 8 字；body ≤ 36 字
- 参考：src/decks/v3-p5 的 `uses` 页；docs/zh-CN/components.md#shelf-gallery；交互：build: reveal 时第一张先在前面，之后每步换下一张；完整状态最后一张在前
