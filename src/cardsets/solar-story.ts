// One story, shared by every platform set. All numbers come from the repo's verified data file
// (src/decks/v2-p4/data.ts: Our World in Data CSV downloads, 2026-10-30) or are calculated here.
import { RACE, SHARES, WORLD_MIX, WORLD_SOLAR, YEARS } from '../decks/v2-p4/data'

export const SRC_ZH = '数据：Our World in Data（基于 Ember、Energy Institute）'
export const CALC_ZH = '数据：Our World in Data（2026），倍数由本文计算'
export const SRC_EN = 'Data: Our World in Data, from Ember and Energy Institute (2026)'
export const CALC_EN = 'Data: Our World in Data (2026). Ratios calculated here.'

const series = (name: string) => WORLD_MIX.find((s) => s.name === name)!.values.slice(YEARS.indexOf('2015'))

export const SOLAR = WORLD_SOLAR
export const COAL = series('煤电')
export const SOLAR_X = SOLAR.map((_, i) => String(2015 + i))

/** 2025 against 2015. 10.86, printed as "about 11". */
export const MULTIPLE = SOLAR[10] / SOLAR[0]
/** New solar generation in 2025. */
export const ADDED = SOLAR[10] - SOLAR[9]
/** Solar as a share of coal in 2025: 26.5%, printed as "about a quarter". */
export const OF_COAL = SOLAR[10] / COAL[10]

export const COUNTRIES = [...RACE].sort((a, b) => b.values.at(-1)! - a.values.at(-1)!)
export const CHINA_SHARE = COUNTRIES[0].values.at(-1)! / SOLAR[10]
export const TOP_SHARES = [...SHARES].sort((a, b) => b.y - a.y)
export const SHARE_OF = (name: string) => SHARES.find((s) => s.name === name)!.y
export const SAMPLE = SHARES.length
