# 构成

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 1 个模板。返回索引：[../templates.md](../templates.md)。

### `MeterCards` 计量卡（构成 · 费用由哪几项组成）
- 适合：讲清楚账单由哪几部分组成；每项有明确的计量单位
- 不适合：要给出金额和比例：用 Waterfall 或 ShareBar；要比较套餐：用 PricingTiers
- 上限：cards 3–5 张；name ≤ 8 字；unit ≤ 8 个字符；note ≤ 40 字；unitLabel ≤ 4 字
- 参考：src/decks/v3-p5 的 `pricing` 页；docs/zh-CN/components.md#meter-cards；交互：build: reveal 时每步出现一张
