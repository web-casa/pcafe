import type { StylePreset } from '../theme'

// Drawn from a design-studio landing page prototype made for PCafe. Owned by the v4 atelier work; theme.ts only imports it.
export const preset: StylePreset = {
  label: '设计室',
  note: '纯白底、浅灰大圆角卡片、黑体粗标题，胶囊小标签带一个绿色“可接单”圆点，作品图成排漂移。适合设计工作室、自由职业者、作品集和服务介绍。',
  ref: 'design studio landing pages',
  radius: 1.5,
  paper: { canvas: '#ffffff', letterbox: '#f1f1f1', card: '#f6f6f6', panel: '#ececec', line: '#e8e8e8', lineStrong: '#d4d4d4' },
}
