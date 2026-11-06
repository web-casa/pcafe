# 数据

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 31 个模板。返回索引：[../templates.md](../templates.md)。

### `MetricBars` 数字条（数据 · 规模与占比）
- 适合：几个可加总或可比较的数量：新增 / 更新 / 删除，收入构成，用户分层；需要让听众记住一个比例
- 不适合：数字之间没有可比性（单位不同）：改用 SpotlightList；超过 4 个数：改用表格或拆页；数据随时间变化：改用 Timeline
- 上限：rows 2–4 行（含 total 最多 5 行）；数值 ≤ 6 位（92u 字号）；label ≤ 6 字；pull.figure ≤ 6 个字符，pull.text ≤ 24 字
- 参考：src/decks/release 的 `numbers` 页；docs/zh-CN/components.md#metric-bars；交互：比例条依次生长；数字使用等宽数字并右对齐，便于纵向比较。

### `SpotlightList` 聚焦列表（数据 · 名称 + 数值）
- 适合：一组“名称 → 版本 / 分数 / 数量”，其中一项是重点；排行榜、组件版本、地区数据
- 不适合：需要展示前后变化：用 CompareTable；数值是可加总的数量：用 MetricBars；没有明确的重点项
- 上限：items 3–6 项；第一项为聚焦项；value ≤ 6 个字符；name ≤ 14 个字符；tag ≤ 8 字，只给第一项；KeyValue 2–4 行
- 参考：src/decks/release 的 `desktop` 页；docs/zh-CN/components.md#spotlight-list

### `StatRow` 数字卡片行（数据 · 3–4 个并列的规模数字）
- 适合：3–4 个同样重要的规模数字；顺带列出用到的工具或合作方（只写名字）
- 不适合：一个数字就是论点：用 BigStat；要看趋势：用 SparkCards
- 上限：stats 3–4 个：value ≤ 6 字符，label ≤ 12 字符，note ≤ 28 字；names ≤ 8 个，只写文字，不放 logo
- 参考：src/decks/mono 的 `stats` 页；docs/zh-CN/components.md#stat-row

### `CountCompare` 数字滚动对比（数据 · 前后两个数字）
- 适合：一个指标的前后变化，变化本身就是结论；发布、复盘、季度对比
- 不适合：超过两个数字：用 MetricBars；需要过程：用 LineChart
- 上限：before / after：label ≤ 8 字，note ≤ 20 字，unit ≤ 4 字；change ≤ 8 字符
- 参考：src/decks/mono 的 `growth` 页；docs/zh-CN/components.md#count-compare

### `Donut` 环形图（数据 · 一个整体的 2–5 个部分）
- 适合：构成：预算、体积、时间花在哪；焦点只有一个部分
- 不适合：部分超过 5 个：用 ShareBar 或 MetricBars；各部分加起来不是整体
- 上限：segments 2–5 个：label ≤ 8 字，note ≤ 16 字，按从大到小排；center.value ≤ 6 字符
- 参考：src/decks/mono 的 `bundle` 页；docs/zh-CN/components.md#donut

### `BarChart` 柱状图（数据 · 2–8 个类别，分组或堆叠）
- 适合：2–8 个类别的数量对比；每个类别再分 2–3 个系列（分组或构成）
- 不适合：只有 2–4 个数：用 MetricBars；时间趋势：用 LineChart；有正有负：用 DeltaBars
- 上限：categories 2–8 个，各 ≤ 6 字；series 1–3 个：name ≤ 8 字；note ≤ 36 字
- 参考：src/decks/mono 的 `tones` 页；docs/zh-CN/components.md#bar-chart

### `Bubble` 散点 / 气泡图（数据 · 两个维度上的定位）
- 适合：对象在两个连续指标上的位置；想同时看第三个量（气泡大小）
- 不适合：只有两个类别的定位：用 Quadrant；点超过 10 个
- 上限：points 3–10 个：label ≤ 8 字；x / y.label ≤ 10 字，带单位；sizeLabel ≤ 12 字，note ≤ 30 字
- 参考：src/decks/mono 的 `variety` 页；docs/zh-CN/components.md#bubble

### `Gauge` 仪表盘（数据 · 一个值相对上限）
- 适合：完成度、预算用量、容量占用；有明确的上限或目标
- 不适合：没有上限的数：用 BigStat；多个指标：用 KpiBoard
- 上限：label ≤ 12 字，unit ≤ 4 字符；target.label ≤ 10 字；points 0–3 个：label ≤ 10 字，value ≤ 8 字符
- 参考：src/decks/mono 的 `budget` 页；docs/zh-CN/components.md#gauge

