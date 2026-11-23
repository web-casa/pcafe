# 证据

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 18 个模板。返回索引：[../templates.md](../templates.md)。

### `BigStat` 单个大数字（证据 · 一个数字撑起一页）
- 适合：一个数字本身就是论点：97%、9.34%、1/100；需要在一串文字页之间放一个视觉重音
- 不适合：几个数字同等重要：用 MetricBars；数字需要和别的数比较才有意义：用 DeltaBars 或 Dumbbell；一份演示里用超过 3 次
- 上限：figure ≤ 6 个字符（含单位），越短字越大；caption ≤ 30 字，写清这个数字在数什么；support 2–3 项：value ≤ 8 个字符，label ≤ 24 字；title 2 行 × ≤ 8 字（右栏 640u 宽）
- 参考：src/decks/geo 的 `fanout` 页；docs/zh-CN/components.md#big-stat；交互：数字逐位从遮罩中升起，并随鼠标轻微漂移。

### `DeltaBars` 正负变化（证据 · 涨了还是跌了）
- 适合：实验或改动前后的变化：引用率、转化率、耗时；同一处理在不同平台上方向不一致
- 不适合：数值都是正的总量：用 MetricBars；要同时展示前后两个绝对值：用 Dumbbell
- 上限：rows 2–6 行：label ≤ 10 字，sub ≤ 14 个字符；unit ≤ 4 个字符；scale 是坐标半宽，取比最大绝对值稍大的整数；ends 两端说明各 ≤ 6 字，例如“引用减少 / 引用增加”；变化不显著时要在标题或 lead 里说明，不要让条形图暗示效果
- 参考：src/decks/geo 的 `schema` 页；docs/zh-CN/components.md#delta-bars；交互：条形从零线向两侧生长。

### `Dumbbell` 两点对比（证据 · 同一指标的两种测法）
- 适合：同一指标在两种条件下的值：API 与 App、去年与今年、对照与实验；差距本身是论点
- 不适合：只有一种条件：用 MetricBars；超过 5 行：拆页或只留最有代表性的几行
- 上限：rows 2–5 行：label ≤ 8 字，sub ≤ 14 个字符；legend 两项各 ≤ 8 字；max 默认 100；unit 默认 %，差值自动写成“个百分点”；footnote ≤ 60 字
- 参考：src/decks/geo 的 `api-app` 页；docs/zh-CN/components.md#dumbbell；交互：先出现 a 点，连线从 a 生长到 b，b 点随后弹出。

### `KeySpec` 巨型规格数字（证据 · 一个规格数字）
- 适合：产品规格、关键指标；一个数字就是论点
- 不适合：要比较多个数：用 StatRow；要看变化：用 CountCompare
- 上限：title ≤ 1 行 × 16 字；value ≤ 5 字符，unit ≤ 4 字符；caption ≤ 30 字；specs 0–3 个：value ≤ 7 字符，label ≤ 12 字
- 参考：src/decks/keynote 的 `size` 页；docs/zh-CN/components.md#key-spec

### `CaseCard` 案例卡（证据 · 一个项目或功能配一张真实截图）
- 适合：用一张真实截图展示一个功能、项目或成果；作品集、案例研究
- 不适合：截图需要标注细节：用 Screenshot；多个视图切换：用 TabbedShot；没有真实截图
- 上限：title ≤ 3 行 × 9 字；lead ≤ 70 字；tags 2–3 个，各 ≤ 10 字；ticker 2–3 个，各 ≤ 14 个字符；image 必须是真实截图
- 参考：src/decks/home-nuance 的 `gallery` 页；docs/zh-CN/components.md#case-card

### `CaseStudy` 案例卡（证据 · 一个案例三个数）
- 适合：介绍一个具体案例、地点、项目，并给出三个关键数；客户案例（主图用真实截图）
- 不适合：只有一个数：用 BigStat；多个案例并列：用 WorkCards
- 上限：title ≤ 2 行 × 10 字；tags 0–4 个，每个 ≤ 6 字；body ≤ 70 字；metrics 正好 3 个：value ≤ 7 个字符，label ≤ 12 字
- 参考：src/decks/v2-p1 的 `gbr` 页；docs/zh-CN/components.md#case-study；交互：build：指标逐个出现

