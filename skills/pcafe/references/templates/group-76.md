# 数字

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 1 个模板。返回索引：[../templates.md](../templates.md)。

### `NinesDial` 数九（数字 · 解释“几个九”）
- 适合：解释耐久度、可用性这类“几个九”的指标；对比不同档位各有几个九
- 不适合：普通百分比：用 BigStat 或 Gauge；数字不是全 9：用 Odometer
- 上限：nines 2–11；caption ≤ 12 字；marks 2–4 步，upto 递增且最后一步 = nines；label ≤ 10 字，note ≤ 36 字
- 参考：src/decks/v3-p5 的 `nines` 页；docs/zh-CN/components.md#nines-dial；交互：build: reveal 时每步点亮一组九和对应说明
