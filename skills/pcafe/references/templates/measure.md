# 衡量

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 1 个模板。返回索引：[../templates.md](../templates.md)。

### `KpiBoard` 指标看板（衡量 · 北极星与输入指标）
- 适合：周会、月报、复盘的核心指标；想表达“一个结果指标由几个输入指标推动”
- 不适合：只有 1–3 个数字：用 BigStat 或 MetricBars；要比较多个对象的同一指标：用 MetricBars
- 上限：star 1 个；items 4 或 6 个；label ≤ 10 字；value ≤ 7 个字符；delta ≤ 6 个字符，good 决定颜色（不写则中性）；trend 6–12 个点；没有走势就写 note（≤ 18 字），两者选一个
- 参考：src/decks/gtm 的 `kpi` 页；docs/zh-CN/components.md#kpi-board；交互：卡片依次淡入，走势线从左向右擦出；悬停小卡时抬起。
