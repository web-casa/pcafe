// 小红书 carousel: the solar story in eight cards. Numbers from ../solar-story.ts.
import type { CardSetDef } from '../../cards'
import { ADDED, CALC_ZH, CHINA_SHARE, COAL, COUNTRIES, SAMPLE, SHARE_OF, SOLAR, SOLAR_X, SRC_ZH, TOP_SHARES } from '../solar-story'

const fmt = (v: number) => v.toLocaleString('en-US')

export const set: CardSetDef = {
  title: '太阳能十年：小红书轮播',
  preset: 'xhs-portrait',
  theme: 'amber',
  style: 'standard',
  handle: 'PCafe',
  cards: [
    {
      t: 'cover',
      tone: 'accent',
      kicker: '全球电力数据',
      lines: ['太阳能', '十年涨到', '约 11 倍'],
      mark: [2],
      sub: '可煤电比十年前还多',
      motif: { kind: 'bars', values: SOLAR, ends: ['2015', '2025'] },
      source: SRC_ZH,
    },
    {
      t: 'number',
      tone: 'paper',
      kicker: '先看规模',
      label: '2025 这一年，全球太阳能新增发电量',
      value: fmt(ADDED),
      unit: 'TWh',
      note: `2015 年全年总共才 ${SOLAR[0]} TWh，这一年的新增量约是它的 2.5 倍。`,
      bars: { values: SOLAR, ends: ['2015 · 256', `2025 · ${fmt(SOLAR[10])}`] },
      source: CALC_ZH,
    },
    {
      t: 'compare',
      kicker: '再看比例',
      title: '占比还不到 9%，\n但快追上核电了',
      items: [
        { label: '2015 年，占全球发电', value: '1.1', unit: '%', num: 1.1 },
        { label: '2025 年，占全球发电', value: '8.7', unit: '%', num: 8.7, focus: true },
      ],
      verdict: `2025 年：太阳能 ${fmt(SOLAR[10])}，核电 2,812，只差 33 TWh`,
      source: CALC_ZH,
    },
    {
      t: 'chart',
      tone: 'ink',
      kicker: '但是',
      title: '涨了这么多，\n也才到煤电的四分之一',
      takeaway: `煤电从 ${fmt(COAL[0])} 涨到 ${fmt(COAL[10])} TWh。2025 年少了 67\u00A0TWh，但一年说明不了趋势。`,
      chart: {
        type: 'line',
        x: SOLAR_X,
        unit: 'TWh',
        series: [
          { name: '煤电', values: COAL },
          { name: '太阳能', values: SOLAR, focus: true },
        ],
      },
      source: '数据：Our World in Data（2026）。2,779 ÷ 10,472 ≈ 26.5%',
    },
    {
      t: 'chart',
      kicker: '谁在发电',
      title: `中国一国，\n占了全球约 ${Math.round(CHINA_SHARE * 100)}%`,
      takeaway: '十年前，中美德都在 38–40 TWh，几乎并列。',
      chart: {
        type: 'rank',
        unit: '',
        rows: COUNTRIES.slice(0, 6).map((r, i) => ({ name: r.name, value: Math.round(r.values.at(-1)!), focus: i === 0 })),
      },
      source: '2025 年发电量（TWh）。数据：Our World in Data（2026）',
    },
    {
      t: 'chart',
      kicker: '比例另算',
      title: '比例最高的，\n不是发电最多的',
      takeaway: `发电最多的中国，比例只有 ${SHARE_OF('中国')}%。`,
      chart: {
        type: 'rank',
        unit: '%',
        decimals: 1,
        gapBefore: 5,
        rows: [...TOP_SHARES.slice(0, 5).map((r) => ({ name: r.name, value: r.y })), { name: '中国', value: SHARE_OF('中国'), focus: true }],
      },
      source: `太阳能占本国发电比例，2025 年。样本为 ${SAMPLE} 国，不是全球排名`,
    },
    {
      t: 'steps',
      tone: 'wash',
      kicker: '自己核对',
      title: '这些数怎么查？四步',
      steps: [
        { head: '打开 Electricity mix 页面', body: 'Our World in Data 的数据页，网址见下。' },
        { head: '选 Solar 和 Generation', body: 'Source 选 Solar，Metric 选 Generation。' },
        { head: '下载 CSV', body: 'Download full data 是含 CSV 的压缩包。' },
        { head: '看清单位', body: '这里是发电量 TWh，别和装机容量混着比。' },
      ],
      source: '网址：ourworldindata.org/grapher/electricity-prod-source-stacked',
    },
    {
      t: 'ending',
      tone: 'ink',
      lines: ['涨得很快', '替代还早'],
      mark: [1],
      takeaways: ['增长是真的，十年约 11 倍', '总量看中国，比例看欧洲和智利', '煤电绝对量仍高于十年前'],
      cta: '想看哪个国家？评论区告诉我',
      sources: ['Our World in Data：Electricity production by source，2026-10-30 下载', '原始数据：Ember（2026）、Energy Institute（2026）'],
      source: null,
    },
  ],
}
