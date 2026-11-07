// Signature templates for the `nocturne` style. 夜拍 is a made-up AI portrait
// app and every figure is illustrative. All pictures are AI-generated
// decorative illustrations (decor-*), not real users or results.

import type { DeckDef } from '../../kit'
import { FeatureBento, GlowPricing, NocturneHero, RevealCompare, StepTrio, WallClose } from '../../kit'
import after from './assets/decor-after.webp'
import before from './assets/decor-before.webp'
import cyber from './assets/decor-cyber.webp'
import film from './assets/decor-film.webp'
import frost from './assets/decor-frost.webp'
import glow from './assets/decor-glow.webp'
import mono from './assets/decor-mono.webp'
import neon from './assets/decor-neon.webp'
import plat from './assets/decor-plat.webp'
import real from './assets/decor-real.webp'
import retro from './assets/decor-retro.webp'
import s1 from './assets/decor-s1.webp'
import s2 from './assets/decor-s2.webp'
import s3 from './assets/decor-s3.webp'
import summer from './assets/decor-summer.webp'
import video from './assets/decor-video.webp'

const img = (src: string, alt: string, credit?: string) => ({ src, alt, credit })
const AI = '插图：AI 生成（示意）'

export const deck: DeckDef = {
  title: '夜紫 · 专属版式',
  iconStyle: 'line-duotone',
  style: 'nocturne',
  theme: 'violet',
  slides: [
    {
      id: 'hero',
      label: '开场',
      render: () => (
        <NocturneHero
          faces={[img(s1, ''), img(s2, ''), img(s3, '')]}
          title={['把你的照片', '变成一组大片']}
          lead="上传几张自拍，几分钟拿到影棚级的头像、写真和创意大片。"
          ctas={['生成我的照片', '看看功能']}
          note="无需绑定信用卡 · 示意产品"
          stats={[
            { value: '569,127', label: '已生成照片' },
            { value: '20+', label: '种风格' },
            { value: '4K', label: '输出画质' },
          ]}
          phone={{ image: img(glow, '红蓝灯光下的白发男性头像'), label: '光影', thumbs: [img(cyber, ''), img(neon, ''), img(summer, ''), img(mono, '')], cta: '免费试用', toast: '8 张写真已生成' }}
        />
      ),
    },
    {
      id: 'features',
      label: '功能',
      render: () => (
        <FeatureBento
          kicker="569,127 张照片已生成"
          title={['AI 驱动的', '头像创作']}
          hero={{ title: '高画质', body: '先进的 AI 技术，带来前所未有的精度和真实感。', images: [img(neon, '粉色头发的女性'), img(glow, '红蓝灯光下的男性'), img(summer, '戴墨镜的女性')] }}
          grid={{
            title: '20+ 种风格',
            body: '从二十多种风格里挑，给你的头像换个性格。',
            items: [
              { image: img(cyber, '橙色光条前的女性'), label: '赛博' },
              { image: img(film, '暖色胶片感的女性'), label: '胶片' },
              { image: img(frost, '深蓝背景的女性'), label: '夜蓝' },
              { image: img(glow, '红蓝灯光下的男性'), label: '光影' },
              { image: img(mono, '雪中的白发男性'), label: '冰霜' },
              { image: img(neon, '粉色头发的女性'), label: '霓虹' },
              { image: img(retro, '戴墨镜的卷发男性'), label: '复古' },
              { image: img(summer, '穿彩色毛衣的女性'), label: '夏日' },
            ],
          }}
          small={[
            { tag: '多平台', title: '全平台通用', body: '社交、简历、名片，一次搞定。', image: img(plat, '手机、平板和相片上的同一张头像', AI) },
            { tag: '4K 视频', title: '生成 4K 短片', body: '把头像变成一段有镜头感的短视频。', image: img(video, '夜晚城市街头的女性', AI) },
            { tag: '写实', title: '真实还原', body: '保留你本来的样子，只是更好看。', image: img(real, '穿灰色 T 恤的男性', AI) },
          ]}
        />
      ),
    },
    {
      id: 'pricing',
      label: '价格',
      render: () => (
        <GlowPricing
          kicker="价格 · 示意"
          title="按需选择，随时升级"
          periods={['按月', '按年']}
          save="省 20%"
          units={['/月', '/月']}
          hint="点按月 / 按年切换价格"
          plans={[
            { name: '入门', price: ['¥99', '¥79'], body: '快速做出高质量 AI 头像的基础功能。', items: ['高质量头像', '10+ 种风格', '快速处理', '基础支持'], quota: { label: '每月生成', value: '40 张', pct: 18 }, cta: '选择入门' },
            { name: '进阶', price: ['¥199', '¥159'], body: '更高画质和更多工具，适合日常创作。', items: ['25+ 种高级风格', '高清渲染', '高清视频导出', '邮件支持'], quota: { label: '每月生成', value: '200 张', pct: 56 }, cta: '选择进阶' },
            { name: '专业', price: ['¥349', '¥279'], body: '全部高级风格，更快渲染和专业级导出。', items: ['50+ 种高级风格', '极速渲染', '4K 导出', '优先支持'], quota: { label: '每月生成', value: '不限量', pct: 100 }, cta: '选择专业', hot: true, badge: '最受欢迎' },
          ]}
        />
      ),
    },
    {
      id: 'steps',
      label: '三步',
      render: () => (
        <StepTrio
          kicker="三步完成"
          title="上传、选风格、拿成片"
          lead="不需要摄影棚，也不用学修图。整个过程大约 6 分钟。"
          picked="已选 {n} 种"
          hint="第二张卡里的风格可以点选"
          steps={[
            { label: 'STEP 01', title: '上传 10 张自拍', body: '正脸、侧脸、不同光线都来几张，越多越像你。' },
            { label: 'STEP 02', title: '挑你喜欢的风格', body: '20 多种风格任选，一次可以选好几种。' },
            { label: 'STEP 03', title: '几分钟拿到成片', body: '每种风格出 8 张 4K 大图，不满意免费重做。' },
          ]}
          inputs={{ images: [img(s1, '一张居家自拍'), img(s2, '一张窗边自拍'), img(s3, '一张咖啡馆自拍')], counter: '已上传 12 / 12 张' }}
          options={[
            { image: img(glow, ''), label: '光影', on: true },
            { image: img(retro, ''), label: '复古' },
            { image: img(cyber, ''), label: '赛博' },
            { image: img(neon, ''), label: '霓虹', on: true },
            { image: img(mono, ''), label: '冰霜' },
            { image: img(summer, ''), label: '夏日' },
          ]}
          result={{ image: img(after, '紫色灯光下的女性肖像'), chip: '4K · 已完成' }}
        />
      ),
    },
    {
      id: 'compare',
      label: '前后对比',
      render: () => (
        <RevealCompare
          kicker="前后对比"
          title={['还是你，', '只是更好看。']}
          lead="我们保留你的五官和神态，只调光线、构图和质感。朋友一眼就认得出来。"
          specs={[
            { label: '五官相似度', value: '98.4%' },
            { label: '输出分辨率', value: '4096 × 4096' },
            { label: '平均生成时间', value: '6 分钟' },
          ]}
          before={img(before, '一张在办公桌前的普通自拍')}
          after={img(after, '同一人在紫色灯光下的肖像')}
          labels={['原图', '夜拍 · 光影']}
          source="示意数据"
          hint="拖动中间的把手对比"
        />
      ),
    },
    {
      id: 'close',
      label: '收尾',
      render: () => (
        <WallClose
          title={['下一张头像，', '交给夜拍。']}
          lead="已经有 569,127 张照片从这里生成。"
          ctas={['生成我的照片', '看价格']}
          note="首次生成免费 · 示意产品"
          images={[img(cyber, ''), img(film, ''), img(frost, ''), img(glow, ''), img(mono, ''), img(neon, ''), img(retro, ''), img(summer, ''), img(after, ''), img(real, '')]}
        />
      ),
    },
  ],
}
