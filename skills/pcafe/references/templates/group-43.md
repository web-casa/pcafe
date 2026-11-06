# 论证

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 3 个模板。返回索引：[../templates.md](../templates.md)。

### `ProofSplit` 证明分栏（论证 · 一个能力加两个证据数字）
- 适合：说明一个自动化能力是怎么设定的，以及效果；一句主张配两个硬数字
- 不适合：数字多于 2 个：用 KpiBoard；没有可以列成设置项的规则
- 上限：rows 3–5 行：label ≤ 8，value ≤ 12 个字符；stats 正好 2 个：value ≤ 6 个字符，label ≤ 12 字；checks 0–3 条，每条 ≤ 20 字
- 参考：src/decks/launch 的 `proof` 页；docs/zh-CN/components.md#proof-split

### `Laurels` 月桂奖章（论证 · 荣誉、排名或硬指标）
- 适合：可以引用出处的奖项、排名、认证；几条硬性的承诺或底线
- 不适合：没有出处的“最佳”“第一”；超过 4 项
- 上限：items 3–4 个：title ≤ 10 字，sub ≤ 14 字，note ≤ 36 字；每一项都要能在 source 里找到依据
- 参考：src/decks/studio 的 `laurels` 页；docs/zh-CN/components.md#laurels

### `Balance` 优缺点天平（论证 · 两边权衡）
- 适合：优缺点、成本与收益、取舍；想表达哪边更重
- 不适合：要逐项对比属性：用 CompareTable；两边分量没有依据又不愿标示意
- 上限：left / right：label ≤ 6 字，items 1–3 条各 ≤ 14 字；weight 只决定倾斜，最多 9°
- 参考：src/decks/wallpaper 的 `balance` 页；docs/zh-CN/components.md#balance
