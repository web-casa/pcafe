# 时间

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 2 个模板。返回索引：[../templates.md](../templates.md)。

### `Timeline` 时间线（时间 · 周期与路线图）
- 适合：支持周期、合同期限、版本路线图、项目阶段；想让听众意识到“还剩多久”
- 不适合：只有一个日期：放进 Cover 的 facts；超过 3 行：拆成两页；事件是离散的点而不是区间：用 StepTrack
- 上限：rows 1–3 行；有 countdowns 时 ≤ 2 行；每行 segments 首尾相接，1–3 段；段内 label 要比段短：一年长的段 ≤ 6 字；countdowns ≤ 3 个；轴两端各留约半年空白
- 参考：src/decks/release 的 `lifecycle` 页；docs/zh-CN/components.md#timeline；交互：分段依次生长；“今天”与倒计时在每次打开时按当前日期计算，演示不会过期。

### `ReleaseTrain` 发布列车（时间 · 版本生命周期重叠）
- 适合：软件版本、产品代际的支持期重叠；想说明“现在有几个版本在维护”
- 不适合：只有日期没有区间：用 Milestones；跨度超过 6 年：横条会太短，拆页
- 上限：rows 3–6 行，按时间先后；version ≤ 10 个字符；note ≤ 20 个字符；start / end / from / until / today 写 YYYY-MM；跨度 18–48 个月最合适；todayLabel ≤ 8 字；估计的日期要标 estimate 并在 source 里说明
- 参考：src/decks/v3-p1 的 `lifecycle` 页；docs/zh-CN/components.md#release-train；交互：build 模式下每按一次 → 出现一行
