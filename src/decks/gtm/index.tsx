// GTM playbook: launching a B2B product. Industry figures were checked
// against the publisher's own page (Gartner via archived snapshots) on
// 2026-10-29. The example product and every number about it are
// illustrative and say so in their source line. Figures only found in
// secondary sources say 转引.

import type { DeckDef } from '../../kit'
import {
  Agenda,
  BigStat,
  Checklist,
  Closing,
  Cover,
  Cycle,
  FlowDiagram,
  Funnel,
  Gantt,
  Heatmap,
  IssueTree,
  KpiBoard,
  Matrix,
  MetricBars,
  NumberedColumns,
  PersonaCards,
  PricingTiers,
  Quadrant,
  QuoteHero,
  Roadmap,
  SectionBreak,
  ShareBar,
  Statement,
  StatusGrid,
  Team,
  Waterfall,
} from '../../kit'

const GARTNER = 'Gartner · The B2B Buying Journey（2023 年存档页）'
const DEMO = '示意：示例产品与数字均为虚构，用来演示方法'

export const deck: DeckDef = {
  title: 'GTM Playbook · 新产品上市运营',
  iconStyle: 'line-duotone',
  theme: 'cobalt',
  style: 'poster',
  slides: [
    {
      id: 'cover',
      label: '封面',
      render: () => (
        <Cover
          kicker="GTM Playbook · 上市运营手册"
          title={['卖给谁，', '怎么卖']}
          lead="这份手册把一次 B2B 新品上市拆成四段：看清买家，定好位置和价格，按计划上市，再用同一套指标复盘。"
          facts={[
            { label: '见供应商', value: '17%', icon: 'clock' },
            { label: '决策人数', value: '6–10 人', icon: 'users' },
            { label: '正在买', value: '5%', icon: 'target' },
          ]}
          numeral="GTM"
          note={['四章 · 30 页', '行业数字附出处，示例数据标为示意']}
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
          title={['四章，', '从买家到复盘']}
          lead="每章先给可核对的行业研究，再用一个虚构的示例产品演示做法。示例里的数字都只是示意。"
          meta="30 页 · 4 章"
          items={[
            { icon: 'users', title: '看清买家', body: '买家怎样花时间、谁参与决策、谁此刻在买', page: 3 },
            { icon: 'target', title: '定位与定价', body: '定位五要素、竞争地图、价格杠杆与分档', page: 8 },
            { icon: 'rocket', title: '上市执行', body: '渠道组合、上市节奏、就绪检查、团队与分工', page: 14 },
            { icon: 'chart', title: '衡量与增长', body: '漏斗、指标、问题拆解、收入桥、留存与路线图', page: 20 },
          ]}
        />
      ),
    },

    // ── 01 看清买家 ─────────────────────────────────────────────────────────
    {
      id: 'ch1',
      tone: 'dark',
      label: '看清买家',
      render: () => (
        <SectionBreak
          kicker="第一章"
          index={1}
          icon="users"
          title="看清买家"
          lead="B2B 采购是一群人在很长的时间里慢慢做的决定。销售真正能接触到他们的时间，比想象的少得多。"
          contents={['买家的时间', '采购小组', '此刻在买的人', '买家画像']}
        />
      ),
    },
    {
      id: 'time',
      label: '买家的时间',
      render: () => (
        <BigStat
          kicker="买家的时间"
          title={['大部分功课，', '买家自己做完了']}
          lead="Gartner 统计 B2B 买家在一次采购中的时间分配：多数时间用在自行调研和内部讨论上。"
          figure="17%"
          caption="采购时间里，用来和潜在供应商见面的比例"
          support={[
            { value: '5–6%', label: '同时比较几家时，留给其中任何一家销售的时间' },
            { value: '6–10', label: '一次复杂采购里的典型决策人数' },
            { value: '67%', label: '更希望没有销售参与的购买体验（2026 年调查）' },
          ]}
          source={`${GARTNER} · Gartner 新闻稿 2026-03-09`}
        />
      ),
    },
    {
      id: 'group',
      build: 'reveal',
      label: '采购小组',
      render: () => (
        <NumberedColumns
          kicker="采购小组"
          title="一次采购，十几个人点头"
          lead="Forrester 2024 年的买家调查：决策涉及的人和部门越来越多，采购也越来越容易卡住。"
          items={[
            { icon: 'users', tag: '决策人数', title: '平均 13 人', body: '一家机构里平均有 13 人参与采购决策。' },
            { icon: 'buildings', tag: '跨部门', title: '89% 跨部门', body: '89% 的采购涉及两个或更多部门。' },
            { icon: 'hourglass', tag: '停滞', title: '86% 曾停滞', body: '86% 的 B2B 采购在过程中出现过停滞。' },
            { icon: 'danger', tag: '买后', title: '81% 不满意', body: '81% 的买家对最终选定的供应商表示不满意。' },
          ]}
          source="Forrester · The State Of Business Buying, 2024（新闻稿 2024-12-04）"
        />
      ),
    },
    {
      id: 'in-market',
      tone: 'dark',
      label: '此刻在买的人',
      render: () => (
        <QuoteHero
          kicker="95:5"
          quote={['只有 5% 的 B2B 买家此刻在市场上，', '其余 95% 几个月甚至几年内都不会买。']}
          marks={['5%', '95%']}
          cite="LinkedIn B2B Institute 与 John Dawes，2021"
          notes={[
            { icon: 'target', label: '对 5% 做效果', text: '在市场上的买家，靠线索、演示和销售跟进转化。' },
            { icon: 'bookmark', label: '对 95% 建记忆', text: '不在市场上的买家，要在他们需要时先想起你。' },
            { icon: 'question', label: '不是精确值', text: 'Dawes 本人说明 95% 只是量级，不是精确规则。' },
          ]}
          source="Weinberg & Lombardo · The 95:5 rule is the new 60:40 rule · Marketing Week 2021-09-02"
        />
      ),
    },
    {
      id: 'personas',
      build: 'reveal',
      label: '买家画像',
      render: () => (
        <PersonaCards
          kicker="买家画像"
          title="同一笔采购，三个角色"
          lead="示例产品是一款面向中型企业的营销数据分析工具。三个角色要的东西不同，触达方式也不同。"
          personas={[
            {
              icon: 'user-speak',
              role: '市场负责人',
              part: '决策者',
              job: '让我能说清每一笔预算带来了多少客户',
              goals: ['预算分配有数据依据', '季度汇报少花时间'],
              pains: ['各渠道数据对不上', '归因靠手工表格'],
              channels: ['行业活动', '同行推荐', '分析报告'],
              focus: true,
            },
            {
              icon: 'user-check',
              role: '增长运营经理',
              part: '使用者',
              job: '每周一早上就能看到上周的漏斗变化',
              goals: ['少写取数脚本', '实验结果当天可看'],
              pains: ['等数据团队排期', '看板口径不统一'],
              channels: ['免费试用', '社区教程', '搜索'],
            },
            {
              icon: 'shield',
              role: 'IT 与数据负责人',
              part: '把关者',
              job: '接进来的新工具不能带来新的安全问题',
              goals: ['权限可控可审计', '和现有数仓打通'],
              pains: ['影子 IT 难管理', '安全评审周期长'],
              channels: ['安全白皮书', '技术文档'],
            },
          ]}
          source={DEMO}
        />
      ),
    },

    // ── 02 定位与定价 ──────────────────────────────────────────────────────
    {
      id: 'ch2',
      tone: 'dark',
      label: '定位与定价',
      render: () => (
        <SectionBreak
          kicker="第二章"
          index={2}
          icon="target"
          title="定位与定价"
          lead="定位回答「和谁比、凭什么赢」，定价回答「按什么收、收多少」。两件事都要在上市前写下来。"
          contents={['定位五要素', '竞争地图', '价格杠杆', '分档定价']}
        />
      ),
    },
    {
      id: 'positioning',
      build: 'focus',
      label: '定位五要素',
      render: () => (
        <FlowDiagram
          kicker="定位"
          title="定位从「客户本来会用什么」开始"
          lead="April Dunford 在《Obviously Awesome》里给出的五个组成部分，按推导顺序从左到右。"
          nodes={[
            { icon: 'transfer', title: '竞争替代', body: '没有你，客户会用什么解决这个问题？', parts: ['表格', '外包', '大厂套件'] },
            { icon: 'stars', title: '独特能力', body: '你有、而这些替代品没有的能力。' },
            { icon: 'medal', title: '差异化价值', body: '这些能力为客户带来的、可以证明的好处。', focus: true },
            { icon: 'users', title: '目标客户', body: '最在乎这份价值的那一类客户。' },
            { icon: 'layers', title: '市场类别', body: '让客户一听就明白你是什么的参照系。' },
          ]}
          source="April Dunford · Obviously Awesome（2019）· 作者网站"
        />
      ),
    },
    {
      id: 'map',
      label: '竞争地图',
      render: () => (
        <Quadrant
          kicker="竞争地图"
          title="找一块别人没占的位置"
          lead="两条轴取客户最在乎的两个维度。示例产品选的是「上手成本」和「分析深度」。"
          x={['上手难', '上手快']}
          y={['只看报表', '能做归因']}
          zones={['专家工具', '目标位置', '传统报表', '轻量看板']}
          points={[
            { label: '手工表格', x: 30, y: 14 },
            { label: '通用 BI', x: 22, y: 58 },
            { label: '营销云套件', x: 14, y: 84 },
            { label: '免费看板', x: 76, y: 26 },
            { label: '示例产品', x: 74, y: 76, focus: true },
          ]}
          notes={[
            { title: '轴要来自客户', body: '两个维度应该是客户访谈里反复出现的选择标准，不是你最强的两项功能。' },
            { title: '位置要能证明', body: '「上手快」要有试用数据支撑，例如首次出图的中位时间。' },
            { title: '对手会移动', body: '每个季度复核一次。大厂的新功能可能让空白位置消失。' },
          ]}
          source={DEMO}
        />
      ),
    },
    {
      id: 'price-lever',
      label: '价格杠杆',
      render: () => (
        <MetricBars
          kicker="价格杠杆"
          title={['同样改善 1%，', '价格最见效']}
          lead="McKinsey 基于 2,463 家公司的平均经营数据测算：每个杠杆改善 1%，营业利润分别提高多少。"
          rows={[
            { label: '价格提高 1%', value: 11.1, suffix: '%' },
            { label: '可变成本降 1%', value: 7.8, suffix: '%' },
            { label: '销量增加 1%', value: 3.3, suffix: '%' },
            { label: '固定成本降 1%', value: 2.3, suffix: '%' },
          ]}
          shares={false}
          pull={{ figure: '≈ 3×', text: '价格的作用约是销量的三倍，前提是销量不因提价下降。' }}
          source="Marn & Rosiello · Managing Price, Gaining Profit · HBR 1992 年 9–10 月"
        />
      ),
    },
    {
      id: 'price-point',
      label: '一句话',
      tone: 'accent',
      render: () => (
        <Statement
          kicker="价格杠杆"
          text={['价格提高 1%，', '利润提高 11.1%']}
          marks={['11.1%']}
          sub="所以定价放在上市之前定，不放在上市之后补。"
          source="Marn & Rosiello · Managing Price, Gaining Profit · HBR 1992 年 9–10 月"
        />
      ),
    },
    {
      id: 'tiers',
      label: '分档定价',
      render: () => (
        <PricingTiers
          kicker="分档定价"
          title="三档定价，把人引到中间那档"
          lead="按席位收费，档位之间按功能和支持区分。中间档是想让大多数客户选的一档。"
          tiers={[
            { name: '入门', price: '¥0', unit: '/ 3 席位', for: '个人和小团队试用', features: ['3 个数据源', '标准看板模板', '7 天数据保留'] },
            {
              name: '专业',
              price: '¥399',
              unit: '/ 席位 / 月',
              for: '有专职增长团队的中型企业',
              features: ['包含入门档全部功能', '不限数据源', '多触点归因', '每周自动报告', '工作日在线支持'],
              focus: true,
              badge: '推荐',
            },
            { name: '企业', price: '询价', for: '有安全评审的大型组织', features: ['包含专业档全部功能', '单点登录与审计日志', '私有化部署选项', '专属客户成功经理'] },
          ]}
          footnote="价值指标选「席位」，是因为分析价值随使用人数增长；试用转付费的门槛是第四个席位。"
          source={DEMO}
        />
      ),
    },

    // ── 03 上市执行 ─────────────────────────────────────────────────────────
    {
      id: 'ch3',
      tone: 'accent',
      label: '上市执行',
      render: () => (
        <SectionBreak
          kicker="第三章"
          index={3}
          icon="rocket"
          title="上市执行"
          lead="同时照顾两类买家：给此刻在买的 5% 做转化，给其余 95% 留下记忆。然后把节奏和分工写清楚。"
          contents={['渠道组合', '上市节奏', '就绪检查', '团队与分工']}
        />
      ),
    },
    {
      id: 'mix',
      label: '渠道组合',
      render: () => (
        <ShareBar
          kicker="渠道组合"
          title="预算随上市阶段换重心"
          lead="示例产品三个阶段的预算分配。上市前重内容和品牌，上市当月重投放和销售跟进。"
          legend={['品牌', '内容与搜索', '付费投放', '销售拓展', '伙伴']}
          focus={0}
          rows={[
            { label: '上市前', note: '第 1–6 周', values: [40, 35, 5, 15, 5] },
            { label: '上市当月', note: '第 7–10 周', values: [30, 15, 30, 20, 5] },
            { label: '上市后一季', note: '第 11 周起', values: [46, 20, 14, 12, 8] },
          ]}
          footnote="参考：Binet 与 Field 分析 IPA 数据库的 B2B 案例，效率最高时约 46% 预算给品牌、54% 给效果，并强调这只是指导原则。"
          source={`${DEMO} · 参考比例：Binet & Field · The 5 Principles of Growth in B2B Marketing（LinkedIn B2B Institute，2019）`}
        />
      ),
    },
    {
      id: 'plan',
      label: '上市节奏',
      render: () => (
        <Gantt
          kicker="上市节奏"
          title="十三周上市计划"
          lead="以第 7 周为上市日倒排。各条工作线可以重叠，但上市日之前必须过一次就绪评审。"
          axis={{ from: 1, to: 13, unit: '周' }}
          groups={[
            { label: '上市前', from: 1, to: 6 },
            { label: '上市', from: 7, to: 9 },
            { label: '上市后', from: 10, to: 13 },
          ]}
          rows={[
            { label: '定位与文案', from: 1, to: 3 },
            { label: '定价与计费', from: 2, to: 5 },
            { label: '官网与内容', from: 3, to: 7 },
            { label: '销售培训', from: 5, to: 7 },
            { label: '就绪评审', from: 6, to: 6, focus: true },
            { label: '上市活动', from: 7, to: 9 },
            { label: '复盘与调整', from: 10, to: 13 },
          ]}
          footnote="示意排期。B2B 采购周期长，上市后至少观察一个完整季度再判断效果。"
          source={DEMO}
        />
      ),
    },
    {
      id: 'ready',
      label: '就绪检查',
      render: () => (
        <StatusGrid
          kicker="就绪检查"
          title="上市前一周的就绪评审"
          lead="每个职能一张卡。任何一张是「阻塞」，上市日就要推迟或缩小范围。"
          labels={{ ok: '就绪', new: '新增', partial: '进行中', off: '阻塞' }}
          tiles={[
            { name: '产品', sub: '功能冻结', status: 'ok' },
            { name: '定价', sub: '价目表与折扣权限', status: 'ok' },
            { name: '官网', sub: '产品页与定价页', status: 'ok' },
            { name: '内容', sub: '案例与白皮书', status: 'partial', note: '两个客户案例待对方审批' },
            { name: '销售', sub: '话术与演示环境', status: 'partial', note: '演示数据集还在补充' },
            { name: '计费', sub: '订阅与发票', status: 'off', note: '企业档合同模板未定稿' },
            { name: '客服', sub: '知识库与工单', status: 'ok' },
            { name: '法务', sub: '协议与隐私政策', status: 'ok' },
            { name: '数据', sub: '漏斗看板', status: 'new', note: '新增首次出图时间埋点' },
          ]}
          source={DEMO}
        />
      ),
    },
    {
      id: 'team',
      label: '上市小组',
      build: 'reveal',
      render: () => (
        <Team
          kicker="上市小组"
          title="六个角色，各管一段"
          lead="小团队可以一人兼几个角色，但每一段都要有明确的负责人。下一页的分工表就按这些角色来排。"
          members={[
            { name: '上市负责人', initials: 'PMM', role: '产品营销 · 1 人', owns: '定位与文案，统筹上市节奏，对上市结果负责。', focus: true },
            { name: '需求增长', initials: 'DG', role: '市场 · 2 人', owns: '内容、活动与付费渠道，按季度交付合格线索。' },
            { name: '销售', initials: 'AE', role: '销售 · 3 人', owns: '跟进合格线索、演示和成交，记录丢单原因。' },
            { name: '售前顾问', initials: 'SE', role: '解决方案 · 1 人', owns: '技术评估和试用配置，回答 IT 与数据负责人的问题。' },
            { name: '客户成功', initials: 'CS', role: '客户成功 · 2 人', owns: '新客上手和续约，盯住第一次看到价值的时间。' },
            { name: '产品经理', initials: 'PM', role: '产品 · 1 人', owns: '定价档位和上市功能范围，把反馈排进路线图。' },
          ]}
          source={DEMO}
        />
      ),
    },
    {
      id: 'raci',
      label: '分工',
      render: () => (
        <Matrix
          kicker="分工"
          title="每件事只有一个人负责到底"
          lead="R 执行、A 负责、C 咨询、I 知会。每一行只能有一个 A。"
          columns={[
            { icon: 'presentation', label: '市场', note: '定位、内容、活动' },
            { icon: 'user-speak', label: '销售', note: '线索跟进、成交' },
            { icon: 'widget', label: '产品', note: '功能、定价' },
            { icon: 'users', label: '客户成功', note: '上手、续约' },
          ]}
          rows={[
            { label: '定位与文案', cells: ['A · R', 'C', 'C', 'I'] },
            { label: '定价与档位', cells: ['C', 'C', 'A · R', 'C'] },
            { label: '上市活动', cells: ['A · R', 'R', 'C', 'I'] },
            { label: '线索跟进', cells: ['C', 'A · R', null, 'I'] },
            { label: '新客上手', cells: ['I', 'C', 'C', 'A · R'] },
          ]}
          focus={0}
          footnote="示意分工。职能少的团队可以一人兼多职，但每一行仍然只写一个 A。"
          source={DEMO}
        />
      ),
    },

    // ── 04 衡量与增长 ──────────────────────────────────────────────────────
    {
      id: 'ch4',
      tone: 'dark',
      label: '衡量与增长',
      render: () => (
        <SectionBreak
          kicker="第四章"
          index={4}
          icon="chart"
          title="衡量与增长"
          lead="上市不是终点。用一个漏斗找流失，用一块看板盯指标，用收入桥看清钱从哪里来、往哪里去。"
          contents={['转化漏斗', '指标与诊断', '收入与留存', '飞轮与路线图']}
        />
      ),
    },
    {
      id: 'funnel',
      build: 'reveal',
      label: '转化漏斗',
      render: () => (
        <Funnel
          kicker="转化漏斗"
          title="先修最漏的那一级"
          lead="示例产品上市首月的漏斗。按相邻两级的转化率找最大流失，而不是只盯着顶部流量。"
          unit="人"
          stages={[
            { label: '官网访问', note: '独立访客', value: 48000 },
            { label: '注册试用', note: '完成注册', value: 2400 },
            { label: '激活', note: '首次出图', value: 960 },
            { label: '预约演示', note: '销售确认', value: 230 },
            { label: '付费', note: '签约', value: 86 },
          ]}
          leak={2}
          aside={{ title: '激活后尽快跟进', body: 'HBR 2011 年的研究：1 小时内联系线索的企业，确认线索资格的可能性约是晚一小时联系的 7 倍。' }}
          source={`${DEMO} · 跟进速度：Oldroyd 等 · The Short Life of Online Sales Leads · HBR 2011（数字为转引）`}
        />
      ),
    },
    {
      id: 'kpi',
      label: '指标看板',
      render: () => (
        <KpiBoard
          kicker="指标看板"
          title="一个北极星，六个输入指标"
          lead="北极星指标衡量客户得到的价值，并能提前反映收入。下面六个指标是推动它的输入。"
          star={{
            label: '北极星 · 每周活跃看板数',
            value: '1,240',
            delta: '+18%',
            good: true,
            trend: [420, 510, 560, 640, 700, 820, 910, 1050, 1240],
            note: '有 2 人以上查看的看板，按周去重',
          }}
          items={[
            { label: '新增 ARR', value: '¥42 万', delta: '+12%', good: true, trend: [18, 22, 21, 27, 30, 34, 38, 42] },
            { label: 'CAC 回收期', value: '16 月', delta: '−2 月', good: true, note: 'Bessemer：中型客户目标 < 18 个月' },
            { label: '净收入留存', value: '108%', delta: '+3 pt', good: true, note: '含扩容，扣除收缩与流失' },
            { label: '毛收入留存', value: '86%', delta: '−1 pt', good: false, note: 'Bessemer 观察多在 85–90%' },
            { label: '激活率', value: '40%', delta: '+5 pt', good: true, trend: [28, 30, 31, 33, 35, 36, 38, 40] },
            { label: '演示到付费', value: '37%', delta: '持平', note: '销售确认的演示为分母' },
          ]}
          source={`${DEMO} · 基准：Bessemer · Scaling to $100 Million · Amplitude · North Star Playbook`}
        />
      ),
    },
    {
      id: 'diagnose',
      label: '问题拆解',
      build: 'focus',
      render: () => (
        <IssueTree
          kicker="问题拆解"
          title="先拆问题，再找原因"
          lead="新客户数取决于线索数和转化率，还受成交周期影响。三个分支互不重叠，合起来覆盖整个问题。"
          root={{ title: '新客户增长为什么放缓？', note: '示例产品，本季度与上季度相比' }}
          branches={[
            { title: '线索变少', note: '看各渠道的线索量', leaves: ['付费渠道预算下调', '内容更新变慢', '活动有季节性'] },
            { title: '转化变低', note: '看漏斗每一级的转化率', leaves: ['首次响应变慢', '演示内容不对口', '试用没有上手'] },
            { title: '成交变慢', note: '看各阶段停留的天数', leaves: ['参与决策的人变多', '安全评审排队', '预算审批推迟'] },
          ]}
          focus={1}
          source={`${DEMO} · 方法：议题树，按互不重叠、完全穷尽（MECE）拆分`}
        />
      ),
    },
    {
      id: 'bridge',
      build: 'reveal',
      label: '收入桥',
      render: () => (
        <Waterfall
          kicker="收入桥"
          title="年度经常性收入从哪里来"
          lead="把一个季度的 ARR 变化拆成四块。新签带来增长，收缩和流失吃掉增长。"
          start={{ label: '期初 ARR', value: 1200 }}
          steps={[
            { label: '新签', value: 420 },
            { label: '扩容', value: 180 },
            { label: '收缩', value: -60 },
            { label: '流失', value: -140 },
          ]}
          end="期末 ARR"
          unit="万元"
          notes={[
            { key: '净收入留存 98%', text: '（期初 + 扩容 − 收缩 − 流失）÷ 期初，不算新签。' },
            { key: '毛收入留存 83%', text: '只扣收缩和流失、不算扩容，低于 Bessemer 观察到的 85–90%。' },
            { key: '先补流失', text: '流失比收缩大一倍多，先查这 140 万来自哪些客户。' },
          ]}
          source={`${DEMO} · 留存定义与基准：Bessemer · Scaling to $100 Million`}
        />
      ),
    },
    {
      id: 'retention',
      label: '留存',
      render: () => (
        <BigStat
          kicker="留存"
          title={['留住老客户，', '比想象的更值钱']}
          lead="Bain 的 Fred Reichheld 用金融服务业的数据说明：留存率的小幅提升，会放大成利润的大幅提升。"
          figure="25%"
          caption="金融服务业里，客户留存率提高 5%，利润提高超过 25%"
          support={[
            { value: '85–90%', label: 'Bessemer 观察到的云公司毛收入留存，相当稳定' },
            { value: '125%', label: 'Bessemer：ARR 1–10 百万美元公司的净收入留存中位数' },
          ]}
          source="Reichheld · Prescription for cutting costs · Bain Brief 2001-09 · Bessemer · Scaling to $100 Million"
        />
      ),
    },
    {
      id: 'cohort',
      label: '分批留存',
      build: 'reveal',
      render: () => (
        <Heatmap
          kicker="分批留存"
          title="按签约月份看留存"
          lead="每一行是同一个月签约的客户，往右是签约后的第几个月。颜色越深，留下来的客户越多。"
          cols={['第 1 月', '第 2 月', '第 3 月', '第 4 月', '第 5 月', '第 6 月']}
          rows={[
            { label: '1 月签约', sub: '42 家', values: [92, 86, 82, 79, 77, 76] },
            { label: '2 月签约', sub: '38 家', values: [93, 87, 83, 80, 78, null] },
            { label: '3 月签约', sub: '45 家', values: [90, 84, 80, 77, null, null] },
            { label: '4 月签约', sub: '51 家', values: [95, 91, 88, null, null, null] },
            { label: '5 月签约', sub: '47 家', values: [96, 92, null, null, null, null] },
            { label: '6 月签约', sub: '55 家', values: [96, null, null, null, null, null] },
          ]}
          unit="%"
          scale={['76%', '96%']}
          notes={[
            { key: '看行', text: '一行从左往右，是同一批客户随时间的留存。' },
            { key: '看列', text: '一列从上往下，是不同批次在同一阶段的表现。' },
            { key: '这一次', text: '4 月起改了上手流程，之后几批的第 2 月留存都在 91% 以上。' },
          ]}
          source={DEMO}
        />
      ),
    },
    {
      id: 'flywheel',
      build: 'focus',
      label: '增长飞轮',
      render: () => (
        <Cycle
          kicker="增长飞轮"
          title="AARRR：五个环节，首尾相接"
          lead="Dave McClure 在 2007 年提出的创业指标框架。推荐把老客户带来的新客户送回第一环。"
          hub={{ value: 'AARRR', caption: 'Dave McClure，2007' }}
          nodes={[
            { icon: 'search', title: '获客', tag: 'Acquisition', body: '客户从哪些渠道第一次接触到产品。' },
            { icon: 'bolt', title: '激活', tag: 'Activation', body: '第一次用就得到价值，例如首次出图。' },
            { icon: 'refresh', title: '留存', tag: 'Retention', body: '客户持续回来使用，每周都在看看板。' },
            { icon: 'chat', title: '推荐', tag: 'Referral', body: '客户把产品介绍给同事和同行。' },
            { icon: 'money', title: '收入', tag: 'Revenue', body: '客户付费、扩容和续约。' },
          ]}
          focus={1}
          source="Dave McClure · Startup Metrics for Pirates: AARRR!（2007-09-06，存档页）"
        />
      ),
    },
    {
      id: 'roadmap',
      label: '路线图',
      build: 'reveal',
      render: () => (
        <Roadmap
          kicker="路线图"
          title="上市后的四个季度"
          lead="路线图只排到季度，看方向和进度。按周的排期放在上市节奏那一页。"
          periods={['第 1 季度', '第 2 季度', '第 3 季度', '第 4 季度']}
          tracks={[
            { label: '产品', icon: 'widget' },
            { label: '市场', icon: 'presentation' },
            { label: '销售', icon: 'user-speak' },
            { label: '客户成功', icon: 'users' },
          ]}
          items={[
            { track: 0, from: 0, title: '公开测试版', status: 'done' },
            { track: 0, from: 1, title: '团队协作', status: 'doing' },
            { track: 0, from: 2, to: 3, title: '数据仓库连接器', status: 'next' },
            { track: 1, from: 0, title: '上市发布会', status: 'done' },
            { track: 1, from: 1, to: 2, title: '行业案例系列', status: 'doing' },
            { track: 1, from: 3, title: '年度报告', status: 'next' },
            { track: 2, from: 0, to: 1, title: '首批行业客户', status: 'doing' },
            { track: 2, from: 2, to: 3, title: '渠道伙伴计划', status: 'next' },
            { track: 3, from: 0, title: '上手流程', status: 'done' },
            { track: 3, from: 1, title: '续约预警', status: 'doing' },
            { track: 3, from: 2, to: 3, title: '客户社区', status: 'next' },
          ]}
          now={1.4}
          source={DEMO}
        />
      ),
    },
    {
      id: 'checklist',
      label: '上市清单',
      render: () => (
        <Checklist
          kicker="上市清单"
          title="上市前一天，再过一遍"
          items={[
            { title: '一句话定位已定稿', cmd: 'docs/gtm/positioning.md', note: '市场、销售、产品三方说法一致' },
            { title: '价格页与计费一致', cmd: '/pricing ↔ billing/plans.yaml', note: '页面价格、合同模板、发票金额核对过' },
            { title: '演示环境可用', cmd: 'https://demo.example.com', note: '用示例数据走完一遍完整演示' },
            { title: '线索分配规则生效', cmd: 'CRM › 线索 › 分配规则', note: '新注册 1 小时内分到销售名下' },
            { title: '漏斗看板埋点上线', cmd: 'signup · first_chart · demo_booked', note: '能看到每一级的人数与转化率' },
            { title: '客服知识库就位', cmd: 'https://help.example.com/launch', note: '前 20 个预期问题都有答案' },
            { title: '回滚方案写好', cmd: 'docs/gtm/rollback.md', note: '计费或注册出问题时怎样暂停' },
            { title: '复盘会已排期', cmd: '上市后第 2 周 · 第 6 周', note: '上市后第 2 周与第 6 周各一次' },
          ]}
          countLabel="已确认"
          source={DEMO}
        />
      ),
    },
    {
      id: 'closing',
      tone: 'dark',
      label: '结论',
      render: () => (
        <Closing
          kicker="结论"
          mark="GTM"
          statement="先想清楚卖给谁，再决定怎么卖。"
          follow="上市之后，用同一个漏斗和看板复盘。"
          takeaways={[
            '买家只用 17% 的采购时间见供应商，决定往往在见你之前就有了雏形。',
            '同时照顾两类买家：给此刻在买的 5% 做转化，给其余 95% 留下记忆。',
            '价格对利润的影响约是销量的三倍。上市前写清楚按什么收、收多少。',
          ]}
          refs={[
            'gartner.com · B2B Buying Journey',
            'forrester.com · State of Business Buying 2024',
            'hbr.org · Managing Price, Gaining Profit',
            'bvp.com/atlas · Scaling to $100M',
          ]}
        />
      ),
    },
  ],
}
