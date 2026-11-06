# 引述

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 1 个模板。返回索引：[../templates.md](../templates.md)。

### `TranscriptCard` 讲稿卡片（引述 · 一段对话或讲解）
- 适合：引用一段录音、访谈或讲解；想让听众注意其中一句
- 不适合：只有一句引语：用 QuoteHero；讲稿是编的又没标示意
- 上限：lines 3–4 行：who ≤ 6 字，time ≤ 6 字符，text ≤ 34 字；file ≤ 16 字符，meta ≤ 8 字符；tags 2–3 个，label ≤ 8 字；不是真实录音时 source 写“示意”
- 参考：src/decks/float-ui 的 `narrate` 页；docs/zh-CN/components.md#transcript-card
