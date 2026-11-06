import type { StylePreset } from '../theme'

// Phase 4 style preset `keynote`. Owned by the keynote work; theme.ts only imports it.
export const preset: StylePreset = {
  label: '发布',
  note: '纯黑大画布，一页只放一句超大紧字距标题，关键词用渐变填色，大面积留白。适合产品发布、主题演讲、年度大会。',
  ref: '科技产品发布会式幻灯片',
  radius: 1.2,
  tone: 'dark',
  paper: { canvas: '#ffffff', letterbox: '#f5f5f7', card: '#f5f5f7', panel: '#efeff2', line: '#e6e6ea', lineStrong: '#d2d2d7' },
}
