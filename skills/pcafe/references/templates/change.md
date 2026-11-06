# 变化

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 2 个模板。返回索引：[../templates.md](../templates.md)。

### `CodeDiff` 配置对照（变化 · 同一份配置的前后写法）
- 适合：配置文件、代码片段从旧格式换成新格式；两段写法等价，想让听众逐行对照
- 不适合：只是几项设置的值变了：用 CompareTable；代码超过 8 行：截取关键部分，或拆成两页
- 上限：before / after 各 2–8 行，每行 ≤ 52 个字符；label ≤ 12 字；file 写完整路径；mark 是从 0 开始的行号；notes 2–3 条：key ≤ 12 个字符（等宽），text ≤ 30 字
- 参考：src/decks/release 的 `deb822` 页；docs/zh-CN/components.md#code-diff；交互：两个窗格依次滑入，代码逐行淡入。

### `SpecSheet` 版本对照表（变化 · 一批组件的新旧版本）
- 适合：发行版、依赖、平台升级时的一批版本号；想让听众快速找出“哪些是大版本跳跃”
- 不适合：只有 3 个以下组件：用 KeyValue 或 CompareTable；值不是版本号而是行为描述：用 CompareTable
- 上限：groups 2–3 组，每组 3–6 行，各组行数相差不超过 1；name ≤ 12 个字符；from / to ≤ 10 个字符；major 只标主版本号变化，不要全标
- 参考：src/decks/release 的 `versions` 页；docs/zh-CN/components.md#spec-sheet；交互：各组依次淡入；悬停一组时图标点亮。
