# 计划

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 1 个模板。返回索引：[../templates.md](../templates.md)。

### `Gantt` 计划甘特图（计划 · 按周排开的工作）
- 适合：30–90 天的行动计划、试点排期；多条工作流互相重叠，需要看清先后
- 不适合：有真实日期的长期周期（版本支持、合同期）：用 Timeline；只有先后没有时长：用 StepTrack
- 上限：axis 6–16 个单位；groups 2–4 段；rows 3–7 行：label ≤ 12 字；按开始时间排序；条形少于 2 个单位时，条内的“5–9”标签会放不下；footnote ≤ 40 字
- 参考：src/decks/geo 的 `plan` 页；docs/zh-CN/components.md#gantt；交互：条形依次从左生长；悬停一行时条形上浮。
