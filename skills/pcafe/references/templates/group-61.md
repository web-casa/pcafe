# 顺序

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 1 个模板。返回索引：[../templates.md](../templates.md)。

### `CardStack` 叠卡推出（顺序 · 3–4 个阶段）
- 适合：3–4 个依次发生的阶段、年份；想让每一项“从一叠里抽出来”
- 不适合：阶段之间没有先后：用 PanelCards；超过 4 项：用 Timeline
- 上限：cards 3–4 张；mark ≤ 6 个字符；title ≤ 10 字；body ≤ 44 字
- 参考：src/decks/v2-p3 的 `machine` 页；docs/zh-CN/components.md#card-stack；交互：build: reveal 时第 0 步是一摞，之后每步推出一张
