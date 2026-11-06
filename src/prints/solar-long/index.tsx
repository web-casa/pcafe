// Long infographic: ten years of solar power. Figures from src/decks/v2-p4/data.ts
// (Our World in Data, based on Ember 2026 and the Energy Institute Statistical Review 2026).
import { BubbleCluster, GlowMetrics, LineChart, RankingRace, StackedArea } from '../../kit'
import { RACE, RACE_YEARS, WORLD_MIX, WORLD_SHARE, WORLD_SOLAR, YEARS } from '../../decks/v2-p4/data'
import { definePrint, Heading, Kicker, Kit, Text, Title } from '../../print'

const OWID = 'Our World in Data，基于 Ember（2026）与 Energy Institute《世界能源统计年鉴》（2026）'
const mix = (name: string) => WORLD_MIX.find((s) => s.name === name)!.values
const last = (name: string) => mix(name).at(-1)!
const SOLAR_2025 = WORLD_SOLAR.at(-1)!
const CHINA_2025 = RACE[0].values.at(-1)!

export const print = definePrint({
  title: '太阳能的十年',
  format: 'long',
  preset: 'long-1080',
  theme: 'amber',
  style: 'mono-studio',
  tone: 'dark',
  emojiStyle: 'noto',
  slices: ['wechat', 'xhs'],
  sections: [
    {
      id: 'hero',
      source: OWID,
      render: () => (
        <>
          <Kicker>☀️ 2015–2025</Kicker>
          <Title lines={['太阳能', '的十年']} mark={[1]} fit />
          <Text scale={1.5}>十年前它只占全球发电的 1.1%，2025 年到了 8.7%，发电量和核电几乎持平。</Text>
        </>
      ),
    },
    {
      id: 'numbers',
      source: OWID,
      render: () => (
        <Kit part=".glow" label="两个数" dw={780} dh={1000}>
          <GlowMetrics
            kicker=""
            title=""
            metrics={[
              { value: SOLAR_2025, unit: 'TWh', label: '全球太阳能发电量', delta: '+30% 比 2024 年', trend: WORLD_SOLAR, note: '2015 年只有 256 TWh' },
              { value: WORLD_SHARE.y2025, decimals: 1, unit: '%', label: '占全球发电', delta: '2015 年为 1.1%', note: `核电同年 ${last('核电').toLocaleString('en-US')} TWh` },
            ]}
          />
        </Kit>
      ),
    },
    {
      id: 'line',
      source: OWID,
      render: () => (
        <>
          <Heading scale={2}>十年涨到约 11 倍</Heading>
          <Kit part=".line" label="发电量曲线" dw={780} dh={760} tier="fine" scale={0.95} pad={8}>
            <LineChart kicker="" title="" x={YEARS.slice(15).filter((_, i) => i % 2 === 0)} series={[{ name: '太阳能', values: WORLD_SOLAR.filter((_, i) => i % 2 === 0), focus: true }]} unit="TWh" />
          </Kit>
        </>
      ),
    },
    {
      id: 'mix',
      source: OWID,
      render: () => (
        <>
          <Heading scale={2}>全球电力从哪里来</Heading>
          <Text>煤电份额在缩小，顶上的太阳能层在变厚。</Text>
          <Kit part=".sarea" label="电源结构" dw={780} dh={800} tier="fine" pad={16}>
            <StackedArea kicker="" title="" x={YEARS} series={WORLD_MIX} mode="share" ticks={[0, 5, 10, 15, 20, 25]} focus="太阳能" unit="占全球发电 %" />
          </Kit>
        </>
      ),
    },
    {
      id: 'size',
      source: OWID,
      render: () => (
        <>
          <Heading scale={2}>和其他电源比，它有多大</Heading>
          <Text>面积与发电量成正比。煤电仍最大，约是太阳能的 3.8 倍。</Text>
          <Kit part=".cluster" label="体量" dw={780} dh={860} tier="fine">
            <BubbleCluster
              kicker=""
              title=""
              items={[
                { name: '煤电', value: last('煤电') },
                { name: '气电', value: 6921 },
                { name: '水电', value: 4435 },
                { name: '核电', value: last('核电') },
                { name: '太阳能', value: SOLAR_2025 },
                { name: '风电', value: last('风电') },
              ]}
              unit="TWh"
              focus="太阳能"
            />
          </Kit>
        </>
      ),
    },
    {
      id: 'race',
      source: OWID,
      render: () => (
        <>
          <Heading scale={2}>谁发的太阳能电最多</Heading>
          <Text>中国 {CHINA_2025.toLocaleString('en-US')} TWh，约是美国的 3 倍。</Text>
          <Kit part=".race__board" label="排名" dw={780} dh={760}>
            <RankingRace kicker="" title="" periods={RACE_YEARS} items={RACE} show={7} unit=" TWh" focus="中国" />
          </Kit>
        </>
      ),
    },
  ],
})
