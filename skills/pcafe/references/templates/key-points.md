# 要点

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 2 个模板。返回索引：[../templates.md](../templates.md)。

### `NumberedColumns` 编号要点（要点 · 并列特性）
- 适合：3–4 个同等重要的特性、原则或发现；每个要点都能用一个关键词标签概括
- 不适合：要点有先后顺序：用 StepTrack；要点有轻重之分：用 SpotlightList 或 Bento；超过 4 个：拆页
- 上限：items 正好 3 或 4 个；title ≤ 10 字（一行）；body 24–40 字：太短列会显得空，太长会压到底部的大编号；长的英文标识符（组件名、包名）放进 tag，不要堆在 body 里，它们不能在中间断行；tag ≤ 20 个字符；各列 body 长度尽量接近
- 参考：src/decks/release 的 `hardening` 页；docs/zh-CN/components.md#numbered-columns；交互：悬停整列：编号变为强调色并上浮，标签换成强调底色。

### `ToggleCard` 开关设置窗（要点 · 哪些开着、哪些关着）
- 适合：讲默认设置、功能开关、可选项；桌面风格的演示
- 不适合：要说明的是状态好坏：用 StatusGrid
- 上限：rows 3–5 行：label ≤ 10 字，note ≤ 24 字；title ≤ 2 行 × 8 字
- 参考：src/decks/wallpaper 的 `toggles` 页；docs/zh-CN/components.md#toggle-card；交互：点击开关可切换，仅为演示
