// Signature templates for the `atelier` style. 白屋设计 is a made-up studio and
// every figure is illustrative. All pictures are AI-generated decorative
// illustrations (decor-*), not real work, clients or people.

import type { DeckDef } from '../../kit'
import { AtelierHero, BookingClose, ProcessQuote, ProjectPair, ServiceTrio, TeamBanner } from '../../kit'
import face from './assets/decor-face.webp'
import p1 from './assets/decor-p1.webp'
import p2 from './assets/decor-p2.webp'
import s1 from './assets/decor-s1.webp'
import s2 from './assets/decor-s2.webp'
import s3 from './assets/decor-s3.webp'
import t1 from './assets/decor-t1.webp'
import t2 from './assets/decor-t2.webp'
import t3 from './assets/decor-t3.webp'
import t4 from './assets/decor-t4.webp'
import team from './assets/decor-team.webp'

const img = (src: string, alt: string, credit?: string) => ({ src, alt, credit })
const AI = '插图：AI 生成（示意）'

export const deck: DeckDef = {
  title: '设计室 · 专属版式',
  iconStyle: 'line-duotone',
  style: 'atelier',
  theme: 'cobalt',
  slides: [
    {
      id: 'hero',
      label: '开场',
      render: () => (
        <AtelierHero
          badge="视觉与产品设计 · 本月可接 2 个项目"
          title={['让人信任、', '也愿意买单的设计']}
          lead="帮助公司在拥挤的市场里脱颖而出，用心做品牌和产品设计。"
          ctas={['预约免费沟通', '看作品']}
          clients={['Proofly', 'Taskgen', 'Trackly', 'Fieldnote', 'Orbit']}
          strip={[
            img(t3, '笔记本电脑上打开的海景网站'),
            img(t4, '一个印着图形标志的纸袋和杯子'),
            img(s1, '桌上铺开的标志草图和色卡'),
            img(t1, '两部手机上的面包店点单界面'),
            img(t2, '一本淡紫色笔记本和信封'),
          ]}
        />
      ),
    },
    {
      id: 'work',
      label: '精选项目',
      render: () => (
        <ProjectPair
          kicker="精选项目"
          title={['从策略出发，', '用手艺收尾。']}
          projects={[
            { image: img(p1, '桌上显示器里是一个蓝紫色球体的网站首页', AI), name: '远拓 · AI 服务机构', tag: '网站设计' },
            { image: img(p2, '笔记本电脑上的经营仪表盘', AI), name: '复兴 · 经营仪表盘', tag: '产品设计' },
          ]}
        />
      ),
    },
    {
      id: 'process',
      label: '合作方式',
      build: 'reveal',
      render: () => (
        <ProcessQuote
          kicker="合作方式"
          title={['四步，', '从想法到上线。']}
          steps={[
            { title: '定位访谈', body: '两次访谈，弄清楚用户、对手和你最想赢的那件事。', time: '第 1 周' },
            { title: '方向探索', body: '三套视觉方向，选一套深入。', time: '第 2 周' },
            { title: '设计与原型', body: '关键页面高保真，可点击原型。', time: '第 3–5 周' },
            { title: '交付与陪跑', body: '组件库、开发对接，上线后两周跟进。', time: '第 6 周' },
          ]}
          portrait={img(face, '一位双臂交叉、面带微笑的女性', AI)}
          rating="5.0 · 40+ 位客户"
          quote={{ text: '改版上线一个月，试用转付费从 3.1% 涨到 4.6%。最难得的是每个决定都说得清为什么。', by: '周岚', role: '增长负责人 · 远拓' }}
          source="示意数据，非真实客户"
        />
      ),
    },
    {
      id: 'services',
      label: '服务',
      build: 'reveal',
      render: () => (
        <ServiceTrio
          kicker="服务"
          title="三件事，我们做得最好"
          services={[
            { image: img(s1, '桌上的标志草图、色卡和铅笔'), title: '品牌识别', body: '标志、配色、字体和规范，让品牌在每个触点都一样。', tags: ['标志', '视觉规范', '包装'] },
            { image: img(s2, '平板上的网页线框图和手绘草图'), title: '官网设计', body: '从信息架构到高保真，帮访客更快看懂你、更愿意留资。', tags: ['落地页', '官网改版', '开发对接'] },
            { image: img(s3, '手里拿着一部显示健康应用的手机'), title: '产品界面', body: 'App 和 SaaS 界面，配一套开发能直接用的组件库。', tags: ['App', '后台', '设计系统'] },
          ]}
        />
      ),
    },
    {
      id: 'team',
      label: '关于我们',
      render: () => (
        <TeamBanner
          kicker="关于我们"
          image={img(team, '五个人站在明亮的工作室里微笑', AI)}
          statement={['五个人，一间工作室，', '只接想做好的项目。']}
          note="2018 年成立 · 上海"
          stats={[
            { value: '120+', label: '完成的项目' },
            { value: '4.9', label: '40+ 位客户评分' },
            { value: '68%', label: '客户回来做第二个项目' },
          ]}
          source="示意数据"
        />
      ),
    },
    {
      id: 'book',
      label: '聊聊',
      render: () => (
        <BookingClose
          hint="点日期和时间试试"
          badge="本月还能接 2 个项目"
          title={['聊聊你的', '下一个项目']}
          lead="30 分钟视频沟通，不收费。聊完你会拿到一份初步方向和报价区间。"
          ctas={['预约免费沟通', '先看作品集']}
          contacts={[
            { value: 'hi@baiwu.example', label: '邮件' },
            { value: 'baiwu_studio', label: '微信' },
          ]}
          card={{
            avatar: img(face, '周岚的头像'),
            name: '周岚 · 创始人',
            note: '30 分钟 · 视频会议',
            status: '可预约',
            month: '2026 年 11 月',
            offset: 0,
            from: 2,
            days: 21,
            open: [5, 6, 7, 8, 11, 12, 13, 14, 15, 18, 19, 20, 21, 22],
            slots: ['10:00', '14:30', '16:00'],
          }}
        />
      ),
    },
  ],
}
