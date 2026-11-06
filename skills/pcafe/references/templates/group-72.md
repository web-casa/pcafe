# 转折

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 1 个模板。返回索引：[../templates.md](../templates.md)。

### `MorphHeadline` 变形标题（转折 · 一句话变成另一句）
- 适合：前后对照的名句、口号；“从 A 到 B”的立场转变
- 不适合：两句都要同时被读到：用 Compare 类模板；句子超过 12 字
- 上限：from、to 各 ≤ 12 字；notes 正好 2 条：label ≤ 6 字，body ≤ 40 字
- 参考：src/decks/v2-p2 的 `step` 页；docs/zh-CN/components.md#morph-headline；交互：build 模式下按 → 变形；直接进入本页时停顿约 1.6 秒后自动变形，打印只显示第二句
