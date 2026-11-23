# 定价

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 6 个模板。返回索引：[../templates.md](../templates.md)。

### `PricingTiers` 分档定价（定价 · 好 / 更好 / 最好）
- 适合：产品分档与定价方案；想把大多数客户引到某一档
- 不适合：在比较竞品价格：用 Matrix；只有一档：用 BigStat
- 上限：tiers 3 或 4 档，从便宜到贵；name ≤ 6 个字符；price ≤ 6 个字符；unit ≤ 10 个字符；for ≤ 16 字；features 3–5 条，每条 ≤ 16 字；后一档第一条写“包含上一档全部功能”；focus 恰好 1 档；badge ≤ 6 字；footnote ≤ 50 字
- 参考：src/decks/gtm 的 `tiers` 页；docs/zh-CN/components.md#pricing-tiers；交互：卡片依次上浮；悬停时抬起。

### `GlowPricing` 发光价格表（定价 · 三档套餐）
- 适合：订阅制产品的价格页；想现场演示年付更省
- 不适合：套餐超过 3 档或要逐项对比：用 PricingTiers 或 CompareTable；只有一个价格：用 BigStat
- 上限：title 1 行 ≤ 12 字；periods 2 个 × ≤ 4 字，save ≤ 6 字；plans 正好 3 个：name ≤ 4 字，price 每个 ≤ 6 个字符，body ≤ 24 字，items 3–5 条 × ≤ 10 字，cta ≤ 6 字；quota 可选：label ≤ 6 字，value ≤ 10 个字符，pct 0–100
- 参考：src/decks/sig-nocturne 的 `pricing` 页；docs/zh-CN/components.md#glow-pricing；交互：点击：切换计费周期，价格一起变

### `BuyoutPricing` 买断价格（定价 · 两档加收尾）
- 适合：一次性买断、两档套餐的价格页；想把价格和最后的号召放在同一页
- 不适合：订阅制、要切换月付年付：用 GlowPricing 或 PricingTiers；超过 2 档：用 PricingTiers
- 上限：title 1 行 ≤ 10 字；plans 正好 2 个：name ≤ 4 字，price ≤ 6 个字符，unit ≤ 4 字，body ≤ 20 字，items 3–4 条 × ≤ 10 字，facts 2 格（label ≤ 4 字，value ≤ 6 字），cta ≤ 6 字，badge ≤ 3 字；close.title ≤ 2 行 × 6 字，body ≤ 36 字，points 2–3 条 × ≤ 12 字，count.value ≤ 7 个字符，count.label ≤ 6 字，cta ≤ 6 字
- 参考：src/decks/sig-sunrise 的 `pricing` 页；docs/zh-CN/components.md#buyout-pricing；交互：点击：切换选中的套餐，按钮变成主题色

### `FolioOffers` 作品轨报价（定价 · 合作方式）
- 适合：独立设计师或小工作室的服务和报价；想用一个留白的位置邀请对方开始
- 不适合：订阅套餐要逐项对比：用 PricingTiers；只有一个价格：用 BookingClose
- 上限：kicker ≤ 20 个字符；title ≤ 8 字，sub ≤ 10 字；offers 2–4 个：name ≤ 6 字，note ≤ 22 字，price ≤ 6 个字符，unit ≤ 3 字；slot.title ≤ 8 字，note ≤ 18 字，cta ≤ 8 字，label ≤ 18 个字符；frames 1–2 张；foot ≤ 24 字
- 参考：src/decks/sig-folio 的 `offers` 页；docs/zh-CN/components.md#folio-offers；交互：点击：选中一种方式，空位里的方式和价格随之更新；虚线边框缓慢流动

### `AlbumPlus` 相册会员（定价 · 单一会员）
- 适合：只有一档付费会员；消费产品的订阅页
- 不适合：多档套餐：用 PricingTiers；一次性买断：用 BuyoutPricing
- 上限：name ≤ 10 个字符；lead ≤ 46 字；feats 正好 4 个：icon 一个字符，title ≤ 7 字，note ≤ 24 字；prices 两个 × ≤ 6 个字符；cta ≤ 8 字；around 2–4 张
- 参考：src/decks/sig-album 的 `plus` 页；docs/zh-CN/components.md#album-plus；交互：点击切换月付 / 年付，价格滚动更新；照片轻轻浮动

### `SlatePricing` 立体看板定价（定价 · 按人数计价）
- 适合：按席位收费的 SaaS 定价；想让观众自己感受人数对价格的影响
- 不适合：只有一个方案：用 AlbumPlus；按用量计费：用数据类模板讲清楚阶梯
- 上限：title ≤ 14 字；plans 恰好 3 个：name ≤ 4 字，note ≤ 14 字，items 3–5 条 × ≤ 12 字，cta ≤ 6 字；perSeat 为单人月价；不填 perSeat 时用 custom（≤ 6 字）；seats 默认 10，step 默认 5
- 参考：src/decks/sig-slate 的 `pricing` 页；docs/zh-CN/components.md#slate-pricing；交互：− / + 改人数，价格实时重算；方案卡悬停浮起
