# 写演示：流程与规则

这份指南讲怎么用 PCafe 写出一份合格的演示：先排故事线，再给每页配模板，把文字压进模板的内容上限，最后跑检查、看截图。每个模板的具体字段和上限见 [components.md](components.md)，放映与导出见 [presenting.md](presenting.md)，新增模板和风格见 [contributing.md](contributing.md)。

章节编号是固定的，其他文档会用“第 8 节”“§13”来引用。

| 节 | 内容 |
| --- | --- |
| [0](#0-命令速查) | 命令速查 |
| [1](#1-工作流) | 工作流 |
| [2](#2-故事线) | 故事线 |
| [3](#3-我要表达什么用哪个模板) | 我要表达什么，用哪个模板 |
| [4](#4-新建一份演示) | 新建一份演示 |
| [5](#5-文案规则) | 文案规则 |
| [6](#6-视觉规则) | 视觉规则 |
| [7](#7-事实与来源) | 事实与来源 |
| [8](#qa-fixes) | QA 报错怎么修 |
| [9](#9-放映) | 放映（见 presenting.md） |
| [10](#bento) | 扩展：Bento 的小图与详情 |
| [11](#11-新增模板) | 新增模板（见 contributing.md） |
| [12](#icons) | 图标 |
| [13](#themes) | 配色、深色页、强调色整页、风格 |
| [14](#build) | 逐条展开与翻页衔接 |
| [15](#images) | 图片 |

---

## 0. 命令速查

```bash
npx pcafe new my-deck       # 从起步模板生成 src/decks/my-deck/index.tsx
npx pcafe dev my-deck       # 开发预览：#/1 放映，#/kit 看模板库
npx pcafe check my-deck     # 类型检查 → 构建 → 自动 QA，最后一行是 PASS 或 FAIL
npx pcafe build my-deck     # 产出 dist/my-deck.html（单文件，离线可用）
npx pcafe docs              # 重新生成 components.md 和 skill 参考表
npx pcafe photos            # 下载可选的氛围照片（见第 15 节）
```

`check` 的输出里会打印打包体积（其中约 3.6 MB 是内嵌字体）。最后一行是 `PASS — all deterministic checks` 才算通过；显示 `FAIL (n)` 时按 [第 8 节](#qa-fixes) 修复后重跑。

---

## 1. 工作流

按顺序做，不要跳步。

1. **收集事实**：把要讲的每一个数字、日期、版本号连同出处整理好。查不到出处的事实不要写。
2. **写故事线**：先写下“听众看完要记住的那一句话”，它就是最后一页 `Closing` 的 `statement`。再按 [第 2 节](#2-故事线) 排出页序（短版 6–8 页，完整版 10–14 页，分章的长版 20–30 页），每页写一句该页要证明的观点。
3. **给每页选模板**：用 [第 3 节](#3-我要表达什么用哪个模板) 的决策表。同一个模板在一份演示里最多用两次（`SectionBreak` 每章一次，不受此限），`Bento` 最多用一次。
4. **建 deck 文件**：`npx pcafe new <name>`，见 [第 4 节](#4-新建一份演示)。
5. **填内容**：每填完一页，就对照 [components.md](components.md) 里该模板的“内容上限”自查一遍。
6. **跑检查**：运行 `npx pcafe check <name>`。只要出现 FAIL 就一定要修，修法见第 8 节。
7. **看一遍截图**：`qa/slide-NN-1920x1080.png` 是每页的截图。逐页确认没有空白过多、一页塞太满、重点不突出等问题。

---

## 2. 故事线

一份好演示是一条论证：**是什么 → 有多大 / 多久 → 变了什么 → 对你意味着什么 → 怎么做 → 接下来 → 结论**。下面三种结构可以直接套用。

### A. 版本 / 产品发布解读（12 页短版）

| # | 这一页回答 | 模板 |
| --- | --- | --- |
| 1 | 这是什么 | `Cover` |
| 2 | 全貌：六个最重要的变化 | `Bento` |
| 3 | 规模有多大 | `MetricBars` |
| 4 | 能用多久 / 时间点 | `Timeline` |
| 5 | 最显眼的组件版本 | `SpotlightList` |
| 6 | 哪些默认行为变了 | `CompareTable` |
| 7 | 三四个同等重要的改进 | `NumberedColumns` |
| 8 | 谁该升级、谁该等 | `VerdictColumns` |
| 9 | 动手前要检查什么 | `Checklist` |
| 10 | 具体怎么做 | `StepTrack` |
| 11 | 下一个版本 | `Teaser` |
| 12 | 一句话结论 | `Closing` |

### B. 项目 / 季度汇报（10 页）

`Cover`（季度或项目代号）→ `MetricBars`（核心指标）→ `CompareTable`（目标 vs 实际）→ `Timeline`（里程碑）→ `NumberedColumns`（三项关键成果）→ `SpotlightList`（各团队或渠道数据）→ `VerdictColumns`（继续 / 调整 / 停止）→ `StepTrack`（下季度计划）→ `Teaser`（下一阶段）→ `Closing`

### C. 技术方案评审（11 页）

`Cover` → `Bento`（方案全貌）→ `CompareTable`（现状 vs 方案）→ `NumberedColumns`（设计原则）→ `MetricBars`（性能或成本估算，标注“估算”）→ `Timeline`（迁移排期）→ `VerdictColumns`（适用 / 有条件 / 不适用的场景）→ `Checklist`（上线前检查）→ `StepTrack`（迁移步骤）→ `Teaser`（后续演进）→ `Closing`

### D. 短版（6–8 页，5 分钟以内）

`Cover` → 一个数据页（`MetricBars`、`Timeline` 或 `SpotlightList` 任选其一）→ `NumberedColumns` 或 `CompareTable` → `VerdictColumns` → `StepTrack` 或 `Checklist` → `Closing`。时间更紧时去掉中间任意一页，但保留首尾。

### E. 分章知识简报（20–30 页）

适合培训、研究综述、行业简报。先用 `Agenda` 列出 3–5 章，每章以 `SectionBreak` 开头，章内 4–6 页。

| # | 这一页回答 | 模板 |
| --- | --- | --- |
| 1–2 | 这是什么 / 分几章 | `Cover` → `Agenda` |
| 章首 | 这一章讲什么 | `SectionBreak` |
| 概念 | 这个词是什么意思 | `QuoteHero` |
| 机制 | 它是怎么运转的 | `FlowDiagram` |
| 证据 | 一个关键数字 / 一组变化 / 两种测法的差距 / 误差有多大 | `BigStat` / `DeltaBars` / `Dumbbell` / `RangeBars` |
| 澄清 | 流传的说法对不对 | `ClaimCards` |
| 排查 | 从外到内逐层要查什么 | `LayerStack` |
| 对照 | 谁在哪一类里叫什么 | `Matrix` |
| 并列 | 6–8 个对象各有什么特点 | `IconGrid` |
| 背景 | 事情是怎么一步步来的 | `Milestones` |
| 计划 | 接下来几周做什么 | `Gantt` |
| 收尾 | 每周 / 每月怎么做，一句话结论 | `Checklist` → `Closing` |

### F. 业务 / 运营手册（20–30 页）

适合上市计划、增长复盘、运营方案。行业数字写出处；示例公司和它的数字一律在 `source` 里标“示意”。

| # | 这一页回答 | 模板 |
| --- | --- | --- |
| 1–2 | 这是什么 / 分几章 | `Cover` → `Agenda` |
| 客户 | 买家怎样决策、谁参与 | `BigStat` / `NumberedColumns` / `QuoteHero` → `PersonaCards` |
| 定位 | 和谁比、站在哪 | `FlowDiagram` → `Quadrant` |
| 定价 | 按什么收、收多少 | `MetricBars` → `PricingTiers` |
| 执行 | 钱和时间怎么分、谁负责 | `ShareBar` → `Gantt` → `StatusGrid` → `Matrix` |
| 衡量 | 漏在哪、指标怎样、钱从哪来 | `Funnel` → `KpiBoard` → `Waterfall` |
| 增长 | 怎样形成闭环 | `Cycle` |
| 收尾 | 上线前检查、一句话结论 | `Checklist` → `Closing` |

技术发布解读写长版（20 页以上）时，在 A 的基础上加：`Agenda` + 每章 `SectionBreak`、`Milestones`（发布历史）、`Cycle`（开发周期）、`StatusGrid`（平台支持）、`SpecSheet`（版本对照）、`CodeDiff`（配置格式变化）、`Terminal`（新命令）、`Faq`（升级问答）、`Lanes`（正在退场的功能）。

**节奏规则**

- 相邻两页不要用同一个模板。
- 数据页（`MetricBars`、`Timeline`、`SpotlightList`）和文字页（`NumberedColumns`、`VerdictColumns`）尽量交替出现。短版里至少放一个数据页。
- 每页只证明一个观点。一页放不下时拆成两页，不要压缩字数硬塞。
- 长演示里，图表页（`BigStat`、`DeltaBars`、`Dumbbell`、`RangeBars`、`MetricBars`、`Funnel`、`Waterfall`、`ShareBar`、`KpiBoard`）之间至少隔一页文字或图标页。

---

## 3. 我要表达什么，用哪个模板

| 我手上的内容 | 用 | 不要用 |
| --- | --- | --- |
| 演示的第一页 | `Cover` | |
| 一句话结论，要单独立住、给密集内容之间一个停顿 | `Statement` | 一份演示超过 3 页；句子超过 28 字 |
| 6 个并列主题，其中 1 个最重要，每个都有能展开讲的图或表 | `Bento` | 不足 6 个时不要凑数 |
| 2–4 个能放在一起比较大小的数量 | `MetricBars` | 单位不同的数字 |
| 起止日期、阶段、支持期、排期 | `Timeline` | 只有一个日期 |
| 一组“名称 → 数值”，其中一项是重点 | `SpotlightList` | 需要展示前后变化时 |
| 改版前 / 改版后，逐项对比 | `CompareTable` | 只有 1–2 处变化 |
| 3–4 个同等重要、没有先后顺序的要点 | `NumberedColumns` | 有先后顺序时 |
| “推荐 / 有条件 / 不推荐”的分组建议 | `VerdictColumns` | 没有明确结论时 |
| 可以逐项打勾的准备工作，每项都有命令或动作 | `Checklist` | 有严格顺序时 |
| 必须按顺序完成的 3–5 步流程 | `StepTrack` | 超过 5 步 |
| 下一版本、下一阶段、路线图 | `Teaser` | 确定的结论 |
| 15 页以上演示的章节目录 | `Agenda` | 10 页以下 |
| 每章的第一页 | `SectionBreak` | 没有 `Agenda` 的短演示 |
| 一个术语的定义，或一句有出处的原话 | `QuoteHero` | 超过 64 字的段落 |
| 系统或机制的运转过程，其中一步是重点 | `FlowDiagram` | 听众要照做的步骤（用 `StepTrack`） |
| 一组流行说法，逐条给出结论与证据 | `ClaimCards` | 没有出处的“辟谣” |
| 层层依赖、要从外到内排查的环节 | `LayerStack` | 没有先后关系的清单 |
| 对象 × 类别的短标识对照（厂商 × 用途） | `Matrix` | 格子里要写句子 |
| 6 或 8 个并列对象，各一两句话 | `IconGrid` | 3–4 个（用 `NumberedColumns`） |
| 一个数字就是论点 | `BigStat` | 几个数字同等重要 |
| 带正负号的变化量 | `DeltaBars` | 都是正的总量 |
| 同一指标两种条件下的值，差距是重点 | `Dumbbell` | 只有一种条件 |
| 估计值和它的误差范围 | `RangeBars` | 没有误差数据 |
| 以周或冲刺为单位的行动计划 | `Gantt` | 有真实日期的长期周期（用 `Timeline`） |
| 4–7 个有日期的事件 | `Milestones` | 需要按时间比例表现间隔 |
| 3–4 条要在终端里敲的独立命令 | `Terminal` | 有先后依赖的流程（用 `StepTrack`） |
| 同一份配置或代码的新旧写法 | `CodeDiff` | 只是几个值变了（用 `CompareTable`） |
| 6–10 个对象各自的支持 / 就绪状态 | `StatusGrid` | 每个对象要比多个维度（用 `Matrix`） |
| 一批组件的新旧版本号 | `SpecSheet` | 值是行为描述而不是版本号 |
| 首尾相接、会循环的阶段 | `Cycle` | 只走一遍的流程（用 `FlowDiagram`） |
| 4 或 6 个常见问题，各一两句回答 | `Faq` | 在核查说法真假（用 `ClaimCards`） |
| 按时间范围分组的事项：现在 / 下一步 / 之后 | `Lanes` | 有确切日期（用 `Gantt`） |
| 逐级转化的流程，要指出先修哪一级 | `Funnel` | 各级不是包含关系 |
| 两个维度上的竞争定位 | `Quadrant` | 只比较一个维度 |
| 同一笔采购里的三个角色 | `PersonaCards` | 三个细分市场（用 `IconGrid`） |
| 3–4 档价格方案 | `PricingTiers` | 竞品价格对比（用 `Matrix`） |
| 一个北极星指标加 4–6 个输入指标 | `KpiBoard` | 只有 1–3 个数字 |
| 加起来是 100% 的构成，几行对比 | `ShareBar` | 各部分不构成整体 |
| 从期初到期末的增减拆解 | `Waterfall` | 各项不是加减关系 |
| 4–12 个时间点的变化趋势 | `LineChart` | 只有 2–3 个点（用 `MetricBars`） |
| 两个维度交叉的数值：分批留存、渠道 × 阶段 | `Heatmap` | 只有一行或一列 |
| 一个要回答的问题，拆成 2–4 个互不重叠的分支 | `IssueTree` | 分支之间有先后顺序（用 `FlowDiagram`） |
| 季度粒度的路线图，带进度 | `Roadmap` | 按周排期（用 `Gantt`） |
| 4、6 或 8 个人或角色，各自负责什么 | `Team` | 要写清每件事谁拍板（用 `Matrix` 做 RACI） |
| 3 或 5 句能逐字引用的原话 | `QuoteWall` | 只有一句（用 `QuoteHero`）；查不到原文 |
| 一张真实的产品截图，要指出 3–5 个位置 | `Screenshot` | 没有真实截图 |
| 同一画面两种状态的真实截图 | `BeforeAfter` | 两张图构图不同 |
| 封面要有记忆点，主题能用 4–8 个图标概括 | `HangingCover` | 正式汇报（用 `Cover`） |
| 3–4 个功能，各配一小块能看懂的界面（列表、大数字、柱、进度、换算、标签） | `PanelCards` | 界面里没有真实数据 |
| 一个问题和三个并列答案，每个有数字和一组小柱 | `AskAnswer` | 答案不能用数字比较 |
| 一个承诺加证据：几行参数、两个数字、两条保证 | `ProofSplit` | 证据少于两条 |
| 4 个话题，一次讲一个（配 `build: 'focus'`） | `IndexStack` | 话题需要同时对比 |
| 结尾留联系方式或入口，带一个动作 | `ContactPanel` | 没有可以给出的入口 |
| 一个核心和 4–8 个围绕它的部件 | `Orbit` | 部件之间有先后顺序（用 `FlowDiagram`） |
| 一个数字开场，后面一句话解释它 | `NumberOpener` | 数字没有出处 |
| 章节页，要让听众知道讲到第几章 | `ChapterProgress` | 少于 3 章 |
| 抛出一个问题，下一页回答 | `Question` | 一份演示超过 2 页 |
| 一句旧说法被一句新说法取代 | `Contrast` | 两边不是同一件事 |
| 一章或整份演示的小结，3 条加“下一步” | `Recap` | 超过 3 条 |
| 产品封面：深色主卡 + 一张真实截图 + 2–3 条可核实的成绩 | `HeroPanel` | 没有真实截图 |
| 同一产品的 2–4 张截图，点分段切换 | `TabbedShot` | 截图之间没有关系 |
| 字体、颜色和尺寸规范 | `BrandKit` | 非设计话题 |
| 3–4 条有出处的奖项、评分或硬指标 | `Laurels` | 编不出出处的“荣誉” |
| 一张真实截图铺满整页，配一句话（`tone: 'dark'`） | `FullBleed` | 截图细节很多、需要标注（用 `Screenshot`） |
| 工作室风的致谢页，列 2–4 个联系入口 | `Thanks` | 已经用了 `ContactPanel` |
| 创意或品牌提案的封面：两个巨字 + 2–3 张真实截图 | `SplitWord` | 正式汇报 |
| 等宽黑风格的章节页 | `PillAgenda` | 少于 3 章 |
| 3–4 个并列的规模数字，可附一排工具名 | `StatRow` | 一个数字就是论点（用 `BigStat`） |
| 一个指标的前后两个值，变化就是结论 | `CountCompare` | 超过两个数 |
| 一个整体分成 2–5 部分，只强调一部分 | `Donut` | 超过 5 部分 |
| 2–8 个类别的数量，可分组或堆叠 | `BarChart` | 只有 2–4 个数（用 `MetricBars`）；时间趋势 |
| 对象在两个连续指标上的位置，可加第三个量 | `Bubble` | 只有两个类别（用 `Quadrant`） |
| 一个值相对上限或目标 | `Gauge` | 没有上限 |
| 4–6 件事，每件一个词就能说清 | `ServiceList` | 每项要两句以上 |
| 恰好三句有出处的原话 | `QuoteArc` | 查不到出处 |
| 3–4 个作品或方案，各一个词 | `WorkCards` | 需要说明文字 |
| 等宽黑风格的结束页 | `RepeatClosing` | 要列联系方式 |
| 轻松场合的封面，有一张真实截图 | `StickerCover` | 正式汇报 |
| 4–10 个关键词：技能、主题 | `WordBlocks` | 每项要解释 |
| 3–4 个项目逐个讲，各有截图（配 `build: 'focus'`） | `FolderCards` | 要并排比较 |
| 3–4 个指标各带一串历史值 | `SparkCards` | 没有历史值（用 `StatRow`） |
| 比例说成“每 10 / 100 个里有几个” | `Pictogram` | 部分超过 3 个 |
| 两个时间点或两种口径下的名次 | `SlopeRank` | 要看具体数值（用 `Dumbbell`） |
| 贴纸风格的结束页，带一个行动号召 | `PixelClosing` | 正式场合 |
| 品牌或发布会封面，有一个代表数字 | `FloatCover` | 正式汇报 |
| 6 或 9 个功能、零件，各一个词 | `TileWall` | 每项要解释（用 `IconGrid`） |
| 3–4 个步骤或服务，各一两句说明 | `ServiceIndex` | 步骤间要画箭头（用 `StepTrack`） |
| 当前这一项和下一项 | `GlowStack` | 超过两项（用 `Roadmap`） |
| 两个方案或两种用法，各一个代表数字 | `DuoCards` | 三档（用 `PricingTiers`） |
| 桌面风格的封面或目录 | `Desktop` | 正式汇报 |
| 2–3 个步骤，各对应一个文件或工具 | `WindowStack` | 超过 3 步 |
| 默认设置、功能开关 | `ToggleCard` | 要讲状态好坏（用 `StatusGrid`） |
| 层层依赖的前提条件 | `Pyramid` | 数量逐级减少（用 `Funnel`） |
| 两三个维度的交集，定性 | `Venn` | 要比大小（用 `Donut`） |
| 从核心到外围的包含关系 | `Concentric` | 平级的卫星（用 `Orbit`） |
| 按是 / 否条件选方案，最多两层 | `DecisionTree` | 拆解原因（用 `IssueTree`） |
| 一个问题的 4–6 类成因 | `Fishbone` | 有层层因果（用 `IssueTree`） |
| 跨角色的流程和交接 | `Swimlane` | 只有一个角色（用 `StepTrack`） |
| 系统或组织的 3–5 层结构 | `ArchLayers` | 要讲数据流（用 `FlowDiagram`） |
| 优缺点、成本与收益的权衡 | `Balance` | 逐项对比属性（用 `CompareTable`） |
| 两组对象经过同样几个阶段 | `DoubleFunnel` | 只有一组（用 `Funnel`） |
| 发布会开场、新版本揭幕 | `KeyReveal` | 需要解释细节：用 Cover |
| 产品规格、关键指标 | `KeySpec` | 要比较多个数：用 StatRow |
| 品牌、创意、功能发布的封面 | `OrbCover` | 正式汇报：用 Cover |
| 3 个并列的功能、开关、选项 | `GradientCards` | 有先后：用 StepTrack |
| 3–4 个同样重要的数字 | `BlockStats` | 要比较大小：用 MetricBars |
| 封面、口号、规则宣讲 | `PopPoster` | 需要论证：用 Statement |
| 产品或项目的一页总览 | `BentoBoard` | 要点击展开详情：用 Bento |
| 介绍一个功能、一个文件、一条命令 | `BentoSpotlight` | 多个并列功能：用 IconGrid |
| 评审、培训、答疑这类要约时间的安排 | `SlotPicker` | 真实的长期排期：用 Gantt 或 Timeline |
| 上手、设置、新建这类三步流程 | `UiSteps` | 步骤带命令且超过 3 步：用 StepTrack |
| AI、语音、工具类产品的开场 | `FloatHero` | 正式汇报：用 Cover |
| 引用一段录音、访谈或讲解 | `TranscriptCard` | 只有一句引语：用 QuoteHero |
| 按角色、阶段、场景分组的清单 | `RetroTabs` | 只有一组：用 IconGrid |
| 版本更新、阶段回顾 | `RetroLog` | 要按真实时间比例：用 Timeline |
| 有一个最想让人记住的数字 | `GlowMetric` | 数字要对比：用 CountCompare |
| 4 或 6 个并列的功能、字段、能力 | `HairlineGrid` | 每项一个词就够：用 TileWall |
| 培训、活动、对外介绍的封面 | `RibbonCover` | 正式汇报：用 Cover |
| 分章的演示，每章开头 | `RibbonSection` | 不分章的短演示 |
| 新手常见问题、用户提问 | `ChatThread` | 问题超过 3 个且要标出处：用 Faq |
| 3–4 条规则、小贴士、注意事项 | `NoteCards` | 正式场合：用 NumberedColumns |
| 最后一页 | `Closing` | |

找不到合适的模板时，**先改内容去适配模板**（拆页、合并、换个角度），而不是去写新的版式。

---

## 4. 新建一份演示

```bash
npx pcafe new my-deck
```

这会把起步模板 `src/decks/starter/` 复制成 `src/decks/my-deck/index.tsx`。起步模板只依赖 `src/kit`，生成后就能编译。需要别的模板时，到 [components.md](components.md) 里找对应模板的示例，或者从 `src/decks/` 下的示例演示里复制那一页的 `{ id, label, render }` 整块再改内容。不要整份复制使用了 Bento 的示例：它依赖同目录下的 `content.ts`、`minis.tsx` 和 `details.tsx`。

`npx pcafe dev`、`check`、`build` 都按名字选择演示，不需要手动改 `src/decks/active.ts`。开发时也可以直接打开 `http://localhost:5173/?deck=my-deck`。

deck 文件的骨架如下。每一页就是一个模板，所有内容都通过 props 传入：

```tsx
import type { DeckDef } from '../../kit'
import { Cover, MetricBars, Closing } from '../../kit'

export const deck: DeckDef = {
  title: 'Q3 Platform Review',          // 每页左上角显示，英文或短中文，≤ 32 个字符
  theme: 'crimson',                      // 配色，见第 13 节
  style: 'standard',                     // 风格，见第 13 节
  iconStyle: 'line-duotone',             // 图标系列，见第 12 节
  slides: [
    {
      id: 'cover',                       // 唯一，只用小写字母和连字符
      label: '封面',                      // 页眉和进度条提示里显示，2–6 字
      notes: '开场先讲季度目标。',          // 演讲备注，可选
      seconds: 60,                       // 计划讲多少秒，可选，演讲者视图排练计时用
      render: () => (
        <Cover
          kicker="Quarterly Review · 季度回顾"
          title="平台组 Q3"
          subtitle="steady"
          lead="……"
          facts={[{ label: '周期', value: '07–09 月' }, { label: '发布', value: '14 次' }]}
          numeral="Q3"
        />
      ),
    },
    // …
  ],
}
```

注意以下几点：

- 需要 Bento 时，把示例里 Bento 页用到的 `content.ts`、`minis.tsx` 和 `details.tsx` 一起复制过来改写，详情页和卡片小图按 [第 10 节](#bento) 来写。
- `title` 可以传字符串数组，用来手动断行，例如 `title={['新版本', '首次进入稳定通道']}`。较长的中文标题请都这样处理，避免浏览器把一两个字挤到第二行。

## 5. 文案规则

**长度怎么数**：“字”指一个汉字；两个英文字母、数字或空格算一个字。“个字符”指每个字符都算一个，用于数字、代号、命令等字段。例如 `Deck Kit` 是 4 字，也是 8 个字符。

1. **标题是观点，不是话题**。比如写“旧版本已转入长期维护”，不要写“支持周期介绍”。标题不超过 16 个字。
2. **kicker 是话题**，2–8 字，例如“支持周期”“升级前”。
3. **lead 是证据或背景**，一到两句，不超过 60 字。lead 不要复述标题。
4. **数字要带单位和口径**：“超过 14,000 个”“≈ 20%”“计划日期”。估算值标“估算”，示意图标“示意”。
5. **中文与英文、数字之间留一个半角空格**，例如“版本 13 的 64 位 time_t”。标点使用全角中文标点。
6. **不要写空话**：去掉“全面升级”“赋能”“无缝”“极致”这类词。用具体的名词和数字来写。
7. **命令和文件名照原样写**，并放进 `cmd`、`mono`、`tag` 这些等宽字段，不要放在正文里。
8. **正文里避免一串长英文标识符**。组件名、包名、路径不能在中间断行，三个连在一起就会把一行撑满，所以放进 `tag`、`cmd` 这些字段，或者只留一个。
9. **一段话的最后一行不要只剩一两个字**。标题可以用数组断行；正文字段不能手动断行，只能改写句子，缩短或加长几个字。
10. **同一个概念全篇只用一种叫法**。前面叫“LTS”，后面就不要改叫“长期维护版”。

## 6. 视觉规则

这些是模板已经做好的事，不要破坏。

- **不要写自定义 CSS，也不要加内联样式**。字号、间距和颜色都在模板里。需要不同的视觉效果时，换一个模板。
- **强调色只由模板来用**。颜色由 `DeckDef.theme` 决定（见 [第 13 节](#themes)），默认绯红 `#e00052`。它出现在两类地方：一类是系统标记，比如每页的 kicker、编号、计数器、来源前的横线；另一类是每页唯一的焦点，比如 `Cover` 的大数字、`MetricBars` 的合计、`SpotlightList` 的第一项、`StepTrack` 的最后一步、`VerdictColumns` 的“推荐”组。你要做的只有一件事：不要在内容里另外加颜色、加粗或使用 HTML 标签来制造第二个焦点。
- **图标只用内置图标**（见 [第 12 节](#icons)），通过模板的 `icon` 字段传入名称。不要放别的图标库或 emoji。其余图形都用 DOM/CSS 绘制，以保证离线、清晰和缩放一致。
- **不要引用任何远程资源**（字体、图片、脚本）。构建时会直接报错。
- **画布固定为 1920 × 1080**，自动等比缩放。在 CSS 里 `24u` 表示设计稿上的 24px。不要使用 `px`、`vw` 写布局。
- **最小字号是 17u**，QA 会检查。
- **强调要对上文字**：说“最长”就高亮最大的那一项，说“进行到第 3 步”就只填到第 3 步。

## 7. 事实与来源

- 页面上有数据或事实时，必须填写 `source`，写明文档名加章节，例如 `2025 年度报告 §4.3`。
- 例外：`Cover` 和 `Closing` 没有 `source` 字段。封面上的事实必须在后面某一页再次出现并带上出处；`Closing` 的 `refs` 就是它的出处。
- 查不到的事实不要写。没有把握的地方，宁可删掉那一页。不要编造客户评价、Logo、奖项。
- 会随时间变化的内容（“已结束”“还剩 N 个月”）用 `Timeline` 的 `today` 和 `countdowns` 计算，不要写死在文字里。
- 示意性质的图形要在图注里写“示意”，示例公司和它的数字一律在 `source` 里标“示意”。

<a id="qa-fixes"></a>

## 8. QA 报错怎么修

`npx pcafe check` 的最后一步是自动 QA：在 1920×1080、1366×768、2560×1440、1440×900 四种窗口下逐页检查，截图存到 `qa/`，详细结果写入 `qa/report.json`。

### 给脚本和 AI 用的报告

每次 `check`（任何格式）都会另外写出 `qa/reports/<格式>-<名字>.json`，完整输出存在 `qa/reports/<格式>-<名字>.log`。每个问题都有级别（`fail`、`warn`、`hint`）、固定的代号、原文，能定位时还带页码或源文件和行号。代号：`fonts.*` `offline.*` `runtime.*` `source.*` `content.*` `text.*` (`text.too-small`, `text.contrast`, `text.unsettled`) `layout.*` (`layout.overflow`, `layout.safe-area`, `layout.overlap`, `layout.sideways-scroll`, `layout.empty`, `layout.widow`) `a11y.*` `nav.*` `build.*` `typecheck.TS…` `pdf.*` `print.*` `video.*` `course.*` `screen.*` `cards.*` `copy.*` `deck.*`。

- `npx pcafe check <name> --json`（其他格式用 `npx pcafe <格式> check <name> --json`）不打印构建过程，只输出这份报告和 `next`。
- `npx pcafe status [格式] <name> [--json]` 读取最近一次报告，告诉你下一步：`run_check`（还没检查过，或之后改过源文件）、`fix`（按代号分组的问题，以及重跑的命令）、`review`（已通过：要看的截图清单，看完给用户确认）。它不会判定“已完成”，完成与否由用户决定。

### 常见报错

| 报错 | 原因 | 修法 |
| --- | --- | --- |
| `text "…" outside the safe area` | 文字超出画布安全区 | 按该模板的“内容上限”缩短文字，或减少行数、条目数 |
| `text collision: "A" × "B"` | 两段文字重叠了 | 在 deck 文件里搜索 A 的开头几个字，找到对应的字段，把它缩短到下限和上限之间。常见情况有三种：标题太长换成了两行（改用数组断行）；正文里堆了长英文标识符（移到 `tag` 或删减）；某一列条目太多（删掉一条）。`"1"`、`"2"` 这类单个数字通常是 `NumberedColumns` 底部的大编号，说明那一列的 body 太长 |
| `… clips content` | 内容超出容器被裁切 | 缩短那个字段，常见于 Timeline 段内的 label 太长 |
| `font 15.0u too small` | 用了自定义的小字号 | 删掉自定义样式 |
| `font cjk400 not loaded`，或页面上出现方框、字体粗细不一 | 新文字不在随仓库提交的字体子集里 | `npm run fonts:verify` 会列出缺字；`check` 给出带缺字的警告并回退到系统字体。维护者用 `npm run fonts` 重新生成子集（需要 Python、fonttools 和 Noto CJK 源文件） |
| `external requests …` | 引用了网络资源 | 删掉远程图片、字体或链接资源 |
| `navigation: …` | 交互元素拦截了翻页键 | 自定义组件不要监听全局键盘事件 |
| `slide … never settled …` | 页面上有东西一直在变，QA 判断不了何时结束 | 如果是实时元素（时钟、跳动的数字），给该元素加 `data-settle-ignore`；否则删掉不会结束的变化 |
| `detail …: card did not return` | 改动了 Bento 内部 | 撤销对 `src/kit/Bento.tsx` 的修改 |
| `gallery …` | 模板库页面出错 | 检查 `src/kit/catalog.ts` 的 `demo` 是否对应 `deck` 字段所指示例演示中存在的页面 id |
| 类型错误 `Type '"xxx"' is not assignable to type IconName` | 图标名写错，或不在精选集里 | 到 `#/kit/icons` 查名字；确实需要新图标时按第 12 节添加 |

**WARN**：QA 还会输出不算失败的提醒，例如 `slide 4: content ends at y=640 … looks empty`，意思是这一页下半部分基本是空的。看到这类提醒，按下面的截图自查处理。

**截图自查**（QA 不一定报，但会影响质量）：

- 整页超过一半是空的：加一个 `pull`、`detail`、`countdowns` 这类可选块，或者换成信息更密的模板。
- 某一列明显比其他列长或短（例如一组只有 1 项）：精简长的那一列，或者给短的列补一条，让各列项数相差不超过 1。
- 正文最后一行只剩一两个字：改写句子，见第 5 节第 9 条。
- 中文标题第二行只有一两个字：改用数组手动断行。
- 装饰件（手绘圈、高亮、箭头）放大 2 倍看一遍：位置要对准，强调的内容要和文字一致。

`PASS` 之前可能会出现 `hint  copy.…` 开头的提示行，标出文案里的套话（“值得注意的是”“有研究表明”“未来可期”等）和所在文件、行号。它们不会让检查失败：能改就改；放在上下文里确实准确的，可以保留。“有研究表明”“业内认为”这类说法要在 `source` 里写出具体出处。规则目前覆盖中文和英文，也可以用 `node scripts/copy-lint.mjs <路径>` 单独检查任何文件。

长演示（20 页以上）还会出现 `hint  deck.…` 开头的结构提示：没有目录（`deck.no-agenda`）、章节页少于 2 个（`deck.few-sections`）、最后一页不是收尾（`deck.no-closing`）、同一个模板连用 4 页以上（`deck.repeat`，任何长度都查）、逐条展开的页超过三分之一（`deck.builds`）。同样不会让检查失败。

`PASS` 并且每页截图都看过，才算完成。

## 9. 放映

快捷键、演讲者视图、导出 PDF、纹理和翻页方式见 [presenting.md](presenting.md)。

<a id="bento"></a>

## 10. 扩展：Bento 的小图与详情

Bento 每张卡片可以带两块自定义内容：

- `mini`：卡片上的小图形，用于第 2–6 格。参考示例演示 Bento 页旁边的 `minis.tsx`：纯 DOM 加已有的 `mini-*` 样式，不超过卡片的视觉区。
- `detail`：展开后的右栏，必填。参考同目录的 `details.tsx`，可以复用这些样式类：

| 类名 | 用途 |
| --- | --- |
| `dv-label` | 小节标签（等宽小字） |
| `dv-flow` | 2–3 个并排的大数字统计 |
| `dv-notes`（`dl > dt/dd`） | 键值说明列表 |
| `dv-code` 系列 | 前后代码对照面板 |
| `dv-stack` 系列 | 两列版本对照表 |

写完后在放映里打开每张卡片，确认详情没有超出卡片。QA 也会逐张检查。

## 11. 新增模板

只有当某类内容反复出现、现有模板都放不下时，才考虑新增模板。步骤见 [contributing.md](contributing.md)。写演示时不要改模板。

<a id="icons"></a>

## 12. 图标

图标来自 [Solar Icons](https://github.com/480-Design/Solar-Icon-Set)（CC BY 4.0，模板库页脚已署名）。`src/kit/icon-set.ts` 精选了一组图标，分组整理；`#/kit/icons` 可以浏览全部图标，点击复制名称。[components.md](components.md) 最后的“图标”一节也列出了全部名称。

**选系列**：每个图标有 6 个系列，整份演示用同一个，写在 `DeckDef` 上：

```tsx
export const deck: DeckDef = {
  title: '…',
  iconStyle: 'line-duotone', // 默认值；可选 bold-duotone、linear、outline、broken、bold
  slides: [ … ],
}
```

模板库左侧（窄屏在页首）的“图标系列”切换器会把所有预览换成对应系列，用来挑选。

**用法**：模板里的 `icon` 字段直接写名称，例如 `icon: 'radar'`。在 Bento 详情等自定义区域里可以用 `<Icon>`：

| 写法 | 效果 |
| --- | --- |
| `<Icon name="radar" />` | 48u，跟随 `iconStyle`，副色层是半透明墨色 |
| `<Icon name="radar" size={36} />` | 尺寸按设计单位，常用 30–48 |
| `<Icon name="radar" tone="accent" />` | 副色层换成强调色。每页最多一个，模板已经替焦点位置处理好了 |
| `<Icon name="radar" tone="mute" />` | 灰色，用于装饰 |
| `<Icon name="radar" variant="bold" />` | 只让这一个图标换系列，一般不需要 |

**挑图标的规则**

1. 按含义挑，不按好看挑：讲“社区”用 `users`，讲“检索”用 `database`。
2. 同一页里不要重复用同一个图标。
3. 图标是辅助，不能代替文字：每个图标旁边都要有标题。
4. 精选集里没有合适的，按 [contributing.md](contributing.md#add-icon) 添加。

<a id="themes"></a>

## 13. 配色、深色页与风格

每份演示选一套强调色，写在 `DeckDef.theme` 上。模板里所有强调色位置（kicker、焦点数字、焦点条、浅色底、终端提示符）都会一起换：

```tsx
export const deck: DeckDef = {
  title: '…',
  theme: 'cobalt', // crimson（默认）· amber · cobalt · emerald · violet
  slides: [ … ],
}
```

| 名称 | 色值 |
| --- | --- |
| `crimson` 绯红 | `#e00052` |
| `amber` 橙 | `#eb5a0c` |
| `cobalt` 钴蓝 | `#2457f5` |
| `emerald` 翠绿 | `#0c9366` |
| `violet` 紫 | `#6c3cf0` |

模板库左侧的“强调色”切换器可以把所有预览临时换成某一套，选“随演示”则各自使用所属演示的配色。

每套配色还带一组 `paper`：底色、卡片、分隔线都往强调色的方向偏一点，橙色配暖米色，钴蓝配冷白，翠绿配灰绿。换配色时底色会一起换，不需要另外设置。

<a id="tone"></a>

### 深色页

单独一页可以设成深色，整块画布（包括页眉和进度条）都会反白，翻页时平滑过渡：

```tsx
{ id: 'ch1', label: '看清买家', tone: 'dark', render: () => <SectionBreak … /> }
```

只在这几个模板上用，它们都在深色下检查过：`SectionBreak`、`QuoteHero`、`Teaser`、`Closing`、`Statement`。`FullBleed` 必须写 `tone: 'dark'`。其余模板有深色卡片或白字，放在深色页上会看不清。一份演示里深色页不要超过三分之一，最适合放在每章的第一页和最后一页，形成明暗节奏。

### 强调色整页

`tone: 'accent'` 把整页铺满主题色，文字反白，原来用强调色的地方（小标签、关键词）变成白色。它是最强的停顿，**一份演示最多 2 页**，只用在 `SectionBreak`、`Statement`、`Closing` 上。最典型的用法是一页 `Statement` 把上一页数据的结论单独立住。

<a id="styles"></a>

### 风格

`DeckDef.style` 决定标题和大数字的字体、圆角、底色和装饰，正文、字号、间距都不变，所以每个模板的内容上限照旧有效。它和配色互相独立，任意组合。共 33 种：

| 场合 | 风格 |
| --- | --- |
| 正式汇报 | `standard`（默认）、`editorial`、`calm` |
| 发布会与品牌 | `keynote`、`toy3d`、`poster`、`gradient`、`warm-dark`、`nuance`、`agency`、`halo`、`electric` |
| 产品与工具 | `studio-dark`、`bento`、`soft-saas`、`float-ui`、`wallpaper`、`desktop` |
| 轻松分享 | `sticker`、`playful`、`pop`、`ribbon`、`mono-studio` |

每种风格的字体、底色和适合场合见 [skills/pcafe/references/styles.md](../../skills/pcafe/references/styles.md)（由代码生成）。

第三方包用 `pcafe` 的 `registerStyle(name, preset)` 注册新风格。它的 CSS 必须写在 `:root[data-style='name']` 下，不能只写 `[data-style='name']`：引擎自己的变量写在 `:root` 上，优先级相同，后加载的规则也可能被盖掉。

`mono-studio`、`keynote`、`warm-dark` 整份默认深色，不用写 `tone`；某一页要换回浅色时写 `tone: 'light'`。默认深色的风格里只用深色下检查过的模板：上面列出的五个，加上各图表模板。

风格专属模板（例如 `FloatCover`、`Desktop`、`KeyReveal`）尽量只在对应风格里用；它们在 components.md 的“适合”一行会写明风格。

每种风格还提供 6 个点缀色 `--spot-1 … 6`（1 是主题色），只给图标方块（`IconTile`）和迷你界面的标签用，不要用在正文上。

选风格之前先看样张：打开 `#/kit/styles`（风格样张墙），同一页按每种风格各排一遍并排对比；也可以用左侧的“风格”切换器把所有预览换成某一种风格。

展示字体只裁剪了 `src/` 里出现过的字，`npx pcafe check` 不会重新裁剪：新打的字如果不在子集里，会回退到系统字体，并在检查里给出缺字警告；要补进子集，维护者运行 `npm run fonts`，再用 `npm run fonts:verify` 校验。

<a id="build"></a>

## 14. 逐条展开与翻页衔接

### 逐条展开

给一页加 `build`，讲的时候就能一项一项出现：

```tsx
{ id: 'funnel', label: '转化漏斗', build: 'reveal', render: () => <Funnel … /> }
```

- `'reveal'`：还没讲到的项先压暗，每按一次 `→` 出现一项。
- `'focus'`：已经讲过的也压暗，只有当前这一项是亮的。适合一次只讲一件事的页面，比如 `Faq`、`Cycle`、`IssueTree`、`FlowDiagram`、`IndexStack`、`FolderCards`。

只有用 `→` 或 `Space` 进入这一页时才逐条展开。用进度条、目录、总览或 `#/N` 跳过来时直接显示全部内容，所以 QA 截图和模板库里看到的都是完整的页面。

哪些元素算一项由模板决定：列表、卡片、表格行、漏斗的每一级、热力表的每一行、截图的每个标注。写 deck 时只需要加 `build`，不用管模板内部。

一页里少于 3 项时不要加 `build`。整份演示里逐条展开的页不要超过三分之一，否则讲的人要按太多次键。

### 翻页衔接

目录里的章节编号会飞到下一页章节页的大号数字上（反过来也一样）。这是 `Agenda` 和 `SectionBreak` 自带的，不需要设置。

逐字出现的一句话用 `RevealStatement` 模板。

<a id="images"></a>

## 15. 图片

`Screenshot`、`BeforeAfter`、`HeroPanel`、`TabbedShot`、`FullBleed` 和部分封面、章节页用到图片。图片只有三类，都用 `import` 引入，其他来源的图片不要用：

| 类型 | 文件名 | 放在哪 | 能做什么 |
| --- | --- | --- | --- |
| 真实截图 | 任意 | deck 目录的 `assets/` | 可以当证据 |
| 图库照片 | `photo-` 开头 | `src/assets/photos/` | 只营造氛围（封面、章节页、场景配图） |
| 装饰插图 | `decor-` 开头 | deck 目录的 `assets/` | 只做装饰（背景、氛围） |

- **真实截图**：没有截图就换模板，不要拿示意图冒充产品界面。`source` 写清楚截的是什么、什么时候截的、怎么截的。
- **`photo-` 照片**来自 Unsplash，不能冒充“我们的客户、团队、产品、办公室”。`source` 里写“图：Unsplash / 作者名”，作者和原链接记在 `src/assets/photos/credits.json`。照片不随项目分发：运行 `npx pcafe photos`，用你自己的 `UNSPLASH_ACCESS_KEY` 下载到 `src/assets/photos/`，同时写好 `credits.json`。
- **`decor-` 插图**是 AI 生成的装饰图，不能当截图、证据或数据图，也不能出现真实品牌。
- 引入方式：`import shot from './assets/x.webp'`。打包时会内联进单个 HTML 文件。
- 用 WebP，单张 200 KB 以内。宽 1440–1600 像素足够。
- `ratio` 填图片真实的宽高比；`BeforeAfter` 的两张图尺寸和构图必须一致。

## 署名

使用 PCafe 制作的作品（演示、报告、卡片、课程、屏幕、印刷、视频）会保留「由 PCafe 制作」署名，并链接到 https://p.cafe：演示在第一页和最后一页的页眉以及控制栏显示，其他格式显示在页脚。

`DeckDef.attribution: false`（以及其他格式定义里的同名选项）只在安装 `@pcafe/pro` 并持有有效的 PCafe Pro 许可时生效；没有 Pro 时这个选项会被忽略，控制台会说明原因。

CPAL-1.0 第 15 条：把作品发布到网站上属于 External Deployment（对外部署）。未修改引擎文件的用户，链接到公开仓库即可满足源码要求；修改过引擎文件的用户，需要公开修改过的文件。你自己的幻灯片内容不受影响。

## 16. Emoji

在任何格式的任何文字字段里直接打 emoji 就行：演示、报告、简历、卡片、视频、课件和展示屏都支持，不用改模板。emoji 由 PCafe 内置的素材绘制，换机器、导出都长一样。文件里只打包实际用到的 emoji。

```ts
export const deck: DeckDef = { title: '…', emojiStyle: 'fluent', slides: [ … ] }
```

| `emojiStyle` | 样子 | 适合 |
| --- | --- | --- |
| `fluent`（默认） | 柔和、有立体感 | 屏幕、卡片、视频、普通 PDF |
| `flat` | 扁平色块、文件小 | 小尺寸、大幅印刷 |
| `noto` | 圆润可爱 | 大幅印刷 |

想单独摆一个 emoji 或指定大小，用 kit 里的 `<Emoji e="🚀" size={64} />`。卡片封面可以用贴纸式主图：`motif: { kind: 'emoji', e: '🎤', around: ['✨', '💡'] }`。在预览地址后加 `?emoji=noto` 可以对比系列。全部 emoji 可以在开发预览的 `#/kit/emoji` 浏览和搜索。

限制：

- 不含国旗和肤色变体。用了会中止构建，并在报错里指出是哪一个。
- 用 SVG 文字画的图表标签放不了图片，写了 emoji 会让 QA 失败。把它放到标题或正文里。
- `fluent` 用了模糊效果，导出 PDF 时会变成 300 ppi 的图片，文字大小下足够清晰。`flat` 和 `noto` 始终是矢量，大幅印刷请用这两种。

用量要克制：一页一两个，放在希望被记住的地方，放在文字前面，不要代替文字。财报、法务文件和事故通报里不要用。社交卡片可以多放一些。

## 文件地图

```
src/
  deck/            放映引擎：画布缩放、翻页、逐条展开、翻页衔接、总览、演讲者视图（一般不用改）
  kit/             251 个模板 + catalog.ts（模板说明的唯一来源）+ theme.ts（配色与风格）+ Icon.tsx / icon-set.ts（图标）
  decks/
    starter/       起步模板，npx pcafe new 从这里复制
    <name>/        每份演示一个目录；assets/ 放截图和装饰图
  assets/photos/   npx pcafe photos 下载的氛围照片和 credits.json
  gallery/         #/kit 模板库页面
  styles/          模板与风格的样式
cli/               PCafe 命令行
scripts/           自动 QA、文档生成、字体子集
docs/<语言>/        文档；components.md 由代码生成
skills/pcafe/  给 AI 助手的 skill 与参考表
```
