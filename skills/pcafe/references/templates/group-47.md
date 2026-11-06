# 说明

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 1 个模板。返回索引：[../templates.md](../templates.md)。

### `BentoSpotlight` 格子聚焦（说明 · 一个功能讲透）
- 适合：介绍一个功能、一个文件、一条命令；有两个关键数字和 3–4 行键值
- 不适合：多个并列功能：用 IconGrid；数字是主角：用 StatRow
- 上限：hero.title ≤ 10 字，hero.text ≤ 60 字；cells 正好 2 个：value ≤ 8 字符，note ≤ 18 字；rows.items 3–4 行：k ≤ 16 字符，v ≤ 22 字；title ≤ 1 行 × 14 字
- 参考：src/decks/bento 的 `single-file` 页；docs/zh-CN/components.md#bento-spotlight
