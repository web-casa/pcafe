// LinkedIn document carousel in English. Exports a PDF as well, which is what LinkedIn takes.
import type { CardSetDef } from '../../cards'
import { ADDED, CALC_EN, COAL, SOLAR, SOLAR_X, SRC_EN } from '../solar-story'

const fmt = (v: number) => v.toLocaleString('en-US')

export const set: CardSetDef = {
  title: 'Solar in ten years: LinkedIn document',
  preset: 'linkedin-doc',
  theme: 'amber',
  lang: 'en',
  handle: 'PCafe',
  cards: [
    {
      t: 'cover',
      kicker: 'Global electricity data',
      lines: ['Solar grew', 'about 11x', 'in ten years'],
      mark: [1],
      sub: 'Coal still generates more than it did in 2015',
      motif: { kind: 'bars', values: SOLAR, ends: ['2015', '2025'] },
      source: SRC_EN,
    },
    {
      t: 'number',
      kicker: 'The scale',
      label: 'New solar generation added in 2025 alone',
      value: fmt(ADDED),
      unit: 'TWh',
      note: `All solar in 2015 came to ${SOLAR[0]} TWh. One year of growth is now 2.5 times that.`,
      bars: { values: SOLAR, ends: ['2015 · 256', `2025 · ${fmt(SOLAR[10])}`] },
      source: CALC_EN,
    },
    {
      t: 'chart',
      tone: 'ink',
      kicker: 'The catch',
      title: 'Still only about\na quarter of coal',
      takeaway: `Coal rose from ${fmt(COAL[0])} to ${fmt(COAL[10])} TWh, with a 67 TWh dip in 2025.`,
      chart: { type: 'line', x: SOLAR_X, unit: 'TWh', series: [{ name: 'Coal', values: COAL }, { name: 'Solar', values: SOLAR, focus: true }] },
      source: 'Data: Our World in Data (2026). 2,779 ÷ 10,472 ≈ 26.5%',
    },
    {
      t: 'list',
      kicker: 'How to read this',
      title: 'Three things the headline number hides',
      items: [
        { head: 'Growth is concentrated', body: 'China generated about 42% of the world’s solar power in 2025.', icon: 'global' },
        { head: 'Share tells another story', body: 'Hungary reached 27.3% of its own power, China 11.1%.', icon: 'chart' },
        { head: 'Generation is not capacity', body: 'These figures are TWh generated, not gigawatts installed.', icon: 'bolt' },
      ],
      source: `${SRC_EN}. Calculated here.`,
    },
    {
      t: 'quote',
      text: 'The growth is real.\nThe replacement has\nnot happened yet.',
      by: 'Our reading of the data above',
      source: SRC_EN,
    },
    {
      t: 'ending',
      lines: ['Check it', 'yourself'],
      mark: [1],
      takeaways: ['Solar: about 11x in ten years', 'Still a quarter of coal', 'Coal is above its 2015 level'],
      cta: 'Which country should we chart next?',
      sources: ['Our World in Data, Electricity mix, downloaded 2026-10-30', 'Underlying data: Ember (2026), Energy Institute (2026)'],
      source: null,
    },
  ],
}
