# 背景

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 4 个模板。返回索引：[../templates.md](../templates.md)。

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

### `TeamBanner` 团队大合影（背景 · 团队和数字）
- 适合：“关于我们”，人比文字更有说服力；团队介绍配几个硬数字
- 不适合：要介绍每个人的分工：用 Team；没有合影：用 BigStat 或 StatRow
- 上限：statement ≤ 2 行 × 12 字；note ≤ 16 字；stats 2–3 个：value ≤ 5 个字符，label ≤ 10 字；合影的人物放在上三分之二
- 参考：src/decks/sig-atelier 的 `team` 页；docs/zh-CN/components.md#team-banner

### `TeamPortraits` 黑白人像团队（背景 · 团队成员）
- 适合：介绍 3 位核心成员；团队页顺便招人
- 不适合：成员超过 3 位或没有照片：用 Team；要写每个人的分工细节：用 PersonaCards
- 上限：title 1 行 ≤ 8 字；people 正好 3 位：name ≤ 6 字，role ≤ 8 字；join.title 2 行 × ≤ 5 字，body ≤ 34 字，contact ≤ 22 个字符
- 参考：src/decks/sig-monograph 的 `team` 页；docs/zh-CN/components.md#team-portraits；交互：悬停：人像从黑白变回彩色
