# 建议

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 1 个模板。返回索引：[../templates.md](../templates.md)。

### `VerdictColumns` 分组建议（建议 · 适用 / 观望 / 不适用）
- 适合：“谁该用 / 谁该等 / 谁不该”这类决策建议；选型结论、风险分级
- 不适合：没有明确的结论倾向；每组超过 3 项：精简或拆页
- 上限：groups 2–3 组，按“是 → 否”排序；每组 2–3 项，各组项数相差不超过 1；只有 1 项的组会显得空；item.title ≤ 16 字；item.body 14–26 字（一行）；label ≤ 6 字
- 参考：src/decks/release 的 `who` 页；docs/zh-CN/components.md#verdict-columns
