# 背景

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 2 个模板。返回索引：[../templates.md](../templates.md)。

### `Milestones` 事件时间线（背景 · 按日期排列的事件）
- 适合：政策、标准、发布等一串有日期的事件；想让听众看到“事情是怎么一步步来的”
- 不适合：需要按真实时间比例表现间隔：本模板等距排列，改用 Timeline；事件超过 7 个：只留关键节点
- 上限：events 4–7 个，按日期排序；等距排列，不按时间比例；date ≤ 10 个字符；title ≤ 24 字（两行）；tag ≤ 8 字，写事件的性质（法规、标准、事件）；focus 最多 1 个
- 参考：src/decks/geo 的 `regulation` 页；docs/zh-CN/components.md#milestones；交互：主轴从左生长，事件点依次弹出，卡片从轴线方向滑入。

### `TraceTimeline` 信号时间线（背景 · 发展历程）
- 适合：4–7 个历史节点；网络、通信、技术主题的历程页
- 不适合：节点超过 7 个或每项要写很多：用 Timeline；要表达时间长短：用 Gantt
- 上限：events 4–7 个：date ≤ 10 个字符，title ≤ 10 字，note ≤ 26 字（7 个时 ≤ 18 字）
- 参考：src/decks/v3-p3 的 `history` 页；docs/zh-CN/components.md#trace-timeline；交互：每按一次 → 出现一个事件
