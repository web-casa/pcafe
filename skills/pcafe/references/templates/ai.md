# AI

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 10 个模板。返回索引：[../templates.md](../templates.md)。

### `TokenStream` Token 流（AI · 文本怎样被切成 token）
- 适合：讲分词、计费单位、上下文怎么被占用；想让观众看到“一句话 = 多少 token”
- 不适合：没有真实分词结果又不标示意：切分要么来自真实分词器，要么在 label 写“示意”；超过 40 个 token：拆页或换 ContextWindow
- 上限：groups 2–5 组，合计 6–40 个 token，每个 ≤ 8 个字符；label ≤ 16 字；notes 与组数相同，每条 ≤ 22 字；空格显示为中点
- 参考：src/decks/v3-p4 的 `tokens` 页；docs/zh-CN/components.md#token-stream；交互：build 模式下每按一次 → 出现一组 token 和它的说明

### `MoeRouter` 专家路由（AI · 混合专家怎样选专家）
- 适合：介绍 MoE 模型：专家总数、每 token 激活几个；想直观表现“总参数大、激活参数小”
- 不适合：不是混合专家结构；要讲各专家分工：亮格位置通常是示意，不代表真实分工
- 上限：experts 8–384；cols 默认 24，384 个时用 32；shared 0–2；routes 1–4 个，token ≤ 6 个字符，note ≤ 20 字；caption ≤ 30 字；picks 不是真实路由时要在 caption 写“示意”；需要 build: 'reveal'；不逐步时显示最后一个 token
- 参考：src/decks/v3-p4 的 `moe` 页；docs/zh-CN/components.md#moe-router；交互：→ 路由下一个 token，亮格随之变化

### `ContextWindow` 上下文窗口（AI · 容量与长度标记）
- 适合：介绍上下文长度、最大输出、训练长度这些“从 0 起算”的长度；比较几种长度相差多少倍
- 不适合：长度之间是并列而不是包含关系：用 BarChart；超过 4 段
- 上限：spans 1–4 段，label ≤ 8 个字符，note ≤ 20 字；ticks 3–6 个，label ≤ 6 个字符；totalLabel ≤ 8 个字符
- 参考：src/decks/v3-p4 的 `context` 页；docs/zh-CN/components.md#context-window；交互：每按一次 → 填入一段长度

### `ScoreMatrix` 评测矩阵（AI · 多个模型 × 多项评测）
- 适合：模型卡、技术报告里的对比表；同一组模型在 3–7 项评测上的高低
- 不适合：只比两个模型：用 Dumbbell 或 DeltaBars；分数口径不同（子集、不同指标）却放在一行：先拆开或记为 —
- 上限：models 3–7 个，每个 ≤ 10 个字符；rows 3–7 行，name ≤ 16 个字符，metric ≤ 10 个字符；默认 1 位小数，可按行设 decimals；分数必须来自官方表格，source 里写明“自测”或评测方
- 参考：src/decks/v3-p4 的 `lead` 页；docs/zh-CN/components.md#score-matrix；交互：每按一次 → 出现一行

### `ModelSpecCard` 模型规格卡（AI · 一个模型的身份卡）
- 适合：介绍一个模型（或任何有“总量 / 实际用量”的系统）的核心规格；想把“总参数 vs 激活参数”放在一眼能看到的地方
- 不适合：比较多个模型：用 ScoreMatrix 或 CompareTable；规格超过 8 行：拆页或用 SpecSheet
- 上限：name ≤ 18 个字符；tag ≤ 16 个字符；chips 2–5 个，每个 ≤ 8 字；params.total、active 各 ≤ 4 位数字；activeLabel ≤ 6 字；specs 4–8 行：label ≤ 6 字，value ≤ 18 字
- 参考：src/decks/v3-p4 的 `spec` 页；docs/zh-CN/components.md#model-spec-card；交互：每按一次 → 出现一行规格

### `TokenPriceGrid` Token 价格表（AI · 按 token 计价）
- 适合：API 价格：输入 / 输出、缓存、高峰闲时；价格之间相差一到两个数量级
- 不适合：只有一两个价格：用 BigStat 或 PricingTiers；要按线性比例比较：用 BarChart（这里的条是对数刻度）
- 上限：columns 2–4 列，每列 ≤ 10 个字符；rows 2–4 行：label ≤ 10 字，note ≤ 10 字；价格 ≤ 6 个字符（含小数点）；unit ≤ 16 个字符
- 参考：src/decks/v3-p4 的 `price` 页；docs/zh-CN/components.md#token-price-grid；交互：每按一次 → 出现一行价格

### `AttentionMask` 注意力掩码（AI · 注意力模式示意）
- 适合：解释稀疏注意力、滑动窗口、因果掩码；说明长上下文为什么能省算力
- 不适合：要展示真实注意力权重：这是示意图，不是热力图（用 Heatmap）；模式超过 4 种
- 上限：size 8–16；window、stride 为小整数；modes 2–4 种：label ≤ 10 字，note ≤ 40 字；label（图上方）≤ 12 字，默认“示意图”；需要 build: 'reveal'；不逐步时显示最后一种
- 参考：src/decks/v3-p4 的 `attention` 页；docs/zh-CN/components.md#attention-mask；交互：→ 换下一种掩码

### `EffortDial` 参数旋钮（AI · 一个可调参数）
- 适合：推理强度、temperature、思考预算这类可调参数；讲“不同档位分别用在哪”
- 不适合：要表达达成率或占比：用 Gauge；档位超过 4 个
- 上限：param ≤ 20 个字符；stops 2–4 个：value 在 min–max 之间，label ≤ 8 字，note ≤ 36 字；需要 build: 'reveal'；不逐步时指向最后一档
- 参考：src/decks/v3-p4 的 `effort` 页；docs/zh-CN/components.md#effort-dial；交互：→ 指针转到下一档

### `PeakClock` 时段钟（AI · 一天里的时段）
- 适合：高峰 / 闲时定价、限流时段、维护窗口；时段跨午夜或分成几段，用表格不直观
- 不适合：要看一天里的数值变化：用 LineChart；跨多天的日程：用 Gantt
- 上限：windows 1–4 段，小时为 0–24 的数字；zone ≤ 8 个字符；onLabel、offLabel 各 ≤ 6 字；notes 2–4 条：title ≤ 10 字，body ≤ 40 字
- 参考：src/decks/v3-p4 的 `peak` 页；docs/zh-CN/components.md#peak-clock；交互：每按一次 → 出现一条说明

### `AliasRoute` 别名指向（AI · 几个名字指向同一个版本）
- 适合：模型别名、旧名迁移、版本映射；开场先核对“我们说的是哪个模型”
- 不适合：一对多或多对多的映射：用 FlowDiagram 或 Sankey；名字超过 30 个字符
- 上限：sources 2–5 个：name ≤ 30 个等宽字符，tag ≤ 6 字；target.label ≤ 14 字，name ≤ 26 个等宽字符，note ≤ 40 字
- 参考：src/decks/v3-p4 的 `alias` 页；docs/zh-CN/components.md#alias-route；交互：每按一次 → 出现一个名字和它的连线
