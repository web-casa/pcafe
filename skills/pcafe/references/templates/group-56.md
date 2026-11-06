# 观点

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 2 个模板。返回索引：[../templates.md](../templates.md)。

### `PillSentence` 嵌图长句（观点 · 用一句大字讲清问题）
- 适合：开场后的问题页、立场页；一句话里有 2–3 个能用图标表示的关键词
- 不适合：句子很短、要居中停顿：用 Statement；有数据要比较：用图表模板
- 上限：parts 文字合计 ≤ 44 字，图标胶囊 2–3 个，每个 1–2 个图标；note.label ≤ 12 字，note.body ≤ 24 字；aside ≤ 64 字
- 参考：src/decks/home-cobalt 的 `problem` 页；docs/zh-CN/components.md#pill-sentence

### `RotatingWord` 轮换词（观点 · 一句话里换 2–4 个词）
- 适合：“靠的是 X / Y / Z”这类并列答案；同一句式要依次套 2–4 个对象
- 不适合：词之间没有共同句式：用 IconGrid 或卡片；要比较数值：用图表
- 上限：before ≤ 8 字，after ≤ 6 字；words 2–4 个：word ≤ 4 字，value ≤ 8 个字符，note ≤ 30 字
- 参考：src/decks/v2-p2 的 `stack` 页；docs/zh-CN/components.md#rotating-word；交互：build 模式下每按一次 → 换下一个词并点亮卡片；完整状态显示最后一个词
