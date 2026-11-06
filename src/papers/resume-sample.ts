// Shared sample for the résumé layouts. The person, companies and numbers are invented.
import type { ResumeDef } from '../paper'

export const SAMPLE: Omit<ResumeDef, 'layout' | 'theme'> = {
  kind: 'resume',
  name: '陆予安',
  headline: '高级产品经理（开发者工具）',
  contact: [
    { value: 'luyuan@example.com', href: 'mailto:luyuan@example.com' },
    { value: '138-0000-0000' },
    { value: '上海' },
    { value: 'example.com/luyuan', href: 'https://example.com/luyuan' },
  ],
  summary: '做了七年开发者工具，从工程师转产品。擅长把含糊的需求拆成可以验证的小实验，用数据决定下一步。最近两年专注让 AI 生成的结果稳定可用。',
  highlights: [
    { value: '4.2 倍', label: '两年付费收入增长' },
    { value: '38%', label: '首周留存提升' },
    { value: '12 人', label: '带过的跨职能团队' },
  ],
  sections: [
    {
      type: 'work',
      title: '工作经历',
      items: [
        {
          org: '青梧云',
          role: '高级产品经理',
          period: '2022.03 – 至今',
          place: '上海',
          context: '面向开发团队的协作平台，负责 AI 辅助文档产品线',
          points: [
            '从零做出 AI 文档助手，上线 18 个月带动付费收入增长 4.2 倍',
            '把首次使用流程从 9 步砍到 3 步，首周留存从 31% 提到 43%',
            '建立每周实验机制，一年跑完 46 个实验，其中 17 个全量上线',
            '协调 12 人跨职能团队，把版本周期从六周缩短到两周',
          ],
        },
        {
          org: '砚田数据',
          role: '产品经理',
          period: '2019.07 – 2022.02',
          place: '杭州',
          context: '数据分析 SaaS，负责查询与可视化模块',
          points: [
            '重做查询编辑器，平均建表时间从 14 分钟降到 5 分钟',
            '访谈 60 位客户后砍掉三个低用量功能，维护成本下降约两成',
            '主导企业版权限体系，帮助销售拿下首批 8 家百人以上客户',
          ],
        },
        {
          org: '砚田数据',
          role: '前端工程师',
          period: '2017.07 – 2019.06',
          place: '杭州',
          points: ['写了团队第一版图表组件库，后来被四条产品线共用', '在内部发起用户反馈周会，因此转岗产品'],
        },
      ],
    },
    {
      type: 'work',
      title: '代表项目',
      items: [
        {
          org: '模板校验器',
          role: '发起人',
          period: '2023',
          points: ['让 AI 生成的文档先过自动版式检查再交付，返工率下降一半，后来成为团队的默认流程'],
        },
        {
          org: '客户声音周报',
          role: '负责人',
          period: '2020 – 2022',
          points: ['把散落在客服、销售和社区的反馈合成一份周报，三个季度的路线图因此调整了 5 项'],
        },
      ],
    },
    {
      type: 'tags',
      title: '技能',
      side: true,
      groups: [
        { label: '产品', items: ['需求拆解', '实验设计', '用户访谈', '定价', '路线图'] },
        { label: '数据', items: ['SQL', 'A/B 测试', '漏斗分析', '留存分析'] },
        { label: '技术', items: ['TypeScript', 'React', 'Prompt 设计', 'API 设计'] },
      ],
    },
    {
      type: 'work',
      title: '教育',
      side: true,
      items: [{ org: '华东某大学', role: '软件工程 本科', period: '2013 – 2017' }],
    },
    {
      type: 'list',
      title: '其他',
      side: true,
      items: ['英语 CET-6，可作为工作语言', '技术社区分享 11 场', '开源项目维护者'],
    },
  ],
  note: '示例简历：人物、公司和数字均为虚构。',
}
