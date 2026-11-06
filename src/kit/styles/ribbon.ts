import type { StylePreset } from '../theme'

// Phase 4 style preset `ribbon`. Owned by the ribbon work; theme.ts only imports it.
export const preset: StylePreset = {
  label: '彩带',
  note: '暖白底、圆润粗体标题、斜切色带小标签，封面和章节页有粗彩带斜穿画面。适合培训、活动、面向客户的友好介绍。',
  ref: 'ribbon-accent product sites',
  radius: 1.25,
  paper: { canvas: '#fbfaf6', letterbox: '#efece4', card: '#ffffff', panel: '#f3f0e8', line: '#e8e4da', lineStrong: '#d7d2c6' },
}
