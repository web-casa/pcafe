# 分隔

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 2 个模板。返回索引：[../templates.md](../templates.md)。

### `SectionBreak` 章节页（分隔 · 每章第一页）
- 适合：配合 Agenda，每章开头放一页；演讲需要停顿、换话题的地方
- 不适合：没有 Agenda 的短演示；连续两页都是章节页；一章只有一页内容：不必单独分隔
- 上限：title 1–2 行，每行 ≤ 6 字（字号 128u）；lead ≤ 44 字；contents 2–4 项，每项 ≤ 12 字，写本章各页的标题；icon 选一个能代表整章的图标，自动用强调色；没有 source 字段
- 参考：src/decks/geo 的 `ch2` 页；docs/zh-CN/components.md#section-break；交互：同心圆依次展开，章节号逐位升起；图标随鼠标漂移。

### `ChapterNumber` 章节大数字（分隔 · 超大章节号配短标题）
- 适合：章节开头；长演示里给听众一个位置感
- 不适合：章节没有编号：用 SectionBreak；需要列出本章要点：用 ChapterProgress
- 上限：num 1–2 个字符；title 2–3 行，每行 ≤ 8 字；body ≤ 60 字；foot 两项，各 ≤ 16 个字符
- 参考：src/decks/sig-pink-script 的 `chapter` 页；docs/zh-CN/components.md#chapter-number
