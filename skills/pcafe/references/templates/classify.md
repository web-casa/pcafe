# 分类

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 1 个模板。返回索引：[../templates.md](../templates.md)。

### `FilterChips` 筛选胶囊（分类 · 一组东西按标签筛）
- 适合：一组条目有交叉分类，想逐个说明“这一类有哪些”；条目多但每个只要一句话
- 不适合：分类互不重叠且只有两三类：用 Matrix 或 IconGrid 分组；条目要详细说明：拆页
- 上限：chips 2–6 个，每个 ≤ 6 字或 ≤ 10 个拉丁字符；cards 4–12 张（每行 4 张）；title ≤ 16 个拉丁字符或 ≤ 8 字；desc ≤ 22 字（12 张时 ≤ 16 字）；in 写胶囊下标，至少 1 个
- 参考：src/decks/v3-p1 的 `variants` 页；docs/zh-CN/components.md#filter-chips；交互：配 build: 'focus'：每按一次 → 切到下一个筛选，非本类卡片变灰
