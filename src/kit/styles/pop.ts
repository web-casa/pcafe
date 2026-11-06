import type { StylePreset } from '../theme'

// Phase 4 style preset `pop`. Owned by the pop work; theme.ts only imports it.
export const preset: StylePreset = {
  label: '波普',
  note: '奶油底配饱和色块，粗黑描边加硬投影，Anton 窄体与特粗黑体大标题。适合营销活动、校园与社群分享、口号式的规则宣讲。',
  ref: 'bold pop-art templates',
  radius: 0.35,
  paper: { canvas: '#fff6e6', letterbox: '#f3e7cf', card: '#ffffff', panel: '#fbeed6', line: '#ead9b8', lineStrong: '#17171b' },
}
