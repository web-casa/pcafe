# 产品

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 10 个模板。返回索引：[../templates.md](../templates.md)。

### `PanelCards` 面板卡片（产品 · 3–4 项能力各配一小块界面）
- 适合：介绍产品的 3–4 项能力，每项都有能画出来的数据；把几组小数据并排展示
- 不适合：只有文字没有数据：用 IconGrid；超过 4 项：拆页
- 上限：cards 3 或 4 张；eyebrow ≤ 12 字，title ≤ 8 字，body ≤ 24 字；list 3–5 行；bars 3–12 根；progress 2–4 行；chips 3–6 个；迷你界面里的数字同样要在 source 写出处
- 参考：src/decks/launch 的 `panels` 页；docs/zh-CN/components.md#panel-cards

### `AskAnswer` 问答卡（产品 · 演示一个问题和它的答案）
- 适合：演示搜索、分析、AI 助手能回答什么；把同一个问题在三个对象上的答案并排
- 不适合：答案不是数字：用 QuoteWall 或 ClaimCards；结果多于 3 个：拆页
- 上限：question ≤ 30 字；found ≤ 20 字；results 正好 3 个：name ≤ 8，value ≤ 6 个字符，bars 4–10 个；notes 0–3 条，每条 ≤ 20 字
- 参考：src/decks/launch 的 `ask` 页；docs/zh-CN/components.md#ask-answer

### `TabbedShot` 分段截图（产品 · 一个产品的 2–4 个界面）
- 适合：一个产品有几个主要界面；截图本身就是论据
- 不适合：没有真实截图；截图需要标注细节：用 Screenshot
- 上限：tabs 2–4 个，label ≤ 6 字；每个 src 都是真实截图；title ≤ 22 字；lead ≤ 50 字
- 参考：src/decks/studio 的 `tabs` 页；docs/zh-CN/components.md#tabbed-shot；交互：点击分段切换截图

### `BrandKit` 设计规范（产品 · 字体、颜色和尺寸）
- 适合：介绍品牌规范或设计系统；给设计、前端交接视觉规则
- 不适合：只有一种颜色要说明：写在正文里即可；字体多于 3 种
- 上限：fonts 2–3 种：name ≤ 20 个字符，role ≤ 10 字；palettes 2–3 排，每排 4–10 个；tokens 0–4 个：label ≤ 8 字，value ≤ 12 个字符
- 参考：src/decks/studio 的 `brand` 页；docs/zh-CN/components.md#brand-kit

### `ServiceTrio` 三项服务卡（产品 · 三项服务）
- 适合：介绍 3 项服务或产品线；每项服务有一张代表图
- 不适合：服务超过 3 项：用 ServiceList 或 Bento；没有配图：用 NumberedColumns
- 上限：title 1 行 ≤ 14 字；services 正好 3 个：title ≤ 6 字，body ≤ 30 字，tags 2–3 个 × ≤ 6 字
- 参考：src/decks/sig-atelier 的 `services` 页；docs/zh-CN/components.md#service-trio；交互：build：卡片逐张出现

### `ServiceLedger` 服务清单（产品 · 服务列表）
- 适合：列出 3–5 项服务，每项一句话；想要报纸目录一样的克制感
- 不适合：每项服务要配图：用 ServiceTrio；服务需要展开详情：用 ProcessAccordion
- 上限：title 1 行 ≤ 8 字；rows 3–5 行：title ≤ 6 字，body ≤ 26 字；caption ≤ 10 字
- 参考：src/decks/sig-monograph 的 `services` 页；docs/zh-CN/components.md#service-ledger；交互：build：清单逐行出现

### `FeatureBento` 发光便当格（产品 · 功能总览）
- 适合：一页讲清楚产品的五个卖点；卖点本身就是“效果图”
- 不适合：卖点没有图：用 Bento 或 IconGrid；只有 3 个卖点：用 ServiceTrio
- 上限：kicker ≤ 16 个字符；title ≤ 2 行 × 8 字；hero、grid：title ≤ 8 字，body ≤ 26 字；hero.images 3 张；grid.items 6–8 个，label ≤ 4 字；small 正好 3 张：tag ≤ 6 个字符，title ≤ 8 字，body ≤ 20 字
- 参考：src/decks/sig-nocturne 的 `features` 页；docs/zh-CN/components.md#feature-bento；交互：悬停：扇形照片展得更开，缩略图放大

### `KitBento` 数字便当格（产品 · 内容清单）
- 适合：讲清一套产品“里面有什么”；模板、组件库、设计系统的内容总览
- 不适合：数字超过 2 个：用 NumberTiles 或 StatRow；要放真实截图：用 Bento
- 上限：title 可选，1 行 ≤ 14 字；stats 正好 2 个：value ≤ 4 个字符，label ≤ 6 字，body ≤ 22 字；wide.title ≤ 10 字，body ≤ 30 字，frames 4–6 个 × ≤ 4 字
- 参考：src/decks/sig-sunrise 的 `kit` 页；docs/zh-CN/components.md#kit-bento；交互：悬停：页面草图散开，画板上浮

### `HomeTrio` 三套首页（产品 · 方案并列）
- 适合：同一产品的三种版本或三套方案；模板、主题、套餐的外观对比
- 不适合：要放真实截图：用 Screenshot 或 ShelfGallery；超过 3 个方案：用 IconGrid
- 上限：kicker ≤ 10 字；title 1 行 ≤ 10 字；items 正好 3 个：name ≤ 10 字，note ≤ 18 字，variant 为 chart / calendar / dark；pickedLabel ≤ 4 字
- 参考：src/decks/sig-sunrise 的 `homes` 页；docs/zh-CN/components.md#home-trio；交互：悬停：草图滚动；点击：选中这一张

### `KanbanDemo` 可玩的看板（产品 · 交互演示）
- 适合：演示任务、工单、流程类产品的核心操作；想让观众现场点一点
- 不适合：流程是线性的步骤：用 StepTrack；要放真实截图：用 DeviceFrame
- 上限：title ≤ 2 行 × 7 字；lead ≤ 36 字；points 2–4 条 × ≤ 16 字；columns 正好 3 列：name ≤ 4 字，每列 1–3 张卡；卡片：tag ≤ 4 字，title ≤ 12 字，due ≤ 8 个字符，progress 0–100；views ≤ 3 个 × ≤ 4 字；cursor ≤ 4 字
- 参考：src/decks/sig-sunrise 的 `board` 页；docs/zh-CN/components.md#kanban-demo；交互：点击：任务卡移到下一列，计数更新；视图标签可切换