### `SparkCards` 迷你走势卡（数据 · 3–4 个指标各带走势）
- 适合：3–4 个指标，每个都有一串历史值；既要看现在也要看走势
- 不适合：只看一个指标的趋势：用 LineChart；没有历史值：用 StatRow
- 上限：cards 3–4 张：label ≤ 10 字，value ≤ 7 字符，series 4–32 个点，note ≤ 12 字
- 参考：src/decks/sticker 的 `density` 页；docs/zh-CN/components.md#spark-cards

### `Pictogram` 象形占比（数据 · “每 N 个里有几个”）
- 适合：比例换成“每 10 / 100 个里有几个”更好懂；一到三个部分
- 不适合：精确到小数的比例：用 ShareBar；部分超过 3 个：用 Donut
- 上限：title ≤ 2 行 × 12 字；parts 1–3 个：label ≤ 10 字；各部分之和 ≤ of；rest ≤ 10 字
- 参考：src/decks/sticker 的 `share` 页；docs/zh-CN/components.md#pictogram

### `SlopeRank` 排名变化（数据 · 两个时间点或两种口径的名次）
- 适合：排名在两个时间点之间的变化；同一批对象按两种口径排名
- 不适合：要看具体数值：用 Dumbbell；超过 8 个对象
- 上限：periods 2 个，各 ≤ 8 字符；items 4–8 个：name ≤ 10 字；note ≤ 40 字
- 参考：src/decks/sticker 的 `rank` 页；docs/zh-CN/components.md#slope-rank

### `BlockStats` 色块数字格（数据 · 3–4 个硬指标）
- 适合：3–4 个同样重要的数字；营销、规则宣讲
- 不适合：要比较大小：用 MetricBars；只有一个数字：用 BigStat
- 上限：stats 3–4 个：value ≤ 5 字符，unit ≤ 3 字符，label ≤ 8 字，note ≤ 24 字；title ≤ 2 行 × 8 字
- 参考：src/decks/pop 的 `numbers` 页；docs/zh-CN/components.md#block-stats

### `GlowMetric` 发光大数字（数据 · 一个核心数字加三个旁证）
- 适合：有一个最想让人记住的数字；还有 3 个支撑它的数字
- 不适合：数字要对比：用 CountCompare；没有旁证：用 BigStat
- 上限：title ≤ 2 行 × 8 字；lead ≤ 50 字；figure ≤ 5 个字符，unit ≤ 4 个字符；caption ≤ 30 字；subs 正好 3 个：value ≤ 8 个字符，label ≤ 16 字
- 参考：src/decks/warm-dark 的 `size` 页；docs/zh-CN/components.md#glow-metric

### `ProgressCards` 进度卡（数据 · 2–4 个百分比）
- 适合：2–4 个 0–100 的比例：完成度、回收率、占比；每个数字要配一句解释
- 不适合：数值不是百分比或会超过 100：用 StatRow；要比较很多项：用 BarChart
- 上限：cards 2–4 张；label ≤ 10 字；display ≤ 6 个字符；note ≤ 30 字；value 0–100
- 参考：src/decks/v2-p3 的 `recycle` 页；docs/zh-CN/components.md#progress-cards；交互：build: reveal 时每步填满一张卡

### `RankingRace` 排名赛跑（数据 · 名次随时间变化）
- 适合：同一组对象在 3–8 个时间点的名次变化；想让观众一步步看到“谁超过了谁”
- 不适合：只有两个时间点：用 SlopeRank；要看精确趋势：用 LineChart
- 上限：periods 3–8 期，每期 ≤ 6 个字符；items 5–12 项，name ≤ 8 字；show 5–8 行；notes 每期一条，≤ 28 字；需要 build: 'reveal'；不逐步时直接显示最后一期
- 参考：src/decks/v2-p4 的 `race` 页；docs/zh-CN/components.md#ranking-race；交互：→ 前进一期

### `BubbleCluster` 气泡簇（数据 · 比较体量）
- 适合：5–14 个对象比体量，差距大但不需要坐标轴；想强调某一项在整体里的位置
- 不适合：要精确比较数值：用 BarChart；有两个维度：用 Scatter
- 上限：items 5–14 项，name ≤ 6 字；最小值 ≥ 最大值的 1/16，否则小圆放不下名字；unit ≤ 4 个字符；notes 1–3 条：key ≤ 8 字，text ≤ 30 字
- 参考：src/decks/v2-p4 的 `bubble` 页；docs/zh-CN/components.md#bubble-cluster

