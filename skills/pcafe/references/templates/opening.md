# 开场

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 32 个模板。返回索引：[../templates.md](../templates.md)。

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

### `AtelierHero` 设计室开场（开场 · 工作室首页）
- 适合：设计工作室、自由职业者、作品集的第一页；想一上来就让人看到作品
- 不适合：没有 4 张以上作品图：用 Cover 或 PhotoCover；需要一句话讲清楚产品：用 Statement
- 上限：badge ≤ 16 字；title ≤ 2 行 × 11 字；lead ≤ 40 字；ctas 每个 ≤ 8 字；clients 3–6 个，每个 ≤ 10 个字符；strip 4–6 张横图
- 参考：src/decks/sig-atelier 的 `hero` 页；docs/zh-CN/components.md#atelier-hero；交互：作品图带持续横向漂移，悬停放大

### `MonographHero` 机构自我介绍（开场 · 机构介绍）
- 适合：机构、工作室开场，用一句话说清楚你是谁；想要杂志感的第一页
- 不适合：标题超过 3 行：拆页或用 Statement；没有合适的配图：用 Cover
- 上限：title ≤ 3 行 × 12 字；rating.score ≤ 7 个字符，note ≤ 12 字；aside.title ≤ 10 字，body ≤ 30 字；story.text ≤ 70 字，index ≤ 4 个字符
- 参考：src/decks/sig-monograph 的 `hero` 页；docs/zh-CN/components.md#monograph-hero

### `NocturneHero` 夜光开场（开场 · App 首页）
- 适合：消费类 App、AI 工具的第一页；想让人一眼看到产品出来的效果
- 不适合：产品是桌面软件：用 HeroPanel 或 DeviceFrame；没有能放进手机的图：用 Cover
- 上限：title ≤ 2 行 × 8 字；lead ≤ 36 字；ctas 每个 ≤ 8 字；note ≤ 16 字；stats 2–3 个：value ≤ 7 个字符，label ≤ 6 字；phone.thumbs ≤ 4 张，label ≤ 4 字，cta ≤ 8 字，toast ≤ 12 字
- 参考：src/decks/sig-nocturne 的 `hero` 页；docs/zh-CN/components.md#nocturne-hero；交互：手机持续缓慢浮动

### `SunriseHero` 晨光开场（开场 · SaaS 首页）
- 适合：SaaS、模板、协作工具的第一页；想一开场就让人看到产品界面
- 不适合：没有产品界面可展示：用 Cover；要放真实截图：用 HeroPanel 或 DeviceFrame
- 上限：brand ≤ 10 个字符；links ≤ 4 个 × ≤ 4 字；navCta ≤ 6 字；title ≤ 2 行 × 12 字；lead ≤ 30 字；ctas 每个 ≤ 6 字；cursors 2 个名字 × ≤ 4 字；dash.gauge.value 0–100；trend.values 6–12 个；team.faces ≤ 5 张，tasks 2 条（title ≤ 8 字，status ≤ 3 字）
- 参考：src/decks/sig-sunrise 的 `hero` 页；docs/zh-CN/components.md#sunrise-hero；交互：光标在页边持续漂动；悬停柱子和头像有反馈

### `FolioHero` 作品轨开场（开场 · 个人作品集首页）
- 适合：产品设计师、独立设计师、自由职业者作品集的第一页；想让人一开场就看到人和作品
- 不适合：没有 2 张以上作品图：用 Cover 或 PhotoCover；团队或机构介绍：用 AtelierHero
- 上限：status ≤ 14 字；person.name ≤ 8 字，note ≤ 24 个字符；pre 和 title 各 ≤ 6 字；lead ≤ 60 字；ctas 每个 ≤ 8 字；tags 3–5 个 × ≤ 6 字；link ≤ 6 字；frames 2–4 张，caption ≤ 14 字
- 参考：src/decks/sig-folio 的 `hero` 页；docs/zh-CN/components.md#folio-hero；交互：点击：右侧刻度让作品列上下滑动；状态绿点呼吸；悬停按钮和图片有反馈

### `DiptychHero` 对页开场（开场 · 个人作品集首页）
- 适合：独立设计师、摄影师、插画师作品集的第一页；作品是竖图，想一开场就放大看
- 不适合：作品是横图或界面截图：用 FolioHero 或 AtelierHero；没有作品图：用 Cover
- 上限：status ≤ 10 字；title 2–3 行 × ≤ 7 字；soft ≤ 4 字且出现在 title 里；lead ≤ 40 字；ctas 每个 ≤ 8 字；clients 4–8 个 × ≤ 10 个字符；shots 2–5 张竖图：title ≤ 8 字，meta ≤ 14 字；signature ≤ 12 个西文字符
- 参考：src/decks/sig-diptych 的 `hero` 页；docs/zh-CN/components.md#diptych-hero；交互：左图自动轮播，进度条走满后切换；点箭头或进度条手动切换；客户名横向漂移，悬停暂停

