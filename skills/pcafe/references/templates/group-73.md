# 解读

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 1 个模板。返回索引：[../templates.md](../templates.md)。

### `MarkerSweep` 荧光笔（解读 · 一段话里划重点）
- 适合：一段话里有 2–4 个要讲的点；逐句解读一段原文或说明
- 不适合：正文超过 110 字：拆页；要点之间是并列清单：用列表模板
- 上限：title ≤ 16 字；body 50–110 字；marks 2–4 个，必须是 body 里的原文；note ≤ 22 字
- 参考：src/decks/v2-p2 的 `eva` 页；docs/zh-CN/components.md#marker-sweep；交互：build 模式下每按一次 → 划下一处并显示对应旁注
