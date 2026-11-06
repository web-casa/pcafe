// 9:16 short of the same story as solar-data, in portrait-native scenes. Every figure comes from
// src/decks/v2-p4/data.ts (Our World in Data CSV downloads, 2026-10-30) or is calculated from it here.
import { RACE, RACE_YEARS, SHARES, WORLD_MIX, WORLD_SOLAR, YEARS } from '../../decks/v2-p4/data'
import { Count, DrawnLine, HeroNumber, RankBars, Slides, Tall, TallClose, Waffle } from '../../video/portrait'
import type { VideoDef } from '../../video'

const SOURCE = 'Our World in Data，基于 Ember 与 Energy Institute（2026）'
const SOLAR_YEARS = WORLD_SOLAR.map((_, i) => String(2015 + i))
const SOLAR_2025 = WORLD_SOLAR.at(-1)!
const total = (i: number) => WORLD_MIX.reduce((a, s) => a + s.values[i], 0)
const solarValues = WORLD_MIX.find((s) => s.name === '太阳能')!.values
const from2015 = YEARS.indexOf('2015')
const SHARE_BY_YEAR = YEARS.slice(from2015).map((_, i) => (solarValues[from2015 + i] / total(from2015 + i)) * 100)
const top6 = RACE.map((r) => ({ name: r.name, value: r.values[RACE_YEARS.length - 1]! })).sort((a, b) => b.value - a.value).slice(0, 6)
const share = (name: string) => SHARES.find((s) => s.name === name)!

export const video: VideoDef = {
  title: '太阳能的十年（竖版）',
  size: '9:16',
  fps: 30,
  theme: 'amber',
  style: 'mono-studio',
  transition: 'rise',
  // Frame 0 is the finished headline, because it may become the cover. Only the TWh figure still moves.
  preroll: 2,
  scenes: [
    {
      id: 'hook',
      duration: 3.5,
      source: SOURCE,
      render: () => (
        <Tall kicker="太阳能的十年 · 2015–2025">
          <HeroNumber from={1} to={11} unit="倍" lines={['全球太阳能发电', '十年涨到约 11 倍']} detailAt={2.05} detail={<>256 TWh →<Count from={256} to={SOLAR_2025} at={2.25} dur={1.1} unit="TWh" /></>} />
        </Tall>
      ),
    },
    {
      id: 'line',
      duration: 5.5,
      source: SOURCE,
      caption: '增量整体越来越大。',
      render: () => (
        <Tall kicker="全球太阳能发电量">
          <DrawnLine x={SOLAR_YEARS} values={WORLD_SOLAR} unit="TWh" callout="2025 年一年新增约 636 TWh" />
        </Tall>
      ),
    },
    {
      id: 'share',
      duration: 5,
      source: SOURCE,
      caption: '一格是全球发电的 1%。它已经和核电几乎持平。',
      render: () => (
        <Tall kicker="放回全球电力里看">
          <Waffle years={SOLAR_YEARS} shares={SHARE_BY_YEAR} label="太阳能占全球发电的比例" compare={{ label: '核电', value: 8.8, unit: '%' }} />
        </Tall>
      ),
    },
    {
      id: 'rank',
      duration: 5,
      source: SOURCE,
      caption: '中国一国发了全球四成以上，约是美国的 3 倍。',
      render: () => (
        <Tall kicker="2025 年谁发得最多">
          <RankBars items={top6} unit="TWh" focus="中国" headline={{ value: (top6[0].value / SOLAR_2025) * 100, unit: '%', label: '中国占全球' }} />
        </Tall>
      ),
    },
    {
      id: 'late',
      duration: 4.5,
      source: SOURCE,
      caption: '后来者追得更快。',
      render: () => (
        <Tall kicker="太阳能占本国发电的比例">
          <Slides
            rows={[
              { name: '匈牙利', from: share('匈牙利').x, to: share('匈牙利').y },
              { name: '巴基斯坦', from: share('巴基斯坦').x, to: share('巴基斯坦').y },
            ]}
            max={30}
            unit="%"
            fromLabel="2015"
            toLabel="2025"
          />
        </Tall>
      ),
    },
    {
      id: 'close',
      duration: 3.5,
      source: SOURCE,
      render: () => (
        <Tall kicker="十年之后">
          <TallClose lines={[{ key: '全球发电量', value: '2,779 TWh' }, { key: '占全球发电', value: '8.7%' }, { key: '中国占全球太阳能', value: '42%' }]} />
        </Tall>
      ),
    },
  ],
}
