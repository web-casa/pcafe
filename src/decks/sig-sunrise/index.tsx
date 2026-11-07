// Signature templates for the `sunrise` style. 拾页 is a made-up website
// template kit and every figure, team and quote is illustrative. All pictures
// are AI-generated decorative illustrations (decor-*), not real people.

import type { DeckDef } from '../../kit'
import { BuyoutPricing, HomeTrio, KanbanDemo, KitBento, ProofMosaic, SunriseHero } from '../../kit'
import a1 from './assets/decor-a1.webp'
import a2 from './assets/decor-a2.webp'
import a3 from './assets/decor-a3.webp'
import a4 from './assets/decor-a4.webp'
import a5 from './assets/decor-a5.webp'
import portrait from './assets/decor-quote.webp'

const img = (src: string, alt: string, credit?: string) => ({ src, alt, credit })
const faces = [img(a1, '团队成员头像'), img(a2, '团队成员头像'), img(a3, '团队成员头像'), img(a4, '团队成员头像'), img(a5, '团队成员头像')]

export const deck: DeckDef = {
  title: '晨光 · 专属版式',
  iconStyle: 'line-duotone',
  style: 'sunrise',
  theme: 'violet',
  slides: [
    {
      id: 'hero',
      label: '开场',
      render: () => (
        <SunriseHero
          brand="拾页"
          links={['全部页面', '功能', '价格', '联系']}
          navCta="获取模板"
          title={['几天，而不是几周，', '上线你的 SaaS 官网']}
          lead="一套开箱即用的网站模板，搭任何一种现代产品官网。"
          ctas={['获取模板', '看全部示例']}
          cursors={['小周', '你']}
          dash={{
            gauge: { label: '本周完成度', value: 68 },
            trend: { label: '任务完成趋势', values: [40, 62, 48, 80, 58, 92, 70, 86, 64, 96] },
            team: {
              label: '团队',
              faces,
              tasks: [
                { title: '写定价页文案', status: '进行中' },
                { title: '首页动效', status: '待评审' },
              ],
            },
          }}
        />
      ),
    },
    {
      id: 'kit',
      label: '内容',
      render: () => (
        <KitBento
          stats={[
            { value: '19', label: '独立页面', body: '现成的页面，直接改内容就能上线。' },
            { value: '62+', label: '区块与组件', body: '拖拽组合，搭出独一无二的页面。' },
          ]}
          wide={{ title: '附带设计源文件', body: '发邮件附上购买凭证，我们把可编辑的设计源文件发给你。', frames: ['首页', '定价', '博客', '关于', '联系', '登录'] }}
        />
      ),
    },
    {
      id: 'homes',
      label: '首页',
      render: () => (
        <HomeTrio
          kicker="三套首页任选"
          title="3 套首页"
          items={[
            { name: '首页 1 · 任务管理', note: '数据图表放在首屏', variant: 'chart' },
            { name: '首页 2 · 团队协作', note: '日程和成员一眼看全', variant: 'calendar' },
            { name: '首页 3 · 远程团队', note: '深色首屏和页脚', variant: 'dark' },
          ]}
          pickedLabel="已选"
          hint="悬停卡片看整页，点击选中"
        />
      ),
    },
    {
      id: 'board',
      label: '看板',
      render: () => (
        <KanbanDemo
          kicker="功能 · 任务看板"
          title={['拖一下，', '进度就更新了']}
          lead="看板、列表和日历三种视图随时切换，团队每个人在做什么一目了然。"
          points={['拖拽改状态，自动通知负责人', '子任务和进度条自动汇总', '和常用协作工具双向同步']}
          views={['看板', '列表', '日历']}
          cursor="小周"
          faces={faces.slice(0, 4)}
          columns={[
            {
              name: '待办',
              count: 4,
              cards: [
                { tag: '设计', tone: 'accent', title: '定价页改版：加年付切换', due: '11 月 12 日', face: faces[0] },
                { tag: '内容', tone: 'lime', title: '写 3 篇客户案例', due: '11 月 15 日', face: faces[2] },
                { tag: '增长', tone: 'sun', title: '落地页 A/B 测试方案', due: '11 月 18 日', face: faces[4] },
              ],
            },
            {
              name: '进行中',
              cards: [
                { tag: '设计', tone: 'accent', title: '首页动效', progress: 65, face: faces[1] },
                { tag: '开发', tone: 'coral', title: '接入支付回调', progress: 40, face: faces[3] },
              ],
            },
            {
              name: '完成',
              count: 12,
              cards: [
                { tag: '内容', tone: 'lime', title: '帮助中心 20 篇文档', face: faces[2] },
                { tag: '开发', tone: 'coral', title: '注册流程改版', face: faces[3] },
              ],
            },
          ]}
          hint="点任务卡，它会移到下一列"
        />
      ),
    },
    {
      id: 'proof',
      label: '口碑',
      render: () => (
        <ProofMosaic
          kicker="客户怎么说"
          title="用过的团队都说好"
          quote={{
            text: '换成拾页模板后，官网从立项到上线只用了 4 天。省下的时间我们全拿去打磨产品了。',
            name: '许宁',
            role: '联合创始人 · Flowly',
            image: img(portrait, '一位穿西装外套、面带微笑的女性', '插图：AI 生成（示意）'),
          }}
          stat={{ value: '2,400+', label: ['团队用它', '上线了官网'] }}
          items={[
            { text: '组件拼起来就是一页，设计师和开发终于不用来回对稿了。', name: '韩东', role: '前端负责人 · Notely', face: faces[1], result: { value: '-60%', label: '对稿时间' } },
            { text: '设计源文件很干净，改品牌色 10 分钟就搞定。', name: '苏晴', role: '设计师 · Ledgerly', face: faces[2], result: { value: '10 分钟', label: '换一套品牌色' } },
          ]}
          source="示意数据"
        />
      ),
    },
    {
      id: 'pricing',
      label: '价格',
      render: () => (
        <BuyoutPricing
          kicker="价格 · 示意"
          title="一次买断，永久使用"
          plans={[
            {
              name: '个人版',
              price: '¥299',
              unit: '一次性',
              body: '一个人做官网，够用了。',
              items: ['全部 19 个页面', '62+ 区块与组件', '1 个网站使用'],
              facts: [
                { label: '网站数量', value: '1 个' },
                { label: '免费更新', value: '6 个月' },
              ],
              cta: '购买个人版',
            },
            {
              name: '团队版',
              price: '¥899',
              unit: '一次性',
              body: '设计和开发一起用，交付更快。',
              badge: '推荐',
              items: ['个人版全部内容', '设计源文件', '不限网站数量', '一年免费更新'],
              facts: [
                { label: '网站数量', value: '不限' },
                { label: '免费更新', value: '1 年' },
              ],
              cta: '购买团队版',
            },
          ]}
          close={{
            title: ['今天开始，', '周末上线。'],
            body: '先免费预览全部页面，满意再买。',
            points: ['30 天内不满意全额退款', '一次付费，永久使用', '附赠部署教程'],
            faces,
            count: { value: '2,400+', label: '团队已在用' },
            cta: '免费预览',
          }}
          hint="点套餐卡切换选中"
        />
      ),
    },
  ],
}
