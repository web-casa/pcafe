# 展示

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 3 个模板。返回索引：[../templates.md](../templates.md)。

### `HaloMarquee` 跑马灯作品页（展示 · 两张截图或作品）
- 适合：展示两张真实截图或作品；想要一个有动感的过渡展示页
- 不适合：截图需要标注：用 Screenshot；超过两项：用 WorkCards
- 上限：band ≤ 6 字；items 正好 2 个：title ≤ 16 字，tags 1–3 个、每个 ≤ 8 字符；src 必须是真实截图或 decor- 装饰插图
- 参考：src/decks/home-nutshell 的 `showcase` 页；docs/zh-CN/components.md#halo-marquee

### `PhotoMosaic` 照片拼格（展示 · 3–5 张图一起看）
- 适合：展示一组同主题的场景、物种、作品；用图片给一个数字做气氛铺垫
- 不适合：每张图都要配说明文字：用 PolaroidWall 或 PhotoStack；图片是界面截图：用 WindowStack
- 上限：title ≤ 1 行 × 18 字或 2 行 × 10 字；lead ≤ 50 字；tiles 3–5 张，caption ≤ 12 字；第一张放最重要的图，它最大
- 参考：src/decks/v2-p1 的 `residents` 页；docs/zh-CN/components.md#photo-mosaic；交互：build：图片逐张出现

### `PolaroidWall` 拍立得墙（展示 · 几张图各配一句话）
- 适合：列举 3–5 个用途、地点、回忆，每个用一张图一句话；轻松、讲故事的语气
- 不适合：严肃的数据汇报；每项需要超过 10 字说明：用 PhotoStack
- 上限：title ≤ 1 行 × 18 字；lead ≤ 50 字；items 3–5 张，note ≤ 10 字
- 参考：src/decks/v2-p1 的 `value` 页；docs/zh-CN/components.md#polaroid-wall；交互：build：拍立得逐张出现
