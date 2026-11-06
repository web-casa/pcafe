# 引语

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 2 个模板。返回索引：[../templates.md](../templates.md)。

### `Typewriter` 打字机（引语 · 一句原话逐字打出）
- 适合：电报、无线电、命令行里的原话；想让观众跟着一个字一个字读完的短句
- 不适合：长段引文：用 Quote；句子没有“正在输入”的意味：用 Statement
- 上限：lines 1–3 行，每行 ≤ 32 个拉丁字符或 ≤ 16 字；caption ≤ 40 字；meta 0–3 组：label ≤ 6 字，value ≤ 12 字
- 参考：src/decks/v2-p2 的 `landed` 页；docs/zh-CN/components.md#typewriter；交互：build 模式下每按一次 → 打出一行；直接跳到本页时进入即打字，最后停在完整文字

### `KaraokeLines` 讲稿高亮（引语 · 逐行读一段讲稿）
- 适合：一段演讲、誓词、歌词式的句子；想让观众跟着节奏一行行读
- 不适合：只有一句话：用 Quote 或 Statement；每行超过 14 字
- 上限：lines 3–6 行，每行 ≤ 14 字；aside ≤ 120 个拉丁字符或 ≤ 60 字；by ≤ 24 字
- 参考：src/decks/v2-p2 的 `speech` 页；docs/zh-CN/components.md#karaoke-lines；交互：build 模式下每按一次 → 点亮下一行；完整状态最后一行为强调色
