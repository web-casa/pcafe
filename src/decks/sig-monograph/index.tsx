// Signature templates for the `monograph` style. 阿卢拉 is a made-up agency and
// every figure is illustrative. All pictures are AI-generated decorative
// illustrations (decor-*), not real work, clients or people.

import type { DeckDef } from '../../kit'
import { MonographClose, MonographHero, ProjectIndex, ServiceLedger, TeamPortraits, WhyStats } from '../../kit'
import blob from './assets/decor-blob.webp'
import chair from './assets/decor-chair.webp'
import end from './assets/decor-end.webp'
import prev from './assets/decor-prev.webp'
import svc from './assets/decor-svc.webp'
import t1 from './assets/decor-t1.webp'
import t2 from './assets/decor-t2.webp'
import t3 from './assets/decor-t3.webp'

const img = (src: string, alt: string, credit?: string) => ({ src, alt, credit })
const AI = '插图：AI 生成（示意）'

export const deck: DeckDef = {
  title: '专著 · 专属版式',
  iconStyle: 'line-duotone',
  style: 'monograph',
  theme: 'amber',
  slides: [
    {
      id: 'hero',
      label: '关于我们',
      render: () => (
        <MonographHero
          kicker="01 关于我们"
          title={['阿卢拉是一家数字机构，', '做大胆的品牌和', '有影响力的体验。']}
          rating={{ score: '4.9 / 5', note: '40+ 位客户的评价', faces: [img(t1, ''), img(t2, ''), img(t3, '')] }}
          aside={{ title: '看看我们的作品集', body: '一组照片，看我们为客户做的创意、策略和高质量作品。' }}
          story={{ image: img(chair, '阳光里的一把木椅'), index: '002', text: '2019 年，欧阳菲和马丁买下了一栋老房子。之所以这么叫，是因为它出自上世纪六十年代一位当地建筑师之手……' }}
          image={img(blob, '黑底上一块白色大理石雕塑', AI)}
        />
      ),
    },
    {
      id: 'index',
      label: '项目',
      render: () => (
        <ProjectIndex
          kicker="02 项目"
          title="看看我们最好的作品"
          cta="查看全部项目"
          hint="点或悬停一行，换右边的图"
          projects={[
            { name: '远山咖啡 · 品牌升级', year: '2026', image: img(prev, '一袋印着山形图案的咖啡豆和一杯咖啡', AI) },
            { name: '像素与共 · 官网', year: '2024', image: img(chair, '阳光里的一把木椅', AI) },
            { name: '轨道工坊 · 开发', year: '2021', image: img(blob, '黑底上一块白色大理石雕塑', AI) },
            { name: '月光三维 · 建模', year: '2019', image: img(end, '俯视的螺旋楼梯', AI) },
            { name: '北岸书店 · 视觉系统', year: '2018', image: img(svc, '一位女士在墙上整理设计稿', AI) },
          ]}
        />
      ),
    },
    {
      id: 'why',
      label: '成果',
      render: () => (
        <WhyStats
          kicker="03 成果"
          title={['为什么', '选我们']}
          reasons={['经验', '稳定', '品牌', '投入']}
          lead="我们设计和搭建量身定制的数字体验，不只让品牌在视觉上更好看，也带来可衡量的结果，支撑长期的业务增长。"
          quote={{ text: '阿卢拉从零重做了品牌和网站，结果完全超出预期。', by: '苏桂 · 市场总监，Lunox' }}
          stats={[
            { value: '105+', label: '完成的项目，覆盖成长型品牌' },
            { value: '92%', label: '近三年的客户留存率', meter: 92 },
            { value: '1M+', label: '通过我们设计的网站触达的用户' },
          ]}
          source="示意数据"
        />
      ),
    },
    {
      id: 'team',
      label: '团队',
      render: () => (
        <TeamPortraits
          kicker="04 团队"
          title="做事的人"
          cta="全部 12 位成员"
          people={[
            { photo: img(t1, '一位穿黑色外套的中年男性', AI), name: '马丁', role: '创意总监' },
            { photo: img(t2, '一位穿白衬衫的女性', AI), name: '欧阳菲', role: '品牌策略' },
            { photo: img(t3, '一位卷发年轻男性', AI), name: '陆川', role: '技术负责人' },
          ]}
          join={{ title: ['我们在', '招设计师。'], accent: '设计师', body: '喜欢把事情做到底、对细节有洁癖？给我们发作品集。', contact: 'jobs@alura.example' }}
        />
      ),
    },
    {
      id: 'services',
      label: '服务',
      build: 'reveal',
      render: () => (
        <ServiceLedger
          kicker="05 服务"
          title="我们做什么"
          rows={[
            { title: '品牌策略', body: '定位、命名和品牌故事，先想清楚再动手画。' },
            { title: '视觉识别', body: '标志、字体、色彩和规范，一套能用十年的系统。' },
            { title: '数字体验', body: '官网和产品界面，好看，也带来可衡量的转化。' },
            { title: '开发上线', body: '前端开发、CMS 和上线后的持续迭代。' },
          ]}
          image={img(svc, '一位女士在墙上整理设计稿', AI)}
          caption="工作室 · 上海徐汇"
        />
      ),
    },
    {
      id: 'close',
      label: '联系',
      render: () => (
        <MonographClose
          kicker="06 联系"
          title={['一起做点', '大胆的', '东西吧。']}
          contacts={[
            { value: 'hello@alura.example', label: '新项目' },
            { value: '上海 · 徐汇', label: '欢迎来喝咖啡' },
            { value: '周一至周五', label: '10:00 – 19:00' },
          ]}
          image={img(end, '俯视的螺旋楼梯', AI)}
          cta="预约 30 分钟沟通"
        />
      ),
    },
  ],
}
