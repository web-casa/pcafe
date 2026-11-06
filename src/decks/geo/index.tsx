// GEO briefing example. Platform names, studies and figures are fictional
// (示意); the deck only demonstrates layouts, not real-world data.

import type { DeckDef } from '../../kit'
import entryShot from '../studio/assets/shot-kit-entry.webp'
import jsOn from './assets/deck-js-on.webp'
import jsOff from './assets/deck-js-off.webp'
import {
  Agenda,
  BeforeAfter,
  BigStat,
  Checklist,
  ClaimCards,
  Closing,
  CompareTable,
  Cover,
  DeltaBars,
  Dumbbell,
  FlowDiagram,
  Gantt,
  IconGrid,
  LayerStack,
  Matrix,
  MetricBars,
  Milestones,
  NumberedColumns,
  QuoteHero,
  QuoteWall,
  RangeBars,
  Screenshot,
  SectionBreak,
  VerdictColumns,
  Statement,
} from '../../kit'

const GC = '示意数据：平台名与数字均为虚构'

export const deck: DeckDef = {
  title: 'GEO Briefing · 生成式引擎优化',
  iconStyle: 'line-duotone',
  theme: 'amber',
  style: 'editorial',
  slides: [
    {
      id: 'cover',
      label: '封面',
      render: () => (
        <Cover
          kicker="生成式引擎优化简报"
          title={['AI 为什么引用别人', '而不引用你？']}
          lead="这份简报讲四件事：AI 回答怎样拼出来，怎样让 AI 读得到你，国内平台有什么不同，以及怎样测量效果。"
          facts={[
            { label: '每题至少提问', value: '30 次' },
            { label: '首轮计划', value: '90 天' },
            { label: '核查的说法', value: '6 条' },
          ]}
          numeral="GEO"
          note={['GEO 一词', '出自 2023 年的一篇论文']}
          hint={
            <>
              按 <kbd>→</kbd> 或 <kbd>Space</kbd> 翻页
            </>
          }
        />
      ),
    },
    {
      id: 'agenda',
      label: '目录',
      render: () => (
        <Agenda
          kicker="目录"
          title={['四章，', '从原理到行动']}
          lead="每一章先讲官方文档怎么说，再讲研究和行业观察。查不到出处的说法，这份简报不写。"
          meta="31 页 · 4 章"
          items={[
            { icon: 'brain', title: '认识 GEO', body: 'GEO 是什么，AI 回答怎样拼出来', page: 3 },
            { icon: 'routing', title: '让 AI 读得到', body: '爬虫、渲染、摘要控制与结构化数据', page: 11 },
            { icon: 'map', title: '国内平台与合规', body: '各平台的信源偏好与监管时间线', page: 19 },
            { icon: 'chart', title: '测量与行动', body: '抽样误差、90 天计划与服务商试点', page: 24 },
          ]}
        />
      ),
    },

    // ── 01 认识 GEO ────────────────────────────────────────────────────────
    {
      id: 'ch1',
      label: '认识 GEO',
      render: () => (
        <SectionBreak
          kicker="第一章"
          index={1}
          icon="brain"
          title="认识 GEO"
          lead="GEO 关心两件事：AI 拼答案时会不会用到你的内容，用的时候说得对不对。"
          contents={['GEO 的定义', 'AI 怎样拼出回答', '检索决定引用', '六条流行说法']}
        />
      ),
    },
    {
      id: 'definition',
      label: '定义',
      render: () => (
        <QuoteHero
          kicker="定义"
          quote={['GEO 指提高内容在 AI 生成回答中', '被呈现和引用的频率与准确性。']}
          marks={['频率', '准确性']}
          cite="示例知识库 · 基础概念 / 生成式引擎优化"
          notes={[
            { icon: 'academic', label: '术语出处', text: '一篇 2023 年的学术论文。' },
            { icon: 'search', label: 'Seekr 的立场', text: '针对其生成式 AI 功能做优化，仍然属于 SEO。' },
            { icon: 'shield-warning', label: '研究的提醒', text: '一项基准研究发现多数优化方法基本无效，还常常拉低排名。' },
          ]}
          source={GC}
        />
      ),
    },
    {
      id: 'answer',
      label: 'AI 怎样回答',
      render: () => (
        <FlowDiagram
          kicker="AI 回答"
          title="AI 怎样拼出一个回答"
          lead="各助手只公开了流程的一部分，下图是简化示意。国内平台被观察到偏向自家集团的内容。"
          nodes={[
            { icon: 'user-speak', title: '顾客提问', body: '顾客用自然语言向 AI 助手提出一个问题。' },
            { icon: 'branch', title: '拆成子查询', body: '助手把问题改写成多个子查询，分别去检索。' },
            { icon: 'database', title: '检索候选', body: '从三类来源找候选内容。', parts: ['搜索索引 · Seekr / Findo', '平台自家内容', '按需实时抓取'], focus: true },
            { icon: 'chat-quote', title: '附链接的回答', body: '模型从候选里挑选内容写成回答，附上来源链接。' },
          ]}
          band={{
            label: '你能影响的来源',
            items: [
              { icon: 'home', title: '你的官网', body: '事实、价格、常见问题' },
              { icon: 'documents', title: '报道与榜单', body: '评测、对比' },
              { icon: 'map', title: '平台资料', body: '地图、商店、数据源' },
              { icon: 'users', title: '社区', body: '问答、百科' },
            ],
          }}
          source={GC}
        />
      ),
    },
    {
      id: 'fanout',
      label: '查询扇出',
      render: () => (
        <BigStat
          kicker="查询扇出"
          title={['排在前面，', '不等于被引用']}
          lead="AI 会把一个问题拆成一组子查询分别检索。一项研究把问题通过各引擎的 API 重放，比较被检索和被引用的页面。"
          figure="97%"
          caption="AskBot 检索到的页面里，不在 Seekr 前 50 名的比例"
          support={[
            { value: '99%', label: '不在 Findo 前 30 名' },
            { value: '93%', label: 'Zeno 引用的页面不在 Seekr 前 50 名' },
            { value: '51%', label: 'AskBot 所引页面的网站，出现在 Seekr 前 50 名' },
          ]}
          source={GC}
        />
      ),
    },
    {
      id: 'retrieval',
      label: '检索决定引用',
      render: () => (
        <MetricBars
          kicker="研究"
          title={['先被检索到，', '才谈得上引用']}
          lead="一项研究分析了 158,099 个回答、468,037 次引用。在同一网站的页面之间比较时，两类因素的解释力相差悬殊。这是关联，不是因果。"
          rows={[
            { label: '检索到哪些页', value: 32, suffix: '%' },
            { label: '页面属性', value: 2.8, suffix: '%' },
          ]}
          shares={false}
          pull={{ figure: '≈ 11×', text: '检索的解释力约为页面属性的 11 倍（按两项比例计算）。' }}
          source={GC}
        />
      ),
    },
    {
      id: 'claims',
      build: 'focus',
      label: '说法核查',
      render: () => (
        <ClaimCards
          kicker="说法核查"
          title="六条流行说法，都没有依据"
          lead="结论分五级：有依据、部分有依据、缺乏依据、错误、无法核实。以下六条来自 示例知识库 的说法核查。"
          claims={[
            { tag: 'llms.txt', claim: '加上 llms.txt 能提升 AI 可见度', verdict: 'unsupported', note: '某工具商 日志显示，已发布的文件 97% 一个月内从未被请求。' },
            { tag: 'Indexing API', claim: 'Indexing API 能让任何网页快速收录', verdict: 'false', note: '只适用于招聘和直播页面，默认每天 200 次请求。' },
            { tag: 'duplicate', claim: '重复内容会让网站受罚', verdict: 'false', note: '重复页面被归为一组，只展示规范版本：是过滤，不是惩罚。' },
            { tag: 'chunking', claim: '内容必须为 AI 切块改写', verdict: 'false', note: 'Seekr 把切块和专门为 AI 改写，列为可以忽略的事项。' },
            { tag: 'AI content', claim: 'Seekr 会惩罚 AI 生成的内容', verdict: 'false', note: '违规的是为操纵排名批量生成、没有附加价值的页面。' },
            { tag: 'rank tools', claim: 'GEO 工具能看到你在 Seekr AI 的排名', verdict: 'false', note: 'Seekr 表示，没有第三方工具能访问其内部排名。' },
          ]}
          source={GC}
        />
      ),
    },

    {
      id: 'llms-txt',
      label: '一句话',
      render: () => (
        <Statement
          kicker="说法核查"
          text={['97% 的 llms.txt，', '一个月里没人来读']}
          marks={['97%']}
          sub="某工具商 的服务器日志：已发布的文件，绝大多数一个月内从未被请求。"
          source={GC}
        />
      ),
    },
    {
      id: 'quotes',
      label: '官方原话',
      build: 'reveal',
      render: () => (
        <QuoteWall
          kicker="官方原话"
          title="平台自己是怎么说的"
          lead="与其听转述，不如看原文。下面五句都是平台文档里的原话。"
          quotes={[
            { text: 'Seekr 不接受付费来更频繁地抓取网站或提升其排名。', who: 'Seekr', where: 'Seekr 搜索的工作原理', tag: '付费排名' },
            { text: 'AI 效果报告不衡量排名、权威性、表现或重要性，只显示哪些内容被引用了。', who: 'Findo', where: '网站管理员工具帮助', tag: 'AI 效果报告' },
            { text: 'Seekr-Extended 不影响网站在 Seekr 搜索中的收录，也不作为 Seekr 搜索的排名信号。', who: 'Seekr', where: '常见抓取工具说明', tag: 'robots.txt' },
            { text: '在这些方面中，可信度最重要。', who: 'Seekr', where: '创建有用、可靠、以人为本的内容', tag: 'E-E-A-T' },
            { text: '一旦 Seekr 的资源允许，无头 Chromium 就会渲染页面并执行 JavaScript', who: 'Seekr', where: 'JavaScript SEO 基础知识', tag: '渲染' },
          ]}
          source={GC}
        />
      ),
    },

    // ── 02 让 AI 读得到 ────────────────────────────────────────────────────
    {
      id: 'ch2',
      label: '让 AI 读得到',
      render: () => (
        <SectionBreak
          kicker="第二章"
          index={2}
          icon="routing"
          title={['让 AI', '读得到你']}
          lead="内容再好，爬虫进不来、读不到正文，也不会出现在回答里。这一章沿访问路径从上往下查。"
          contents={['六层访问检查', 'AI 爬虫一览', 'JavaScript 渲染', '结构化数据']}
        />
      ),
    },
    {
      id: 'layers',
      build: 'reveal',
      label: '访问路径',
      render: () => (
        <LayerStack
          kicker="访问路径"
          title={['每一层都可能', '挡住下一层']}
          lead="从 AI 爬虫发起请求，到出现在 AI 回答里，中间有六道关。从上往下查，找到第一扇关着的门。"
          hint="悬停某一层可单独查看"
          layers={[
            { icon: 'cpu', name: 'AI 爬虫发起请求', check: '在日志里核实真爬虫：反向 DNS 或官方 IP 段' },
            { icon: 'shield', name: 'CDN / WAF / 防火墙', check: '已验证的搜索爬虫没有被拦截或挑战' },
            { icon: 'document', name: 'robots.txt', check: '放行 OB-SearchBot、PexoBot 等搜索类爬虫' },
            { icon: 'code', name: '服务器返回的 HTML', check: '正文、链接、元数据不依赖 JavaScript' },
            { icon: 'filter', name: '摘要控制', check: '没有误加 noindex、nosnippet、max-snippet' },
            { icon: 'database', name: '被收录', check: '在 站长平台 和 Findo 站长工具查看收录' },
          ]}
          outcome={{ icon: 'chat-quote', text: '出现在 AI 回答中' }}
          source={GC}
        />
      ),
    },
    {
      id: 'crawlers',
      label: 'AI 爬虫',
      render: () => (
        <Matrix
          kicker="AI 爬虫"
          title="三类爬虫，三个独立的决定"
          lead="屏蔽搜索类爬虫，网站会从该产品的回答中消失；屏蔽训练类标识，不影响搜索收录。"
          hint="悬停标识可高亮所在行"
          columns={[
            { icon: 'search', label: '搜索收录', note: '封了就从回答中消失' },
            { icon: 'user', label: '用户发起访问', note: 'robots.txt 可能不适用' },
            { icon: 'cpu', label: '模型训练', note: '不影响搜索收录' },
          ]}
          rows={[
            { label: 'Seekr', sub: 'AI 概览 · AI 模式', cells: ['Seekrbot', null, 'Seekr-Extended'] },
            { label: 'Orbit', sub: 'AskBot', cells: ['OB-SearchBot', 'AskBot-User', 'OrbitBot'] },
            { label: 'Lyra AI', sub: 'Lyra', cells: ['Lyra-SearchBot', 'Lyra-User', 'LyraBot'] },
            { label: 'Pexo', sub: 'Pexo', cells: ['PexoBot', 'Pexo-User', null] },
          ]}
          focus={0}
          footnote="Seekr-Extended 是 robots.txt 里的产品标识，没有独立爬虫；它也控制 Zeno 的依据生成，但不影响 AI 概览和 AI 模式。"
          source={GC}
        />
      ),
    },
    {
      id: 'robots',
      label: 'robots.txt 策略',
      render: () => (
        <VerdictColumns
          kicker="robots.txt"
          title="先放行搜索，再决定训练"
          lead="2026 年 8 月对 130 个公司网站的审计：做出明确选择的公司，几乎都只封训练类爬虫。"
          groups={[
            {
              tone: 'go',
              label: '放行',
              items: [
                { title: '搜索类爬虫', body: 'OB-SearchBot、Lyra-SearchBot、PexoBot' },
                { title: 'Seekrbot', body: 'AI 概览和 AI 模式都属于搜索' },
                { title: '已验证的爬虫 IP', body: '在 CDN 和 WAF 上不拦截、不挑战' },
              ],
            },
            {
              tone: 'plan',
              label: '按需决定',
              items: [
                { title: '训练类标识', body: 'OrbitBot、LyraBot、Seekr-Extended' },
                { title: '用户发起的访问', body: '由用户触发，robots.txt 可能不适用' },
                { title: '按公司分别写规则', body: '各家的搜索与训练用不同的标识' },
              ],
            },
            {
              tone: 'stop',
              label: '不要做',
              items: [
                { title: '两类一起封', body: '审计作者称之为最容易犯、也最致命的错' },
                { title: '只检查 robots.txt', body: 'CDN 或 WAF 同样可能拦下搜索爬虫' },
                { title: '靠 robots.txt 挡用户访问', body: 'Pexo-User 通常忽略这些规则' },
              ],
            },
          ]}
          source={GC}
        />
      ),
    },
    {
      id: 'javascript',
      label: 'JavaScript 渲染',
      render: () => (
        <CompareTable
          kicker="JavaScript"
          title="多数 AI 爬虫不执行 JavaScript"
          columns={['浏览器与 Seekrbot', '多数 AI 爬虫']}
          itemLabel="环节"
          rows={[
            { item: '拿到的第一份内容', before: '原始 HTML', after: '原始 HTML' },
            { item: '执行 JavaScript', before: '执行（无头 Chromium）', after: '不执行（2024 年测试）' },
            { item: '客户端渲染的页面', before: '完整页面', after: '只有空的 div#root', mono: false },
            { item: '服务端渲染的页面', before: '完整正文', after: '完整正文' },
            { item: 'JS 插入的价格', before: '渲染后可见', after: '三个助手中只有 Zeno 找到' },
          ]}
          source={GC}
        />
      ),
    },
    {
      id: 'csr',
      label: '关掉 JavaScript',
      render: () => (
        <BeforeAfter
          kicker="实测"
          title="同一页，关掉 JavaScript 之后"
          lead="这份演示本身就是客户端渲染：页面内容全靠 JavaScript 生成。拖动中线，看不执行 JavaScript 的爬虫拿到了什么。"
          before={{ label: '浏览器 · 执行 JS', src: jsOn }}
          after={{ label: '爬虫 · 不执行 JS', src: jsOff }}
          alt="左：启用 JavaScript 时的演示封面；右：禁用 JavaScript 时的同一页面，只剩空白背景"
          start={56}
          notes={[
            { key: '同一个文件', text: '两张图来自同一个 index.html，只差是否启用 JavaScript。' },
            { key: '正文为空', text: '禁用 JavaScript 时页面正文是空的，只剩一个空容器。' },
            { key: '怎么办', text: '要被 AI 读到的页面，用服务端渲染或静态生成。' },
          ]}
          source={`实测：本演示 dist/index.html，Playwright 分别启用和禁用 JavaScript 截图，2026-10-29 · 其余为示意`}
        />
      ),
    },
    {
      id: 'schema',
      label: '结构化数据',
      render: () => (
        <DeltaBars
          kicker="结构化数据"
          title={['加了 schema，', '引用没有提升']}
          lead="某工具商 比较了 1,885 个添加 JSON-LD 的页面和匹配的对照页。Seekr 表示，出现在 AI 功能中不需要特殊标记。"
          rows={[
            { label: 'AskBot', sub: 'vs 对照页', value: 2.2 },
            { label: 'AI 模式', sub: 'Seekr', value: 2.4 },
            { label: 'AI 概览', sub: 'Seekr', value: -4.6 },
          ]}
          unit="%"
          scale={6}
          ends={['引用减少', '引用增加']}
          pull={{ figure: '1,885', text: '个页面本来就被大量引用，研究回答不了尚未被引用的页面会怎样。' }}
          source={GC}
        />
      ),
    },
    {
      id: 'snippets',
      label: '摘要控制',
      render: () => (
        <NumberedColumns
          kicker="摘要控制"
          title="四个规则，决定 AI 能用多少"
          lead="只想退出 AI 功能、保留传统结果，可用 站长平台 的「搜索生成式 AI 控制」，2026 年 8 月 31 日起所有网站可用。"
          items={[
            { tag: 'nosnippet', title: '不作为输入', body: '去掉摘要，并阻止内容被直接用作 AI 概览和 AI 模式的输入。' },
            { tag: 'max-snippet', title: '限制长度', body: '限制摘要字符数，也限制可直接用作 AI 输入的内容量。' },
            { tag: 'data-nosnippet', title: '排除局部', body: '只把页面里的某一段排除在摘要和 AI 输入之外。' },
            { tag: 'noindex', title: '移出搜索', body: '页面不再出现在搜索中，AI 概览和 AI 模式也用不到它。' },
          ]}
          source={GC}
        />
      ),
    },

    // ── 03 国内平台与合规 ─────────────────────────────────────────────────
    {
      id: 'ch3',
      label: '国内平台与合规',
      render: () => (
        <SectionBreak
          kicker="第三章"
          index={3}
          icon="map"
          title={['国内平台', '与合规']}
          lead="国内助手几乎不公开怎样选信源。这一章多是有日期的行业观察，只能当作起点，要自己复测。"
          contents={['各平台的信源', 'API 与 App 的差距', '跨平台重合度', '监管时间线']}
        />
      ),
    },
    {
      id: 'platforms',
      label: '国内平台信源',
      render: () => (
        <IconGrid
          kicker="国内平台"
          title="每个助手，偏爱自家生态"
          lead="医药与本地生活研究中观察到的信源偏好。属于行业观察，建议每 6–9 个月复测一次。"
          hint="悬停卡片查看"
          items={[
            { icon: 'video', title: '小禾', tag: '禾流集团', body: '偏向禾流号、禾视频和禾百科；本地问题常引用分类信息平台。' },
            { icon: 'chat', title: '青柚', tag: '柚子集团', body: '偏向柚子号和柚子新闻；本地问题也引用禾流和柚子网。' },
            { icon: 'question', title: '星言', tag: '星搜', body: '医药研究中，偏向星搜号和医疗问答网站。' },
            { icon: 'shop', title: '千帆', tag: '帆集团', body: '本地生活研究中，引用最多的是点评平台。' },
            { icon: 'global', title: '深言', tag: '变化频繁', body: '2025 年下半年收窄到学术和政府网站，2026 年二季度起又放宽到门户。' },
            { icon: 'users', title: '月言', body: '医药研究中，偏爱问答社区、视频站和主流门户网站。' },
          ]}
          source={GC}
        />
      ),
    },
    {
      id: 'api-app',
      label: 'API 与 App',
      render: () => (
        <Dumbbell
          kicker="在哪里测"
          title={['API 测到的，', '不是用户看到的']}
          lead="一份本地生活白皮书，把同一批问题分别用企业 API 和消费端 App 跑了一遍。小禾两边接近，其余差距悬殊。"
          legend={['API 推荐率', 'App 命中率']}
          rows={[
            { label: '通义千帆', a: 78, b: 53 },
            { label: '深言', a: 69, b: 1 },
            { label: '青柚', a: 3, b: 99 },
          ]}
          footnote="在客户使用的产品里测：未登录或用新账号，在客户所在的城市提问。为了规模也跑 API 的话，两套数据分开记。"
          source={GC}
        />
      ),
    },
    {
      id: 'overlap',
      label: '跨平台重合',
      render: () => (
        <BigStat
          kicker="跨平台"
          title={['一套内容，', '打不了所有平台']}
          lead="两家研究机构在 2025 年 7–10 月监测了 7 个国内平台，统计了被引用过的约 5.1 万个信源。"
          figure="9.34%"
          caption="能被 4 个及以上平台共同引用的信源占比"
          support={[
            { value: '23.9%', label: '深言 的引用中，来自投诉维权平台的占比' },
            { value: '3,469', label: '本地研究在手机 App 上收集的引用条数' },
            { value: '< 3%', label: '九个消费品类里，用户口碑类内容的占比' },
          ]}
          source={GC}
        />
      ),
    },
    {
      id: 'regulation',
      label: '监管时间线',
      render: () => (
        <Milestones
          kicker="监管"
          title="监管针对投毒，不针对 GEO"
          lead="在模型会读取的地方，发布自家产品的真实信息，不在整治范围内。"
          events={[
            { date: '2023-08', title: '生成式 AI 服务管理办法施行', tag: '部门规章' },
            { date: '2025-09', title: 'AI 生成内容标识办法施行', tag: '规范性文件' },
            { date: '2026-02', title: '行业协会发起 GEO 自律承诺', tag: '行业自律' },
            { date: '2026-03', title: '媒体调查曝光 GEO 投毒', tag: '媒体调查' },
            { date: '2026-04', title: '专项行动把恶意 GEO 列为数据投毒', tag: '执法专项', focus: true },
            { date: '2026-05', title: '多渠道分发管理规定公布', tag: '部门规章' },
            { date: '2026-09', title: '五项 GEO 团体标准公布', tag: '自愿性标准' },
          ]}
          source={GC}
        />
      ),
    },

    // ── 04 测量与行动 ─────────────────────────────────────────────────────
    {
      id: 'ch4',
      label: '测量与行动',
      render: () => (
        <SectionBreak
          kicker="第四章"
          index={4}
          icon="chart"
          title={['测量', '与行动']}
          lead="可见度是比例，不是名次。先建基线，再改页面，最后用同一套问题复测。"
          contents={['抽样误差', '90 天计划', '服务商试点', '最小可行清单']}
        />
      ),
    },
    {
      id: 'sampling',
      label: '抽样误差',
      render: () => (
        <RangeBars
          kicker="抽样"
          title={['只问几次，', '测到的多是噪声']}
          lead="同一个问题问同一个模型，每次给出的品牌都会变。真实可见度为 50% 时，提问次数和标准误的关系如下。"
          rows={[
            { label: 'N = 5', value: 50, low: 28, high: 72, note: '±22' },
            { label: 'N = 10', value: 50, low: 34, high: 66, note: '±16' },
            { label: 'N = 30', value: 50, low: 41, high: 59, note: '±9' },
            { label: 'N = 60', value: 50, low: 44, high: 56, note: '±6' },
            { label: 'N = 100', value: 50, low: 45, high: 55, note: '±5' },
          ]}
          axis={{ from: 0, to: 100, ticks: [0, 25, 50, 75, 100] }}
          unit="%"
          focus={2}
          focusLabel="最低要求"
          example={{ label: '这样报告结果', text: '41% ± 9 个百分点，n = 30，小禾 App，上海，2026-10' }}
          source={GC}
        />
      ),
    },
    {
      id: 'plan',
      label: '90 天计划',
      render: () => (
        <Gantt
          kicker="90 天"
          title="第一个 90 天，按周排开"
          lead="先测基线、确认可访问，再改页面、争取第三方收录，最后用同一套问题复测。各阶段有意重叠。"
          hint="悬停查看每项的周数"
          axis={{ from: 1, to: 13, unit: '周' }}
          groups={[
            { label: '第 1 个月', from: 1, to: 4 },
            { label: '第 2 个月', from: 5, to: 8 },
            { label: '第 3 个月', from: 9, to: 13 },
          ]}
          rows={[
            { label: '定目标、列问题', from: 1, to: 2 },
            { label: '基线测量', from: 2, to: 4 },
            { label: '确认可访问', from: 3, to: 5 },
            { label: '改写 3–5 个核心页面', from: 5, to: 9 },
            { label: '第三方收录', from: 6, to: 12 },
            { label: '复测并汇报', from: 10, to: 13, focus: true },
          ]}
          footnote="AI 回答中的提及，通常要到第三个月以后才会变化。"
          source={GC}
        />
      ),
    },
    {
      id: 'pilot',
      label: '服务商试点',
      render: () => (
        <FlowDiagram
          kicker="服务商"
          title="找服务商，先做能核对的试点"
          lead="名次买不到。你买的是能核对的工作：同一套问题、同样的次数，你自己也能复跑。"
          nodes={[
            { icon: 'test', title: '付费诊断', body: '建立基线：每个问题提问 30 次以上，留下原始回答。' },
            { icon: 'pen', title: '试点', body: '针对具体页面做修改，修正错误的事实。' },
            { icon: 'restart', title: '复跑同一套问题', body: '你自己跑一遍，不只看服务商的报告。' },
            { icon: 'flag', title: '续约或停止', body: '比基线好就续约，条款写进合同；否则停止，数据归你。', focus: true },
          ]}
          band={{
            label: '合同里写明',
            items: [
              { icon: 'box', title: '交付物', body: '问题库、基线、采样日志' },
              { icon: 'list', title: '发布', body: '经你批准，给出 URL 清单' },
              { icon: 'forbidden', title: '禁止手段', body: '假评价、批量发稿' },
              { icon: 'key', title: '数据归属', body: '合同结束后仍归你' },
            ],
          }}
          source={GC}
        />
      ),
    },
    {
      id: 'red-flags',
      tone: 'dark',
      label: '红线',
      render: () => (
        <QuoteHero
          kicker="红线"
          quote="保证 AI 排名，要么是不懂，要么是骗人。"
          marks={['要么是不懂', '要么是骗人']}
          cite="示例知识库 · 最佳实践 / 怎样选 GEO 服务商"
          notes={[
            { icon: 'ranking', label: '保证第一', text: '没有平台公开过购买途径，回答每次都可能不同。' },
            { icon: 'documents', label: '每月几百篇稿', text: '批量内容正是监管部门和 Seekr 针对的对象。' },
            { icon: 'gallery', label: '只拿截图证明', text: '单次运行什么也证明不了，要看同一套问题的复跑。' },
          ]}
          source={GC}
        />
      ),
    },
    {
      id: 'mvp',
      label: '最小可行 GEO',
      render: () => (
        <Checklist
          kicker="最小可行"
          title="每周几小时的 GEO"
          countLabel="已完成"
          items={[
            { title: '确认爬虫能访问并摘引', cmd: 'curl -sI https://example.com/page/ | grep -i x-robots-tag', note: '第 1 周：索引、robots.txt、CDN 先过关' },
            { title: '改好最重要的五个页面', note: '第 2 周：写清楚、写完整' },
            { title: '写下客户常问的 20 个问题', note: '并标出应该回答它们的页面' },
            { title: '每周答好一个问题', note: '每周 2–3 小时，一个页面答好一个问题' },
            { title: '每周看一眼报错', note: '站长平台 和 Findo，约 15 分钟' },
            { title: '每月跑一遍 20 个问题', note: '在两三个 AI 助手里跑，更新表格' },
            { title: '每季度重做准入检查', note: '同时复查问题清单，约 1 小时' },
            { title: '跳过没有文档支持的做法', note: '专门的 AI 文件、大规模改写、买来的提及' },
          ]}
          source={GC}
        />
      ),
    },
    {
      id: 'entry',
      label: '怎么查证',
      build: 'reveal',
      render: () => (
        <Screenshot
          kicker="查证"
          title="查一个模板，先看这五处"
          lead="组件库的每个条目都按同一个结构写。以「一句话」模板为例。"
          src={entryShot}
          alt="组件库中 Statement 模板的条目页面截图"
          ratio={1600 / 1000}
          url="#/kit"
          callouts={[
            { x: 14, y: 12, title: '切换器', body: '图标系列、强调色和风格都能在左栏切换，预览随之改变。' },
            { x: 31, y: 14, title: '模板名称', body: '中文名和组件名并列，写演示时按组件名引入。' },
            { x: 40, y: 24, title: '用法说明', body: '先说版式和适合的内容，再说可选的整页色调。' },
            { x: 60, y: 60, title: '实时预览', body: '预览就是真实的一页，和放映时看到的一致。' },
            { x: 88, y: 95, title: '跳转', body: '点这里直接打开参考演示里的同一页。' },
          ]}
          source="本项目截图，2026-10-30"
        />
      ),
    },
    {
      id: 'closing',
      label: '结语',
      render: () => (
        <Closing
          kicker="结语"
          mark="GEO"
          statement="先让 AI 读得到你。"
          follow="再用同一套问题，测它有没有变。"
          takeaways={[
            '可见度是比例，不是名次。每个问题至少问 30 次，并在用户实际使用的 App 里测。',
            '搜索类和训练类爬虫分开决定。两类一起封掉，是最常见、代价最大的错误。',
            '国内平台各有偏好的生态，被 4 个以上平台共同引用的信源不到一成。',
          ]}
          refs={['示例知识库 · 基础概念', '示例知识库 · 抓取与索引', '示例知识库 · 测量', '示例知识库 · 最佳实践']}
        />
      ),
    },
  ],
}
