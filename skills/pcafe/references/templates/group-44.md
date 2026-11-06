# 结构

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 7 个模板。返回索引：[../templates.md](../templates.md)。

### `IndexStack` 目录叠卡（结构 · 一页讲 3–5 件事，一次看一件）
- 适合：一页里要依次讲 3–5 个模块；模块各有一小块数据
- 不适合：模块之间要并排比较：用 PanelCards；超过 5 项
- 上限：items 3–5 项；label ≤ 8 字，title ≤ 10 字，body ≤ 40 字；每项的 ui 和 PanelCards 相同；建议在 SlideDef 上设 build: "focus"
- 参考：src/decks/launch 的 `stack` 页；docs/zh-CN/components.md#index-stack；交互：按 → 把下一张卡翻到最前；跳页进入时全部叠好

### `Orbit` 轨道图（结构 · 一个核心和围绕它的东西）
- 适合：生态、集成、技术栈、合作方；说明“这些都连到同一个东西上”
- 不适合：节点之间有先后或依赖：用 FlowDiagram；超过 8 个节点
- 上限：nodes 4–8 个，label ≤ 6 字；points 0–3 条，每条 ≤ 22 字；center.label ≤ 8 个字符
- 参考：src/decks/launch 的 `orbit` 页；docs/zh-CN/components.md#orbit

### `Pyramid` 金字塔（结构 · 层层依赖的条件）
- 适合：前提条件、层级、需求层次；下层是上层的基础
- 不适合：各层没有依赖关系：用 LayerStack；要表达数量递减：用 Funnel
- 上限：levels 3–5 层：label ≤ 8 字，note ≤ 30 字；title ≤ 2 行 × 8 字
- 参考：src/decks/toy3d 的 `ship` 页；docs/zh-CN/components.md#pyramid

### `Concentric` 同心圆（结构 · 从核心到外围）
- 适合：核心与外围、影响范围、目录分层；每一圈包住里面一圈
- 不适合：各层是上下堆叠关系：用 ArchLayers；一个核心加若干平级的卫星：用 Orbit
- 上限：rings 3–4 圈：label ≤ 6 字，note ≤ 30 字
- 参考：src/decks/toy3d 的 `rings` 页；docs/zh-CN/components.md#concentric

### `NodeGraph` 节点关系图（结构 · 谁和谁相连）
- 适合：4–10 个对象之间的关系：依赖、流向、合作；讲一个系统由哪些部分组成、怎么互相影响
- 不适合：有先后步骤：用 FlowDiagram；有数量流动：用 Sankey
- 上限：nodes 4–10 个：label ≤ 6 字，sub ≤ 10 字；edges ≤ 14 条，label ≤ 6 字；note ≤ 60 字；默认第一个节点居中；所有节点都给 x/y（0–100）时按手动位置
- 参考：src/decks/v2-p4 的 `graph` 页；docs/zh-CN/components.md#node-graph

### `AnatomyCard` 解剖卡（结构 · 一个东西由几部分组成）
- 适合：拆解一个对象、请求、报文、记录的组成；每一部分都有一个具体的示例值
- 不适合：部分之间是上下层依赖：用 LayerStack 或 ArchLayers；没有示例值：用 NumberedColumns
- 上限：label ≤ 24 个拉丁字符；parts 2–4 条；name ≤ 8 字；sample ≤ 3 行 × 36 个拉丁字符；note ≤ 40 字；weight 1–3
- 参考：src/decks/v3-p5 的 `anatomy` 页；docs/zh-CN/components.md#anatomy-card；交互：build: reveal 时每步点亮一条；完整状态全部点亮

### `StackBars` 阶梯层级（结构 · 一层层错开的横条）
- 适合：分层结构：技术栈、组织层级、优先级；上层依赖下层的关系
- 不适合：层与层之间有数量关系：用 Funnel 或 Pyramid；每层要详细说明：用 LayerStack
- 上限：layers 3–6 层，从上到下；name ≤ 8 字；note ≤ 20 字；页标题 ≤ 22 字
- 参考：src/decks/sig-broadside 的 `stack` 页；docs/zh-CN/components.md#stack-bars；交互：按 → 逐层出现
