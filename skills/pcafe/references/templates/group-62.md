# 路线

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 1 个模板。返回索引：[../templates.md](../templates.md)。

### `DepthCarousel` 纵深轮播（路线 · 3–6 站依次讲）
- 适合：路线、站点、版本这类有顺序的 3–6 项；每项一个大数字（年份、编号）
- 不适合：要一眼看全部：用 Timeline；项目超过 6 个
- 上限：items 3–6 项；mark ≤ 6 个字符；title ≤ 8 字；body ≤ 40 字
- 参考：src/decks/v2-p3 的 `route` 页；docs/zh-CN/components.md#depth-carousel；交互：build: reveal 时每步换到下一站；完成态停在最后一站
