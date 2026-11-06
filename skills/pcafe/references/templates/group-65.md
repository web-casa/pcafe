# 流程

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 3 个模板。返回索引：[../templates.md](../templates.md)。

### `ProcessAccordion` 流程手风琴（流程 · 4–6 步逐项展开）
- 适合：4–6 步的工艺、流程，每步一段说明；讲一步时希望其他步骤收起来
- 不适合：要同时看全部说明：用 StepTrack；步骤名超过 6 字（竖排会太长）
- 上限：steps 4–6 步；title ≤ 6 字；sub ≤ 16 字；body ≤ 60 字；open 未逐步时展开的面板，默认最后一个
- 参考：src/decks/v2-p3 的 `craft` 页；docs/zh-CN/components.md#process-accordion；交互：build: reveal 时每步展开一项

### `LifecycleRail` 生命周期轨道（流程 · 一个东西随时间换位置）
- 适合：数据、订单、文档随时间在几个状态间移动；每一站有明确的时间点
- 不适合：多条并行线：用 Swimlane；只是历史年份：用 Timeline
- 上限：stops 3–5 站；at ≤ 8 个字符；title ≤ 12 个拉丁字符或 ≤ 8 字；body ≤ 32 字；marker ≤ 10 个拉丁字符
- 参考：src/decks/v3-p5 的 `lifecycle` 页；docs/zh-CN/components.md#lifecycle-rail；交互：build: reveal 时第一站先显示，之后每步移到下一站；完整状态标记停在最后一站

### `MethodSteps` 方法步骤（流程 · 深浅交替的编号步骤卡）
- 适合：固定的工作方法、协作流程；每一步要写清谁负责
- 不适合：步骤超过 4 个：用 Roadmap；步骤之间是循环：用 Cycle
- 上限：steps 3–4 个；title ≤ 8 字；body ≤ 44 字；who、when 各 ≤ 8 个字符；页标题 ≤ 22 字
- 参考：src/decks/sig-emerald 的 `method` 页；docs/zh-CN/components.md#method-steps；交互：按 → 逐张亮起
