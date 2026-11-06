# 拟真界面

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 2 个模板。返回索引：[../templates.md](../templates.md)。

### `ChatDemo` 对话演示（拟真界面 · 用一段对话展示怎么用）
- 适合：工具、助手、客服类产品：展示一次典型的交互；比列功能更直观的场合
- 不适合：有真实截图：用 Screenshot 或 TiltShot；对话超过 5 条：拆页
- 上限：title ≤ 2 行 × 10 字；lead ≤ 50 字；messages 2–5 条，每条 ≤ 40 字；card 2–4 行；notes 0–3 条，每条 ≤ 20 字；app 不用真实品牌名，除非是你自己的产品；source 写明是示意
- 参考：src/decks/mockui 的 `chat` 页；docs/zh-CN/components.md#chat-demo；交互：按 → 逐条出现对话

### `AppCards` 后台卡片（拟真界面 · 2–4 个填好内容的应用面板）
- 适合：同一件东西在几个平台、几种出口里的样子；用填好的表单代替文字描述
- 不适合：有真实截图：用 TabbedShot；要比较数字：用 CompareTable
- 上限：cards 2–4 张；title ≤ 16 字；fields 2–5 个，value ≤ 16 字；tags 0–4 个；页标题 ≤ 22 字；source 写明是示意
- 参考：src/decks/mockui 的 `apps` 页；docs/zh-CN/components.md#app-cards
