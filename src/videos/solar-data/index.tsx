// 16:9 data video from the live kit templates. Every figure comes from src/decks/v2-p4/data.ts
// (Our World in Data CSV downloads, 2026-10-30) or is calculated from it in that deck.
import { BubbleCluster, Closing, GlowMetrics, LineChart, NumberOpener, RankingRace, Scatter, StackedArea } from '../../kit'
import { RACE, RACE_YEARS, SHARES, WORLD_MIX, WORLD_SHARE, WORLD_SOLAR, YEARS } from '../../decks/v2-p4/data'
import type { VideoDef } from '../../video'

const OWID = 'Our World in Data，基于 Ember（2026）与 Energy Institute《世界能源统计年鉴》（2026）'
const last = (name: string) => WORLD_MIX.find((s) => s.name === name)!.values.at(-1)!
const SOLAR_2025 = WORLD_SOLAR.at(-1)!
const CHINA_2025 = RACE[0].values.at(-1)!
const LABELLED = ['中国', '德国', '巴西', '巴基斯坦', '匈牙利', '智利', '日本', '意大利']

export const video: VideoDef = {
  title: '太阳能的十年',
  size: '16:9',
  fps: 30,
  theme: 'amber',
  style: 'mono-studio',
  transition: 'fade',
  preroll: 1,
  scenes: [
    {
      id: 'open',
      duration: 3.5,
      caption: '十年前，太阳能还只是全球电力的一个零头。',
      render: () => <NumberOpener kicker="全球电力 · 2015–2025" value="11×" text={['太阳能发电', '十年涨到约 11 倍']} sub="2015 年 256 TWh，2025 年 2,779 TWh。" source={OWID} />,
    },
    {
      id: 'three',
      duration: 5,
      caption: '到 2025 年，它占全球发电的 8.7%，增速仍接近三成。',
      render: () => (
        <GlowMetrics
          kicker="2025 年"
          title="先记住三个数"
          metrics={[
            { value: SOLAR_2025, unit: 'TWh', label: '全球太阳能发电量', delta: '+30% 比 2024 年', trend: WORLD_SOLAR, note: '2015 年只有 256 TWh' },
            { value: WORLD_SHARE.y2025, decimals: 1, unit: '%', label: '占全球发电', delta: '2015 年为 1.1%', note: '与核电（8.8%）几乎持平' },
            { value: (CHINA_2025 / SOLAR_2025) * 100, decimals: 0, unit: '%', label: '中国占全球太阳能', delta: '1,175 TWh', note: '一个国家贡献四成以上' },
          ]}
          source={OWID}
        />
      ),
    },
    {
      id: 'line',
      duration: 5,
      caption: '增量整体越来越大，2025 年一年就新增约 636 TWh。',
      render: () => (
        <LineChart
          kicker="增长"
          title="这条曲线越来越陡"
          x={WORLD_SOLAR.map((_, i) => String(2015 + i))}
          series={[{ name: '全球太阳能发电', values: WORLD_SOLAR, focus: true }]}
          unit="TWh"
          annotations={[{ at: 10, text: '一年新增 636 TWh' }]}
          source={OWID}
        />
      ),
    },
    {
      id: 'stack',
      duration: 5,
      caption: '放回全球电力里看：煤电份额在缩小，太阳能这一层在变厚。',
      render: () => <StackedArea kicker="结构" title="全球电力从哪里来" x={YEARS} series={WORLD_MIX} mode="share" ticks={[0, 5, 10, 15, 20, 25]} focus="太阳能" unit="占全球发电 %" source={OWID} />,
    },
    {
      id: 'bubble',
      duration: 5,
      caption: '它已经超过风电、追上核电，但煤电仍是它的约 3.8 倍。',
      render: () => (
        <BubbleCluster
          kicker="体量"
          title="和其他电源比，它有多大"
          items={[
            { name: '煤电', value: last('煤电') },
            { name: '气电', value: 6921 },
            { name: '水电', value: 4435 },
            { name: '核电', value: last('核电') },
            { name: '太阳能', value: SOLAR_2025 },
            { name: '风电', value: last('风电') },
            { name: '油电', value: 842 },
            { name: '生物质', value: 710 },
          ]}
          unit="TWh"
          focus="太阳能"
          notes={[
            { key: '追上核电', text: '太阳能 2,779 TWh，核电 2,812 TWh，差距约 1%。' },
            { key: '超过风电', text: '2025 年太阳能首次超过风电（2,713 TWh）。' },
            { key: '煤电仍最大', text: '煤电 10,472 TWh，约是太阳能的 3.8 倍。' },
          ]}
          source={OWID}
        />
      ),
    },
    {
      id: 'race',
      duration: 8.5,
      caption: [
        { at: 0.15, text: '2015 年，前几名几乎并列。' },
        { at: 2, text: '之后中国越跑越快，差距逐年拉大。' },
        { at: 6.4, text: '十年后，中国一家超过后面五家之和。' },
      ],
      steps: [2, 3.1, 4.2, 5.3, 6.4],
      render: () => (
        <RankingRace
          kicker="排名"
          title="谁发的太阳能电最多"
          periods={RACE_YEARS}
          items={RACE}
          show={7}
          unit=" TWh"
          focus="中国"
          notes={['2015 年：中、美、德三国都在 38–40 TWh', '2017 年：中国拉开差距，德国开始掉队', '2019 年：印度进入前五', '2021 年：日本仍居第三，印度紧随其后', '2023 年：巴西已进入前七', '2025 年：中国 1,175 TWh，约是美国的 3 倍']}
          source={OWID}
        />
      ),
    },
    {
      id: 'scatter',
      duration: 5,
      caption: '后来者更快：巴基斯坦、匈牙利十年前不到 1%，如今超过 18%。',
      render: () => (
        <Scatter
          kicker="追赶"
          title="后来者追得有多快"
          points={SHARES.map((p) => ({ ...p, label: LABELLED.includes(p.name), focus: p.name === '巴基斯坦' || p.name === '匈牙利' }))}
          xLabel="2015 年占比（%）"
          yLabel="2025 年占比（%）"
          split={{ x: WORLD_SHARE.y2015, y: WORLD_SHARE.y2025 }}
          quadrants={['后来居上', '一直领先', '仍在起步', '被平均追上']}
          xDecimals={0}
          source={`${OWID}；共 ${SHARES.length} 个国家`}
        />
      ),
    },
    {
      id: 'end',
      duration: 5.5,
      // The last card can rest longer than a scene mid-story.
      maxHold: 4.5,
      steps: [0.5, 0.9, 1.3],
      render: () => (
        <Closing
          kicker="十年之后"
          mark="11"
          statement="十年，涨到约 11 倍。"
          follow="煤电仍是它的约 3.8 倍。"
          takeaways={['全球太阳能发电从 256 TWh 涨到 2,779 TWh，占比接近核电。', '中国一国占四成以上，前九国约占八成，增长高度集中。', '巴基斯坦、匈牙利十年前不到 1%，如今都超过 18%。']}
          refs={['Our World in Data', 'Ember（2026）', 'Energy Institute（2026）']}
        />
      ),
    },
  ],
}
