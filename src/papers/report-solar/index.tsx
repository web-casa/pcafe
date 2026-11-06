// A real analysis report on one source. Every figure comes from the v2-p4 data file
// (Our World in Data CSV downloads, 2026-10-30) or is calculated from it in this file.
import { Sankey } from '../../kit'
import { Callout, Cover, DocArea, DocBars, DocLine, DocStack, Figure, H1, H2, List, P, SlidePage, SourceList, Stats, Table, Toc, type ReportDef } from '../../paper'
import { RACE, RACE_YEARS, SHARES, WORLD_MIX, WORLD_SOLAR, YEARS } from '../../decks/v2-p4/data'

const DATA = '数据：Our World in Data，基于 Ember（2026）与 Energy Institute（2026）[^owid]'
const CALC = `${DATA}；同比与新增量由本文计算`
const SOLAR_YEARS = WORLD_SOLAR.map((_, i) => String(2015 + i))
const at2015 = YEARS.indexOf('2015')
const total = (i: number) => WORLD_MIX.reduce((a, s) => a + s.values[i], 0)
const fmt = (v: number) => v.toLocaleString('en-US')
const pct = (v: number) => `${v.toFixed(1)}%`
const LAST = YEARS.length - 1
const riser = [...SHARES].sort((a, b) => b.y - a.y).slice(0, 8)

