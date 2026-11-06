# 规划

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 2 个模板。返回索引：[../templates.md](../templates.md)。

### `Lanes` 泳道看板（规划 · 现在 / 下一步 / 之后）
- 适合：路线图：现在、下一步、之后；按状态归类：已移除、将移除、已弃用
- 不适合：有明确日期和周期：用 Gantt；项目之间有先后依赖：用 FlowDiagram
- 上限：lanes 3 或 4 列；label ≤ 6 字；sub ≤ 12 个字符；每列 2–4 张卡，列与列相差不超过 1 张；card.title ≤ 14 字；body ≤ 28 字；tag ≤ 12 个字符
- 参考：src/decks/release 的 `sunset` 页；docs/zh-CN/components.md#lanes；交互：泳道依次出现，卡片逐张落下；悬停卡片时抬起。

### `Roadmap` 路线图（规划 · 按季度看方向）
- 适合：季度或半年粒度的产品、市场、销售路线图；要同时表达方向和进度
- 不适合：按周排期：用 Gantt；没有时间段，只分现在 / 下一步 / 之后：用 Lanes
- 上限：periods 3–5 个，每个 ≤ 8 个字符；tracks 2–4 条；label ≤ 6 字；items 4–12 个；只占一段时 title ≤ 8 字，跨段时 ≤ 12 字；同一条工作线同一时间段最多两个事项
- 参考：src/decks/gtm 的 `roadmap` 页；docs/zh-CN/components.md#roadmap；交互：事项按工作线依次升起；进行中的事项带呼吸点。
