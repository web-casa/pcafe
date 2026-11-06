// Sample: the person, companies and numbers are invented.
import type { ResumeDef, ResumeSection } from '../../paper'
import { SAMPLE } from '../resume-sample'

const [work, projects, skills, edu] = SAMPLE.sections
const short = (s: ResumeSection): ResumeSection => (s.type === 'work' ? { ...s, items: s.items.map((w) => ({ ...w, context: undefined, points: w.points?.slice(0, 3) })) } : s)

export const paper: ResumeDef = {
  ...SAMPLE,
  layout: 'showcase',
  theme: 'crimson',
  asOf: '2026.10',
  badge: { event: 'OPEN TO WORK', initials: '陆', role: '高级产品经理', code: 'PM · 7 YRS', strap: 'LU YUAN' },
  highlights: [
    { value: '4.2 倍', label: '两年付费收入增长', trend: [1, 1.1, 1.3, 1.6, 2, 2.5, 3.3, 4.2] },
    { value: '43%', label: '首周留存（原 31%）', trend: [31, 32, 34, 33, 36, 39, 41, 43] },
    { value: '46 个', label: '一年跑完的实验', trend: [2, 5, 9, 14, 20, 28, 37, 46] },
  ],
  sections: [
    { type: 'track', title: '职业轨迹' },
    short(work),
    { ...projects, items: projects.type === 'work' ? projects.items.slice(0, 1) : [] } as ResumeSection,
    { type: 'impact', title: '改变了什么', side: true, rows: [
      { label: '首周留存', before: 31, after: 43, unit: '%' },
      { label: '上手步骤', before: 9, after: 3, unit: '步' },
      { label: '建表时间', before: 14, after: 5, unit: '分钟' },
      { label: '版本周期', before: 6, after: 2, unit: '周' },
    ] },
    skills,
    edu,
  ],
}
