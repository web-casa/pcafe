# 客户

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 4 个模板。返回索引：[../templates.md](../templates.md)。

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

### `DuskCases` 霞光面板客户案例（客户 · 案例轮播与两句评价）
- 适合：用真实感的客户故事做证明；既有案例又有几句短评价
- 不适合：没有照片：用 EmberWords；评价超过 2 条：用评价墙类模板
- 上限：title ≤ 16 字，单行；cases 2–4 个：company ≤ 10 字，headline ≤ 26 字；voices 恰好 2 条：quote ≤ 44 字，role ≤ 12 字；cta ≤ 6 字；autoplay 默认 5200 毫秒
- 参考：src/decks/sig-dusk 的 `cases` 页；docs/zh-CN/components.md#dusk-cases；交互：案例自动轮播，箭头切换；进度点计时；评价卡悬停浮起

### `AgencyProof` 深蓝评价加便当格（客户 · 评价与成果）
- 适合：机构或产品的客户评价页；既要一句原话，又要一个成果数字
- 不适合：评价超过 3 条：用评价墙类模板；没有人像照片：用 QuoteBlock
- 上限：tag ≤ 6 字；title 2 行 × ≤ 12 字；quotes 1–3 条：text ≤ 40 字，role ≤ 14 字；statement ≤ 14 字；visual.caption ≤ 10 字；stat.value 如 "+65%"；label ≤ 8 字；foot ≤ 8 字；faces 0–4 张；autoplay 默认 6400 毫秒
- 参考：src/decks/sig-agency 的 `proof` 页；docs/zh-CN/components.md#agency-proof；交互：评价自动轮换，箭头切换并停止自动；数字从零数上去；渐变格悬停流动；图片格悬停推近；头像悬停散开
