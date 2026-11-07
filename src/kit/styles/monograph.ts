import type { StylePreset } from '../theme'

// Drawn from a digital-agency site prototype made for PCafe. Owned by the v4 monograph work; theme.ts only imports it.
export const preset: StylePreset = {
  label: '专著',
  note: '浅灰纸、淡淡的四栏竖线、中等字重的大标题，主题色只用在圆点、编号和一句强调上；作品图大幅、人像黑白。适合品牌与数字机构、作品集、团队介绍。',
  ref: 'digital agency portfolios',
  radius: 0.5,
  paper: { canvas: '#ececea', letterbox: '#dededa', card: '#ffffff', panel: '#e2e2df', line: '#d9d9d5', lineStrong: '#bdbdb8' },
}