### `DeviceFrame` 设备外框（证据 · 产品或网站截图）
- 适合：展示一个网站、App、工具的真实界面；说明“我们从哪里看到这些数据”
- 不适合：截图里的细节要放大讲：用 Screenshot 或 TabbedShot；只有氛围图没有截图：用 PhotoSplit
- 上限：title ≤ 1 行 × 16 字；lead ≤ 40 字；points 0–3 条：title ≤ 10 字，body ≤ 30 字；截图比例：laptop 16:10，tablet 4:3，phone 9:19.5；image 只能是真实截图
- 参考：src/decks/v2-p1 的 `watch` 页；docs/zh-CN/components.md#device-frame；交互：build：标注逐条出现

### `OutageBoard` 故障时间板（证据 · 一次事件怎么发生）
- 适合：复盘一次故障或事件里各服务的受影响时段；同一天内、几小时尺度的时间线
- 不适合：跨天或跨月：用 Gantt；只有一条时间线：用 Timeline
- 上限：rows 2–6 个：name ≤ 10 字，note ≤ 20 字；ticks 3–8 个，时间写 HH:MM，同一天；events 0–3 个，label ≤ 10 字，相邻两个至少隔开窗口的 15%；legend 每项 ≤ 6 字
- 参考：src/decks/v3-p3 的 `outage` 页；docs/zh-CN/components.md#outage-board；交互：每按一次 → 出现一个服务的轨道

### `ProjectPair` 双作品展示（证据 · 两个代表作）
- 适合：挑两个最能代表你的项目；作品要配客户名一起看
- 不适合：作品超过 2 个：用 PhotoMosaic 或 WorkCards；要讲一个项目的前后变化：用 CaseStudy
- 上限：kicker ≤ 6 字；title ≤ 2 行 × 9 字；projects 正好 2 个：name ≤ 16 字，tag ≤ 8 字；图片用横图
- 参考：src/decks/sig-atelier 的 `work` 页；docs/zh-CN/components.md#project-pair；交互：build：两个项目逐个出现

### `ProjectIndex` 项目索引（证据 · 项目列表）
- 适合：一次列出 3–6 个项目，又想让每个都有画面；现场讲到哪个项目就点哪个
- 不适合：每个项目都要讲细节：一页一个，用 CaseStudy；要同时看到所有图：用 PhotoMosaic
- 上限：title 1 行 ≤ 12 字；cta ≤ 8 字；projects 3–6 个：name ≤ 14 字，year ≤ 6 个字符；图片用竖图
- 参考：src/decks/sig-monograph 的 `index` 页；docs/zh-CN/components.md#project-index；交互：点击或悬停：切换当前项目和右侧大图

### `FolioCase` 作品轨案例（证据 · 单个项目详情）
- 适合：作品集里讲一个项目：做了什么、多久、结果如何；有 2–3 个能量化的结果
- 不适合：要讲改版前后对比：用 CaseStudy；只是展示多张作品：用 ProjectPair
- 上限：kicker ≤ 24 个字符；title ≤ 8 字，sub ≤ 12 字；meta 2–4 行：label ≤ 5 字，value ≤ 20 字；stats 2–3 个：value ≤ 4 个字符，unit ≤ 2 个字符，label ≤ 8 字；link ≤ 10 字；frames 3–5 张
- 参考：src/decks/sig-folio 的 `case` 页；docs/zh-CN/components.md#folio-case；交互：点击：刻度或露出的作品图让作品列滑动；悬停放大正中的图

### `FolioWords` 作品轨评价（证据 · 客户原话）
- 适合：作品集或服务介绍里放 2–4 条客户评价；每条评价能对上一个具体项目
- 不适合：评价很多、想一页铺开：用 ProofMosaic；只有一条：用 Quote
- 上限：kicker ≤ 20 个字符；words 2–4 条：text ≤ 56 字，name ≤ 6 字，role ≤ 16 字，metric.value ≤ 5 个字符，metric.label ≤ 8 字，caption ≤ 14 字
- 参考：src/decks/sig-folio 的 `words` 页；docs/zh-CN/components.md#folio-words；交互：点击：箭头翻到下一条，文字淡入，作品列同步滑动

