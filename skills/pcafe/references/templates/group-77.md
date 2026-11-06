# 分级

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 1 个模板。返回索引：[../templates.md](../templates.md)。

### `TierLadder` 阶梯卡（分级 · 从热到冷 3–5 档）
- 适合：存储层级、服务档位、价格档这类有序分级；每档 2–3 个相同的参数
- 不适合：档位之间没有顺序：用 PanelCards；要买哪一档：用 PricingTiers
- 上限：steps 3–5 级；name ≤ 14 个拉丁字符或 ≤ 8 字；tag ≤ 6 字；specs 2–3 项：label ≤ 4 字，value ≤ 8 字；ends 各 ≤ 6 字
- 参考：src/decks/v3-p5 的 `tiers` 页；docs/zh-CN/components.md#tier-ladder；交互：build: reveal 时每步放下一级