### `Sankey` 桑基图（数据 · 总量怎么分流）
- 适合：一个总量由哪些部分组成、又流向哪里；预算、能源、流量的去向
- 不适合：只有一层构成：用 Donut 或 Treemap；没有数量的关系：用 NodeGraph
- 上限：nodes 4–14 个，label ≤ 6 字；每列 ≤ 8 个；列数 2–4，由连线自动推出；数值标签含单位 ≤ 10 个字符
- 参考：src/decks/v2-p4 的 `sankey` 页；docs/zh-CN/components.md#sankey

### `Treemap` 矩形树图（数据 · 整体的构成）
- 适合：6–12 个部分组成一个整体；份额差距大，想一眼看出谁占大头
- 不适合：只有 2–5 个部分：用 Donut；要比较时间变化：用 StackedArea
- 上限：items 4–12 项，name ≤ 6 字；太小的块不写字：最小项 ≥ 总量的 1.5% 才有标签；unit ≤ 4 个字符
- 参考：src/decks/v2-p4 的 `treemap` 页；docs/zh-CN/components.md#treemap

### `Radar` 雷达图（数据 · 多维画像对比）
- 适合：两个对象在 5–8 个维度上的画像对比；各维度单位相同（例如都是百分比或评分）
- 不适合：维度单位不同：用 CompareTable；对象超过两个：用 BarChart 分组
- 上限：axes 5–8 条，每条 ≤ 6 字；series 1–2 组，name ≤ 8 字；notes 1–3 条：key ≤ 8 字，text ≤ 30 字
- 参考：src/decks/v2-p4 的 `radar` 页；docs/zh-CN/components.md#radar

### `Scatter` 散点象限（数据 · 两个指标的分布）
- 适合：6–60 个对象在两个指标上的位置；想按“高/低 × 高/低”把它们分组
- 不适合：点少于 6 个：用 Quadrant 摆卡片；要看时间变化：用 LineChart
- 上限：points 6–60 个，带名字的 ≤ 8 个，name ≤ 6 字；xLabel / yLabel ≤ 14 字；quadrants 4 个，每个 ≤ 8 字
- 参考：src/decks/v2-p4 的 `scatter` 页；docs/zh-CN/components.md#scatter

### `StackedArea` 堆叠面积图（数据 · 构成随时间变化）
- 适合：总量的构成怎样随时间变化；某一层在变厚或变薄
- 不适合：只看一两条趋势：用 LineChart；只有一个时间点：用 Treemap 或 Donut
- 上限：x 4–30 个点，标签 ≤ 6 个字符；多于 12 个时用 ticks 只标一部分；series 2–6 层，name ≤ 6 字；unit ≤ 10 字
- 参考：src/decks/v2-p4 的 `stack` 页；docs/zh-CN/components.md#stacked-area

### `DotMap` 点阵地图（数据 · 在哪里）
- 适合：1–8 个国家或城市的位置和数值；想让观众先看到“分布在哪”
- 不适合：要按地区着色比较：用 Heatmap 或 BarChart；地点集中在一个城市内：点阵太粗
- 上限：markers 1–8 个，name ≤ 6 字；listTitle ≤ 10 字；数值含单位 ≤ 10 个字符；地图精度为 2°，只适合国家级位置
- 参考：src/decks/v2-p4 的 `map` 页；docs/zh-CN/components.md#dot-map

### `GlowMetrics` 发光指标卡（数据 · 开场的关键数字）
- 适合：整场演示依赖的 2–4 个数字；深色风格（studio-dark 等）里的数据开场
- 不适合：数字超过 4 个：用 KpiBoard；浅色正式汇报：用 StatRow
- 上限：metrics 2–4 个；数值含单位 ≤ 8 个字符；unit ≤ 4 个字符；label ≤ 10 字，delta ≤ 12 个字符，note ≤ 24 字；trend 4–16 个数
- 参考：src/decks/v2-p4 的 `glow` 页；docs/zh-CN/components.md#glow-metrics

### `Odometer` 数字滚轮（数据 · 1–3 个大数字）
- 适合：少数几个需要“数出来”的大数字；距离、人数、时长这类量级数字
- 不适合：数字之间要比较大小：用 BarChart；超过 3 个数字：用 StatRow
- 上限：title ≤ 18 字；stats 1–3 个：value ≤ 7 个字符，unit ≤ 4 个字符，label ≤ 12 字，note ≤ 28 字
- 参考：src/decks/v2-p2 的 `numbers` 页；docs/zh-CN/components.md#odometer；交互：每个数字是一个 build 步骤，出现时滚动到终值

