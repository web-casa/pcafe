// Signature templates for the `diptych` style. 柏一 is a made-up independent designer
// and every client, figure and price is illustrative. All pictures are AI-generated
// decorative illustrations (decor-*), not real work, clients or people.

import type { DeckDef } from '../../kit'
import { DiptychAbout, DiptychContact, DiptychHero, DiptychServices, DiptychWords, DiptychWorks } from '../../kit'
import bloom from './assets/decor-bloom.webp'
import cup from './assets/decor-cup.webp'
import flame from './assets/decor-flame.webp'
import me from './assets/decor-me.webp'
import tulip from './assets/decor-tulip.webp'
import vase from './assets/decor-vase.webp'

const img = (src: string, alt: string, focus?: string) => ({ src, alt, focus })
const SIG = 'Baiyi'
const FLAME = img(flame, '一枝动态模糊的橙色花，像火焰')
const VASE = img(vase, '浅蓝玻璃瓶里插着一根白色枝条')
const TULIP = img(tulip, '粉色背景前一朵晃动的深红郁金香')
const BLOOM = img(bloom, '深蓝背景里一只手举着一朵黄色小花')
const CUP = img(cup, '石台上一只灰绿陶杯和一块亚麻餐巾', '50% 60%')
const ME = img(me, '柏一的半身照', '50% 30%')

export const deck: DeckDef = {
  title: '对页 · 专属版式',
  iconStyle: 'line-duotone',
  style: 'diptych',
  theme: 'amber',
  slides: [
    {
      id: 'hero',
      label: '开场',
      render: () => (
        <DiptychHero
          hint="左图自动轮播，点箭头或进度条切换"
          status="接受预约中"
          title={['我设计并搭建', '让人心动', '的产品']}
          soft="心动"
          lead="独立设计师，做品牌、网站和小而好用的产品。一次只接两个项目。"
          ctas={['约个时间聊聊', '看看项目']}
          clients={['◇ 半山民宿', '✳ 纸页阅读', '☁ 云栖茶室', '◐ 南风杂志', '⚡ 远岸科技', '◇ 素瓶']}
          signature={SIG}
          shots={[
            { image: FLAME, title: '焰', meta: '视觉设计 · 2026' },
            { image: VASE, title: '素瓶', meta: '品牌摄影 · 2025' },
            { image: TULIP, title: '郁金', meta: '海报系列 · 2024' },
          ]}
        />
      ),
    },
    {
      id: 'works',
      label: '项目',
      render: () => (
        <DiptychWorks
          hint="把鼠标移到项目上，左图跟着换"
          kicker="精选项目 · 2023—2026"
          title={['做得不多，', '每一个都做透。']}
          soft="每一个都做透。"
          signature={SIG}
          active={1}
          works={[
            { name: '焰', kind: '视觉设计', year: '2026', image: FLAME },
            { name: '素瓶', kind: '品牌摄影', year: '2025', image: VASE },
            { name: '郁金', kind: '海报系列', year: '2024', image: TULIP },
            { name: '半山民宿', kind: '官网与预订', year: '2024', image: CUP },
            { name: '纸页阅读', kind: 'App 设计', year: '2023', image: BLOOM },
          ]}
          source="示意项目"
        />
      ),
    },
    {
      id: 'services',
      label: '服务',
      render: () => (
        <DiptychServices
          hint="点上面的标签切换"
          kicker="我能帮你做"
          title={['三件事，', '从头到尾一个人。']}
          soft="从头到尾一个人。"
          signature={SIG}
          services={[
            {
              name: '品牌',
              body: '从名字的气质到一套能用十年的视觉规范：标志、字体、颜色和照片风格。',
              items: ['标志与字标', '视觉规范', '包装与物料', '品牌摄影指导'],
              time: '4–6 周',
              price: '¥60k 起',
              image: VASE,
            },
            {
              name: '网站',
              body: '先把要讲的话理顺，再做页面。上线后两周内的改动都算我的。',
              items: ['信息架构', '视觉与动效', '响应式页面', '上线与陪跑'],
              time: '5–8 周',
              price: '¥80k 起',
              image: CUP,
            },
            {
              name: '产品',
              body: '小而好用的 App 和工具：先画关键流程，再做到可以交给开发的组件库。',
              items: ['关键流程', '可点原型', '界面设计', '组件库'],
              time: '6–10 周',
              price: '¥120k 起',
              image: BLOOM,
            },
          ]}
          source="示意价格"
        />
      ),
    },
    {
      id: 'words',
      label: '评价',
      render: () => (
        <DiptychWords
          hint="点编号换一条"
          kicker="合作过的人说"
          signature={SIG}
          words={[
            {
              text: '她会把我们说不清的感觉，变成一页能直接拿去印的规范。',
              name: '许岚',
              role: '主理人 · 素瓶',
              image: VASE,
              project: '素瓶',
            },
            {
              text: '官网上线第一个月，预订咨询比以前多了一倍，还少了很多重复的问题。',
              name: '程野',
              role: '创始人 · 半山民宿',
              image: CUP,
              project: '半山民宿',
            },
            {
              text: '海报贴出去那周，路过的人会停下来拍照。这是我们最想要的。',
              name: '叶舟',
              role: '策展人 · 郁金展',
              image: TULIP,
              project: '郁金',
            },
          ]}
          stats={[
            { value: '9 年', label: '做设计' },
            { value: '40+', label: '完成的项目' },
            { value: '2×', label: '平均回头率' },
          ]}
          source="示意评价与数据"
        />
      ),
    },
    {
      id: 'about',
      label: '关于',
      render: () => (
        <DiptychAbout
          hint="点邮箱可以复制"
          kicker="关于我"
          title={['九年，从印刷品', '做到屏幕里。']}
          soft="做到屏幕里。"
          signature={SIG}
          roles={[
            {
              role: '独立设计师',
              note: '品牌、网站与产品',
              years: '2022 — 至今',
            },
            {
              role: '设计负责人 · 远岸科技',
              note: '带 8 人设计团队',
              years: '2019 — 2022',
            },
            {
              role: '视觉设计师 · 南风杂志',
              note: '封面与专题版式',
              years: '2017 — 2019',
            },
          ]}
          mail="hi@baiyi.example"
          ctas={['约个时间聊聊', '下载简历']}
          shots={[{ image: ME, title: '柏一', meta: '独立设计师 · 上海' }]}
        />
      ),
    },
    {
      id: 'contact',
      label: '联系',
      render: () => (
        <DiptychContact
          hint="点选标签，按钮上的数字会变"
          kicker="开始一个项目"
          title={['先告诉我', '你想做什么。']}
          soft="你想做什么。"
          signature={SIG}
          groups={[
            {
              label: '想做什么（可多选）',
              options: ['品牌', '官网', 'App', '海报与包装'],
              multi: true,
            },
            {
              label: '预算',
              options: ['5 万以内', '5–15 万', '15 万以上', '还不确定'],
            },
            {
              label: '什么时候开始',
              options: ['尽快', '一个月内', '下个季度'],
            },
          ]}
          cta="发给柏一"
          note="一般 24 小时内回复。"
          shots={[
            { image: FLAME, title: '焰', meta: '视觉设计 · 2026' },
            { image: BLOOM, title: '纸页', meta: 'App 设计 · 2023' },
          ]}
        />
      ),
    },
  ],
}
