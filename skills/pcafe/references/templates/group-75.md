# 接口

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 1 个模板。返回索引：[../templates.md](../templates.md)。

### `VerbCards` 请求卡（接口 · 3–4 个操作）
- 适合：介绍一个 API 的几个核心操作；每个操作都有“请求 → 响应”
- 不适合：要展示完整代码：用 Terminal 或 CodeDiff；操作超过 4 个：拆页
- 上限：cards 3–4 张；verb ≤ 6 个拉丁字符；path ≤ 28 个拉丁字符；body ≤ 30 字；reply ≤ 28 个拉丁字符
- 参考：src/decks/v3-p5 的 `api` 页；docs/zh-CN/components.md#verb-cards；交互：build: reveal 时每步打出一张卡的响应
