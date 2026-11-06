# 开场

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 20 个模板。返回索引：[../templates.md](../templates.md)。

### `Cover` 封面（开场 · 第 1 页）
- 适合：整份演示的第一页；主题能浓缩成一个数字或短代号：版本号、年份、季度、排名
- 不适合：主题没有能代表它的数字：此时用 numeral 放首字母或年份后两位，而不是硬凑；章节分隔页：分隔页用 Teaser 更克制
- 上限：numeral 1–4 个字符；3–4 个字符时字号自动缩小；title 1–2 行，每行 ≤ 12 个字符；subtitle ≤ 10 个字符，并且比 numeral 窄，否则会贴近大数字；facts 2–4 项，每个 value ≤ 10 个字符；note ≤ 2 行；没有 source 字段：封面上的事实必须在后面某页出现并带出处
- 参考：src/decks/release 的 `cover` 页；docs/zh-CN/components.md#cover；交互：鼠标移动时数字轻微跟随；数字逐位从遮罩中升起。

### `HangingCover` 悬挂图标封面（开场 · 产品发布第 1 页）
- 适合：产品、平台、工具的发布或介绍；想要轻松、干净、有产品感的开场
- 不适合：严肃的研究或政策汇报：用 Cover；没有合适的图标：图标只是装饰，不要硬凑
- 上限：title ≤ 2 行 × 12 字；mark 必须是 title 里原样出现的子串；lead ≤ 50 字；icons 4–8 个，只用 icon-set 里的名称；pills 1–3 个，写事实（页数、日期），不要假按钮
- 参考：src/decks/launch 的 `cover` 页；docs/zh-CN/components.md#hanging-cover

### `HeroPanel` 深色主卡封面（开场 · 工具或平台发布）
- 适合：软件、平台、设计系统发布；有一张能代表产品的真实截图
- 不适合：没有真实截图：用 HangingCover；奖章内容无法引用出处：去掉 laurels
- 上限：title ≤ 2 行 × 10 字；lead ≤ 40 字；pills 1–2 个；src 必须是真实截图；laurels 0–3 个：title ≤ 10 字，sub ≤ 14 字，要有出处
- 参考：src/decks/studio 的 `cover` 页；docs/zh-CN/components.md#hero-panel

### `SplitWord` 大字穿插封面（开场 · 创意或品牌提案）
- 适合：创意、品牌、作品集类提案的封面；有 2–3 张能代表内容的真实截图
- 不适合：正式汇报：用 Cover；标题超过两个词：用 HangingCover
- 上限：words 2 个，各 ≤ 6 字或 10 个西文字母；cards 2–3 张：label ≤ 8 字；src 必须是真实截图；lead ≤ 30 字
- 参考：src/decks/mono 的 `cover` 页；docs/zh-CN/components.md#split-word

### `StickerCover` 贴纸封面（开场 · 轻松的分享或个人介绍）
- 适合：团队分享、个人介绍、内部轻松场合；有一张产品或作品的真实截图
- 不适合：正式汇报：用 Cover；没有截图时可去掉 shot，标题会占满
- 上限：title ≤ 2 行 × 8 字；lead ≤ 50 字；stickers 2–4 个，各 ≤ 8 字；note ≤ 12 字；pills 1–2 个
- 参考：src/decks/sticker 的 `cover` 页；docs/zh-CN/components.md#sticker-cover

### `FloatCover` 漂浮几何封面（开场 · 品牌或发布会第 1 页）
- 适合：发布会、品牌介绍的封面；有一个能代表这次主题的数字
- 不适合：正式汇报：用 Cover；没有合适的数字：用 HangingCover
- 上限：title ≤ 2 行 × 7 字；lead ≤ 40 字；card.value ≤ 8 字符，card.note ≤ 24 字；marquee ≤ 10 字符，只重复页面上已有的词
- 参考：src/decks/toy3d 的 `cover` 页；docs/zh-CN/components.md#float-cover

