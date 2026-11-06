# 预告

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 2 个模板。返回索引：[../templates.md](../templates.md)。

### `Teaser` 下一站（预告 · 展望）
- 适合：“接下来会发生什么”：下一版本、下一季度、路线图要点；章节过渡页
- 不适合：要传达确定的结论：用 Closing；没有可以引用的前瞻信息：不要编造
- 上限：numeral 1–3 个字符；word ≤ 10 个字符；notes 2–4 条：key ≤ 16 个字符，text ≤ 34 字
- 参考：src/decks/release 的 `forky` 页；docs/zh-CN/components.md#teaser；交互：描边数字随鼠标漂移，逐位升起。

### `GlowStack` 发光叠卡（预告 · 这一个，然后下一个）
- 适合：讲本期 / 下期、当前版本 / 下个版本；当前这项有 2–4 个要点
- 不适合：两项同样重要：用 DuoCards；超过两项：用 Roadmap
- 上限：front.title ≤ 14 字，items 2–4 条各 ≤ 20 字；back.title ≤ 14 字；title ≤ 2 行 × 8 字
- 参考：src/decks/toy3d 的 `next` 页；docs/zh-CN/components.md#glow-stack
