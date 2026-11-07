# 客户

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 2 个模板。返回索引：[../templates.md](../templates.md)。

### `PersonaCards` 买家画像（客户 · 采购小组里的三个角色）
- 适合：B2B 采购小组：决策者、使用者、把关者；要让市场、销售、产品对“卖给谁”达成一致
- 不适合：在比较三个细分市场（不是同一笔采购里的人）：用 IconGrid；画像没有访谈依据又不标示意
- 上限：personas 正好 3 个；role ≤ 10 字；part ≤ 6 字；job ≤ 30 字；goals / pains 各正好 2 条，每条 ≤ 18 字；channels 2–3 个，每个 ≤ 8 个字符；focus 最多 1 个
- 参考：src/decks/gtm 的 `personas` 页；docs/zh-CN/components.md#persona-cards；交互：卡片依次上浮；悬停时卡片抬起，图标格转动并点亮。

### `ProofMosaic` 口碑拼图（客户 · 评价与口碑）
- 适合：客户评价、用户口碑页；既有一句重磅引言、又有一个总量数字
- 不适合：只有一条引言：用 QuoteHero 或 QuoteArc；评价超过 3 条：用 QuoteWall
- 上限：title 1 行 ≤ 10 字；quote.text ≤ 48 字，name ≤ 6 字，role ≤ 16 个字符，人像竖图；stat.value ≤ 7 个字符，label ≤ 2 行 × 6 字；items 正好 2 条：text ≤ 30 字，name ≤ 4 字，role ≤ 16 个字符；result 可选（value ≤ 6 个字符，label ≤ 8 字）
- 参考：src/decks/sig-sunrise 的 `proof` 页；docs/zh-CN/components.md#proof-mosaic；交互：悬停：人像微放大，短评卡上浮
