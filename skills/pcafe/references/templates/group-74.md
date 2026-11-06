# 事件

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 1 个模板。返回索引：[../templates.md](../templates.md)。

### `NewsTicker` 新闻滚动条（事件 · 头版大标题）
- 适合：宣布一个事件或结果；一个主消息加几条次要消息
- 不适合：快讯需要出处各不相同且要细读：用列表；没有一个主标题
- 上限：dateline ≤ 16 个字符；headline ≤ 2 行 × 14 字；dek ≤ 56 字；label ≤ 4 字；items 2–4 条，每条 ≤ 18 字，合计 ≤ 50 字
- 参考：src/decks/v2-p2 的 `home` 页；docs/zh-CN/components.md#news-ticker；交互：滚动条是一个 build 步骤，驶入后停住
