# 技术

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 10 个模板。返回索引：[../templates.md](../templates.md)。

### `QueryPlan` 执行计划树（技术 · 解释一条查询怎么执行）
- 适合：讲数据库查询计划、编译器语法树、调用树这类层级结构；想让观众从根往下一层层读
- 不适合：节点超过 7 个或超过 4 层：拆页或改用 IssueTree；节点之间不是父子关系：用 NodeGraph
- 上限：sql 1–3 行，每行 ≤ 56 个字符；plan ≤ 4 层、≤ 7 个节点、≤ 3 个叶子；op ≤ 18 个字符；detail ≤ 24 个字符；meta ≤ 16 个字符；note ≤ 50 字
- 参考：src/decks/v3-p2 的 `plan` 页；docs/zh-CN/components.md#query-plan；交互：SlideDef.build = 'reveal' 时每按一次 → 展开下一层

### `SchemaEr` 表结构关系图（技术 · 数据模型）
- 适合：讲数据模型、外键约束、接口对象之间的引用；表和列都不多，能一屏放下
- 不适合：超过 4 张表或每张超过 6 列：只画关键表；关系跨越不相邻的表：调整顺序或拆页
- 上限：tables 2–4 张；name ≤ 14 个字符；cols 2–6 列，name ≤ 14 个字符，type ≤ 12 个字符；drop 0–3；links ≤ 4 条，只连相邻的表；label ≤ 6 个字符；note ≤ 50 字
- 参考：src/decks/v3-p2 的 `schema` 页；docs/zh-CN/components.md#schema-er；交互：build 模式下每按一次 → 出现下一张表和连向它的线

### `ResultGrid` 查询与结果（技术 · 数据 · 一条查询和它返回的表）
- 适合：用一条查询带出一小张事实表；演示 SQL、API 查询返回什么
- 不适合：结果超过 7 行或 5 列：只留关键行；没有查询，只有表：用 CompareTable 或 SpecSheet
- 上限：sql 2–6 行，每行 ≤ 40 个字符；columns 2–5 列，每个 ≤ 14 个字符；rows 3–7 行，每格 ≤ 14 个字符；status ≤ 24 个字符；note ≤ 60 字
- 参考：src/decks/v3-p2 的 `support` 页；docs/zh-CN/components.md#result-grid；交互：结果表是一个 build 步骤

### `CodeCallouts` 代码批注（技术 · 逐行讲一段代码）
- 适合：讲一段配置、SQL、脚本里的关键几行；每条说明对应明确的行
- 不适合：要对比改动：用 CodeDiff；要演示命令和输出：用 Terminal
- 上限：code 4–12 行，每行 ≤ 52 个字符；file ≤ 20 个字符；notes 2–4 条：title ≤ 10 字，body ≤ 40 字
- 参考：src/decks/v3-p2 的 `postgis` 页；docs/zh-CN/components.md#code-callouts；交互：build 模式下每按一次 → 点亮下一条说明和它对应的行；未讲到的行仍可读

### `RequestResponse` 请求与响应（技术 · 一次往返）
- 适合：讲一次 API 调用、SQL 语句和返回、协议往返；请求和响应都能用几行文本表示
- 不适合：有多次往返或多方参与：用 SessionSequence；只有命令和输出、没有“两端”之分：用 Terminal
- 上限：label ≤ 10 字；file ≤ 20 个字符；lines 2–9 行，每行 ≤ 36 个字符；via ≤ 8 字；note ≤ 50 字
- 参考：src/decks/v3-p2 的 `returning` 页；docs/zh-CN/components.md#request-response；交互：箭头和响应是一个 build 步骤；光点动画在减少动态效果和打印时关闭

### `BeamFlow` 光束流向图（技术 · 架构 · 多进一出）
- 适合：讲一个枢纽连接多个来源和去处：网关、数据库进程、消息总线；方向比层级更重要
- 不适合：有分层关系：用 ArchLayers；有先后步骤：用 FlowDiagram；节点间是任意网状关系：用 NodeGraph
- 上限：inputs、outputs 各 2–4 个；label ≤ 10 字或 ≤ 18 个字符；sub ≤ 14 字；hub 同上；heads 每项 ≤ 8 字
- 参考：src/decks/v3-p2 的 `process` 页；docs/zh-CN/components.md#beam-flow；交互：build 模式下依次出现：输入列、枢纽、输出列；光点动画在减少动态效果和打印时关闭

### `TupleVersions` 版本时间线（技术 · 并发 · 一行数据的多个版本）
- 适合：讲 MVCC、多版本、快照隔离；讲任何“同一对象在不同时段有不同值”的有效期
- 不适合：版本超过 4 个；时间是真实日期且需要刻度精确：用 Gantt
- 上限：versions 2–4 个；value ≤ 20 个字符；snapshots 0–2 个；label ≤ 10 字；range 两个整数；axis ≤ 12 字
- 参考：src/decks/v3-p2 的 `mvcc` 页；docs/zh-CN/components.md#tuple-versions；交互：build 模式下每按一次 → 出现一个版本，最后出现快照

### `BTreeIndex` B 树查找（技术 · 索引 · 查找路径）
- 适合：讲 B-tree、跳表、分层目录这类逐层缩小范围的查找；要讲清“为什么快”
- 不适合：超过 3 层或每层超过 4 页；不是查找过程，只是层级：用 Pyramid 或 IssueTree
- 上限：levels 2–3 层；每层 ≤ 4 页；每页 1–4 个键，每个 ≤ 5 个字符；target ≤ 8 个字符；notes 每层一句，≤ 30 字；leafNote ≤ 24 字
- 参考：src/decks/v3-p2 的 `btree` 页；docs/zh-CN/components.md#btree-index；交互：build 模式下每按一次 → 往下走一层

### `JsonTree` 文档与路径（技术 · 数据 · 文档查询）
- 适合：讲 JSON、YAML 配置的取值方式；讲 JSONB 运算符、JSONPath、jq 之类的路径语法
- 不适合：文档超过 13 行：只保留相关部分；要比较两份文档：用 CodeDiff
- 上限：doc 6–13 行；depth 0–4；text ≤ 34 个字符；queries 2–4 条：expr ≤ 40 个字符，result ≤ 24 个字符，note ≤ 20 字；file ≤ 20 个字符
- 参考：src/decks/v3-p2 的 `jsonb` 页；docs/zh-CN/components.md#json-tree；交互：build 模式下每按一次 → 下一条查询出现，并点亮它取到的行

### `SessionSequence` 会话时序图（技术 · 并发 · 谁先谁后）
- 适合：讲事务隔离、锁等待、竞态；讲两三方之间的调用先后
- 不适合：事件超过 7 个；只有一方：用 StepTrack 或 Timeline；要讲跨部门流程：用 Swimlane
- 上限：lanes 2–3 个，每个 ≤ 10 字；events 3–7 个：text ≤ 30 个字符，note ≤ 12 字；axis ≤ 4 字
- 参考：src/decks/v3-p2 的 `isolation` 页；docs/zh-CN/components.md#session-sequence；交互：build 模式下每按一次 → 出现下一个事件
