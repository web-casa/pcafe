// Regression sheet, not a post: every template on each shape it claims to support, so a CSS change
// that breaks one ratio fails QA. Numbers are repo data; see ../solar-story.ts.
import type { CardDef, CardSetDef, PresetName } from '../../cards'
import { COAL, COUNTRIES, SOLAR, SOLAR_X, SRC_ZH } from '../solar-story'

const body: CardDef[] = [
  { t: 'number', kicker: '规模', label: '2025 年全球太阳能发电量', value: '2,779', unit: 'TWh', note: '2015 年为 256 TWh。', bars: { values: SOLAR, ends: ['2015', '2025'] }, source: SRC_ZH },
  { t: 'chart', kicker: '走势', title: '再猛也才到\n煤电的四分之一', chart: { type: 'line', x: SOLAR_X, unit: 'TWh', series: [{ name: '煤电', values: COAL }, { name: '太阳能', values: SOLAR, focus: true }] }, source: SRC_ZH },
  { t: 'chart', kicker: '逐年', title: '每年都在加速', chart: { type: 'bars', x: SOLAR_X, values: SOLAR, unit: 'TWh' }, source: SRC_ZH },
  { t: 'chart', kicker: '排名', title: '中国占全球\n约 42%', chart: { type: 'rank', rows: COUNTRIES.slice(0, 5).map((r, i) => ({ name: r.name, value: Math.round(r.values.at(-1)!), focus: i === 0 })) }, source: SRC_ZH },
  { t: 'compare', kicker: '比例', title: '占比升到\n8.7%', items: [{ label: '2015 年', value: '1.1', unit: '%', num: 1.1 }, { label: '2025 年', value: '8.7', unit: '%', num: 8.7, focus: true }], source: SRC_ZH },
  { t: 'list', kicker: '三点', title: '记住这三点', items: [{ head: '增长是真的', body: '十年约 11 倍。', icon: 'chart' }, { head: '总量看中国', body: '约占全球 42%。', icon: 'global' }, { head: '煤电还在', body: '绝对量高于十年前。', icon: 'bolt' }], source: SRC_ZH },
  { t: 'steps', kicker: '核对', title: '三步查数据', steps: [{ head: '打开数据页', body: 'Our World in Data。' }, { head: '选指标', body: 'Solar 与 Generation。' }, { head: '下载', body: '含 CSV 的压缩包。' }], source: null },
  { t: 'quote', text: '增长是真的，\n替代还没有发生。', by: '本文结论', source: SRC_ZH },
  { t: 'text', kicker: '说明', title: '发电量不是装机容量', paras: ['这里的单位都是 **TWh**，指一年实际发出来的电。', '装机容量是**能发多少**，两者别混着比。'], source: null },
  { t: 'ending', lines: ['涨得很快', '替代还早'], mark: [1], cta: '想看哪个国家？', sources: ['Our World in Data，2026-10-30 下载'], source: null },
]

const on = (preset: PresetName, cards: CardDef[]) => cards.map((c) => ({ ...c, preset, cover: false }) as CardDef)
const wideOnly = body.filter((c) => ['number', 'chart', 'compare', 'quote'].includes(c.t))
const landscape = body.filter((c) => ['number', 'chart', 'compare', 'list', 'quote'].includes(c.t))

const coverOf = (preset: PresetName, tone: 'accent' | 'ink' | 'wash' | 'paper'): CardDef => ({
  t: 'cover', preset, tone, cover: true, kicker: '全球电力数据', lines: ['太阳能', '十年涨到', '约 11 倍'], mark: [2], sub: '可煤电比十年前还多',
  motif: { kind: 'bars', values: SOLAR, ends: ['2015', '2025'] }, source: SRC_ZH,
})
const wideOf = (preset: PresetName, align?: 'left'): CardDef => ({
  t: 'wide', preset, align, cover: true, lines: ['太阳能 ×11', '煤电反而更多'], mark: [1], sub: '全球发电量，2015–2025', motif: { kind: 'bars', values: SOLAR }, source: `约 10.9 倍。${SRC_ZH}`,
})

export const set: CardSetDef = {
  title: 'All templates, all shapes',
  preset: 'xhs-portrait',
  theme: 'cobalt',
  pages: false,
  cards: [
    coverOf('xhs-portrait', 'accent'),
    coverOf('xhs-square', 'ink'),
    coverOf('weibo-square', 'paper'),
    coverOf('ig-portrait', 'wash'),
    coverOf('channels-portrait', 'accent'),
    coverOf('douyin-cover', 'ink'),
    wideOf('bili-wide'),
    wideOf('bili-mobile'),
    wideOf('xhs-landscape'),
    wideOf('channels-wide'),
    wideOf('weibo-article'),
    wideOf('yt-thumb', 'left'),
    wideOf('og-image', 'left'),
    { t: 'wide', preset: 'wechat-head', cover: true, lines: ['约 11 倍'], mark: [0], sub: '太阳能这十年', motif: { kind: 'bars', values: SOLAR }, source: SRC_ZH },
    { t: 'cover', preset: 'wechat-thumb', cover: true, lines: ['11倍'], source: SRC_ZH },
    ...on('xhs-portrait', body),
    ...on('xhs-square', body),
    ...on('ig-portrait', body),
    ...on('douyin-cover', body),
    ...on('bili-wide', wideOnly),
    ...on('xhs-landscape', landscape),
  ],
}
