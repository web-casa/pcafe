import type { StylePreset } from '../theme'

// Phase 4 style preset `agency`. Owned by the agency work; theme.ts only imports it.
export const preset: StylePreset = {
  label: '增长',
  note: '纯白底，超大紧排黑字，标题里嵌彩色小图标，“( 01 ) 小节.”式括号标签，蓝色胶囊按钮和荧光绿小徽章。适合产品官网、营销方案、增长类提案。',
  ref: 'B2B growth agency landing pages',
  radius: 1.5,
  paper: { canvas: '#ffffff', letterbox: '#f1f1f3', card: '#f4f4f6', panel: '#f4f4f6', line: '#e7e7ea', lineStrong: '#d4d4d9' },
}
