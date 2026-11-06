// The same exhibit on a 65-inch upright totem: rewritten for a narrow column, not the landscape scenes re-flowed.
import { BigNumber, Hero, Moments, Pair, Quote, defineScreen } from '../../screen'
import { AGC, DECOR, JFK, JOURNAL, MOMENTS, MOONFACTS, NASA, SATURN } from '../apollo11/facts'
import surface from '../../decks/v2-p2/assets/decor-lunar-surface.webp'
import disc from '../../decks/v2-p2/assets/decor-moon-disc.webp'

const moon = { src: disc, mode: 'disc' } as const
const ground = { src: surface, mode: 'ground' } as const

export const screen = defineScreen({
  title: '阿波罗 11\u00a0号的八天',
  theme: 'cobalt',
  face: 'editorial',
  atmosphere: 'stars',
  orientation: 'portrait',
  // A 65-inch totem, read from 3 m by people walking past.
  venue: { diagonalIn: 65, distanceM: 3, baselineM: 1.4, panel: 'lcd' },
  clock: { date: true },
  reloadAt: '04:30',
  scenes: [
    {
      id: 'open',
      label: '开场',
      seconds: 12,
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
      id: 'choose',
      label: '演讲',
      seconds: 14,
      render: () => (
        <Quote
          kicker="我们选择登月"
          lines={['不是因为', '它们容易，', '而是因为', '它们困难。']}
          by="肯尼迪 · 1962 年 9 月 12 日"
          source={JFK}
        />
      ),
    },
    {
      id: 'saturn',
      label: '火箭',
      seconds: 11,
      render: () => <BigNumber kicker="靠什么上去" value="110.6" unit="米" label="土星五号的高度" note="从 39A 号发射台起飞。" art={moon} source={SATURN} credit={DECOR} />,
    },
    {
      id: 'agc',
      label: '计算机',
      seconds: 11,
      render: () => <BigNumber kicker="靠什么算" value="2048" unit="字" label="制导计算机内存" note="只有 2048 个 16 位字。" source={AGC} />,
    },
    {
      id: 'moments',
      label: '时刻表',
      seconds: 18,
      render: () => <Moments kicker="1969 年 · 世界时" title={['五个时刻']} items={MOMENTS} source={JOURNAL} />,
    },
    {
      id: 'step',
      label: '一步',
      seconds: 13,
      render: () => (
        <Pair
          kicker="踏上月面时"
          items={[
            { big: '一个人的一小步', small: '“That’s one small step for [a] man,”' },
            { big: '人类的一大步', small: '“one giant leap for mankind.”' },
          ]}
          source={NASA}
        />
      ),
    },
    {
      id: 'surface',
      label: '月面',
      seconds: 12,
      render: () => <BigNumber kicker="两人在月面" value="21.6" unit="小时" label="从着陆到离开月面" note="21 小时 36 分，舱外活动只有两个半小时多一点。" art={ground} source={NASA} credit={DECOR} />,
    },
    {
      id: 'distance',
      label: '距离',
      seconds: 10,
      render: () => <BigNumber kicker="有多远" value="384,400" unit="公里" label="地月平均距离" note="从地球中心到月球中心。" art={moon} source={MOONFACTS} credit={DECOR} />,
    },
    {
      id: 'home',
      label: '返回',
      seconds: 13,
      render: () => <Hero kicker="1969 年 7 月 24 日" title={['哥伦布号溅落', '三人平安返回']} sub="隔离 21 天，8 月 10 日结束。" source={NASA} />,
    },
  ],
})
