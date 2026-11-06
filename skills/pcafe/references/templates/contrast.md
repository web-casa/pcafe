# 对照

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 1 个模板。返回索引：[../templates.md](../templates.md)。

### `Matrix` 矩阵对照（对照 · 行 × 列的标识）
- 适合：“谁在哪一类里叫什么”：厂商 × 用途、平台 × 接口、版本 × 功能；格子里是短标识而不是句子
- 不适合：格子里要写句子：用 CompareTable 或拆页；只有新旧两列：用 CompareTable
- 上限：columns 2–4 列：label ≤ 8 字，note ≤ 14 字；rows 3–6 行：label ≤ 10 字，sub ≤ 16 个字符；单元格 ≤ 18 个字符，没有就写 null；focus 最多 1 列；footnote ≤ 60 字；标题写成一行时整页更从容；两行标题时最多 5 行数据
- 参考：src/decks/geo 的 `crawlers` 页；docs/zh-CN/components.md#matrix；交互：悬停一行时整行变暗底；悬停单元格时标识反白。
