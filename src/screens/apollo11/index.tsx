// Exhibition hall loop, landscape. Facts only from src/decks/v2-p2 (see facts.ts).
import { BigNumber, Hero, Moments, Pair, Quote, defineScreen } from '../../screen'
import { AGC, CURATION, DECOR, JFK, JOURNAL, MOMENTS, MOONFACTS, NASA, SATURN } from './facts'
import surface from '../../decks/v2-p2/assets/decor-lunar-surface.webp'
import disc from '../../decks/v2-p2/assets/decor-moon-disc.webp'

const moon = { src: disc, mode: 'disc' } as const
const ground = { src: surface, mode: 'ground' } as const

export const screen = defineScreen({
  title: '阿波罗 11 号的八天',
  theme: 'cobalt',
  face: 'editorial',
  atmosphere: 'stars',
  orientation: 'landscape',
  // A 98-inch panel with its text about eye height, to be read from 5 m.
  venue: { diagonalIn: 98, distanceM: 5, baselineM: 1.4, panel: 'lcd' },
  clock: { date: true },
  reloadAt: '04:30',
  scenes: [
    {
      id: 'open',
      label: '开场',
      seconds: 14,
      render: () => (
        <Hero
          kicker="阿波罗 11 号 · 1969"
          title={['八天往返，', '人第一次', '站上月球']}
          sub="3 名航天员，7 月 16 日发射。"
          art={moon}
          source={NASA}
          credit={DECOR}
        />
      ),
    },
    {
      id: 'goal',
      label: '目标',
      seconds: 14,
      render: () => (
        <Hero
          kicker="起点"
          title={['1961 年定下的目标，', '八年后兑现']}
          sub={'1961 年 5 月 25 日，肯尼迪提出：\n十年内把人送上月球，并安全带回地球。'}
          source={NASA}
        />
      ),
    },
    {
      id: 'choose',
      label: '演讲',
      seconds: 14,
      render: () => (
        <Quote
          kicker="我们选择登月"
          lines={['不是因为它们容易，', '而是因为它们困难。']}
          original="“…because they are hard…”"
          by="肯尼迪 · 莱斯大学 · 1962 年 9 月 12 日"
          source={JFK}
        />
      ),
    },
    {
      id: 'saturn',
      label: '火箭',
      seconds: 12,
      render: () => (
        <BigNumber
          kicker="靠什么上去"
          value="110.6"
          unit="米"
          label="土星五号的高度"
          note="363 英尺，从 39A 号发射台起飞。"
          source={SATURN}
        />
      ),
    },
    {
      id: 'agc',
      label: '计算机',
      seconds: 12,
      render: () => (
        <BigNumber
          kicker="靠什么算"
          value="2048"
          unit="字"
          label="制导计算机的可擦写内存"
          note="只有 2048 个 16 位字。"
          source={AGC}
        />
      ),
    },
    {
      id: 'moments',
      label: '时刻表',
      seconds: 20,
      render: () => <Moments kicker="1969 年 · 世界时" title={['五个时刻']} items={MOMENTS} source={JOURNAL} />,
    },
    {
      id: 'landed',
      label: '着陆',
      seconds: 16,
      render: () => (
        <Quote
          kicker="着陆后的第一句话"
          lines={['休斯敦，这里是静海基地。', '鹰号已着陆。']}
          original="“Houston, Tranquility Base here. The Eagle has landed.”"
          by="阿姆斯特朗 · 任务第 102 小时 45 分"
          source={NASA}
        />
      ),
    },
    {
      id: 'step',
      label: '一步',
      seconds: 15,
      render: () => (
        <Pair
          kicker="踏上月面时"
          items={[
            { big: '一个人的一小步', small: '“That’s one small step for [a] man,”' },
            { big: '人类的一大步', small: '“one giant leap for mankind.”' },
          ]}
          source={`${NASA}；约 6.5 亿人通过电视看到，为 NASA 引用的估算`}
        />
      ),
    },
    {
      id: 'surface',
      label: '月面',
      seconds: 13,
      render: () => (
        <BigNumber
          kicker="两人在月面"
          value="21.6"
          unit="小时"
          label="从着陆到离开月面"
          note="21 小时 36 分，舱外活动两个半小时多一点。"
          art={ground}
          source={NASA}
          credit={DECOR}
        />
      ),
    },
    {
      id: 'collins',
      label: '留守',
      seconds: 12,
      render: () => (
        <Hero
          kicker="第三个人"
          title={['柯林斯', '独自留在轨道']}
          sub={'他驾驶哥伦布号，\n在轨道上等同伴回来。'}
          art={moon}
          source={NASA}
          credit={DECOR}
        />
      ),
    },
    {
      id: 'distance',
      label: '距离',
      seconds: 11,
      render: () => (
        <BigNumber
          kicker="有多远"
          value="384,400"
          unit="公里"
          label="地月平均距离"
          note="从地球中心到月球中心的平均值。"
          source={MOONFACTS}
        />
      ),
    },
    {
      id: 'home',
      label: '返回',
      seconds: 16,
      render: () => (
        <Hero
          kicker="1969 年 7 月 24 日 · 太平洋"
          title={['哥伦布号溅落，', '三人平安返回']}
          sub={'隔离 21 天，8 月 10 日结束。\n六次登月共带回 382 公斤月岩。'}
          source={CURATION}
        />
      ),
    },
  ],
})
