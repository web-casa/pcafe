# 操作

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 6 个模板。返回索引：[../templates.md](../templates.md)。

### `Checklist` 可勾选清单（操作 · 准备工作）
- 适合：上线前检查、升级前准备、验收标准；每项都能给出一条具体命令或动作
- 不适合：项之间有严格顺序：用 StepTrack；只是罗列特性：用 NumberedColumns
- 上限：items 6 或 8 项（两列等高）；4 项时页面下半会空；title ≤ 18 字；cmd ≤ 56 个字符；每项都尽量给出 cmd，没有 cmd 的项会比相邻项矮；note ≤ 30 字
- 参考：src/decks/release 的 `prepare` 页；docs/zh-CN/components.md#checklist；交互：点击条目勾选，对勾以描边动画画出；勾选不会触发翻页（Space 在按钮上被保留）。

### `StepTrack` 步骤轨道（操作 · 有序流程）
- 适合：必须按顺序执行的流程：升级、部署、入职；每步都有明确的动作
- 不适合：步骤无先后：用 NumberedColumns；超过 5 步：合并步骤或拆页
- 上限：steps 3–5 步；title ≤ 8 字；body ≤ 40 字（两行内）；cmd ≤ 30 个字符；after.cmds 2–5 条
- 参考：src/decks/release 的 `steps` 页；docs/zh-CN/components.md#step-track；交互：轨道从左向右画出，节点依次出现，轨道止于最后一个节点。

### `Terminal` 终端会话（操作 · 要敲的几条命令）
- 适合：3–4 条互相独立、但都要在终端里敲的命令；想让听众看到“到底敲什么”，并知道每条为什么要敲
- 不适合：命令有先后依赖、构成一个流程：用 StepTrack；需要逐项勾选确认：用 Checklist；没有真实命令：不要编造输出
- 上限：steps 3–4 条；cmd ≤ 44 个字符，只写 ASCII（中文会让打字动画错位）；out 0–3 行，每行 ≤ 48 个字符；只写文档里出现过的输出或注释（# 开头），不要编造；note ≤ 34 字；window ≤ 24 个字符，例如 root@aurora: ~
- 参考：src/decks/release 的 `habits` 页；docs/zh-CN/components.md#terminal；交互：命令按顺序逐字打出，输出随后淡入，最后一行光标闪烁。悬停右侧注释时编号变为强调色。

### `ServiceIndex` 大编号服务栏（操作 · 3–4 个步骤或服务）
- 适合：3–4 个步骤、服务或方法；每项需要一两句说明
- 不适合：步骤之间有明确的先后箭头：用 StepTrack；超过 4 项
- 上限：items 3–4 个：title ≤ 10 字，text ≤ 44 字；title ≤ 1 行 × 14 字
- 参考：src/decks/toy3d 的 `steps` 页；docs/zh-CN/components.md#service-index

### `WindowStack` 层叠窗口（操作 · 2–3 个步骤）
- 适合：2–3 个步骤，每步对应一个文件或工具；桌面风格的演示
- 不适合：步骤超过 3 个：用 StepTrack
- 上限：windows 2–3 个：title ≤ 16 字符，heading ≤ 14 字，lines 1–3 行各 ≤ 26 字
- 参考：src/decks/wallpaper 的 `windows` 页；docs/zh-CN/components.md#window-stack

### `UiSteps` 小界面步骤卡（操作 · 三步上手）
- 适合：上手、设置、新建这类三步流程；每一步都能画成一个简单的界面动作
- 不适合：步骤带命令且超过 3 步：用 StepTrack；步骤没有先后：用 NumberedColumns
- 上限：steps 正好 3 步：title ≤ 8 字，text ≤ 36 字；ui: field（label ≤ 10 字，value ≤ 24 字符）/ options（2–4 个，各 ≤ 8 字符）/ done（≤ 14 字）
- 参考：src/decks/soft-saas 的 `steps` 页；docs/zh-CN/components.md#ui-steps
