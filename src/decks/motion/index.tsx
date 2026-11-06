import type { DeckDef } from '../../kit'
import { Closing, ConvergeShots, MediaExpand, ScatterOrder, Statement, StepVideo, TiltShot } from '../../kit'
import kit from './assets/shot-kit.webp'
import overview from './assets/shot-overview.webp'
import entry from './assets/shot-kit-entry.webp'
import single from './assets/shot-slide.webp'
import race from './assets/solar-race.mp4'

const SHOTS = '截图：PCafe 本项目页面，2026-10-30'

export const deck: DeckDef = {
  title: '按键动效 · 五个模板',
  iconStyle: 'line-duotone',
  theme: 'cobalt',
  style: 'standard',
  slides: [
    {
      id: 'intro',
      label: '开场',
      render: () => (
        <Statement
          kicker="按键动效"
          text={['五个模板，', '每按一次 → 走一步']}
          sub="小窗放大、散点成序、倾斜摆正、多图汇聚、逐段播放。动作来自 oil-motion 的动效模式卡（MIT），改成按键驱动。"
        />
      ),
    },
    {
      id: 'expand',
      label: '小窗放大',
      build: 'reveal',
      render: () => (
        <MediaExpand
          kicker="小窗放大"
          title={['先认出画面，', '再看清细节']}
          lead="截图先以小窗出现在标题旁边，按一下放大到整页，标题让开。"
          src={overview}
          alt="PCafe 演示的总览视图截图"
          caption="总览视图：所有页面按顺序排开"
          source={SHOTS}
        />
      ),
    },
    {
      id: 'scatter',
      label: '散点成序',
      build: 'reveal',
      render: () => (
        <ScatterOrder
          kicker="散点成序"
          title="一份演示从散乱的笔记开始"
          lead="每按一次，一张卡片落到自己的位置；全部归位后连线出现。"
          steps={[
            { title: '收集事实', body: '每条数字都记下出处，查不到的不写' },
            { title: '写故事线', body: '先定每页要说的一句话' },
            { title: '配模板', body: '按内容的形状挑模板' },
            { title: '压进上限', body: '放不下就拆页，不缩字号' },
            { title: '检查看图', body: 'check 输出 PASS 后逐页看截图' },
          ]}
          source="skills/pcafe/SKILL.md 流程"
        />
      ),
    },
    {
      id: 'tilt',
      label: '倾斜摆正',
      build: 'reveal',
      render: () => (
        <TiltShot
          kicker="倾斜摆正"
          title={['组件库：', '先看全貌再细读']}
          lead="截图先带透视角度出场，按一下转正，再逐条出现要点。"
          src={kit}
          alt="PCafe 组件库页面截图"
          points={[
            { title: '按位置分组', body: '开场、内容、数据、收尾各一组' },
            { title: '每个模板带上限', body: '字数、条数写在卡片上' },
            { title: '风格可切换', body: '同一页换风格即时预览' },
          ]}
          source={SHOTS}
        />
      ),
    },
    {
      id: 'converge',
      label: '多图汇聚',
      build: 'reveal',
      render: () => (
        <ConvergeShots
          kicker="多图汇聚"
          title="几种看法，落到同一页"
          lead="先并排看几个视图，按一下汇聚到要讲的那一张。"
          shots={[
            { src: overview, alt: 'PCafe 演示的总览视图截图', label: '总览' },
            { src: single, alt: 'PCafe 演示放映中的一页截图', label: '放映' },
            { src: entry, alt: 'PCafe 组件库中一个模板的详情截图', label: '模板详情' },
          ]}
          focus={1}
          caption="总览、模板详情都通向同一件事：放映时的这一页。"
          source={SHOTS}
        />
      ),
    },
    {
      id: 'video',
      label: '逐段播放',
      build: 'reveal',
      render: () => (
        <StepVideo
          kicker="逐段播放"
          title="十年里，差距怎么拉开"
          lead="每按一次 →，视频播到下一个停点并暂停。"
          src={race}
          start={0.6}
          label="2015 到 2025 年各国太阳能发电量排名动画"
          stops={[
            { at: 1, title: '2015 年', body: '中国 39.5、美国 39.0、德国 38.1 TWh，几乎并列' },
            { at: 4.4, title: '2021 年', body: '中国 327 TWh，约为美国的 2 倍' },
            { at: 7.5, title: '2025 年', body: '中国 1,175 TWh，约为美国的 3 倍' },
          ]}
          source="视频：PCafe 示例视频 solar-data 片段；数据 Our World in Data（Ember、Energy Institute，2026）"
        />
      ),
    },
    {
      id: 'end',
      label: '结尾',
      render: () => (
        <Closing
          kicker="按键动效"
          statement="动效只在按 → 时播放"
          follow="跳页、截图和减少动态效果时，直接显示完成后的画面。"
          takeaways={[
            '截图类：MediaExpand 小窗放大，TiltShot 倾斜摆正，ConvergeShots 多图汇聚。',
            '步骤类：ScatterOrder 让散乱的卡片逐个归位，最后连成一条路径。',
            '视频类：StepVideo 每按一次播一段，片段先用 ffmpeg 截短压缩。',
          ]}
          refs={['docs/zh-CN/components.md', 'github.com/oil-oil/oil-motion']}
        />
      ),
    },
  ],
}
