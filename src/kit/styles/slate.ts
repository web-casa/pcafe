import type { StylePreset } from '../theme'

// Drawn from a SaaS analytics prototype made for PCafe. Owned by the v4 slate work; theme.ts only imports it.
export const preset: StylePreset = {
  label: '立体看板',
  note: '冷灰底加白卡片，一种主色做成由浅到深的渐变，只点亮一张卡、一根柱或一列。标题里嵌一枚斜放的小图标块，右侧的数据看板在 3D 里微微倾斜。点 KPI 换图表、拖人数改价格、开关只看差异。适合 SaaS 发布、数据产品、增长复盘与定价页。',
  ref: 'tilted-dashboard SaaS landing pages',
  radius: 1.2,
  paper: { canvas: '#eef0f4', letterbox: '#e6e9ef', card: '#ffffff', panel: '#f5f6f9', line: '#e2e5ec', lineStrong: '#cdd2dc' },
}
