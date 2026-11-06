# 叙事

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 1 个模板。返回索引：[../templates.md](../templates.md)。

### `FlipBook` 翻书（叙事 · 2–4 个跨页）
- 适合：讲一本书、一份档案、一段史料；4–8 个数字按两两一组讲
- 不适合：只有 1 个跨页：用 DuoCards；数字要互相比较：用图表
- 上限：spreads 2–4 个跨页；label ≤ 8 字；value ≤ 7 个字符；title ≤ 12 字；body ≤ 56 字；texture 只用 decor- 纸纹
- 参考：src/decks/v2-p3 的 `bible` 页；docs/zh-CN/components.md#flip-book；交互：build: reveal 时每步翻一页；完成态显示最后一个跨页
