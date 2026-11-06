// Starter résumé. Change `layout` to classic, sidebar, banner or ledger; the content stays the same.
import type { ResumeDef } from '../../paper'

export const paper: ResumeDef = {
  kind: 'resume',
  layout: 'classic',
  theme: 'crimson',
  name: '你的姓名',
  headline: '目标职位',
  contact: [{ value: 'you@example.com', href: 'mailto:you@example.com' }, { value: '手机号' }, { value: '城市' }],
  summary: '用两三句话说明你是谁、擅长什么、接下来想做什么。',
  highlights: [{ value: '00%', label: '面试时讲得清楚的成果' }],
  sections: [
    {
      type: 'work',
      title: '工作经历',
      items: [{ org: '公司', role: '职位', period: '2022.03 – 至今', context: '一句话说明业务和你的职责', points: ['先写结果，再写做法'] }],
    },
    { type: 'tags', title: '技能', side: true, groups: [{ items: ['技能一', '技能二'] }] },
    { type: 'work', title: '教育', side: true, items: [{ org: '学校', role: '专业 学位', period: '2013 – 2017' }] },
  ],
}
