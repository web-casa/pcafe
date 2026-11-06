# 定价

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 1 个模板。返回索引：[../templates.md](../templates.md)。

### `PricingTiers` 分档定价（定价 · 好 / 更好 / 最好）
- 适合：产品分档与定价方案；想把大多数客户引到某一档
- 不适合：在比较竞品价格：用 Matrix；只有一档：用 BigStat
- 上限：tiers 3 或 4 档，从便宜到贵；name ≤ 6 个字符；price ≤ 6 个字符；unit ≤ 10 个字符；for ≤ 16 字；features 3–5 条，每条 ≤ 16 字；后一档第一条写“包含上一档全部功能”；focus 恰好 1 档；badge ≤ 6 字；footnote ≤ 50 字
- 参考：src/decks/gtm 的 `tiers` 页；docs/zh-CN/components.md#pricing-tiers；交互：卡片依次上浮；悬停时抬起。
