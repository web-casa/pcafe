// Components v2, phase 2 example deck: a short talk on Apollo 11 that uses the
// ten text and number motion templates. Facts checked 2026-10-30 against NASA,
// NASA JSC curation, the JFK Library and the AGC documentation.

import type { DeckDef } from '../../kit'
import {
  Closing,
  KaraokeLines,
  MarkerSweep,
  MorphHeadline,
  NewsTicker,
  Odometer,
  RotatingWord,
  SplitFlap,
  Statement,
  TextArc,
  TextMask,
  Typewriter,
} from '../../kit'
import surface from './assets/decor-lunar-surface.webp'
import disc from './assets/decor-moon-disc.webp'

const NASA = 'NASA, Apollo 11 Mission Overview (nasa.gov, 2019)'

export const deck: DeckDef = {
  title: '阿波罗 11 号的八天',
  iconStyle: 'line-duotone',
  theme: 'cobalt',
  style: 'editorial',
  slides: [
    {
      id: 'cover',
      label: '封面',
      render: () => (
        <TextMask
          kicker="阿波罗 11 号 · 1969"
          word="MOON"
          title={['八天往返，', '人第一次站上月球']}
          sub="一次任务里的几句话、几个数字和一张时刻表。"
          facts={[
            { value: '3', label: '名航天员' },
            { value: '8 天', label: '往返时长' },
            { value: '1969', label: '7 月 16 日发射' },
          ]}
          image={surface}
          alt="月面陨石坑的装饰插图"
          credit="字中图：AI 生成装饰图，不是实拍"
          source={NASA}
        />
      ),
    },
    {
      id: 'goal',
      label: '目标',
      render: () => (
        <Statement
          kicker="起点"
          text={['1961 年定下的目标，', '八年后兑现']}
          marks={['八年后兑现']}
          sub="1961 年 5 月 25 日，肯尼迪提出：十年内把人送上月球，并安全带回地球。"
          source={NASA}
        />
      ),
    },
    {
      id: 'speech',
      label: '演讲',
      build: 'reveal',
      render: () => (
        <KaraokeLines
          kicker="我们选择登月"
          lines={['我们选择在这十年里登月，', '也去做其他那些事，', '不是因为它们容易，', '而是因为它们困难。']}
          aside="“We choose to go to the Moon in this decade and do the other things, not because they are easy, but because they are hard.”"
          by="肯尼迪 · 莱斯大学 · 1962 年 9 月 12 日"
          source="JFK Library, Address at Rice University (jfklibrary.org)；中文为本演示翻译"
        />
      ),
    },
    {
      id: 'stack',
      label: '靠什么',
      build: 'reveal',
      render: () => (
        <RotatingWord
          kicker="三样东西"
          before="登月靠的是"
          words={[
            { word: '火箭', value: '110.6 m', note: '土星五号高 363 英尺，从 39A 号发射台起飞' },
            { word: '计算机', value: '2048 字', note: '制导计算机的可擦写内存只有 2048 个 16 位字' },
            { word: '留守者', value: '1 人', note: '柯林斯驾驶哥伦布号，独自留在月球轨道' },
          ]}
          source="NASA, Saturn V (nasa.gov)；Raytheon, Apollo Guidance Computer 手册 (ibiblio.org/apollo)；NASA, Apollo 11 Mission Overview"
        />
      ),
    },
    {
      id: 'board',
      label: '时刻表',
      build: 'reveal',
      render: () => (
        <SplitFlap
          kicker="时刻表"
          title="五个时刻，换算成世界时"
          heads={['日期', '时间 UTC', '事件', '状态']}
          rows={[
            { time: '07-16', at: '13:32', label: '土星五号发射', status: '起飞' },
            { time: '07-20', at: '20:17', label: '鹰号着陆静海', status: '着陆' },
            { time: '07-21', at: '02:56', label: '第一步踏上月面', status: '出舱' },
            { time: '07-24', at: '16:50', label: '太平洋溅落', status: '返回' },
            { time: '08-10', at: '-----', label: '21 天隔离结束', status: '解除' },
          ]}
          source="NASA, Apollo 11 Mission Overview；NASA Apollo Lunar Surface Journal (nasa.gov)；美东夏令时 +4 小时换算"
        />
      ),
    },
    {
      id: 'landed',
      label: '着陆',
      build: 'reveal',
      render: () => (
        <Typewriter
          kicker="第一句话"
          lines={['Houston, Tranquility Base here.', 'The Eagle has landed.']}
          caption="“休斯敦，这里是静海基地。鹰号已着陆。”着陆后阿姆斯特朗向地面报告。"
          meta={[
            { label: '任务时间', value: '第 102 小时 45 分' },
            { label: '着陆地点', value: '静海' },
            { label: '登月舱', value: '鹰号' },
          ]}
          source={NASA}
        />
      ),
    },
    {
      id: 'numbers',
      label: '数字',
      build: 'reveal',
      render: () => (
        <Odometer
          kicker="三个数字"
          title="远、久、看的人多"
          stats={[
            { value: '384,400', unit: 'km', label: '地月平均距离', note: '从地球中心到月球中心的平均值' },
            { value: '21.6', unit: '小时', label: '两人在月面停留', note: '21 小时 36 分，含舱内休息' },
            { value: '6.5', unit: '亿人', label: '电视观众（估算）', note: 'NASA 引用的估计数字' },
          ]}
          source="NASA Science, Moon Facts (science.nasa.gov)；NASA, Apollo 11 Mission Overview"
        />
      ),
    },
    {
      id: 'step',
      label: '一步',
      build: 'reveal',
      render: () => (
        <MorphHeadline
          kicker="那句话"
          from="一个人的一小步"
          to="人类的一大步"
          notes={[
            { label: '前半句', body: '“That’s one small step for [a] man,” 踏上月面时说出。' },
            { label: '后半句', body: '“one giant leap for mankind.” 约 6.5 亿人通过电视看到（估算）。' },
          ]}
          source={NASA}
        />
      ),
    },
    {
      id: 'desolation',
      label: '月面',
      build: 'reveal',
      render: () => (
        <TextArc
          kicker="月面印象"
          title="壮丽的荒凉"
          lead="奥尔德林走下舷梯后，用两个英文单词形容眼前的月面。"
          points={['说话的人是第二个踏上月面的奥尔德林', '着陆点在静海，后来称为静海基地', '舱外活动持续两个半小时以上']}
          ring="MAGNIFICENT DESOLATION · MAGNIFICENT DESOLATION · "
          center="静海"
          centerLabel="着陆地点"
          image={disc}
          alt="满月的装饰插图"
          credit="圆中图：AI 生成装饰图"
          source={NASA}
        />
      ),
    },
    {
      id: 'eva',
      label: '分工',
      build: 'reveal',
      render: () => (
        <MarkerSweep
          kicker="分工"
          title="两人在月面，一人在轨道"
          body="阿姆斯特朗和奥尔德林在月面一共停留了 21 小时 36 分，真正走出舱外的时间只有两个半小时多一点。同一时间，柯林斯驾驶哥伦布号，在月球轨道上等他们回来。"
          marks={[
            { text: '21 小时 36 分', note: '从着陆到离开月面的总时长' },
            { text: '两个半小时多一点', note: '舱外活动在任务第 111 小时 39 分结束' },
            { text: '在月球轨道上等他们回来', note: '哥伦布号是这次任务的指令与服务舱' },
          ]}
          source={NASA}
        />
      ),
    },
    {
      id: 'home',
      label: '返回',
      build: 'reveal',
      render: () => (
        <NewsTicker
          kicker="返回"
          dateline="1969-07-24 · 太平洋"
          headline={['哥伦布号溅落，', '三人平安返回']}
          dek="美东时间 12:50，指令舱落在太平洋，距回收舰大黄蜂号 13 英里（约 21 公里）。"
          label="快讯"
          items={['任务往返约 8 天', '隔离 21 天，8 月 10 日结束', '六次登月共带回 382 kg 月岩']}
          source="NASA, Apollo 11 Mission Overview；NASA JSC Astromaterials Curation, Lunar Rocks and Soils (curator.jsc.nasa.gov)"
        />
      ),
    },
    {
      id: 'close',
      label: '结尾',
      build: 'reveal',
      render: () => (
        <Closing
          kicker="回看"
          mark="11"
          statement="八天，五个时刻。"
          follow="几句话和几个数字，就能讲清一次登月。"
          takeaways={[
            '目标在 1961 年提出，1969 年 7 月 20 日鹰号着陆静海，前后八年。',
            '两人在月面停留 21 小时 36 分，柯林斯独自在月球轨道上等待。',
            '7 月 24 日溅落太平洋，隔离 21 天后，8 月 10 日任务正式收尾。',
          ]}
          refs={['nasa.gov/history/apollo-11-mission-overview', 'jfklibrary.org', 'curator.jsc.nasa.gov/lunar', 'ibiblio.org/apollo']}
        />
      ),
    },
  ],
}