### `Desktop` 桌面封面（开场 · 轻松的产品演示）
- 适合：产品演示、个人分享的封面或目录；桌面风格的演示
- 不适合：正式汇报：用 Cover
- 上限：title ≤ 2 行 × 6 字；lead ≤ 40 字；apps 4–8 个，label ≤ 4 字；dock 4–7 个；clock.time ≤ 5 字符
- 参考：src/decks/wallpaper 的 `desktop` 页；docs/zh-CN/components.md#desktop

### `KeyReveal` 渐变标题揭幕（开场 · 发布会第 1 页或一句话揭幕）
- 适合：发布会开场、新版本揭幕；一句话就是主题
- 不适合：需要解释细节：用 Cover；句子超过 16 字：用 Statement
- 上限：title ≤ 2 行 × 8 字；marks 0–2 个，必须是 title 里的子串；sub ≤ 36 字；facts 0–3 个：value ≤ 6 字符，label ≤ 10 字
- 参考：src/decks/keynote 的 `reveal` 页；docs/zh-CN/components.md#key-reveal

### `OrbCover` 渐变光球封面（开场 · 创意或品牌第 1 页）
- 适合：品牌、创意、功能发布的封面；有 2–3 个代表数字
- 不适合：正式汇报：用 Cover；只有一个数字：用 FloatCover
- 上限：title ≤ 3 行 × 6 字；lead ≤ 48 字；chips 2–3 个：value ≤ 6 字符，label ≤ 10 字
- 参考：src/decks/gradient 的 `cover` 页；docs/zh-CN/components.md#orb-cover

### `FloatHero` 浮动标签封面（开场 · 产品或功能第 1 页）
- 适合：AI、语音、工具类产品的开场；有 4–6 个能用一个词说清的功能
- 不适合：正式汇报：用 Cover；功能需要解释：用 IconGrid
- 上限：title ≤ 2 行 × 12 字，lead ≤ 48 字；chips 4–6 个，label ≤ 10 字符；card.label ≤ 12 字符，card.text ≤ 22 字
- 参考：src/decks/float-ui 的 `hero` 页；docs/zh-CN/components.md#float-hero

### `RibbonCover` 彩带封面（开场 · 活动、培训第 1 页）
- 适合：培训、活动、对外介绍的封面；想要热闹友好的开场
- 不适合：正式汇报：用 Cover；要放数字：用 FloatCover
- 上限：title ≤ 2 行 × 8 字；lead ≤ 40 字；band、band2 ≤ 12 个字符，只重复页面上已有的词
- 参考：src/decks/ribbon 的 `cover` 页；docs/zh-CN/components.md#ribbon-cover

### `SketchCover` 画板封面（开场 · 产品主页或作品集第 1 页）
- 适合：产品主页、工具介绍、个人作品集的开场；有一行能“写在画板上”的命令或口号
- 不适合：正式汇报：用 Cover；标题没有一个能单独压进标签的词：用 HangingCover
- 上限：pre ≤ 6 字，tag ≤ 4 字，line ≤ 12 字；lead ≤ 48 字；canvas ≤ 30 个字符，一行；chips 3–5 个，各 ≤ 8 字；有事实时写 source
- 参考：src/decks/home-nuance 的 `cover` 页；docs/zh-CN/components.md#sketch-cover

### `AgencyHero` 增长官网首屏（开场 · 产品或方案第 1 页）
- 适合：产品官网式的开场；营销方案、增长提案的封面
- 不适合：正式汇报：用 Cover；要放大数字：用 NumberOpener
- 上限：lines 2–3 行，每行 ≤ 7 字（或 12 个字母），最多 2 行带 icon；badge ≤ 24 字；tag ≤ 16 字；lead ≤ 64 字；actions 1–2 个，每个 ≤ 10 个字符；names 0–6 个，只写文字；namesLabel ≤ 16 字
- 参考：src/decks/home-northbound 的 `hero` 页；docs/zh-CN/components.md#agency-hero

