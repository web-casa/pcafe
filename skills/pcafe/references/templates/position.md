# 定位

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 1 个模板。返回索引：[../templates.md](../templates.md)。

### `Quadrant` 定位四象限（定位 · 二维竞争地图）
- 适合：竞品定位、产品组合、优先级（影响 × 投入）；想让听众看到“哪块位置是空的”
- 不适合：点的坐标没有依据又不标示意；只有一个维度在比较：用 MetricBars 或 RangeBars
- 上限：points 3–7 个，坐标 0–100，相邻点至少相距 8，避免标签重叠；point.label ≤ 8 字；x / y 每端 ≤ 6 字；zones 每个 ≤ 8 字；notes 2–3 段：title ≤ 10 字，body ≤ 40 字
- 参考：src/decks/gtm 的 `map` 页；docs/zh-CN/components.md#quadrant；交互：点依次弹出，焦点持续发出脉冲；悬停一个点时标签反白。
