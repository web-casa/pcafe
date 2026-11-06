# 安排

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 1 个模板。返回索引：[../templates.md](../templates.md)。

### `SlotPicker` 日历时间段（安排 · 日期与时间段）
- 适合：评审、培训、答疑这类要约时间的安排；轻柔风格里放一个产品感的小界面
- 不适合：真实的长期排期：用 Gantt 或 Timeline；日期不是真的又没标示意
- 上限：card.title ≤ 12 字，meta ≤ 10 字符；month ≤ 10 字符，days 28–31，start 为 1 号是周几（周一 = 0）；slots 3–5 个：time ≤ 8 字符，note ≤ 8 字；不是真实日程时 source 写“示意”
- 参考：src/decks/soft-saas 的 `booking` 页；docs/zh-CN/components.md#slot-picker
