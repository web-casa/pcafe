# 概念

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 2 个模板。返回索引：[../templates.md](../templates.md)。

### `QuoteHero` 定义与引语（概念 · 定义一个词 / 引用一句话）
- 适合：给全场统一一个术语的定义；引用一句有分量的原话作为论点
- 不适合：句子超过 64 字：改用 NumberedColumns 拆开讲；没有可靠出处的“名言”
- 上限：quote ≤ 64 字；需要换行时传数组，最多 3 行 × 22 字；marks 1–3 个，必须是 quote 里原样出现的子串；cite ≤ 30 个字符，写原文出处；notes 正好 3 条：label ≤ 8 字，text ≤ 36 字；引语要逐字照抄原文，不要改写后加引号
- 参考：src/decks/geo 的 `definition` 页；docs/zh-CN/components.md#quote-hero；交互：关键词底纹依次从左向右划出；悬停注释时图标副色变为强调色。

### `Venn` 维恩图（概念 · 几样东西的交集）
- 适合：几个维度共同决定一个结果；定性说明，不带数量
- 不适合：要比较各部分大小：用 Donut；超过 3 个集合
- 上限：sets 2–3 个：label ≤ 8 字，note ≤ 10 字；overlap ≤ 8 字
- 参考：src/decks/toy3d 的 `parts-of-deck` 页；docs/zh-CN/components.md#venn
