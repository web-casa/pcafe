// Signature templates for the `slate` style. 数衡 is a made-up workflow analytics product;
// every customer wordmark, figure and price is illustrative.

import type { DeckDef } from '../../kit'
import { SlateCompare, SlateConnect, SlateHero, SlatePricing, SlateSteps, SlateTrend } from '../../kit'

export const deck: DeckDef = {
  title: '立体看板 · 专属版式',
  iconStyle: 'line-duotone',
  style: 'slate',
  theme: 'cobalt',
  slides: [
    {
      id: 'hero',
      label: '开场',
      render: () => (
        <SlateHero
          hint="点看板上的数字卡，图表会跟着换"
          chip={['2.0 版', '更聪明，也更快']}
          title={['用 {bolt} 数衡', '理顺你的工作流']}
          lead="把散在表格、群聊和工单里的数字收到一块看板上，每天早上一眼看清该先处理什么。"
          ctas={['免费试用 14 天', '看 2 分钟演示']}
          logos={['Halden', 'Orbit&Co', 'KAIROS', '青禾']}
          dash={{
            tabs: ['总览', '收入', '团队', '报表'],
            hello: '早上好，林秋',
            note: '本周比上周多完成了 18% 的任务',
            kpis: [
              { label: '本月收入', value: '¥156.6万', delta: '+12.4%', series: [42, 50, 46, 58, 62, 55, 70, 74, 68, 82, 88, 94] },
              { label: '新增订阅', value: '¥54.2万', delta: '+8.1%', series: [30, 34, 40, 38, 44, 52, 48, 56, 60, 58, 66, 72] },
              { label: '活跃团队', value: '2,987', delta: '+326', series: [60, 58, 64, 66, 70, 68, 74, 76, 80, 84, 82, 90] },
            ],
            chart: '近 12 周',
          }}
          float="已自动同步 ✓"
        />
      ),
    },
    {
      id: 'steps',
      label: '三步上手',
      render: () => (
        <SlateSteps
          hint="把鼠标移到卡片上"
          dot="三步上手"
          title={['接入、整理、行动，', '一个下午就能跑起来']}
          lead="不用写代码，也不用重新搭一套系统。"
          steps={[
            { tag: '步骤 1', title: '连上现有工具', body: '授权一次，表格、工单和支付数据会自动流进来。', vis: 'nodes' },
            { tag: '步骤 2', title: '自动整理指标', body: '数衡按团队和项目分好类，重复的记录自己合并。', vis: 'bars' },
            { tag: '步骤 3', title: '照着提醒行动', body: '指标偏离目标时，负责的人会第一时间收到提醒。', vis: 'gauge', value: 86 },
          ]}
          source="接入时长为内测团队的中位数，仅作示意。"
        />
      ),
    },
    {
      id: 'compare',
      label: '对比',
      render: () => (
        <SlateCompare
          hint="打开右上角开关，只看不一样的地方"
          dot="为什么换过来"
          title={['同样的预算，', '少开一半的会']}
          lead="大多数团队换过来的理由很朴素：数字终于对得上了，周会不用再先对半小时的表。"
          cta="预约演示"
          stats={[
            { value: '41%', label: '周会时长减少' },
            { value: '3.2×', label: '问题发现更早' },
            { value: '9 天', label: '平均回本周期' },
          ]}
          cols={['数衡', '传统报表']}
          rows={[
            { icon: '⌁', label: '实时同步数据', ours: true, theirs: false },
            { icon: '◎', label: '按团队拆分指标', ours: true, theirs: true },
            { icon: '↯', label: '偏离目标自动提醒', ours: true, theirs: false },
            { icon: '▤', label: '导出表格', ours: true, theirs: true },
            { icon: '⌘', label: '不写代码就能接入', ours: true, theirs: false },
            { icon: '✦', label: '权限细到每张看板', ours: true, theirs: false },
            { icon: '☰', label: '历史版本可回看', ours: true, theirs: true },
          ]}
          source="数据来自 2026 年 9 月对 120 个内测团队的调查，仅作示意。"
        />
      ),
    },
    {
      id: 'trend',
      label: '增长',
      render: () => (
        <SlateTrend
          hint="点左侧的指标，曲线会换"
          dot="上线一年"
          title="每一条曲线都在往上走"
          series={[
            { label: '月度经常性收入', value: '¥156.6万', delta: '+212%', points: [50, 56, 54, 62, 70, 68, 80, 92, 98, 110, 128, 156] },
            { label: '付费团队', value: '2,987', delta: '+164%', points: [1130, 1240, 1300, 1420, 1560, 1700, 1880, 2050, 2260, 2480, 2720, 2987] },
            { label: '净留存率', value: '118%', delta: '+9 点', points: [109, 110, 110, 112, 111, 113, 114, 115, 115, 116, 117, 118] },
          ]}
          xs={['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']}
          note="所有数字均为虚构示例。"
        />
      ),
    },
    {
      id: 'pricing',
      label: '定价',
      render: () => (
        <SlatePricing
          hint="用右上角的 − / + 改人数，价格会跟着算"
          dot="定价"
          title="按人数付费，随时增减"
          seats={10}
          step={5}
          plans={[
            { name: '入门', note: '小团队先把数字收拢', perSeat: 39, items: ['3 张看板', '5 个数据源', '每日同步', '邮件提醒'], cta: '免费开始' },
            { name: '团队', note: '多数团队的选择', perSeat: 79, items: ['不限看板', '30 个数据源', '实时同步', '群聊与邮件提醒', '看板级权限'], cta: '试用 14 天' },
            { name: '企业', note: '需要私有部署与审计', custom: '联系我们', items: ['私有部署', '单点登录', '审计日志', '专属客户成功经理'], cta: '预约沟通' },
          ]}
          source="价格为示意，不含税。"
        />
      ),
    },
    {
      id: 'connect',
      label: '集成',
      render: () => (
        <SlateConnect
          hint="把鼠标移到外圈的工具上"
          dot="集成"
          title={['你已经在用的工具，', '{link} 都能接上']}
          lead="40 多个现成连接器，授权一次就开始同步。没有的，开放接口一天之内能接好。"
          ctas={['开始免费试用', '查看全部集成']}
          note="无需信用卡 · 14 天全功能试用 · 随时取消"
          tools={[
            { name: '表格', mark: '▦' },
            { name: '工单', mark: '✓' },
            { name: '支付', mark: '¥' },
            { name: '群聊', mark: '◍' },
            { name: '日历', mark: '◷' },
            { name: '代码库', mark: '</>' },
            { name: '客服', mark: '☏' },
            { name: '表单', mark: '☰' },
          ]}
        />
      ),
    },
  ],
}
