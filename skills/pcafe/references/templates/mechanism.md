# 机制

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 7 个模板。返回索引：[../templates.md](../templates.md)。

### `Cycle` 循环图（机制 · 首尾相接的阶段）
- 适合：阶段会循环往复：开发周期、增长飞轮、复盘闭环；想强调“最后一步会喂回第一步”
- 不适合：阶段只走一遍、不回到起点：用 FlowDiagram 或 StepTrack；阶段超过 6 个：合并相近阶段
- 上限：nodes 3–6 个，从顶部开始顺时针；title ≤ 8 个字符（显示在环旁）；body ≤ 36 字；tag ≤ 14 个字符；hub.value ≤ 6 个字符；hub.caption ≤ 12 字；focus 最多 1 个
- 参考：src/decks/release 的 `cycle` 页；docs/zh-CN/components.md#cycle；交互：阶段依次弹出，强调色小点沿环持续转动；悬停阶段时图标格轻转。

### `FlowDiagram` 流程机制（机制 · 讲清“它是怎么运转的”）
- 适合：解释一个系统或机制：数据怎么流、请求怎么处理；一个过程里有一步是听众能影响的，用 focus 和 band 指出来
- 不适合：听众要照着操作的步骤：用 StepTrack；有分支或循环的流程：拆成两页或画专门的图
- 上限：nodes 3–5 个；title ≤ 8 字；body ≤ 30 字；parts 每个环节最多 3 个，每个 ≤ 12 字；focus 最多标 1 个环节；band.items 3–4 项：title ≤ 6 字，body ≤ 14 字；label ≤ 10 字；示意图要在 lead 或 source 里写明“简化示意”
- 参考：src/decks/geo 的 `answer` 页；docs/zh-CN/components.md#flow-diagram；交互：箭头先生长再持续流动；焦点环节使用强调色光环。

### `ArchLayers` 架构分层图（机制 · 系统由哪几层组成）
- 适合：软件架构、组织层级、技术栈；每层有 2–5 个组成部分
- 不适合：层与层之间是包含关系：用 Concentric；要讲数据怎么流动：用 FlowDiagram
- 上限：layers 3–5 层：name ≤ 8 字，tag ≤ 16 字符，items 2–5 个各 ≤ 10 字符
- 参考：src/decks/wallpaper 的 `layers` 页；docs/zh-CN/components.md#arch-layers

### `RequestJourney` 请求路径（机制 · 一次请求经过哪里）
- 适合：请求、数据或订单依次经过几层；讲解系统的处理顺序
- 不适合：有分支或回路：用 FlowDiagram；超过 6 站：拆页或用 StepTrack
- 上限：hops 3–6 站：name ≤ 6 字，note ≤ 30 字，tag ≤ 10 个字符；图标只用 icon-set 里的名称，同一页不要重复
- 参考：src/decks/v3-p3 的 `journey` 页；docs/zh-CN/components.md#request-journey；交互：每按一次 → 数据包前进一站，线路随之点亮

### `ShieldLayers` 防护层（机制 · 纵深防御）
- 适合：安全、过滤、审核类的多层机制；强调“外层先拦，里层兜底”的顺序
- 不适合：层之间没有内外顺序：用 LayerStack；要讲每层的细节步骤：用 RequestJourney
- 上限：layers 2–5 层（外层在前）：name ≤ 10 字，note ≤ 34 字，tag ≤ 10 个字符；core ≤ 4 字
- 参考：src/decks/v3-p3 的 `shield` 页；docs/zh-CN/components.md#shield-layers；交互：每按一次 → 点亮一道环和对应说明

### `ServerRack` 服务器机柜（机制 · 跑在哪里）
- 适合：说明同一台机器或节点上运行哪些服务；基础设施、部署架构的直观示意
- 不适合：要讲层级关系：用 ArchLayers；要讲服务之间的调用：用 FlowDiagram
- 上限：units 4–8 个：name ≤ 10 字，tag ≤ 12 个字符；points 1–3 条，每条 ≤ 36 字；label ≤ 12 个字符
- 参考：src/decks/v3-p3 的 `rack` 页；docs/zh-CN/components.md#server-rack；交互：每按一次 → 一个机位通电

### `EmberAgent` 暗场代理执行（机制 · 代理一步步完成任务）
- 适合：讲清楚 AI 代理具体怎么干活；演示一次完整的委托：从一句话到交付
- 不适合：步骤超过 6 个：用时间线类模板；没有可展示的产出：用 SlateSteps
- 上限：title 2 行 × ≤ 10 字；task ≤ 40 字；steps 3–6 个：label ≤ 10 字，detail ≤ 24 字，tool ≤ 6 字；result.title ≤ 16 字；result.lines 3–6 条 × ≤ 26 字；pace 每步毫秒数，默认 1400
- 参考：src/decks/sig-ember 的 `agent` 页；docs/zh-CN/components.md#ember-agent；交互：步骤自动依次完成，进度轨点亮；草稿逐行变清楚；“再跑一次”重新播放