export const paper: ReportDef = {
  kind: 'report',
  title: '太阳能的十年',
  theme: 'amber',
  look: 'editorial',
  footer: 'PCafe 示例报告',
  sources: {
    owid: { org: 'Our World in Data', title: 'Electricity production by source / Share of electricity by source', url: 'https://ourworldindata.org/grapher/electricity-prod-source-stacked', note: '基于 Ember（2026）与 Energy Institute《世界能源统计年鉴》（2026）整理，2026 年 10 月 30 日下载。' },
  },
  blocks: [
    <Cover
      kicker="全球电力结构分析"
      title={['太阳能的十年']}
      subtitle="2015 至 2025 年，全球太阳能发电怎么长、在哪里长，又改变了什么。"
      numeral="8.7%"
      numeralLabel="2025 年太阳能占全球发电的比例，2015 年为 1.1%"
      facts={[{ label: '覆盖时间', value: '2015–2025 年' }, { label: '数据版本', value: '2026 年 10 月下载' }, { label: '数据来源', value: 'Our World in Data' }]}
      note="这是一份演示 PCafe 文档能力的示例报告，数字全部来自公开数据，出处见文末。"
    />,
    <Toc />,
    <H1>摘要</H1>,
    <P lead>2025 年，全球太阳能发电量达到 2,779 TWh，约为 2015 年的 11 倍，占全球发电的比例从 1.1% 升到 8.7%，几乎追平核电。</P>,
    <P>这份报告只回答三个问题：增长有多快，集中在哪里，以及它有没有真正改变全球的电力结构。结论是增长确实很快，但高度集中；太阳能和风电合计已经超过核电与水电的任何一项，而煤电的绝对发电量到 2025 年仍高于十年前。</P>,
    <Stats
      items={[
        { value: '2,779', label: '2025 年发电量（TWh）', note: '2015 年为 256 TWh' },
        { value: '+636', label: '2025 年新增（TWh）', note: '比 2024 年增长 30%' },
        { value: '42%', label: '中国占全球的比例', note: '1,175 TWh' },
      ]}
      source={DATA}
    />,
    <H1>增长：年度增量放大近九倍</H1>,
    <P>2015 年全球太阳能发电只有 256 TWh。此后每年的同比增速都在 21% 到 36% 之间，看起来并不特别，真正变化的是基数。2016 年新增 72 TWh，2025 年一年就新增 636 TWh，相当于 2015 年全年总量的约 2.5 倍。[^owid]</P>,
    <Figure caption="全球太阳能发电量，2015–2025 年" source={DATA}>
      <DocLine x={SOLAR_YEARS} series={[{ name: '全球太阳能发电', values: WORLD_SOLAR, focus: true }]} unit=" TWh" />
    </Figure>,
    <P>同比增速在 2017 年最高（36%），2019 年最低（21%），之后六年回升到接近三成。一项技术的规模涨到约 11 倍之后增速没有明显回落，这一点比任何单年的数字都值得注意。</P>,
    <Table
      caption="全球太阳能发电的逐年变化"
      source={CALC}
      columns={[{ label: '年份' }, { label: '发电量（TWh）', num: true }, { label: '当年新增（TWh）', num: true }, { label: '同比', num: true }]}
      rows={WORLD_SOLAR.map((v, i) => [SOLAR_YEARS[i], fmt(v), i ? fmt(v - WORLD_SOLAR[i - 1]) : '–', i ? `${Math.round((v / WORLD_SOLAR[i - 1] - 1) * 100)}%` : '–'])}
      focus={[10]}
    />,
    <H1>结构：份额变了，煤电还在</H1>,
    <P>把时间拉长到 2000 年，变化更清楚。2025 年太阳能和风电合计发电 5,492 TWh，占全球 17.3%；2015 年两者合计只有 1,086 TWh，占 4.5%。这十年全球发电总量增加了 7,771 TWh，其中太阳能和风电贡献了约 57%。[^owid]</P>,
    <Figure caption="全球发电结构，2000–2025 年（占比，%）" source={DATA}>
      <DocArea x={YEARS} series={WORLD_MIX} focus="太阳能" />
    </Figure>,
    <P>但替代还没有发生。煤电从 2015 年的 9,284 TWh 增加到 2025 年的 10,472 TWh，份额下降是因为总量增长更快，绝对量并没有减少。不过最近一年出现了松动：2025 年煤电比 2024 年减少了 67 TWh。一年的变化不足以说明趋势，但值得继续观察。</P>,
    <Table
      caption="各类电源十年变化"
      source={`${DATA}；比例与变化量由本文计算`}
      columns={[{ label: '电源' }, { label: '2015（TWh）', num: true }, { label: '2025（TWh）', num: true }, { label: '变化（TWh）', num: true }, { label: '2015 占比', num: true }, { label: '2025 占比', num: true }]}
      rows={WORLD_MIX.map((s) => [s.name, fmt(s.values[at2015]), fmt(s.values[LAST]), `+${fmt(s.values[LAST] - s.values[at2015])}`, pct((s.values[at2015] / total(at2015)) * 100), pct((s.values[LAST] / total(LAST)) * 100)])}
      focus={[WORLD_MIX.findIndex((s) => s.name === '太阳能')]}
    />,
    <H1>地理：一国四成，其余分散</H1>,
    <H2>总量集中在中国</H2>,
    <P>2025 年中国的太阳能发电量为 1,175 TWh，约占全球的 42%，是美国（389 TWh）的 3 倍。2015 年中国、美国和德国还在 38 到 40 TWh 之间几乎并列。[^owid]</P>,
    <Figure caption="2025 年太阳能发电量前十的国家（TWh）" source={DATA}>
      <DocBars items={[...RACE].sort((a, b) => b.values.at(-1)! - a.values.at(-1)!).slice(0, 10).map((r) => ({ name: r.name, value: r.values.at(-1)!, focus: r.name === '中国' }))} />
    </Figure>,
    <Table
      caption="主要国家太阳能发电量的变化（TWh）"
      source={DATA}
      columns={[{ label: '国家' }, ...RACE_YEARS.map((y) => ({ label: y, num: true }))]}
      rows={RACE.slice(0, 8).map((r) => [r.name, ...r.values.map((v) => (v < 10 ? v.toFixed(1) : fmt(Math.round(v))))])}
      focus={[0]}
    />,
    <H2>比例最高的不是总量最大的</H2>,
    <P>总量看中国，比例要看别处。下面八个国家是样本中 2025 年太阳能占本国发电比例最高的，其中匈牙利和巴基斯坦 2015 年都不到 1%，十年后分别达到 27.3% 和 18.8%。中国的这一比例是 11.1%，低于德国的 17.9%。[^owid]</P>,
    <Figure caption="太阳能占本国发电比例最高的八个国家，2025 年（%）" source={`${DATA}；样本为报告选取的 ${SHARES.length} 个国家，不是全球排名`}>
      <DocBars items={riser.map((r) => ({ name: r.name, value: r.y }))} unit="%" decimals={1} />
    </Figure>,
    <H2>两种电力结构</H2>,
    <P>中国和德国代表两条路。中国的煤电仍超过一半，太阳能和风电合计约 22%；德国的风电和太阳能合计 45.1%，核电已经归零。</P>,
    <Figure caption="中国与德国的电力结构，2025 年（%）" source={DATA}>
      <DocStack parts={['煤电', '气电', '核电', '水电', '风电', '太阳能']} focus="太阳能" rows={[{ name: '中国', values: [54.3, 4.0, 4.6, 13.2, 10.7, 11.1] }, { name: '德国', values: [20.6, 20.3, 0, 3.9, 27.2, 17.9] }]} />
    </Figure>,
    <SlidePage caption="2025 年全球发电量的拆分：八类电源汇成化石与低碳两股（TWh）" source={`${DATA}；生物质等 = 生物质 710 + 其他可再生 89；合计因四舍五入差 1；这一页直接使用幻灯片模板 Sankey`}>
      <Sankey
        kicker="流向"
        title="2025 年的全球发电量怎么拆"
        nodes={[
          { id: 'coal', label: '煤电' }, { id: 'gas', label: '气电' }, { id: 'oil', label: '油电' }, { id: 'hydro', label: '水电' },
          { id: 'nuclear', label: '核电' }, { id: 'solar', label: '太阳能' }, { id: 'wind', label: '风电' }, { id: 'bio', label: '生物质等' },
          { id: 'fossil', label: '化石' }, { id: 'low', label: '低碳' }, { id: 'all', label: '全球发电' },
        ]}
        links={[
          { from: 'coal', to: 'fossil', value: 10472 }, { from: 'gas', to: 'fossil', value: 6921 }, { from: 'oil', to: 'fossil', value: 842 },
          { from: 'hydro', to: 'low', value: 4435 }, { from: 'nuclear', to: 'low', value: 2812 }, { from: 'solar', to: 'low', value: 2779 },
          { from: 'wind', to: 'low', value: 2713 }, { from: 'bio', to: 'low', value: 799 }, { from: 'fossil', to: 'all', value: 18235 }, { from: 'low', to: 'all', value: 13538 },
        ]}
        unit=" TWh"
        focus="solar"
      />
    </SlidePage>,
    <H1>结论</H1>,
    <List ordered items={[
      '**增长是真实的，而且还没有放缓。** 十年增长约 11 倍，2025 年的同比增速仍有 30%。',
      '**结构在变，但替代尚未发生。** 太阳能和风电贡献了十年新增发电量的约 57%，煤电的绝对量仍高于 2015 年。',
      '**总量和比例要分开看。** 中国决定全球总量，而匈牙利、智利等国更能说明高比例运行时会发生什么。',
    ]} />,
    <Callout title="这份报告没有回答的" tone="note">发电量不等于电网能否吸收。太阳能比例上升后，储能、输电和灵活电源会变得多重要，本文的数据不足以判断，需要逐国的调度和弃电数据。</Callout>,
    <H1>来源</H1>,
    <SourceList />,
  ],
}
