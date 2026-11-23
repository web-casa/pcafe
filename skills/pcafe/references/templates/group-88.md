# 服务

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 1 个模板。返回索引：[../templates.md](../templates.md)。

### `DiptychServices` 对页服务（服务 · 分标签介绍）
- 适合：2–4 项服务，每项有交付物和大致报价；不想把所有服务挤在一页里
- 不适合：要并排比较价格：用 PricingTiers；服务就是一个流程：用 FolioSteps
- 上限：title 1–2 行 × ≤ 8 字；services 2–4 个：name ≤ 4 字，body ≤ 40 字，items 3–5 条 × ≤ 10 字，time 和 price 各 ≤ 8 字；labels 每个 ≤ 4 字
- 参考：src/decks/sig-diptych 的 `services` 页；docs/zh-CN/components.md#diptych-services；交互：点击标签：内容淡入切换，左图同步交叉淡入