### `MarkerIntro` 记号笔开场（开场 · 一句话自我介绍）
- 适合：个人主页、设计师、写作者的第一页；想用一句话而不是一个标题来介绍自己
- 不适合：要放作品图：用 FolioHero 或 DiptychHero；要讲产品卖点：用 Statement
- 上限：say ≤ 2 行 × 14 字，标记 1–3 处；aside ≤ 2 行 × 12 字；links 2–4 个 × ≤ 6 字；corners.left ≤ 20 字，city ≤ 6 字
- 参考：src/decks/sig-marker 的 `intro` 页；docs/zh-CN/components.md#marker-intro；交互：荧光笔底色依次刷入；悬停标记词微微倾斜；右下角时钟每秒走动

### `AlbumHero` 相册开场（开场 · 温暖的消费产品首页）
- 适合：相册、日记、家庭、生活方式类产品的第一页；想要温暖、私密、有手感的开场
- 不适合：B2B 或数据产品：用 SunriseHero；照片不够 5 张：用 AtelierHero
- 上限：badge ≤ 8 字；hand ≤ 18 字；title 2 行 × ≤ 9 字；grad ≤ 4 字且在最后一行末尾；lead ≤ 40 字；cta ≤ 6 字；prints 5–9 张：caption ≤ 8 字；chips ≤ 3 个 × ≤ 10 字
- 参考：src/decks/sig-album 的 `hero` 页；docs/zh-CN/components.md#album-hero；交互：拍立得依次发牌落下；悬停抽出一张；小标签轻轻浮动，晨光缓慢呼吸

### `SlateHero` 立体看板开场（开场 · SaaS 产品首页）
- 适合：SaaS、数据产品、效率工具的第一页；想一眼看出“这是一个有看板的产品”
- 不适合：没有可展示的数字：用 SunriseHero；消费类、生活方式产品：用 AlbumHero
- 上限：chip 标签 ≤ 6 个字符，后半句 ≤ 12 字；title 2 行 × ≤ 8 字，可放 {bolt} {up} {spark} {chart} {link} {shield} {clock} {check}；lead ≤ 50 字；ctas 各 ≤ 8 字；logos 3–5 个 × ≤ 10 个字符；dash.tabs 3–5 个 × ≤ 4 字；hello ≤ 12 字；note ≤ 24 字；dash.kpis 恰好 3 张：value ≤ 8 个字符，series 8–14 个数；float ≤ 8 字
- 参考：src/decks/sig-slate 的 `hero` 页；docs/zh-CN/components.md#slate-hero；交互：看板从远处转进来；点 KPI 卡换图表；悬停看板转正；图标块悬停会弹一下

### `EmberHero` 暗场开场（开场 · AI 产品首页）
- 适合：AI 代理、智能助手、对话式产品的第一页；想让观众一眼看到“它是用来提问的”
- 不适合：没有合适的暗调大图：用 NocturneHero；需要展示数据看板：用 SlateHero
- 上限：badge 标签 ≤ 2 字，后半句 ≤ 18 字；title 2 行 × ≤ 9 字；ask.placeholder ≤ 20 字；prompts 2–5 条 × ≤ 26 字；ask.chips ≤ 3 个 × ≤ 6 字；ask.models ≤ 3 个 × ≤ 10 个字符；image 宜用暗底、单侧打光、主体居中的图
- 参考：src/decks/sig-ember 的 `hero` 页；docs/zh-CN/components.md#ember-hero；交互：背景随鼠标漂移；提问框自动打字；开关可按；模型可切换；发送键换下一个问题

### `DuskHero` 霞光面板开场（开场 · 开发者工具首页）
- 适合：开发者工具、AI 编程助手、技术 SaaS 的第一页；想同时展示“产品界面”和“代码”
- 不适合：非技术受众：用 SlateHero；没有代码可展示：用 SunriseHero
- 上限：ann ≤ 20 字 + 链接 ≤ 4 字；title 2 行 × ≤ 8 字；lead ≤ 30 字；ctas 各 ≤ 6 字；tabs 2–5 个：label ≤ 4 字，head ≤ 8 字，bars 2–5 段 × ≤ 4 字，file ≤ 18 个字符；code 6–12 行 × ≤ 34 个字符；以 "- " "+ " "# " 开头分别表示删除、新增、注释
- 参考：src/decks/sig-dusk 的 `hero` 页；docs/zh-CN/components.md#dusk-hero；交互：点标签切换小部件；代码逐行滑入；渐变面板缓慢流动

### `AgencyStage` 电光蓝舞台开场（开场 · 机构或品牌第 1 页）
- 适合：增长机构、咨询公司、品牌方案的封面；想要有冲击力、像官网首屏的开场
- 不适合：没有英文字标：用 AgencyHero；正式汇报：用 Cover
- 上限：title 2 行 × ≤ 9 字；cta ≤ 8 字；card.title ≤ 8 字，card.body ≤ 40 字；trust.faces 2–4 张，text 两行各 ≤ 12 字；word 3–7 个英文字母；mark 默认 ®；这一页在 deck 里请设 tone: 'dark'，页眉才是浅色
- 参考：src/decks/sig-agency 的 `stage` 页；docs/zh-CN/components.md#agency-stage；交互：亮光跟随鼠标；字标字母依次升起，悬停单个字母抬起；照片卡悬停浮起；按钮箭头悬停转向
