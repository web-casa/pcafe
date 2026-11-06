# 过程

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 1 个模板。返回索引：[../templates.md](../templates.md)。

### `MaskReveal` 遮罩揭示（过程 · 边讲边揭开图片）
- 适合：分阶段讲一个过程，最后看到全貌；想让一张氛围图随讲解逐步出现
- 不适合：要点超过 4 个：拆页或用 StepTrack；图片本身是证据：用 Screenshot
- 上限：title 1–2 行 × ≤ 8 字；steps 2–4 个：label ≤ 8 字，text ≤ 36 字；shape: circle（默认）或 blinds；配 build: reveal
- 参考：src/decks/v2-p5 的 `stages` 页；docs/zh-CN/components.md#mask-reveal