### `DiptychWorks` 对页项目列表（证据 · 精选项目）
- 适合：3–6 个项目，每个有一张好图；想让人自己挑着看
- 不适合：只有两个项目：用 ProjectPair；项目要讲细节：用 FolioCase
- 上限：kicker ≤ 16 字；title 1–2 行 × ≤ 8 字；works 3–6 个：name ≤ 6 字，kind ≤ 6 字，year ≤ 6 个字符
- 参考：src/decks/sig-diptych 的 `works` 页；docs/zh-CN/components.md#diptych-works；交互：悬停或点击项目，左图交叉淡入对应作品，箭头滑入

### `DiptychWords` 对页评价（证据 · 客户原话）
- 适合：2–4 条评价，每条对应一个作品；想把评价和数字放在同一页
- 不适合：评价没有对应作品：用 Quote；评价很多：用 ProofMosaic
- 上限：kicker ≤ 16 字；words 2–4 条：text ≤ 50 字，name ≤ 6 字，role ≤ 16 字，project ≤ 8 字；stats 2–3 个：value ≤ 5 个字符，label ≤ 8 字
- 参考：src/decks/sig-diptych 的 `words` 页；docs/zh-CN/components.md#diptych-words；交互：点击编号：原话淡入切换，左图同步交叉淡入

### `MarkerWorks` 记号笔作品卡（证据 · 精选作品）
- 适合：3–9 件小而精的作品：产品、物件、App；作品图是干净的产品照
- 不适合：作品是横图截图：用 ProjectPair；要逐个讲细节：用 FolioCase
- 上限：kicker ≤ 10 字；works 3–9 件，三件一页：name ≤ 6 字，no ≤ 4 个字符，year ≤ 10 个字符
- 参考：src/decks/sig-marker 的 `works` 页；docs/zh-CN/components.md#marker-works；交互：悬停：取景角张开、图片上浮；点击箭头三张一页翻动

### `AlbumStories` 相册翻面故事（证据 · 用户故事）
- 适合：消费产品的用户故事、评价；想让人自己翻开看，而不是一次铺满
- 不适合：评价要配数字：用 DiptychWords；超过 3 条：用 ProofMosaic
- 上限：kicker ≤ 8 字；title 1 行 ≤ 14 字；stories 正好 3 条：caption ≤ 8 字，note ≤ 44 字，name ≤ 6 字，meta ≤ 10 字
- 参考：src/decks/sig-album 的 `stories` 页；docs/zh-CN/components.md#album-stories；交互：点击照片立体翻面；悬停摆正上浮

### `EmberWords` 暗场用户评价（证据 · 两位客户的话和结果）
- 适合：用两位客户的原话加结果做证明；发布会、销售演示里的口碑页
- 不适合：评价超过 2 条：用 FolioWords 或 AlbumStories；没有量化结果：用引语类模板
- 上限：title ≤ 12 字；quotes 恰好 2 条：quote ≤ 40 字，role ≤ 16 字；value ≤ 5 个字符，数字部分会滚动；label ≤ 8 字
- 参考：src/decks/sig-ember 的 `words` 页；docs/zh-CN/components.md#ember-words；交互：结果数字从零滚动；光斑跟随鼠标；悬停卡片浮起

### `SocialPost` 一条发布动态（证据 · 一次上线或里程碑的反响）
- 适合：讲一次上线、发布、里程碑，以及大家的反应；想让数字和评论显得像真实发生过
- 不适合：数字是重点：用 StatRow；没有配图：用 QuoteHero
- 上限：text 1–2 行 × ≤ 22 字；time ≤ 6 字；counts 如 ['12.8k', '932']；facts 2–3 条：value ≤ 8 个字符，note ≤ 10 字；comments 2–3 条：name ≤ 6 字，text ≤ 16 字
- 参考：src/decks/mockui 的 `post` 页；docs/zh-CN/components.md#social-post；交互：点 ♡ 点赞并弹跳计数；评论依次出现；配图悬停推近；菜单点击切换高亮
