// Signature templates for the `dusk` style. 解码 is a made-up AI tool that explains code;
// every customer, person, figure and line of code is illustrative. All pictures are
// AI-generated decorative illustrations (decor-*), not real photos of real people.

import type { DeckDef } from '../../kit'
import { DuskCases, DuskClose, DuskExplain, DuskFeature, DuskHero, DuskStats } from '../../kit'
import desk from './assets/decor-desk.webp'
import faceA from './assets/decor-face-a.webp'
import faceB from './assets/decor-face-b.webp'
import pair from './assets/decor-pair.webp'
import wall from './assets/decor-wall.webp'

const img = (src: string, alt: string, focus?: string) => ({ src, alt, focus })

export const deck: DeckDef = {
  title: '霞光面板 · 专属版式',
  iconStyle: 'line-duotone',
  style: 'dusk',
  theme: 'crimson',
  slides: [
    {
      id: 'hero',
      label: '开场',
      render: () => (
        <DuskHero
          hint="点渐变面板上的标签，小部件会换"
          ann={['解码完成 1.6 亿元 A 轮融资', '阅读全文']}
          title={['把复杂代码', '讲成人话的 AI']}
          lead="最快的方式，把技术细节变成清楚、能直接用的理解。"
          ctas={['免费开始', '预约演示']}
          tabs={[
            {
              label: '编辑器',
              head: '时间分布',
              stat: '24',
              unit: '个运行周期',
              bars: [
                { label: '解释', value: 22 },
                { label: '评审', value: 30 },
                { label: '调试', value: 16 },
                { label: '文档', value: 20 },
              ],
              file: 'AuthService.ts',
            },
            {
              label: '调试',
              head: '问题分布',
              stat: '37',
              unit: '个问题 · 14 天',
              bars: [
                { label: '已修复', value: 21 },
                { label: '处理中', value: 9 },
                { label: '待确认', value: 5 },
                { label: '严重', value: 2 },
              ],
              file: 'billing/worker.ts',
            },
            {
              label: '文档',
              head: '覆盖率',
              stat: '86%',
              unit: '的函数有说明',
              bars: [
                { label: '已写', value: 86 },
                { label: '待补', value: 14 },
              ],
              file: 'docs/api.md',
            },
            {
              label: '评审',
              head: '本周评审',
              stat: '58',
              unit: '个合并请求',
              bars: [
                { label: '通过', value: 41 },
                { label: '需修改', value: 12 },
                { label: '已关闭', value: 5 },
              ],
              file: 'pull/1284',
            },
          ]}
          code={[
            '# 解码 · 解释补丁',
            '--- 之前',
            '- function calcTier(user) {',
            '-   if (user.points > 5000 &&',
            '+   if (user.points > 1000 ||',
            '      return "gold"',
            '  }',
            '',
            '# 解释：',
            '按积分给会员分级：',
            '· 积分超过 1000 → 金卡',
            '· 其余会员 → 银卡',
          ]}
        />
      ),
    },
    {
      id: 'feature',
      label: '调试',
      render: () => (
        <DuskFeature
          hint="在右边的图上左右移动鼠标"
          tag={{ icon: '◆', label: '调试' }}
          title={['在问题变大之前，', '先看见它。']}
          body="代码库越长越大，盲区就越多。调试会把隐藏的问题、不稳定的写法和静默失败摆到台面上，赶在它们影响用户之前。"
          points={['按严重程度自动排序', '每个问题都附一段人话解释', '一键生成修复补丁']}
          more="了解调试"
          chart={{
            stat: '37',
            unit: '个问题 · 最近 14 天',
            name: '错误时间线',
            series: [
              { label: '严重', points: [3, 6, 8, 7, 4, 2, 3, 5, 8, 9, 6, 4, 3, 2] },
              { label: '警告', points: [5, 3, 2, 3, 5, 7, 8, 6, 4, 3, 4, 6, 7, 6] },
              { label: '已弃用', points: [8, 7, 6, 5, 3, 3, 4, 5, 6, 4, 3, 2, 2, 1], dashed: true },
            ],
            xs: ['10/26', '10/27', '10/28', '10/29', '10/30', '10/31', '11/1', '11/2', '11/3', '11/4', '11/5', '11/6', '11/7', '11/8'],
          }}
        />
      ),
    },
    {
      id: 'explain',
      label: '讲解',
      render: () => (
        <DuskExplain
          hint="点左边任意一段代码，看它在做什么"
          tag={{ icon: '✳', label: '解释' }}
          title="一段一段，讲给你听。"
          file="billing/retry.ts"
          blocks={[
            {
              lines: ['async function retryCharge(order) {', '  const max = order.vip ? 5 : 3', '  let wait = 1000'],
              title: '先定好重试几次',
              note: '扣款失败时会自动重试。大客户最多试 5 次，普通客户 3 次，第一次等 1 秒。',
            },
            {
              lines: ['  for (let i = 0; i < max; i++) {', '    const ok = await charge(order)', '    if (ok) return markPaid(order)'],
              title: '一次次去扣款',
              note: '每次都真的去扣一次款，只要成功一次就把订单标成已付款，立刻结束。',
            },
            {
              lines: ['    await sleep(wait)', '    wait = wait * 2', '  }'],
              title: '每次多等一倍',
              note: '失败了就等一会儿再试，等待时间每次翻倍（1 秒、2 秒、4 秒…），避免把支付接口压垮。',
            },
            {
              lines: ['  notify(order.owner, "扣款失败")', '  return markFailed(order)', '}'],
              title: '都失败了才通知人',
              note: '所有次数用完还没成功，才给负责人发提醒，并把订单标成失败，方便人工跟进。',
            },
          ]}
          source="示例代码为虚构。"
        />
      ),
    },
    {
      id: 'stats',
      label: '结果',
      render: () => (
        <DuskStats
          hint="把鼠标移到卡片上"
          tag={{ icon: '●', label: '上线半年' }}
          title="团队用了之后，变化很具体。"
          stats={[
            { value: '3.2×', label: '读懂旧代码', note: '新同学第一次读懂一个模块的速度', series: [1, 1.2, 1.5, 1.7, 2.1, 2.4, 2.6, 2.9, 3.2] },
            { value: '48%', label: '评审时间减少', note: '每个合并请求从提交到通过的中位时长', series: [100, 92, 85, 80, 71, 66, 60, 55, 52] },
            { value: '1,240', label: '每周解释次数', note: '一支 40 人工程团队一周里点“解释”的次数', series: [300, 420, 510, 640, 780, 860, 990, 1100, 1240] },
          ]}
          source="数字来自虚构的示例团队，仅作示意。"
        />
      ),
    },
    {
      id: 'cases',
      label: '案例',
      render: () => (
        <DuskCases
          hint="左右箭头切换案例"
          tag={{ icon: '●', label: '客户案例' }}
          title="用解码交付的团队，都更快。"
          cases={[
            { company: '✳ 常青科技', headline: '消除异步 bug 之后，平台改版快了 3 倍', image: img(pair, '两位工程师在笔记本电脑前讨论', '50% 40%') },
            { company: '◐ 北岸支付', headline: '扣款重试逻辑讲清楚之后，退款工单少了一半', image: img(desk, '工程师指着屏幕上的代码给同事讲解', '40% 40%') },
            { company: '▲ 青柚学堂', headline: '新人第一周就能独立提交合并请求', image: img(wall, '三位工程师在白板前讨论架构', '50% 35%') },
          ]}
          voices={[
            {
              company: '◼ 模块实验室',
              quote: '解码把新同学上手的时间砍了一半，读懂老代码从几天变成了几分钟。',
              name: '罗振',
              role: '联合创始人兼 CEO',
              avatar: img(faceA, '罗振的头像（AI 生成）'),
            },
            {
              company: '◆ 福斯特工作室',
              quote: '一次大重构毫无压力。AI 评审和解释让整个流程顺了很多。',
              name: '马涛',
              role: '工程负责人',
              avatar: img(faceB, '马涛的头像（AI 生成）'),
            },
          ]}
          source="公司、人物与数字均为虚构示例。"
        />
      ),
    },
    {
      id: 'close',
      label: '收尾',
      render: () => (
        <DuskClose
          hint="点“复制”拿走命令"
          title={['下一段看不懂的代码，', '交给解码。']}
          lead="个人免费使用，团队版 14 天试用。"
          ctas={['免费开始', '预约演示']}
          command="npx jiema init"
          output={['✓ 已连接代码仓库', '✓ 已索引 1,284 个文件', '✓ 已就绪：选中任意代码，按 ⌘E 解释']}
        />
      ),
    },
  ],
}
