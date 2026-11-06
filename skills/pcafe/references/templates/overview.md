# 总览

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 3 个模板。返回索引：[../templates.md](../templates.md)。

### `Bento` Bento 总览（总览 · 紧跟封面）
- 适合：需要一页讲清“这是什么”，并允许听众按兴趣深入；有 6 个并列主题，其中 1 个是最重要的（放在第 1 格）
- 不适合：主题不足 6 个：不要凑数，改用 NumberedColumns；每个主题的详情你说不出一张图或一张表：详情页会空洞；一份演示里使用超过一次
- 上限：cards 必须正好 6 张；顺序即位置：1 大卡（左），2–3 宽卡（右上），4–6 小卡（底部）；标题必须预先断行且不会自动换行：第 1 格 1 行；第 2–3 格 ≤ 2 行 × 8 字；第 4–6 格 1 行 ≤ 12 字；summary 1 行；lead ≤ 70 字；feature.stats 正好 3 项，value ≤ 7 个字符
- 参考：src/decks/release 的 `overview` 页；docs/zh-CN/components.md#bento；交互：点击或 Tab + Enter 展开；Esc 返回并把焦点还给原卡片；详情打开时方向键不会翻页。

### `BentoBoard` 格子全貌（总览 · 一页说清全貌）
- 适合：产品或项目的一页总览；有 3 个数字、一句规则和 4–6 个功能点
- 不适合：要点击展开详情：用 Bento；只有一个数字：用 BigStat
- 上限：title ≤ 2 行 × 8 字，lead ≤ 40 字；stats 正好 3 个：label ≤ 14 字符，value ≤ 6 字符，unit ≤ 4 字符，note ≤ 20 字；note.text ≤ 70 字；chips.items 4–6 个，label ≤ 6 字
- 参考：src/decks/bento 的 `board` 页；docs/zh-CN/components.md#bento-board

### `MegaMenu` 导航大菜单（总览 · 一个家族的分类）
- 适合：产品线、版本家族、文档目录这类“有几个大类、每类几项”的总览；想让观众像看官网菜单一样一眼看到全貌
- 不适合：每项要详细说明：用 IconGrid 或拆页；只有一层分类：用 Agenda 或 IconGrid
- 上限：brand ≤ 10 个字符，只写文字，不画 logo；menu 3–6 项，每项 ≤ 6 字或 ≤ 10 个拉丁字符；columns 2–4 列；heading ≤ 8 字；items 每列 2–5 个；name ≤ 14 个字符，desc ≤ 16 字（4 列时 ≤ 10 字）
- 参考：src/decks/v3-p1 的 `family` 页；docs/zh-CN/components.md#mega-menu；交互：build 模式下每按一次 → 出现一列
