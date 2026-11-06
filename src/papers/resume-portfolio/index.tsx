// Sample: the person and companies are invented. The thumbnails are PCafe's own example decks.
import type { DeckDef, ResumeDef } from '../../paper'
import { deck as apollo } from '../../decks/v2-p2'
import { deck as fedora } from '../../decks/v3-p1'
import { deck as deepseek } from '../../decks/v3-p4'
import { deck as storage } from '../../decks/v3-p5'
import { deck as solar } from '../../decks/v2-p4'
import { deck as postgres } from '../../decks/v3-p2'

const shot = (deck: DeckDef, n = 1) => ({ render: deck.slides[n - 1].render, theme: deck.theme, style: deck.style })

export const paper: ResumeDef = {
  kind: 'resume',
  layout: 'portfolio',
  theme: 'cobalt',
  asOf: '2026.10',
  name: '温见山',
  headline: '信息设计师（数据叙事与品牌）',
  contact: [
    { value: 'jianshan@example.com', href: 'mailto:jianshan@example.com' },
    { value: '137-0000-0000' },
    { value: '深圳' },
    { value: 'example.com/jianshan', href: 'https://example.com/jianshan' },
  ],
  summary: '把复杂的内容讲成别人愿意看完的东西。做过年报、发布会和技术白皮书，习惯从故事线开始，而不是从版式开始。',
  highlights: [
    { value: '3 年', label: '带领内容设计组', trend: [1, 2, 3, 4, 5, 6] },
    { value: '40+', label: '发布会与年报', trend: [4, 9, 15, 22, 31, 42] },
  ],
  sections: [
    { type: 'track', title: '职业轨迹' },
    {
      type: 'work',
      title: '工作经历',
      items: [
        {
          org: '遥山工作室',
          role: '设计负责人',
          period: '2023.02 – 至今',
          place: '深圳',
          context: '十人规模的信息设计工作室，服务科技和金融客户',
          points: [
            '带 4 人小组完成 40 多份发布会和年报，客户续约率超过八成',
            '把常用版式沉淀成模板库，单份演示的制作周期从 3 周缩短到 6 天',
            '建立图表规范，让非设计同事也能做出一致的数据页',
          ],
        },
        {
          org: '白露传媒',
          role: '高级视觉设计师',
          period: '2019.06 – 2023.01',
          place: '广州',
          context: '财经媒体，负责数据新闻和专题',
          points: [
            '主笔 60 多篇数据专题，其中 3 篇获行业年度奖提名',
            '和编辑部一起建立选题到发布的流程，平均出稿时间减少四成',
          ],
        },
        {
          org: '白露传媒',
          role: '视觉设计师',
          period: '2017.07 – 2019.05',
          place: '广州',
          points: ['从零搭建图表组件，把日常配图的制作时间从半天缩短到一小时'],
        },
      ],
    },
    { type: 'impact', title: '改变了什么', rows: [
      { label: '单份演示制作周期', before: 21, after: 6, unit: '天' },
      { label: '日常配图制作时长', before: 4, after: 1, unit: '小时' },
    ] },
    { type: 'tags', title: '技能', groups: [
      { label: '设计', items: ['信息设计', '数据可视化', '版式系统', '品牌规范'] },
      { label: '工具', items: ['Figma', 'After Effects', 'D3', 'HTML / CSS'] },
    ] },
    { type: 'work', title: '教育', items: [{ org: '华南某大学', role: '视觉传达 本科', period: '2013 – 2017' }] },
    {
      type: 'projects',
      title: '代表项目',
      page: 2,
      items: [
        { name: '阿波罗 11 号的八天', role: '故事线与设计', period: '2026', text: '把八天任务讲成一条时间线，从发射到返回，每一步都有出处。', shot: shot(apollo) },
        { name: '认识 Fedora Linux', role: '信息结构', period: '2026', text: '用产品页的讲法介绍一个操作系统，让新用户知道从哪里开始。', shot: shot(fedora) },
        { name: 'DeepSeek-V4.1-Flash', role: '数据叙事', period: '2026', text: '把一份技术规格拆成读者能比较的数字：价格、窗口和时段。', shot: shot(deepseek) },
        { name: '介绍对象存储', role: '概念讲解', period: '2026', text: '从一个常见的误解讲起，用图解释键、桶和存储层级。', shot: shot(storage) },
        { name: '太阳能的十年', role: '数据图表', period: '2026', text: '十年数据用一组图讲完：发电量涨了多少，价格降了多少。', shot: shot(solar) },
        { name: '认识 PostgreSQL', role: '历史叙事', period: '2026', text: '从伯克利的研究项目讲到今天，再落到一条查询怎样执行。', shot: shot(postgres) },
      ],
    },
  ],
  note: '示例简历：人物和公司均为虚构。项目缩略图是 PCafe 的示例演示，用来展示版式。',
}
