# 问答

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 2 个模板。返回索引：[../templates.md](../templates.md)。

### `ChatThread` 聊天问答（问答 · 3–6 条对话）
- 适合：新手常见问题、用户提问；想让问答读起来像对话
- 不适合：问题超过 3 个且要标出处：用 Faq；回答很长
- 上限：messages 3–6 条：提问 ≤ 24 字，回答 ≤ 44 字；title ≤ 2 行 × 7 字；lead ≤ 50 字；names 每个 ≤ 6 字
- 参考：src/decks/playful 的 `chat` 页；docs/zh-CN/components.md#chat-thread

### `FaqAccordion` 折叠问答（问答 · 逐条展开）
- 适合：3–6 个常见问题，想一条一条讲；答案都短，一两句话
- 不适合：想一次看全部问答：用 Faq；问题是步骤：用 ProcessAccordion 或 StepTrack
- 上限：items 3–6 个；q ≤ 24 字（一行 ≤ 18 字）；a ≤ 70 字；title 1–2 行，每行 ≤ 8 字；lead ≤ 50 字；打印 / 总览只展开 open 指定的一条
- 参考：src/decks/v3-p1 的 `faq` 页；docs/zh-CN/components.md#faq-accordion；交互：配 build: 'focus'：每按一次 → 展开下一条，上一条收起
