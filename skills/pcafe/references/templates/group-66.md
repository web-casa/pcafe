# 章节

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 1 个模板。返回索引：[../templates.md](../templates.md)。

### `NotebookCover` 笔记本章节页（章节 · 分隔页）
- 适合：章节分隔页；想让分隔页有手作、笔记的感觉
- 不适合：正式汇报：用 SectionBreak；没有章节结构的短演示
- 上限：number ≤ 3 个字符；title ≤ 2 行 × 7 字；sub ≤ 16 字；items 0–4 条，每条 ≤ 14 字；texture 只用 decor- 皮纹
- 参考：src/decks/v2-p3 的 `ch1` 页；docs/zh-CN/components.md#notebook-cover
