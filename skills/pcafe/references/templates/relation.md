# 关系

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 1 个模板。返回索引：[../templates.md](../templates.md)。

### `PathCrumbs` 路径面包屑（关系 · 上下游与流转）
- 适合：上游到下游、源头到成品这种单向链条；3–5 个环节，每个环节一两句话
- 不适合：有分叉或回路：用 FlowDiagram 或 NodeGraph；每步要写很多：用 StepTrack
- 上限：crumbs 3–5 个；label ≤ 8 字或 ≤ 14 个拉丁字符（5 个时 ≤ 10 个拉丁字符）；sub ≤ 16 个字符；body ≤ 50 字；tag ≤ 8 字
- 参考：src/decks/v3-p1 的 `upstream` 页；docs/zh-CN/components.md#path-crumbs；交互：build 模式下每按一次 → 一节面包屑和它的卡片一起出现
