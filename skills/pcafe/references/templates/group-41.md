# 节奏

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 10 个模板。返回索引：[../templates.md](../templates.md)。

### `Statement` 一句话（节奏 · 两段密集内容之间的停顿）
- 适合：刚讲完一页数据，要把结论单独立住；章节中间需要一个停顿，让听众记住一句话
- 不适合：一句话放不下：改用 QuoteHero 或 BigStat；连续两页都用它：停顿多了就不是停顿
- 上限：text ≤ 28 字；传数组手动断行，最多 2 行 × 14 字；marks 0–2 个，必须是 text 里原样出现的子串；sub ≤ 40 字；句子里的数字也要在 source 写出处；整份演示最多 3 页
- 参考：src/decks/gtm 的 `price-point` 页；docs/zh-CN/components.md#statement

### `NumberOpener` 大数字开场（节奏 · 用一个数字开一章）
- 适合：开场就抛出最关键的一个数字；章节第一页用一个数字定调
- 不适合：需要多个数字：用 BigStat 或 KpiBoard；数字没有出处
- 上限：value ≤ 5 个字符；unit ≤ 4 个字符；text ≤ 2 行 × 14 字；sub ≤ 40 字；source 必填
- 参考：src/decks/launch 的 `count` 页；docs/zh-CN/components.md#number-opener

### `ChapterProgress` 章节进度（节奏 · 章节第一页，告诉听众讲到哪了）
- 适合：分章的长演示，每章第一页；听众需要知道还剩多少
- 不适合：只有一章；想要配图标和大卡片的章节页：用 SectionBreak
- 上限：chapters 3–6 个，每个 ≤ 8 字；current 从 0 开始；title ≤ 2 行 × 10 字；lead ≤ 50 字
- 参考：src/decks/launch 的 `ch2` 页；docs/zh-CN/components.md#chapter-progress

### `Question` 问题页（节奏 · 用一个问题引出下一段）
- 适合：下一章要回答一个问题；把听众的疑问先说出来
- 不适合：问题本身就有答案：直接用 Statement；连续使用
- 上限：question ≤ 2 行 × 12 字，以问号结尾；sub ≤ 36 字
- 参考：src/decks/launch 的 `why` 页；docs/zh-CN/components.md#question

### `Contrast` 双句对照（节奏 · 过去 / 现在、误解 / 事实）
- 适合：一句话说清楚改变了什么；纠正一个常见误解
- 不适合：两边各有多条：用 VerdictColumns；需要数据对比：用 Dumbbell
- 上限：label ≤ 6 字；text ≤ 20 字；sub ≤ 40 字
- 参考：src/decks/launch 的 `contrast` 页；docs/zh-CN/components.md#contrast

### `Recap` 章节小结（节奏 · 一章结束时回顾要点）
- 适合：一章讲完，留下要记住的几点；长演示中途帮听众整理
- 不适合：只有一点：用 Statement；要点之间有先后：用 StepTrack
- 上限：points 3–4 条：title ≤ 12 字，body ≤ 36 字；next.label ≤ 6 字，next.title ≤ 14 字
- 参考：src/decks/launch 的 `recap` 页；docs/zh-CN/components.md#recap

### `FullBleed` 整页图片（节奏 · 一张图占满整页）
- 适合：一张图就能说明问题；章节之间的视觉停顿
- 不适合：图片不是真实截图或照片；需要标注图上的细节：用 Screenshot
- 上限：src 是真实截图或照片，16:9 或更宽；title ≤ 2 行 × 12 字；caption ≤ 36 字；source 写图片出处；必须设 tone: "dark"
- 参考：src/decks/studio 的 `bleed` 页；docs/zh-CN/components.md#full-bleed

### `PillAgenda` 胶囊目录章节页（节奏 · 每章开头）
- 适合：等宽黑风格的章节页；让听众知道一共几章、讲到哪里
- 不适合：少于 3 章；其他风格：用 ChapterProgress 或 SectionBreak
- 上限：chapters 3–6 个，各 ≤ 8 字；title ≤ 2 行 × 10 字；lead ≤ 60 字
- 参考：src/decks/mono 的 `ch1` 页；docs/zh-CN/components.md#pill-agenda

### `RibbonSection` 彩带章节页（节奏 · 每章第一页）
- 适合：分章的演示，每章开头；彩带风格里替代 SectionBreak
- 不适合：不分章的短演示；需要深色页：用 SectionBreak
- 上限：title 一行 ≤ 8 字；lead ≤ 44 字；contents 2–4 项，每项 ≤ 12 字；没有 source：章节页不陈述事实
- 参考：src/decks/ribbon 的 `ch1` 页；docs/zh-CN/components.md#ribbon-section

### `AgencyManifesto` 观点大段落（节奏 · 一段观点）
- 适合：讲问题或立场，一句话说不完；两段密集内容之间的停顿
- 不适合：只有一句短话：用 Statement；有出处的引语：用 QuoteHero
- 上限：text ≤ 64 字；label ≤ 8 字；marks 0–2 个，必须是 text 里原样出现的子串
- 参考：src/decks/home-northbound 的 `problem` 页；docs/zh-CN/components.md#agency-manifesto
