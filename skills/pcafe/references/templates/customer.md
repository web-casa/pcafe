# 客户

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 1 个模板。返回索引：[../templates.md](../templates.md)。

### `PersonaCards` 买家画像（客户 · 采购小组里的三个角色）
- 适合：B2B 采购小组：决策者、使用者、把关者；要让市场、销售、产品对“卖给谁”达成一致
- 不适合：在比较三个细分市场（不是同一笔采购里的人）：用 IconGrid；画像没有访谈依据又不标示意
- 上限：personas 正好 3 个；role ≤ 10 字；part ≤ 6 字；job ≤ 30 字；goals / pains 各正好 2 条，每条 ≤ 18 字；channels 2–3 个，每个 ≤ 8 个字符；focus 最多 1 个
- 参考：src/decks/gtm 的 `personas` 页；docs/zh-CN/components.md#persona-cards；交互：卡片依次上浮；悬停时卡片抬起，图标格转动并点亮。
