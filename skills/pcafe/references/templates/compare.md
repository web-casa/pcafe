# 对比

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 6 个模板。返回索引：[../templates.md](../templates.md)。

### `CompareTable` 前后对比表（对比 · 旧 → 新）
- 适合：版本升级、政策调整、改版前后；每行都是同一维度的旧值与新值
- 不适合：只有 1–2 处变化：写进 NumberedColumns；需要三方以上比较：拆页或自定义；单元格需要换行解释
- 上限：rows 4–7 行；少于 4 行时下方会空；每个单元格必须一行放下：item ≤ 12 字，值 ≤ 22 字；命令、文件名设 mono: true
- 参考：src/decks/release 的 `compare` 页；docs/zh-CN/components.md#compare-table

### `DuoCards` 双色方案卡（对比 · 两个方案或两种用法）
- 适合：两个方案、两档套餐、两种用法；每项有一个代表数字
- 不适合：三档：用 PricingTiers；要逐行对比属性：用 CompareTable
- 上限：cards 正好 2 张：name ≤ 8 字，value ≤ 6 字符，note ≤ 24 字，items 3–5 条各 ≤ 16 字
- 参考：src/decks/toy3d 的 `outputs` 页；docs/zh-CN/components.md#duo-cards

### `DoubleFunnel` 双漏斗对比（对比 · 两组对象经过同样的阶段）
- 适合：两个群体、两个版本的转化对比；3–5 个相同的阶段
- 不适合：只有一组：用 Funnel；阶段不同：分两页
- 上限：stages 3–5 个各 ≤ 8 字；values 与 stages 一一对应、逐级不增；name ≤ 8 字
- 参考：src/decks/wallpaper 的 `funnel` 页；docs/zh-CN/components.md#double-funnel

### `CompareSlider` 前后对比滑块（对比 · 同一画面的前后变化）
- 适合：改版前后、治理前后、季节变化等同机位对比；想让观众“拉开帘子”看变化
- 不适合：两张图构图不同：用 BeforeAfter 或 DuoCards；要比较数字：用图表
- 上限：title ≤ 1 行 × 16 字；lead ≤ 40 字；before.label / after.label ≤ 8 字；stops 1–3 步：at 为 0–100，note ≤ 24 字；两张图尺寸和构图必须一致；生成图要在 note 或 credit 里写明“示意”
- 参考：src/decks/v2-p1 的 `compare` 页；docs/zh-CN/components.md#compare-slider；交互：build：分割线逐步滑动，说明逐条点亮

### `ParadigmCards` 模型对照卡（对比 · 2–3 种做法的结构）
- 适合：比较 2–3 种组织数据或做事的模型；每种模型用同样的几个维度描述
- 不适合：维度超过 4 个或要打分：用 CompareTable；结构示意和内容无关：用 PanelCards
- 上限：cards 2–3 张；name ≤ 8 字；tagline ≤ 16 字；rows 2–4 行：label ≤ 4 字，value ≤ 16 字；各卡的 label 顺序一致；shape 只能是 tree / blocks / flat
- 参考：src/decks/v3-p5 的 `models` 页；docs/zh-CN/components.md#paradigm-cards；交互：build: reveal 时每步出现一张卡

### `ScoreTable` 评分表（对比 · 黑表头，每格一个彩色标签）
- 适合：几个方案按同一组标准打分；结论能写成两三个字
- 不适合：格子里要写一句话：用 CompareTable；只比较两项：用 Contrast
- 上限：columns 2–4 个，每个 ≤ 10 字；rows 3–5 行，label ≤ 8 字；每格 text ≤ 8 个字符；页标题 ≤ 22 字
- 参考：src/decks/sig-stencil 的 `score` 页；docs/zh-CN/components.md#score-table；交互：按 → 逐行出现
