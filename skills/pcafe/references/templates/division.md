# 分工

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 2 个模板。返回索引：[../templates.md](../templates.md)。

### `Team` 团队卡片（分工 · 谁负责什么）
- 适合：项目启动会的团队介绍；上市小组、虚拟团队的角色分工
- 不适合：要写清每件事谁执行、谁拍板：用 Matrix 做 RACI；只有 2–3 个人：写进正文
- 上限：members 4、6 或 8 个；name ≤ 8 字；role ≤ 14 字；owns ≤ 36 字；initials 1–3 个字符；不填时取中文首字或英文缩写；没有照片位：真人照片不放进演示
- 参考：src/decks/gtm 的 `team` 页；docs/zh-CN/components.md#team；交互：卡片依次出现；悬停时抬起。

### `Swimlane` 泳道流程图（分工 · 一个流程里谁做哪步）
- 适合：跨角色的流程、交接；4–8 个步骤
- 不适合：只有一个角色：用 StepTrack；要表达长期分工：用 Lanes
- 上限：lanes 2–4 条，各 ≤ 6 字；steps 4–8 步，text ≤ 10 字
- 参考：src/decks/wallpaper 的 `swimlane` 页；docs/zh-CN/components.md#swimlane
