# 现状

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 1 个模板。返回索引：[../templates.md](../templates.md)。

### `StatusGrid` 状态网格（现状 · 一组对象各自的状态）
- 适合：架构、平台、职能、模块等一组对象的支持或就绪状态；想让听众一眼数出“几个好、几个有问题”
- 不适合：每个对象要比较多个维度：用 Matrix；状态只有两种且对象少于 4 个：用 VerdictColumns
- 上限：tiles 6–10 张；6 张 3 列，7–8 张 4 列，9–10 张 5 列；name ≤ 10 个字符（等宽显示）；sub ≤ 12 字；note ≤ 24 字，只给“部分”“不支持”写原因；labels 每个 ≤ 4 字
- 参考：src/decks/release 的 `arch` 页；docs/zh-CN/components.md#status-grid；交互：卡片依次淡入；悬停时抬起。
