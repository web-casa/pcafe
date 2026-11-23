# 方法

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 6 个模板。返回索引：[../templates.md](../templates.md)。

### `RangeBars` 区间估计（方法 · 数字有多可靠）
- 适合：讲抽样误差、置信区间、预测范围；说明“样本量要多大才够”
- 不适合：数据没有误差范围：用 MetricBars；区间来自你自己的估算却没有标明：在 source 里写清计算方法
- 上限：rows 3–6 行：label ≤ 8 个字符，note ≤ 8 个字符；axis.ticks 3–5 个；focusLabel ≤ 8 字；example.text ≤ 48 个字符（等宽两行）
- 参考：src/decks/geo 的 `sampling` 页；docs/zh-CN/components.md#range-bars；交互：区间从中心向两侧展开。

### `ProcessQuote` 流程配客户评价（方法 · 合作步骤加一句评价）
- 适合：讲合作流程，同时给一句客户背书；服务型生意的“怎么合作”页
- 不适合：步骤要配图：用 StepGrid；只有评价没有流程：用 QuoteHero
- 上限：title ≤ 2 行 × 8 字；steps 3–5 行：title ≤ 8 字，body ≤ 26 字，time ≤ 6 字；rating ≤ 14 个字符；quote.text ≤ 48 字，by ≤ 6 字，role ≤ 14 字
- 参考：src/decks/sig-atelier 的 `process` 页；docs/zh-CN/components.md#process-quote；交互：build：步骤逐行出现

### `FolioSteps` 作品轨流程（方法 · 分步折叠）
- 适合：讲合作流程、设计方法、项目阶段；每一步都有一张能拿出来的过程图
- 不适合：步骤没有配图：用 ProcessQuote 或 Steps；超过 5 步：用 Timeline
- 上限：kicker ≤ 20 个字符；title ≤ 8 字，sub ≤ 10 字；steps 3–5 步：name ≤ 6 字，time ≤ 6 字，body ≤ 36 字，caption ≤ 14 字
- 参考：src/decks/sig-folio 的 `steps` 页；docs/zh-CN/components.md#folio-steps；交互：点击：展开一步，右侧作品列滑到对应的图

### `AlbumLayout` 相册桌面排版（方法 · 三步演示）
- 适合：演示一个“整理 / 排版 / 编辑”的过程；产品的核心是亲手摆放
- 不适合：步骤超过 3 个：用 FolioSteps 或 Steps；要放真实界面截图：用 DeviceFrame
- 上限：title 2 行 × ≤ 9 字；em ≤ 4 字且在第一行里；steps 正好 3 步：name ≤ 10 字，note ≤ 26 字；photos 正好 5 张；loose 0–2 张
- 参考：src/decks/sig-album 的 `layout` 页；docs/zh-CN/components.md#album-layout；交互：点击步骤：五张照片带弹性地移动、缩放、旋转到新位置；悬停桌面倾角变小

### `SlateSteps` 立体看板三步（方法 · 三步上手）
- 适合：讲清楚产品怎么上手、怎么运作；三个步骤各自能配一幅简单的图
- 不适合：步骤超过 3 个：用时间线类模板；每步需要长段说明：用 FolioSteps
- 上限：title 2 行 × ≤ 12 字；lead ≤ 24 字；steps 恰好 3 个：tag ≤ 6 字，title ≤ 10 字，body ≤ 34 字；vis 取 bars / gauge / wave / donut / rows / nodes；gauge 与 donut 需 value 0–100
- 参考：src/decks/sig-slate 的 `steps` 页；docs/zh-CN/components.md#slate-steps；交互：小图依次生长、扫过；悬停卡片浮起

### `AgencyAccordion` 人像加手风琴（方法 · 使命、服务或做法展开讲）
- 适合：讲机构的使命、方法或服务，每项都需要一句展开说明；有一张代表人物照片
- 不适合：5 项以上：用 AgencyRows；每项都要同时可见：用 IconGrid
- 上限：tag ≤ 6 字；title 2 行 × ≤ 12 字；items 3–4 行：title ≤ 10 字，body ≤ 40 字，chips 0–3 个 × ≤ 5 字，image 可选；photo.caption ≤ 12 字；autoplay 默认 5600 毫秒，0 关闭
- 参考：src/decks/sig-agency 的 `mission` 页；docs/zh-CN/components.md#agency-accordion；交互：自动依次展开并显示进度线；点击任意行展开并停止自动；悬停行标题变色；照片悬停推近
