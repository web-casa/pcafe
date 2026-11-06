# 动效

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 5 个模板。返回索引：[../templates.md](../templates.md)。

### `MediaExpand` 小窗放大（动效 · 一张截图或照片从小窗放大到整页）
- 适合：产品演示、案例：先让人认出画面，再看细节；一张图本身就是这一页的重点
- 不适合：截图需要标注细节：用 Screenshot；主体贴近图片边缘：放大时会被裁掉
- 上限：title ≤ 2 行 × 10 字；lead ≤ 40 字；caption ≤ 24 字；src 是真实截图或标明来源的照片；配 build: 'reveal'（只有 1 步）
- 参考：src/decks/motion 的 `expand` 页；docs/zh-CN/components.md#media-expand；交互：按 → 放大画面

### `ScatterOrder` 散点成序（动效 · 散乱的卡片逐个归位成一条路径）
- 适合：把零散的事项理成有顺序的步骤；流程、方法论、准备清单
- 不适合：步骤之间是循环：用 Cycle；每步需要详细说明：用 Process 类模板
- 上限：steps 4–6 个；title ≤ 8 字；body ≤ 28 字；页标题 ≤ 22 字；lead ≤ 40 字
- 参考：src/decks/motion 的 `scatter` 页；docs/zh-CN/components.md#scatter-order；交互：按 → 逐个归位

### `TiltShot` 倾斜摆正（动效 · 带透视的截图转正后逐条讲要点）
- 适合：软件、工具、控制台的界面介绍；先给整体印象，再讲 2–3 个看点
- 不适合：要在截图上标位置：用 Screenshot；没有真实截图
- 上限：title ≤ 2 行 × 10 字；lead ≤ 40 字；points 2–3 条：title ≤ 10 字，body ≤ 20 字；src 必须是真实截图
- 参考：src/decks/motion 的 `tilt` 页；docs/zh-CN/components.md#tilt-shot；交互：按 → 摆正截图，再逐条出现要点

### `ConvergeShots` 多图汇聚（动效 · 几张图并排，汇聚成一张焦点图）
- 适合：几个页面或视图最后都落到一个结果；先展示范围，再聚焦到要讲的那一张
- 不适合：每张图都要细讲：用 Screenshot 或拆页；图片比例差别很大
- 上限：shots 3–4 张，最好都是 16:9；label ≤ 10 字；caption ≤ 36 字；页标题 ≤ 22 字；lead ≤ 40 字；截图当证据，照片只营造氛围
- 参考：src/decks/motion 的 `converge` 页；docs/zh-CN/components.md#converge-shots；交互：按 → 汇聚到焦点图，再按出现说明

### `StepVideo` 逐段播放（动效 · 视频按一次播一段，停在要讲的画面）
- 适合：操作录屏、动画图表，需要边放边讲；一段变化里有 2–4 个值得停下来的时刻
- 不适合：视频很长或很大：会内联进单个 HTML 文件；需要声音：视频固定静音
- 上限：stops 2–4 个，at 按秒递增；title ≤ 8 字；body ≤ 30 字；页标题 ≤ 22 字；lead ≤ 40 字；视频建议 ≤ 15 秒、≤ 1 MB（先用 ffmpeg 截短压缩）
- 参考：src/decks/motion 的 `video` 页；docs/zh-CN/components.md#step-video；交互：按 → 播放到下一个停点
