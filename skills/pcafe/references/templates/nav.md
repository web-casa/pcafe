# 导航

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 1 个模板。返回索引：[../templates.md](../templates.md)。

### `Agenda` 目录（导航 · 封面之后）
- 适合：15 页以上、分成几章的演示；想让听众先看到全貌，或者演讲中途要跳回某一章
- 不适合：10 页以下的短演示：目录本身就占了一成篇幅；章节只有 2 个：直接在封面导语里说
- 上限：items 3–6 项，顺序与演示一致；title ≤ 10 字；body 一行，≤ 26 字；page 是章节第一页的页码（从 1 开始），改动页序后记得同步；meta ≤ 20 个字符，例如“27 页 · 4 章”；没有 source 字段：目录不陈述事实
- 参考：src/decks/geo 的 `agenda` 页；docs/zh-CN/components.md#agenda；交互：悬停一行：背景变亮，图标格换成强调底色并轻微旋转，箭头右移；点击跳到该章第一页。
