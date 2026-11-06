# 时间线

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 2 个模板。返回索引：[../templates.md](../templates.md)。

### `FilmStrip` 胶片条（时间线 · 3–5 个节点配图）
- 适合：按时间或步骤排列的 3–5 个节点，每个都有一张图；回顾、历史、演变
- 不适合：节点超过 5 个：用 Timeline；没有配图：用 Milestones
- 上限：title ≤ 1 行 × 18 字；lead ≤ 50 字；frames 3–5 格：label ≤ 8 字，mark ≤ 6 个字符
- 参考：src/decks/v2-p1 的 `events` 页；docs/zh-CN/components.md#film-strip；交互：build：每一格“显影”并显示说明

### `SplitFlap` 翻牌板（时间线 · 3–6 个时刻）
- 适合：有准确时刻的日程、任务时间线；发车、发布、上线这类“到点”的事件
- 不适合：事件需要长说明：用 Timeline；超过 6 行：拆页
- 上限：title ≤ 16 字；rows 3–6 行：time 和 at 各正好 5 个字符，label ≤ 8 字或 ≤ 14 个拉丁字符，status ≤ 4 字；heads 每项 ≤ 6 字
- 参考：src/decks/v2-p2 的 `board` 页；docs/zh-CN/components.md#split-flap；交互：build 模式下每按一次 → 翻出一行
