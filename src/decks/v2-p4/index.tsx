// Components v2 · phase 4 (data and relations): a talk on the rise of solar power, 2015–2025.
// All figures come from data.ts (Our World in Data, based on Ember 2026 and the
// Energy Institute Statistical Review 2026). The node graph slide is a labelled illustration.

import type { DeckDef } from '../../kit'
import { BubbleCluster, Cover, DotMap, GlowMetrics, LineChart, NodeGraph, RankingRace, Radar, Recap, Sankey, Scatter, StackedArea, Treemap } from '../../kit'
import { RACE, RACE_YEARS, SHARES, WORLD_MIX, WORLD_SHARE, WORLD_SOLAR, YEARS } from './data'

const OWID = 'Our World in Data，基于 Ember（2026）与 Energy Institute《世界能源统计年鉴》（2026），ourworldindata.org'
const mix = (name: string) => WORLD_MIX.find((s) => s.name === name)!.values
const last = (name: string) => mix(name).at(-1)!
const SOLAR_2025 = WORLD_SOLAR.at(-1)!
const CHINA_2025 = RACE[0].values.at(-1)!
const LABELLED = ['中国', '德国', '巴西', '巴基斯坦', '匈牙利', '智利', '日本', '意大利']

export const deck: DeckDef = {
  title: '太阳能的十年',
  iconStyle: 'line-duotone',
  theme: 'amber',
  style: 'mono-studio',
  slides: [
    {
      id: 'cover',
      label: '封面',
      render: () => (
        <Cover
          kicker="数据讲稿 · 全球电力"
          title={['太阳能的十年']}
          subtitle="2015–2025"
          lead="十年里，太阳能从全球电力的 1% 涨到将近 9%。这份讲稿用公开数据看它怎么长、在哪里长、改变了什么。"
          facts={[
            { label: '2015 年占比', value: '1.1%' },
            { label: '2025 年占比', value: '8.7%' },
            { label: '2025 年发电', value: '2,779 TWh' },
          ]}
          numeral="11×"
          note={['发电量约为', '十年前的 11 倍']}
        />
      ),
    },
    {
      id: 'glow',
      label: '三个数',
      build: 'reveal',
      render: () => (
        <GlowMetrics
          kicker="2025 年"
          title="先记住三个数"
          lead="全球太阳能发电在 2025 年再创新高，增速仍接近三成。"
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
      label: '增长',
      render: () => (
        <LineChart
          kicker="增长"
          title="十年涨到约 11 倍"
          lead="2019 年后，每年的增量都在变大：2025 年新增约 636 TWh，是 2015 年全年总量的两倍多。"
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
      label: '结构',
      build: 'reveal',
      render: () => (
        <StackedArea
          kicker="结构"
          title="全球电力从哪里来"
          lead="2000–2025 年各类电源占全球发电的比例。煤电份额在缩小，顶上的太阳能层在变厚。"
          x={YEARS}
          series={WORLD_MIX}
          mode="share"
          ticks={[0, 5, 10, 15, 20, 25]}
          focus="太阳能"
          unit="占全球发电 %"
          source={OWID}
        />
      ),
    },
    {
      id: 'bubble',
      label: '体量',
      render: () => (
        <BubbleCluster
          kicker="体量"
          title="和其他电源比，它有多大"
          lead="2025 年各类电源发电量，面积与发电量成正比。"
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
      id: 'sankey',
      label: '流向',
      build: 'reveal',
      render: () => (
        <Sankey
          kicker="流向"
          title="2025 年的全球发电量怎么拆"
          lead="八类电源汇成化石和低碳两股，再合成全年约 3.18 万 TWh。"
          nodes={[
            { id: 'coal', label: '煤电' },
            { id: 'gas', label: '气电' },
            { id: 'oil', label: '油电' },
            { id: 'hydro', label: '水电' },
            { id: 'nuclear', label: '核电' },
            { id: 'solar', label: '太阳能' },
            { id: 'wind', label: '风电' },
            { id: 'bio', label: '生物质等' },
            { id: 'fossil', label: '化石' },
            { id: 'low', label: '低碳' },
            { id: 'all', label: '全球发电' },
          ]}
          links={[
            { from: 'coal', to: 'fossil', value: 10472 },
            { from: 'gas', to: 'fossil', value: 6921 },
            { from: 'oil', to: 'fossil', value: 842 },
            { from: 'hydro', to: 'low', value: 4435 },
            { from: 'nuclear', to: 'low', value: 2812 },
            { from: 'solar', to: 'low', value: 2779 },
            { from: 'wind', to: 'low', value: 2713 },
            { from: 'bio', to: 'low', value: 799 },
            { from: 'fossil', to: 'all', value: 18235 },
            { from: 'low', to: 'all', value: 13538 },
          ]}
          unit=" TWh"
          focus="solar"
          source={`${OWID}；生物质等 = 生物质 710 + 其他可再生 89；合计因四舍五入差 1`}
        />
      ),
    },
    {
      id: 'race',
      label: '排名',
      build: 'reveal',
      render: () => (
        <RankingRace
          kicker="排名"
          title="谁发的太阳能电最多"
          lead="按 → 每次前进两年。2015 年前五名几乎并列，十年后中国一家超过后面五家之和。"
          periods={RACE_YEARS}
          items={RACE}
          show={7}
          unit=" TWh"
          focus="中国"
          notes={[
            '2015 年：中、美、德三国都在 38–40 TWh',
            '2017 年：中国拉开差距，德国开始掉队',
            '2019 年：印度进入前五',
            '2021 年：日本仍居第三，印度紧随其后',
            '2023 年：巴西进入前七',
            '2025 年：中国 1,175 TWh，约是美国的 3 倍',
          ]}
          source={OWID}
        />
      ),
    },
    {
      id: 'treemap',
      label: '分布',
      render: () => (
        <Treemap
          kicker="分布"
          title="2025 年的太阳能电在哪里发"
          lead="全球 2,779 TWh 按国家拆开，前九个国家约占八成，其余国家合计约两成。"
          items={[
            { name: '中国', value: 1175 },
            { name: '美国', value: 389 },
            { name: '印度', value: 196 },
            { name: '日本', value: 101 },
            { name: '德国', value: 90 },
            { name: '巴西', value: 89 },
            { name: '西班牙', value: 63 },
            { name: '澳大利亚', value: 56 },
            { name: '意大利', value: 45 },
            { name: '其他', value: 575 },
          ]}
          unit=" TWh"
          focus="中国"
          source={`${OWID}；“其他”= 全球合计减前九国`}
        />
      ),
    },
    {
      id: 'map',
      label: '地图',
      build: 'reveal',
      render: () => (
        <DotMap
          kicker="地图"
          title="前八名在地图上"
          lead="2025 年太阳能发电量前八的国家，圆点面积与发电量成正比。"
          listTitle="2025 年发电量"
          markers={[
            { name: '中国', lon: 104, lat: 35, value: 1175 },
            { name: '美国', lon: -98, lat: 39, value: 389 },
            { name: '印度', lon: 79, lat: 22, value: 196 },
            { name: '日本', lon: 138, lat: 37, value: 101 },
            { name: '德国', lon: 10, lat: 51, value: 90 },
            { name: '巴西', lon: -52, lat: -10, value: 89 },
            { name: '西班牙', lon: -4, lat: 40, value: 63 },
            { name: '澳大利亚', lon: 134, lat: -25, value: 56 },
          ]}
          unit=" TWh"
          source={`${OWID}；底图：Natural Earth（公有领域）`}
        />
      ),
    },
    {
      id: 'scatter',
      label: '追赶',
      build: 'reveal',
      render: () => (
        <Scatter
          kicker="追赶"
          title="后来者追得有多快"
          lead="每个点是一个国家：横轴是 2015 年太阳能占本国发电的比例，纵轴是 2025 年。虚线是全球平均。"
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
      id: 'radar',
      label: '对比',
      build: 'reveal',
      render: () => (
        <Radar
          kicker="对比"
          title="两种不同的电力结构"
          lead="2025 年各类电源占本国发电的比例。中国的太阳能总量最大，德国的太阳能占比更高。"
          axes={['煤电', '油气', '核电', '水电', '风电', '太阳能']}
          series={[
            { name: '中国', values: [54.3, 4.0, 4.6, 13.2, 10.7, 11.1] },
            { name: '德国', values: [20.6, 20.3, 0, 3.9, 27.2, 17.9] },
          ]}
          max={60}
          unit="%"
          decimals={1}
          notes={[
            { key: '中国', text: '煤电仍过半，太阳能和风电合计约 22%。' },
            { key: '德国', text: '风电 27.2%、太阳能 17.9%，核电已为 0。' },
          ]}
          source={OWID}
        />
      ),
    },
    {
      id: 'graph',
      label: '系统',
      build: 'reveal',
      render: () => (
        <NodeGraph
          kicker="系统 · 示意"
          title="太阳能越多，电网要补的课越多"
          lead="光伏只在白天发电，比例越高，越需要其他环节配合。下图是示意，不含数据。"
          nodes={[
            { id: 'pv', label: '光伏发电', sub: '白天出力' },
            { id: 'store', label: '储能', sub: '把午间电挪到晚上' },
            { id: 'load', label: '用电负荷', sub: '早晚两个高峰' },
            { id: 'grid', label: '输电网', sub: '跨地区调配' },
            { id: 'flex', label: '灵活电源', sub: '水电、气电调峰' },
            { id: 'curtail', label: '弃光', sub: '用不掉的电' },
          ]}
          edges={[
            { from: 'pv', to: 'store', label: '充电', strong: true },
            { from: 'pv', to: 'grid', label: '送出', strong: true },
            { from: 'grid', to: 'load', label: '供电' },
            { from: 'store', to: 'load', label: '晚高峰放电' },
            { from: 'flex', to: 'grid', label: '调峰' },
            { from: 'pv', to: 'curtail', label: '送不出' },
          ]}
          note="比例低时，电网能直接吸收；比例高时，储能、输电和灵活电源决定还能接多少。"
          source="示意图，按电力系统的一般构成整理，不代表具体数据"
        />
      ),
    },
    {
      id: 'recap',
      label: '小结',
      build: 'reveal',
      render: () => (
        <Recap
          kicker="小结"
          title="十年之后"
          points={[
            { title: '涨得快', body: '全球太阳能发电从 256 TWh 涨到 2,779 TWh，约 11 倍。' },
            { title: '比例接近核电', body: '2025 年占全球发电 8.7%，核电为 8.8%。' },
            { title: '集中在少数国家', body: '中国一国占四成以上，前九国约占八成。' },
            { title: '后来者更快', body: '巴基斯坦、匈牙利十年前不到 1%，如今超过 18%。' },
          ]}
          source={OWID}
        />
      ),
    },
  ],
}
