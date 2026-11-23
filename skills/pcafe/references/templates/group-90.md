# 能力

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 2 个模板。返回索引：[../templates.md](../templates.md)。

### `MarkerSkills` 记号笔能力卡（能力 · 我做什么与近况）
- 适合：介绍自己做哪三类事；想顺便讲讲最近在忙什么
- 不适合：服务要配价格：用 FolioOffers；超过三类：用 IconGrid
- 上限：kicker ≤ 10 字；skills 正好 3 个：name ≤ 5 字，no ≤ 4 个字符，note ≤ 8 字，icon 六选一；nowLabel ≤ 6 字，updated ≤ 14 字；now ≤ 2 行 × 22 字
- 参考：src/decks/sig-marker 的 `skills` 页；docs/zh-CN/components.md#marker-skills；交互：悬停：图标分层上浮，取景角张开

### `EmberBento` 暗场能力拼贴（能力 · 四项功能）
- 适合：介绍 AI 产品的 4 项核心能力；既想要氛围图，又想有一点可以动手的界面
- 不适合：能力超过 4 项：用 FeatureBento；没有图片：用要点类模板
- 上限：title ≤ 16 字，单行；cards 恰好 4 张：title ≤ 8 字，body ≤ 34 字；第 1、3 张宜放竖图；tools 3–6 个；toggles 2–4 个 × ≤ 8 字
- 参考：src/decks/sig-ember 的 `bento` 页；docs/zh-CN/components.md#ember-bento；交互：点工具图标切换并显示名字；开关可拨；悬停图片推近、卡片描出主色边
