# 列举

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 1 个模板。返回索引：[../templates.md](../templates.md)。

### `PhotoStack` 照片叠放（列举 · 3–4 项逐张翻开）
- 适合：3–4 个并列的地点、案例、发现，每个有图和一句话；想制造“一张接一张”的节奏
- 不适合：需要同时比较所有图：用 PhotoMosaic；超过 4 项：拆页
- 上限：title ≤ 2 行 × 8 字；photos 3–4 张：title ≤ 10 字，body ≤ 32 字
- 参考：src/decks/v2-p1 的 `regions` 页；docs/zh-CN/components.md#photo-stack；交互：build：照片逐张落到最上面
