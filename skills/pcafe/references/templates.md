# 模板速查（索引）

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 251 个模板，87 组。先读本页选组，再读组文件里的“适合 / 不适合 / 上限 / 参考”；完整 props 和示例见 docs/zh-CN/components.md。

| 组 | 内容形状 | 模板 |
| --- | --- | --- |
| [开场](templates/opening.md) | 整份演示的第一页；主题能浓缩成一个数字或短代号：版本号、年份、季度、排名；产品、平台、工具的发布或介绍 | `Cover`、`HangingCover`、`HeroPanel`、`SplitWord`、`StickerCover`、`FloatCover`、`Desktop`、`KeyReveal`、`OrbCover`、`FloatHero`、`RibbonCover`、`SketchCover`、`AgencyHero`、`FanCover`、`PhotoCover`、`TextMask`、`GlobeCover`、`BadgeHero`、`ExhibitCover`、`AgendaMosaic` |
| [总览](templates/overview.md) | 需要一页讲清“这是什么”，并允许听众按兴趣深入；有 6 个并列主题，其中 1 个是最重要的（放在第 1 格）；产品或项目的一页总览 | `Bento`、`BentoBoard`、`MegaMenu` |
| [数据](templates/data.md) | 几个可加总或可比较的数量：新增 / 更新 / 删除，收入构成，用户分层；需要让听众记住一个比例；一组“名称 → 版本 / 分数 / 数量”，其中一项是重点 | `MetricBars`、`SpotlightList`、`StatRow`、`CountCompare`、`Donut`、`BarChart`、`Bubble`、`Gauge`、`SparkCards`、`Pictogram`、`SlopeRank`、`BlockStats`、`GlowMetric`、`ProgressCards`、`RankingRace`、`BubbleCluster`、`Sankey`、`Treemap`、`Radar`、`Scatter`、`StackedArea`、`DotMap`、`GlowMetrics`、`Odometer`、`ArcGlobe`、`PopGrid`、`SpikeChart`、`ReachRings`、`YearBars`、`MetricMosaic`、`FramedStats` |
| [时间](templates/timeline.md) | 支持周期、合同期限、版本路线图、项目阶段；想让听众意识到“还剩多久”；软件版本、产品代际的支持期重叠 | `Timeline`、`ReleaseTrain` |
| [对比](templates/compare.md) | 版本升级、政策调整、改版前后；每行都是同一维度的旧值与新值；两个方案、两档套餐、两种用法 | `CompareTable`、`DuoCards`、`DoubleFunnel`、`CompareSlider`、`ParadigmCards`、`ScoreTable` |
| [要点](templates/key-points.md) | 3–4 个同等重要的特性、原则或发现；每个要点都能用一个关键词标签概括；讲默认设置、功能开关、可选项 | `NumberedColumns`、`ToggleCard` |
| [建议](templates/advice.md) | “谁该用 / 谁该等 / 谁不该”这类决策建议；选型结论、风险分级 | `VerdictColumns` |
| [操作](templates/steps.md) | 上线前检查、升级前准备、验收标准；每项都能给出一条具体命令或动作；必须按顺序执行的流程：升级、部署、入职 | `Checklist`、`StepTrack`、`Terminal`、`ServiceIndex`、`WindowStack`、`UiSteps` |
| [预告](templates/preview.md) | “接下来会发生什么”：下一版本、下一季度、路线图要点；章节过渡页；讲本期 / 下期、当前版本 / 下个版本 | `Teaser`、`GlowStack` |
| [收尾](templates/closing.md) | 整份演示的最后一页；演示最后一页，给出明确的下一步；销售、合作、招募的收尾 | `Closing`、`ContactPanel`、`Thanks`、`RepeatClosing`、`PixelClosing`、`CtaBlock`、`StepGrid` |
| [变化](templates/change.md) | 配置文件、代码片段从旧格式换成新格式；两段写法等价，想让听众逐行对照；发行版、依赖、平台升级时的一批版本号 | `CodeDiff`、`SpecSheet` |
| [现状](templates/status.md) | 架构、平台、职能、模块等一组对象的支持或就绪状态；想让听众一眼数出“几个好、几个有问题” | `StatusGrid` |
| [机制](templates/mechanism.md) | 阶段会循环往复：开发周期、增长飞轮、复盘闭环；想强调“最后一步会喂回第一步”；解释一个系统或机制：数据怎么流、请求怎么处理 | `Cycle`、`FlowDiagram`、`ArchLayers`、`RequestJourney`、`ShieldLayers`、`ServerRack` |
| [答疑](templates/qa.md) | 升级、上线、采购前常被问到的 4–6 个问题；每个问题都能用一两句话回答 | `Faq` |
| [规划](templates/roadmap.md) | 路线图：现在、下一步、之后；按状态归类：已移除、将移除、已弃用；季度或半年粒度的产品、市场、销售路线图 | `Lanes`、`Roadmap` |
| [趋势](templates/trend.md) | 4–12 个时间点的变化：版本、年份、季度、月份；要指出某个时间点发生了什么 | `LineChart` |
| [导航](templates/nav.md) | 15 页以上、分成几章的演示；想让听众先看到全貌，或者演讲中途要跳回某一章 | `Agenda` |
| [分隔](templates/divider.md) | 配合 Agenda，每章开头放一页；演讲需要停顿、换话题的地方；章节开头 | `SectionBreak`、`ChapterNumber` |
| [概念](templates/concept.md) | 给全场统一一个术语的定义；引用一句有分量的原话作为论点；几个维度共同决定一个结果 | `QuoteHero`、`Venn` |
| [辟谣](templates/myth.md) | 澄清行业里流传的误解；对一组主张逐条给出证据等级 | `ClaimCards` |
| [排查](templates/troubleshoot.md) | 任何一层出问题都会挡住后面的链路：网络、权限、发布流程；排查清单需要按顺序从上往下查 | `LayerStack` |
| [对照](templates/contrast.md) | “谁在哪一类里叫什么”：厂商 × 用途、平台 × 接口、版本 × 功能；格子里是短标识而不是句子 | `Matrix` |
| [并列](templates/parallel.md) | 6 或 8 个并列对象：平台、产品、角色、地区；每个对象一两句话就能说清；6 或 9 个并列的功能、集成、零件 | `IconGrid`、`TileWall`、`GradientCards`、`HairlineGrid`、`NoteCards`、`ArcCards`、`HaloRows`、`FanCarousel`、`TabSpec` |
| [证据](templates/evidence.md) | 一个数字本身就是论点：97%、9.34%、1/100；需要在一串文字页之间放一个视觉重音；实验或改动前后的变化：引用率、转化率、耗时 | `BigStat`、`DeltaBars`、`Dumbbell`、`KeySpec`、`CaseCard`、`CaseStudy`、`DeviceFrame`、`OutageBoard` |
| [方法](templates/method.md) | 讲抽样误差、置信区间、预测范围；说明“样本量要多大才够” | `RangeBars` |
| [计划](templates/plan.md) | 30–90 天的行动计划、试点排期；多条工作流互相重叠，需要看清先后 | `Gantt` |
| [背景](templates/background.md) | 政策、标准、发布等一串有日期的事件；想让听众看到“事情是怎么一步步来的”；4–7 个历史节点 | `Milestones`、`TraceTimeline` |
| [佐证](templates/proof.md) | 平台、监管机构、权威文档的原话；客户访谈里的原话（要能追溯到记录） | `QuoteWall` |
| [实证](templates/empirical.md) | 改版前后、优化前后；同一页面在两种条件下的样子：开关 JavaScript、桌面与移动、两个版本 | `BeforeAfter` |
| [讲解](templates/explain.md) | 介绍产品界面、网站结构、报表怎么读；要让听众看着真实界面找到具体位置；介绍一个对象或概念，图片帮助理解 | `Screenshot`、`PhotoSplit`、`MagazineSpread` |
| [诊断](templates/diagnose.md) | 注册、激活、付费这类逐级转化的流程；想说明“先修哪一级”，而不只是展示数字 | `Funnel` |
| [定位](templates/position.md) | 竞品定位、产品组合、优先级（影响 × 投入）；想让听众看到“哪块位置是空的” | `Quadrant` |
| [客户](templates/customer.md) | B2B 采购小组：决策者、使用者、把关者；要让市场、销售、产品对“卖给谁”达成一致 | `PersonaCards` |
| [定价](templates/pricing.md) | 产品分档与定价方案；想把大多数客户引到某一档 | `PricingTiers` |
| [衡量](templates/measure.md) | 周会、月报、复盘的核心指标；想表达“一个结果指标由几个输入指标推动” | `KpiBoard` |
| [分配](templates/allocation.md) | 预算、时间、渠道、流量的构成；几行之间比较构成怎么变化 | `ShareBar` |
| [拆解](templates/breakdown.md) | ARR、利润、预算、人数等从期初到期末的变化拆解；想说明“增长被什么吃掉了” | `Waterfall` |
| [分工](templates/division.md) | 项目启动会的团队介绍；上市小组、虚拟团队的角色分工；跨角色的流程、交接 | `Team`、`Swimlane` |
| [分析](templates/analysis.md) | 复盘或诊断：指标为什么变了；咨询式分析的第一页：先把问题拆成互不重叠的几块；根据条件选方案、选工具 | `IssueTree`、`DecisionTree`、`Fishbone` |
| [分布](templates/distribution.md) | 分批留存（签约月份 × 第几个月）；渠道 × 漏斗阶段的转化率、功能 × 客户群的使用率 | `Heatmap` |
| [节奏](templates/group-41.md) | 刚讲完一页数据，要把结论单独立住；章节中间需要一个停顿，让听众记住一句话；开场就抛出最关键的一个数字 | `Statement`、`NumberOpener`、`ChapterProgress`、`Question`、`Contrast`、`Recap`、`FullBleed`、`PillAgenda`、`RibbonSection`、`AgencyManifesto` |
| [产品](templates/group-42.md) | 介绍产品的 3–4 项能力，每项都有能画出来的数据；把几组小数据并排展示；演示搜索、分析、AI 助手能回答什么 | `PanelCards`、`AskAnswer`、`TabbedShot`、`BrandKit` |
| [论证](templates/group-43.md) | 说明一个自动化能力是怎么设定的，以及效果；一句主张配两个硬数字；可以引用出处的奖项、排名、认证 | `ProofSplit`、`Laurels`、`Balance` |
| [结构](templates/group-44.md) | 一页里要依次讲 3–5 个模块；模块各有一小块数据；生态、集成、技术栈、合作方 | `IndexStack`、`Orbit`、`Pyramid`、`Concentric`、`NodeGraph`、`AnatomyCard`、`StackBars` |
| [内容](templates/group-45.md) | 我们做什么、流程有哪几步；每项能用一个词说清；三句能逐字引用、有出处的原话 | `ServiceList`、`QuoteArc`、`WorkCards`、`WordBlocks`、`FolderCards`、`AgencyRows`、`NumberTiles`、`IndexList`、`PriorityColumns` |
| [开场 / 停顿](templates/group-46.md) | 封面、口号、规则宣讲；一句话里有一个关键词 | `PopPoster` |
| [说明](templates/group-47.md) | 介绍一个功能、一个文件、一条命令；有两个关键数字和 3–4 行键值 | `BentoSpotlight` |
| [安排](templates/group-48.md) | 评审、培训、答疑这类要约时间的安排；轻柔风格里放一个产品感的小界面 | `SlotPicker` |
| [引述](templates/group-49.md) | 引用一段录音、访谈或讲解；想让听众注意其中一句 | `TranscriptCard` |
| [分组](templates/group-50.md) | 按角色、阶段、场景分组的清单；现场点标签逐组讲 | `RetroTabs` |
| [回顾](templates/group-51.md) | 版本更新、阶段回顾；每一条一句话能说清 | `RetroLog` |
| [问答](templates/group-52.md) | 新手常见问题、用户提问；想让问答读起来像对话；3–6 个常见问题，想一条一条讲 | `ChatThread`、`FaqAccordion` |
| [停顿](templates/group-53.md) | 整份演示里最想让人记住的一句话；章节之间的停顿页 | `RevealStatement` |
| [开场 / 收尾](templates/group-54.md) | 产品主页式的开场，一句价值主张；结尾页放一条上手命令和仓库地址 | `HaloHero` |
| [展示](templates/group-55.md) | 展示两张真实截图或作品；想要一个有动感的过渡展示页；展示一组同主题的场景、物种、作品 | `HaloMarquee`、`PhotoMosaic`、`PolaroidWall` |
| [观点](templates/group-56.md) | 开场后的问题页、立场页；一句话里有 2–3 个能用图标表示的关键词；“靠的是 X / Y / Z”这类并列答案 | `PillSentence`、`RotatingWord` |
| [清单](templates/group-57.md) | 快捷键、命令、功能清单；常见问题里只需要展开回答一题 | `OpenList` |
| [时间线](templates/group-58.md) | 按时间或步骤排列的 3–5 个节点，每个都有一张图；回顾、历史、演变；有准确时刻的日程、任务时间线 | `FilmStrip`、`SplitFlap` |
| [列举](templates/group-59.md) | 3–4 个并列的地点、案例、发现，每个有图和一句话；想制造“一张接一张”的节奏 | `PhotoStack` |
| [揭晓](templates/group-60.md) | 破除误解：正面写常见说法，背面写事实；先抛问题让听众猜，再翻面揭晓；原文引用一封信、通知、公告 | `FlipCards`、`Envelope`、`ExplorerFlip` |
| [顺序](templates/group-61.md) | 3–4 个依次发生的阶段、年份；想让每一项“从一叠里抽出来” | `CardStack` |
| [路线](templates/group-62.md) | 路线、站点、版本这类有顺序的 3–6 项；每项一个大数字（年份、编号） | `DepthCarousel` |
| [叙事](templates/group-63.md) | 讲一本书、一份档案、一段史料；4–8 个数字按两两一组讲 | `FlipBook` |
| [人物](templates/group-64.md) | 介绍讲者本人；介绍一位历史人物或故事主角（不放真人照片） | `Lanyard` |
| [流程](templates/group-65.md) | 4–6 步的工艺、流程，每步一段说明；讲一步时希望其他步骤收起来；数据、订单、文档随时间在几个状态间移动 | `ProcessAccordion`、`LifecycleRail`、`MethodSteps` |
| [章节](templates/group-66.md) | 章节分隔页；想让分隔页有手作、笔记的感觉 | `NotebookCover` |
| [氛围](templates/group-67.md) | 想用图片营造质感，又不想让照片抢走注意力；装饰图和主题色要统一；章节开场、场景引入 | `Halftone`、`ProgressiveBlur`、`TextArc` |
| [过程](templates/group-68.md) | 分阶段讲一个过程，最后看到全貌；想让一张氛围图随讲解逐步出现 | `MaskReveal` |
| [信任](templates/group-69.md) | 列出参与方类型、合作网络；需要“很多方参与”的视觉感 | `LogoWall` |
| [结尾](templates/group-70.md) | 演讲最后一页，留一个画面；有明确的下一步行动；最后一页列出文档、社区、下载等去处 | `PhotoClosing`、`FooterClosing` |
| [引语](templates/group-71.md) | 电报、无线电、命令行里的原话；想让观众跟着一个字一个字读完的短句；一段演讲、誓词、歌词式的句子 | `Typewriter`、`KaraokeLines` |
| [转折](templates/group-72.md) | 前后对照的名句、口号；“从 A 到 B”的立场转变 | `MorphHeadline` |
| [解读](templates/group-73.md) | 一段话里有 2–4 个要讲的点；逐句解读一段原文或说明 | `MarkerSweep` |
| [事件](templates/group-74.md) | 宣布一个事件或结果；一个主消息加几条次要消息 | `NewsTicker` |
| [接口](templates/group-75.md) | 介绍一个 API 的几个核心操作；每个操作都有“请求 → 响应” | `VerbCards` |
| [数字](templates/group-76.md) | 解释耐久度、可用性这类“几个九”的指标；对比不同档位各有几个九 | `NinesDial` |
| [分级](templates/group-77.md) | 存储层级、服务档位、价格档这类有序分级；每档 2–3 个相同的参数 | `TierLadder` |
| [构成](templates/group-78.md) | 讲清楚账单由哪几部分组成；每项有明确的计量单位 | `MeterCards` |
| [场景](templates/scene.md) | 3–4 个用途、场景、案例，每个配一张图；想逐个讲但让观众看到全部 | `ShelfGallery` |
| [AI](templates/ai.md) | 讲分词、计费单位、上下文怎么被占用；想让观众看到“一句话 = 多少 token”；介绍 MoE 模型：专家总数、每 token 激活几个 | `TokenStream`、`MoeRouter`、`ContextWindow`、`ScoreMatrix`、`ModelSpecCard`、`TokenPriceGrid`、`AttentionMask`、`EffortDial`、`PeakClock`、`AliasRoute` |
| [技术](templates/tech.md) | 讲数据库查询计划、编译器语法树、调用树这类层级结构；想让观众从根往下一层层读；讲数据模型、外键约束、接口对象之间的引用 | `QueryPlan`、`SchemaEr`、`ResultGrid`、`CodeCallouts`、`RequestResponse`、`BeamFlow`、`TupleVersions`、`BTreeIndex`、`JsonTree`、`SessionSequence` |
| [展开](templates/expand.md) | 一个过程或一个主题有 3–5 个并列侧面，想一次只讲一个；每个侧面内容差不多多 | `TabPanels` |
| [选项](templates/options.md) | 产品的几个版本、套餐、发行版本，各有用途；想逐个讲“这一个适合谁” | `EditionPicker` |
| [关系](templates/relation.md) | 上游到下游、源头到成品这种单向链条；3–5 个环节，每个环节一两句话 | `PathCrumbs` |
| [分类](templates/classify.md) | 一组条目有交叉分类，想逐个说明“这一类有哪些”；条目多但每个只要一句话 | `FilterChips` |
| [动效](templates/motion.md) | 产品演示、案例：先让人认出画面，再看细节；一张图本身就是这一页的重点；把零散的事项理成有顺序的步骤 | `MediaExpand`、`ScatterOrder`、`TiltShot`、`ConvergeShots`、`StepVideo` |
| [拟真界面](templates/realistic-ui.md) | 工具、助手、客服类产品：展示一次典型的交互；比列功能更直观的场合；同一件东西在几个平台、几种出口里的样子 | `ChatDemo`、`AppCards` |