### `ArcGlobe` 弧线地球（数据 · 从一处到多处）
- 适合：一个中心向各地分发：源站和缓存、总部和分部、出口目的地；地点分布在同一个半球
- 不适合：地点遍布全球两侧：用 DotMap；要比较各地数值：用 DotMap 或 BarChart
- 上限：places 2–8 个，name ≤ 6 字，note ≤ 14 字；hub.name ≤ 6 字；listTitle ≤ 10 字；所有地点要在 center 朝向的半球，否则弧线绕到背面；地图精度 2°，只适合城市级以上的位置
- 参考：src/decks/v3-p3 的 `arc` 页；docs/zh-CN/components.md#arc-globe；交互：每按一次 → 画出一条弧线并点亮对应列表行

### `PopGrid` 站点点阵（数据 · 有多少、怎么分）
- 适合：20–500 个同类对象按 2–8 组分布；想让观众直观感到“很多”，同时看到构成
- 不适合：要看地理位置：用 DotMap；数量超过 500：用 Treemap 或 ShareBar
- 上限：groups 2–8 组，name ≤ 8 字；总数 20–500；totalLabel ≤ 10 字；unit ≤ 2 个字符
- 参考：src/decks/v3-p3 的 `pop` 页；docs/zh-CN/components.md#pop-grid；交互：每按一次 → 点亮一组圆点和它的图例行

### `SpikeChart` 尖峰曲线（数据 · 突然暴涨）
- 适合：一条序列里有明显的峰值或暴涨；流量、攻击量、请求量这类时间序列
- 不适合：多条序列对比：用 LineChart；数值没有明显峰值：用 LineChart 或 BarChart
- 上限：x 3–24 个，每个 ≤ 8 个字符；unit ≤ 6 个字符；峰值含单位 ≤ 12 个字符；callouts 0–3 条，text ≤ 24 字，不要放在峰值上；note ≤ 50 字，估算值在这里说明
- 参考：src/decks/v3-p3 的 `spike` 页；docs/zh-CN/components.md#spike-chart；交互：每按一次 → 出现一条说明框

### `ReachRings` 覆盖圈（数据 · 覆盖多远）
- 适合：按距离、延迟、时间分档的覆盖率；“多少用户在 N 以内”这类说法
- 不适合：各档之间不是包含关系：用 BarChart；超过 4 档：用 LineChart
- 上限：rings 2–4 圈（内圈在前）：label ≤ 8 个字符，value ≤ 6 个字符，text ≤ 30 字；center ≤ 4 字
- 参考：src/decks/v3-p3 的 `reach` 页；docs/zh-CN/components.md#reach-rings；交互：每按一次 → 点亮一圈和对应说明

### `YearBars` 数字配年份条（数据 · 两个大数字配按年份的细条）
- 适合：一个指标逐年增长，再配一两个结论数字；年度回顾、参观人数、营收
- 不适合：要比较多个系列：用 LineChart；年份超过 7 个：用 LineChart
- 上限：stats 1–2 个：value ≤ 5 字符，unit ≤ 3，label ≤ 12 字，body ≤ 24 字；bars 3–7 条，从早到晚；页标题 ≤ 22 字；必须有 source
- 参考：src/decks/sig-biennale 的 `bars` 页；docs/zh-CN/components.md#year-bars

### `MetricMosaic` 数字拼格（数据 · 长条、标题块、小数字块和大数字块拼成一页）
- 适合：一页讲清一组相关数字；发布会、增长复盘的数据页
- 不适合：数字之间没有主次：用 KpiBoard；需要趋势：用 LineChart
- 上限：side value ≤ 7 字符；small 2–3 个：value ≤ 6 字符，label ≤ 14 字；hero value ≤ 6 字符，label ≤ 16 字；title 1–2 行，每行 ≤ 6 字；必须有 source
- 参考：src/decks/sig-neo 的 `mosaic` 页；docs/zh-CN/components.md#metric-mosaic

### `FramedStats` 粗框数字（数据 · 3–4 个粗边框数字盒）
- 适合：3–4 个并列的关键数字；活动、产品、项目的规模一览
- 不适合：数字需要解释：用 KpiBoard；只有一个数字：用 BigStat
- 上限：stats 3–4 个；value ≤ 6 个字符；label ≤ 12 字；页标题 ≤ 22 字；有数字就要有 source
- 参考：src/decks/sig-block-frame 的 `stats` 页；docs/zh-CN/components.md#framed-stats
