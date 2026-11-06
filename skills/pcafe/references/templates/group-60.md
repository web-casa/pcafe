# 揭晓

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 3 个模板。返回索引：[../templates.md](../templates.md)。

### `FlipCards` 翻面卡（揭晓 · 先问后答）
- 适合：破除误解：正面写常见说法，背面写事实；先抛问题让听众猜，再翻面揭晓
- 不适合：没有“先问后答”的悬念：用 PanelCards；超过 4 张：拆页
- 上限：cards 2–4 张；tag ≤ 6 字；front ≤ 3 行 × 9 字；title ≤ 12 字；body ≤ 48 字；backTag ≤ 6 字；配 build: reveal 才有翻面
- 参考：src/decks/v2-p3 的 `myths` 页；docs/zh-CN/components.md#flip-cards；交互：build: reveal 时每步翻一张；未逐步或打印时全部显示背面

### `Envelope` 信封（揭晓 · 一封信、一段公告）
- 适合：原文引用一封信、通知、公告；想营造“拆开来看”的揭晓感
- 不适合：信的内容超过 72 字：用 QuoteHero；内容是虚构的却没标明：必须在 sign 或 source 里写“示意”
- 上限：title ≤ 3 行 × 8 字；lead ≤ 60 字；greeting ≤ 12 字；body ≤ 72 字；sign ≤ 14 字；stamp ≤ 4 个字符；texture 只用 decor- 纸纹
- 参考：src/decks/v2-p3 的 `stamp` 页；docs/zh-CN/components.md#envelope；交互：build: reveal 时第 1 步开封口，第 2 步抽出信纸

### `ExplorerFlip` 浏览器翻转（揭晓 · 表面样子和真实样子）
- 适合：说明“看起来是 A，其实是 B”的数据结构（前缀、别名、映射）；有 3–6 个具体的条目
- 不适合：只是展示文件列表：用 Screenshot 或 Terminal；条目超过 6 个
- 上限：path ≤ 32 个拉丁字符；rows 3–6 行：name ≤ 24 个拉丁字符（以 / 结尾画成文件夹），key ≤ 40 个拉丁字符，size ≤ 10 个字符；views 各 ≤ 6 字；note ≤ 60 字
- 参考：src/decks/v3-p5 的 `flat` 页；docs/zh-CN/components.md#explorer-flip；交互：build: reveal 时第 1 步翻成键名，第 2 步出现说明；完整状态显示键名