### `FanCover` 扇形截图封面（开场 · 产品官网式第 1 页）
- 适合：产品、工具、开源项目的封面；有 3–5 张真实截图可以展示
- 不适合：没有真实截图：用 OrbCover 或 Cover；正式汇报：用 Cover
- 上限：badge.text ≤ 20 字，icons 1–3 个；title 1–2 行 × 12 字；lead ≤ 40 字；actions 1–2 个，每个 ≤ 28 个字符；cards 3–5 张真实截图，宽高比约 16:10；配 tone: accent 使用
- 参考：src/decks/home-cobalt 的 `cover` 页；docs/zh-CN/components.md#fan-cover

### `PhotoCover` 照片封面（开场 · 用一张图定调）
- 适合：有一张能代表主题的氛围图：风景、场景、物件；公开演讲、科普、品牌故事的第一页
- 不适合：没有合适的图：用 Cover；要在封面放数字和关键事实：用 Cover 或 NumberOpener
- 上限：title ≤ 2 行 × 10 字；sub ≤ 40 字；meta 0–3 项，每项 ≤ 12 字；image.credit ≤ 20 字；必须配 tone: 'dark'
- 参考：src/decks/v2-p1 的 `cover` 页；docs/zh-CN/components.md#photo-cover

### `TextMask` 镂空大字（开场 · 封面或章节页）
- 适合：封面、章节页，主题能用一个短词概括；有一张纹理感强的图
- 不适合：图片本身是证据或要看清内容：用图片版式；词超过 5 个拉丁字母
- 上限：word 2–5 个拉丁大写字母或 1–2 个汉字；title ≤ 2 行 × 10 字；sub ≤ 36 字；facts 0–3 个：value ≤ 8 个字符，label ≤ 10 字
- 参考：src/decks/v2-p2 的 `cover` 页；docs/zh-CN/components.md#text-mask

### `GlobeCover` 地球封面（开场 · 第 1 页）
- 适合：主题和全球网络、跨国业务、地理分布有关；深色风格（mono-studio 等）的开场
- 不适合：弧线想表达真实流量或路线：用 ArcGlobe 并写出处；主题与地理无关：用 Cover
- 上限：title ≤ 2 行 × 10 字；lead ≤ 50 字；facts 0–3 项：value ≤ 8 个字符，label ≤ 10 字；arcs 0–8 条，两端都要在 center 朝向的半球
- 参考：src/decks/v3-p3 的 `cover` 页；docs/zh-CN/components.md#globe-cover

### `BadgeHero` 徽标首屏（开场 · 官网式首屏）
- 适合：介绍一个产品、项目或发行版的开场；有一张宽幅装饰插图或真实截图可放
- 不适合：没有图：用 Cover 或 Statement；按钮只是装饰，现场不能点；需要真实链接时写进 note 或结尾页
- 上限：kicker ≤ 6 字；badge ≤ 18 字；title 1 行 ≤ 12 字（最多 2 行）；lead ≤ 60 字；actions 1–2 个，label ≤ 10 字或 ≤ 18 个拉丁字符；note ≤ 30 字；image 宽图，上部是重点（只露出约 290u 高），credit ≤ 20 字
- 参考：src/decks/v3-p1 的 `hero` 页；docs/zh-CN/components.md#badge-hero

### `ExhibitCover` 展览封面（开场 · 超大窄衬线标题加角落日期块）
- 适合：展览、文化项目、年度回顾的第一页；主题是一个时间段或一届活动
- 不适合：需要一个代表数字：用 Cover；标题超过 3 行
- 上限：title 2–3 行，每行 ≤ 8 字；badge 1–2 行，每行 ≤ 10 个字符；meta 3–4 栏，value ≤ 24 字
- 参考：src/decks/sig-biennale 的 `cover` 页；docs/zh-CN/components.md#exhibit-cover

### `AgendaMosaic` 议程拼块（开场 · 五个议题拼成大小不一的色块）
- 适合：开场后的议程页，正好五个议题
- 不适合：议题不是五个：用 Agenda 或 PillAgenda；议题需要说明：用 Agenda
- 上限：items 正好 5 个；title ≤ 12 字；tag ≤ 6 字；页标题 ≤ 16 字；aside ≤ 16 个字符
- 参考：src/decks/sig-forest 的 `agenda` 页；docs/zh-CN/components.md#agenda-mosaic
