# 产品

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 4 个模板。返回索引：[../templates.md](../templates.md)。

### `PanelCards` 面板卡片（产品 · 3–4 项能力各配一小块界面）
- 适合：介绍产品的 3–4 项能力，每项都有能画出来的数据；把几组小数据并排展示
- 不适合：只有文字没有数据：用 IconGrid；超过 4 项：拆页
- 上限：cards 3 或 4 张；eyebrow ≤ 12 字，title ≤ 8 字，body ≤ 24 字；list 3–5 行；bars 3–12 根；progress 2–4 行；chips 3–6 个；迷你界面里的数字同样要在 source 写出处
- 参考：src/decks/launch 的 `panels` 页；docs/zh-CN/components.md#panel-cards

### `AskAnswer` 问答卡（产品 · 演示一个问题和它的答案）
- 适合：演示搜索、分析、AI 助手能回答什么；把同一个问题在三个对象上的答案并排
- 不适合：答案不是数字：用 QuoteWall 或 ClaimCards；结果多于 3 个：拆页
- 上限：question ≤ 30 字；found ≤ 20 字；results 正好 3 个：name ≤ 8，value ≤ 6 个字符，bars 4–10 个；notes 0–3 条，每条 ≤ 20 字
- 参考：src/decks/launch 的 `ask` 页；docs/zh-CN/components.md#ask-answer

### `TabbedShot` 分段截图（产品 · 一个产品的 2–4 个界面）
- 适合：一个产品有几个主要界面；截图本身就是论据
- 不适合：没有真实截图；截图需要标注细节：用 Screenshot
- 上限：tabs 2–4 个，label ≤ 6 字；每个 src 都是真实截图；title ≤ 22 字；lead ≤ 50 字
- 参考：src/decks/studio 的 `tabs` 页；docs/zh-CN/components.md#tabbed-shot；交互：点击分段切换截图

### `BrandKit` 设计规范（产品 · 字体、颜色和尺寸）
- 适合：介绍品牌规范或设计系统；给设计、前端交接视觉规则
- 不适合：只有一种颜色要说明：写在正文里即可；字体多于 3 种
- 上限：fonts 2–3 种：name ≤ 20 个字符，role ≤ 10 字；palettes 2–3 排，每排 4–10 个；tokens 0–4 个：label ≤ 8 字，value ≤ 12 个字符
- 参考：src/decks/studio 的 `brand` 页；docs/zh-CN/components.md#brand-kit
