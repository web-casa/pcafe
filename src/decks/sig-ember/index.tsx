// Signature templates for the `ember` style. 观止 is a made-up AI-agent product; every
// person, company, figure and quote is illustrative. All pictures are AI-generated
// decorative illustrations (decor-*), not real photos of real people.

import type { DeckDef } from '../../kit'
import { EmberAgent, EmberBento, EmberClose, EmberHero, EmberSaves, EmberWords } from '../../kit'
import dots from './assets/decor-dots.webp'
import faceA from './assets/decor-face-a.webp'
import faceB from './assets/decor-face-b.webp'
import head from './assets/decor-head.webp'
import lake from './assets/decor-lake.webp'
import ring from './assets/decor-ring.webp'

const img = (src: string, alt: string, focus?: string) => ({ src, alt, focus })

const ASK = {
  placeholder: '今天想让观止帮你处理什么？',
  prompts: ['把上周所有会议纪要整理成一份周报', '找出本月退款最多的三个原因', '给昨天没回复的客户写跟进邮件'],
  chips: ['＋ 附件', '⌕ 联网'],
  models: ['观止 4.1', '观止 4.1 快速'],
}

export const deck: DeckDef = {
  title: '暗场 · 专属版式',
  iconStyle: 'line-duotone',
  style: 'ember',
  theme: 'amber',
  slides: [
    {
      id: 'hero',
      label: '开场',
      render: () => (
        <EmberHero
          hint="移动鼠标看光影；点提问框里的按钮"
          badge={['新', '观止 4.1 现已支持多代理协作']}
          title={['让 AI 代理', '替你把事办完。']}
          image={img(head, '暗处一个被橙色轮廓光勾勒的人头侧影', '50% 30%')}
          ask={ASK}
        />
      ),
    },
    {
      id: 'bento',
      label: '能力',
      render: () => (
        <EmberBento
          hint="点工具栏里的图标，或者拨一下开关"
          dot="功能"
          title="更聪明的能力，无尽的可能。"
          cards={[
            { icon: '◐', title: '对话式 AI', body: '像跟同事聊天一样跟观止说话，它听得懂上下文，也接得住追问。', image: img(dots, '由橙色光点组成的人脸侧影') },
            {
              icon: '◎',
              title: '多模态理解',
              body: '文字、图片、语音和表格，丢进来就能读。',
              image: img(lake, '月光下的湖面和远山', '50% 60%'),
              tools: [
                { mark: '▤', name: '文档' },
                { mark: '◫', name: '图片' },
                { mark: '⌁', name: '语音' },
                { mark: '◉', name: '屏幕' },
                { mark: '✎', name: '手写' },
              ],
            },
            {
              icon: '⚡',
              title: '工作流自动化',
              body: '周报、会议纪要、跟进邮件，交给代理按时完成。你的时间，解锁了。',
              image: img(ring, '一圈火光环绕着一个人的背影', '50% 40%'),
            },
            {
              icon: '✓',
              title: '企业级安全',
              body: '权限、审计、留存，全部可控。',
              toggles: [
                { label: '私有部署', on: true },
                { label: '数据不出域', on: true },
                { label: '允许训练', on: false },
              ],
            },
          ]}
        />
      ),
    },
    {
      id: 'agent',
      label: '执行',
      render: () => (
        <EmberAgent
          hint="看代理一步步做完；右上角可以再跑一次"
          dot="一次真实的委托"
          title={['你只说一句话，', '剩下的交给它。']}
          task="把上周所有会议纪要整理成一份周报，周一早上九点发给团队。"
          steps={[
            { label: '读取会议纪要', detail: '找到上周的 7 份纪要和 2 段录音', tool: '文档库', secs: 4 },
            { label: '提取决定与待办', detail: '归并出 12 项决定、19 条待办', tool: '分析', secs: 9 },
            { label: '核对负责人', detail: '对照通讯录补全 5 位负责人', tool: '通讯录', secs: 3 },
            { label: '起草周报', detail: '按项目分节，附上截止日期', tool: '写作', secs: 11 },
            { label: '定时发送', detail: '周一 09:00 发到团队群和邮箱', tool: '日程', secs: 1 },
          ]}
          result={{
            title: '第 45 周 · 团队周报',
            lines: ['增长组：新版注册流程本周五上线', '平台组：数据迁移完成 80%，下周收尾', '待办 19 条，其中 4 条本周到期', '需要决定：第四季度预算是否追加'],
          }}
          source="流程与数字均为示意。"
        />
      ),
    },
    {
      id: 'saves',
      label: '省时',
      render: () => (
        <EmberSaves
          hint="切换上方的按钮，比较自己做和交给代理"
          dot="省下的时间"
          title={['每周多出来的，', '是整整一天半。']}
          lead="我们统计了内测团队最常交给观止的六类工作，每人每周平均的耗时如下。"
          tasks={[
            { name: '写周报', before: 3, after: 0.5 },
            { name: '会议纪要', before: 4, after: 0.5 },
            { name: '跟进邮件', before: 2.5, after: 0.5 },
            { name: '数据汇总', before: 3.5, after: 1 },
            { name: '资料检索', before: 2, after: 0.5 },
            { name: '日程协调', before: 1.5, after: 0.5 },
          ]}
          source="基于 2026 年第三季度 60 个内测团队的自报数据，仅作示意。"
        />
      ),
    },
    {
      id: 'words',
      label: '评价',
      render: () => (
        <EmberWords
          hint="把鼠标移到卡片上"
          dot="用户评价"
          title="听听用户怎么说"
          quotes={[
            {
              quote: '观止帮我们把一个 AI 代理做成了真正能用的产品，转化率几乎是立刻就涨了。',
              name: '邓帆',
              role: '产品负责人 · 远舟数据',
              avatar: img(faceA, '邓帆的头像（AI 生成）'),
              value: '26%',
              label: '演示转化提升',
            },
            {
              quote: '以前很难说清我们的自动化在做什么。现在一切都清楚、有条理，也好讲多了。',
              name: '叶书',
              role: '创始人 · 回路自动化',
              avatar: img(faceB, '叶书的头像（AI 生成）'),
              value: '3×',
              label: '更多合格线索',
            },
          ]}
          source="人物、公司与数字均为虚构示例。"
        />
      ),
    },
    {
      id: 'close',
      label: '收尾',
      render: () => (
        <EmberClose
          hint="点发送键，换一个问题"
          title={['把今天的第一件事，', '交给观止。']}
          lead="免费开始，不用信用卡。团队版可以私有部署。"
          image={img(ring, '一圈火光')}
          ask={ASK}
          ctas={['开始使用', '预约团队演示']}
          note="观止 · 让 AI 代理替你把事办完"
        />
      ),
    },
  ],
}
