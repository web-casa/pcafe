// Sample: the person, companies and numbers are invented.
import type { ResumeDef } from '../../paper'

export const paper: ResumeDef = {
  kind: 'resume',
  layout: 'console',
  theme: 'emerald',
  asOf: '2026.10',
  name: '许明澈',
  headline: '资深后端工程师（基础设施）',
  contact: [
    { value: 'mingche@example.com', href: 'mailto:mingche@example.com' },
    { value: '139-0000-0000' },
    { value: '北京' },
    { value: 'example.com/mingche', href: 'https://example.com/mingche' },
  ],
  summary: '九年后端，最近五年做支付和云平台的基础设施。喜欢把线上问题变成再也不会发生的机制：先量化，再改架构，最后写进流程。',
  terminal: {
    window: 'mingche — ~/oncall',
    steps: [
      { cmd: 'p99 --service payments', out: ['420 ms → 95 ms（重写路由层之后）'] },
      { cmd: 'mttr --last 12mo', out: ['58 min → 12 min，值班人数没有增加'] },
      { cmd: 'deploys --per-day', out: ['1 次 → 40 次，失败率 2.1% → 0.4%'] },
    ],
  },
  sections: [
    { type: 'track', title: '职业轨迹' },
    {
      type: 'work',
      title: '工作经历',
      items: [
        {
          org: '栖木云',
          role: '资深后端工程师',
          period: '2021.04 – 至今',
          place: '北京',
          context: '云平台基础设施组，负责网关和部署系统',
          points: [
            '重写网关路由层，p99 延迟从 420 ms 降到 95 ms，同等流量下机器减少 34%',
            '设计灰度发布系统，日部署从 1 次到 40 次，变更失败率从 2.1% 降到 0.4%',
            '建立故障复盘机制，一年内重复故障从 11 起降到 2 起',
            '带 5 人小组完成核心库从 MySQL 到分布式数据库的不停机迁移',
          ],
        },
        {
          org: '鹿鸣支付',
          role: '高级后端工程师',
          period: '2018.06 – 2021.03',
          place: '杭州',
          context: '支付核心系统，日交易千万级',
          points: [
            '主导账务系统拆分，大促峰值承载能力提升 6 倍，全程零资损',
            '搭建全链路压测平台，后来成为全公司上线前的必经流程',
          ],
        },
        {
          org: '鹿鸣支付',
          role: '后端工程师',
          period: '2017.07 – 2018.05',
          place: '杭州',
          points: ['负责对账服务，把每日人工对账从 4 小时缩短到 20 分钟'],
        },
      ],
    },
    {
      type: 'work',
      title: '开源与分享',
      items: [
        { org: 'ratewall', role: '作者', period: '2022', points: ['分布式限流库，被公司内 30 多个服务使用'] },
        { org: '技术大会演讲', role: '讲者', period: '2023', points: ['分享不停机数据库迁移的做法和踩过的坑'] },
      ],
    },
    { type: 'gauges', title: '线上指标', side: true, items: [
      { value: 99.97, max: 100, text: '99.97%', label: '全年可用性' },
      { value: 34, max: 100, text: '34%', label: '机器成本降低' },
    ] },
    { type: 'heat', title: '技术栈使用年份', side: true,
      years: ['19', '20', '21', '22', '23', '24', '25', '26'],
      rows: [
        { label: 'Go', levels: [1, 2, 3, 3, 3, 3, 3, 3] },
        { label: 'Java', levels: [3, 3, 2, 1, 1, 0, 0, 0] },
        { label: 'Rust', levels: [0, 0, 0, 1, 1, 2, 2, 3] },
        { label: 'Kubernetes', levels: [0, 1, 2, 3, 3, 3, 3, 3] },
        { label: 'PostgreSQL', levels: [0, 0, 2, 3, 3, 3, 2, 2] },
        { label: 'Kafka', levels: [2, 3, 3, 2, 2, 2, 1, 1] },
      ],
      legend: '颜色越深用得越多：偶尔、经常、每天。' },
    { type: 'work', title: '教育', side: true, items: [{ org: '华北某大学', role: '计算机科学 本科', period: '2013 – 2017' }] },
    { type: 'list', title: '其他', side: true, items: ['英语可作为工作语言', '值班 On-call 负责人三年'] },
  ],
  note: '示例简历：人物、公司和数字均为虚构。',
}
