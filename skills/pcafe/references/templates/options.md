# 选项

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 1 个模板。返回索引：[../templates.md](../templates.md)。

### `EditionPicker` 版本挑选器（选项 · 几个版本 / 方案逐个介绍）
- 适合：产品的几个版本、套餐、发行版本，各有用途；想逐个讲“这一个适合谁”
- 不适合：有价格要比：用 PricingTiers；选项超过 6 个：拆页或用 FilterChips
- 上限：options 3–6 个；name ≤ 12 个拉丁字符或 ≤ 8 字；tag ≤ 6 字；desc ≤ 40 字（6 个时 ≤ 30 字）；fit ≤ 24 字（6 个时 ≤ 14 字）
- 参考：src/decks/v3-p1 的 `editions` 页；docs/zh-CN/components.md#edition-picker；交互：配 build: 'focus'：每按一次 → 选中框移到下一张卡片
