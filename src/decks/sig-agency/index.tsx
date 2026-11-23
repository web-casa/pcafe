// Signature templates for the `agency` style. 澜启 is a made-up growth agency;
// every client, person and figure is illustrative. All pictures are AI-generated
// decorative illustrations (decor-*), not real photos of real people.

import type { DeckDef } from '../../kit'
import { AgencyAccordion, AgencyBook, AgencyManifesto, AgencyProof, AgencyRows, AgencyStage } from '../../kit'
import desk from './assets/decor-desk.webp'
import faceA from './assets/decor-face-a.webp'
import faceB from './assets/decor-face-b.webp'
import glass from './assets/decor-glass.webp'
import night from './assets/decor-night.webp'
import team from './assets/decor-team.webp'

const img = (src: string, alt: string, focus?: string) => ({ src, alt, focus })
const FACES = [img(faceA, '戴眼镜的男士头像（AI 生成）'), img(desk, '端着咖啡的女士头像（AI 生成）', '50% 22%'), img(faceB, '穿白 T 恤的男士头像（AI 生成）')]

export const deck: DeckDef = {
  title: '增长 · 专属版式',
  iconStyle: 'line-duotone',
  style: 'agency',
  theme: 'cobalt',
  slides: [
    {
      id: 'stage',
      label: '开场',
      tone: 'dark',
      render: () => (
        <AgencyStage
          hint="移动鼠标，光会跟着走；指一下底部的大字母"
          title={['为认真做增长的', '品牌而生']}
          cta="预约一次诊断"
          card={{
            image: img(night, '深夜办公室里三个人看着发蓝光的屏幕（AI 生成）', '50% 40%'),
            title: '增长策略',
            body: '用数据定方向，用创意抓注意力，再把两者变成可复用的增长系统。',
          }}
          trust={{ faces: FACES, text: ['已服务 120+ 家', '快速成长的品牌'] }}
          word="LANQI"
        />
      ),
    },
    {
      id: 'pov',
      label: '看法',
      render: () => (
        <AgencyManifesto
          label="我们的看法"
          icon="lightbulb"
          text="多数品牌的增长卡在同一个地方：投放、内容和官网各做各的，钱花出去了，却说不清哪一块在起作用。我们先把它们放回同一张表上。"
          marks={['同一张表上']}
          by={{ name: '周以宁', role: '澜启 · 策略总监', image: img(desk, '策略总监周以宁（AI 生成）', '50% 22%') }}
        />
      ),
    },
    {
      id: 'mission',
      label: '使命',
      render: () => (
        <AgencyAccordion
          hint="点任意一行展开；不点时会自己往下翻"
          tag="我们的使命"
          title={['我们把策略做成系统，', '让增长不靠运气。']}
          photo={{ image: img(desk, '傍晚在办公桌前端着咖啡微笑的女士（AI 生成）', '50% 30%'), caption: '策略总监 · 周以宁' }}
          items={[
            {
              title: '策略与执行',
              body: '数据、创意和投放放在同一张表上，每一次预算都能说清楚换来了什么。',
              chips: ['用户研究', '渠道组合', '季度复盘'],
              image: img(team, '四个人围着桌子讨论文件和电脑（AI 生成）'),
            },
            {
              title: '创意与转化',
              body: '每一版创意都带着假设上线，两周一轮测试，留下能复用的那一半。',
              chips: ['素材测试', '落地页', '转化漏斗'],
              image: img(glass, '展开成螺旋的蓝色玻璃叶片（AI 生成）'),
            },
            {
              title: '可扩展的品牌体系',
              body: '把口吻、版式和素材规则写成手册，新同事一周就能做出不跑偏的内容。',
              chips: ['品牌手册', '模板库'],
              image: img(night, '深夜办公室里看屏幕的团队（AI 生成）', '50% 40%'),
            },
            {
              title: '效果与归因',
              body: '统一口径的看板，每周一早上自动更新，谁都能看懂哪条渠道在赚钱。',
              chips: ['归因模型', '周报看板'],
              image: img(team, '团队围着桌子讨论（AI 生成）', '30% 50%'),
            },
          ]}
        />
      ),
    },
    {
      id: 'services',
      label: '服务',
      build: 'reveal',
      render: () => (
        <AgencyRows
          kicker="02 服务"
          title={['四件事，', '一个团队做完']}
          more="看完整清单"
          items={[
            { title: '增长诊断', note: '两周，交一份能直接执行的清单', icon: 'search' },
            { title: '官网与落地页', note: '按转化重做结构，不只换皮', icon: 'monitor' },
            { title: '内容与投放', note: '素材、渠道、预算一起排期', icon: 'chart' },
            { title: '数据看板', note: '统一口径，每周自动更新', icon: 'graph-up' },
          ]}
        />
      ),
    },
    {
      id: 'proof',
      label: '评价',
      render: () => (
        <AgencyProof
          hint="点箭头换一位客户"
          tag="客户评价"
          title={['官网改完那个季度，', '线索翻了一倍。']}
          quotes={[
            {
              text: '他们帮我们拿到了更多高质量线索，营收涨得比预期快。',
              name: '陈嘉禾',
              role: '市场负责人 · 栖木家居',
              image: img(faceA, '戴眼镜微笑的男士（AI 生成）', '50% 25%'),
            },
            {
              text: '第一次有人把投放、内容和官网放在一起看，预算终于花得明白。',
              name: '林知远',
              role: '创始人 · 青屿咖啡',
              image: img(faceB, '穿白 T 恤的年轻男士（AI 生成）', '50% 30%'),
            },
            {
              text: '两周拿到的诊断清单，我们照着做了一个季度，复购率涨了三成。',
              name: '周可欣',
              role: '增长负责人 · 半亩田',
              image: img(desk, '端着咖啡微笑的女士（AI 生成）', '50% 26%'),
            },
          ]}
          statement="把数字体验做到能转化"
          visual={{ image: img(glass, '展开成螺旋的蓝色玻璃叶片（AI 生成）'), caption: '策略先行的创意' }}
          stat={{ value: '+65%', label: '客户平均增长', foot: '增长已交付', faces: FACES }}
          source="客户、人名与数字均为虚构示例。"
        />
      ),
    },
    {
      id: 'book',
      label: '预约',
      tone: 'dark',
      render: () => (
        <AgencyBook
          hint="选一天、选一个时间，再点按钮"
          tag="下一步"
          title={['下一季的增长，', '从一次诊断开始']}
          lead="45 分钟视频通话，我们先听你的数据和目标，再告诉你最值得先做的三件事。"
          heading="预约一次增长诊断"
          days={[
            ['周一', '11/10'],
            ['周二', '11/11'],
            ['周三', '11/12'],
            ['周四', '11/13'],
            ['周五', '11/14'],
          ]}
          slots={['10:00', '11:30', '14:00', '15:30', '17:00', '19:00']}
          host={{ image: img(desk, '策略总监周以宁（AI 生成）', '50% 22%'), name: '周以宁', role: '策略总监' }}
          note="免费 · 45 分钟 · 会后发你一页纸的纪要"
          contacts={[
            { label: '邮箱', value: 'hello@lanqi.example' },
            { label: '电话', value: '021-5555 0188' },
            { label: '办公室', value: '上海 · 杭州 · 深圳' },
            { label: '回复时间', value: '一个工作日内' },
          ]}
          pick={[2, 2]}
        />
      ),
    },
  ],
}
