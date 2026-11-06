import type { StylePreset } from '../theme'

// Phase 4 style preset `electric`. Owned by the electric work; theme.ts only imports it.
export const preset: StylePreset = {
  label: '电光',
  note: '纯白页配浅灰大圆角卡，强调色整页是一片发光的饱和蓝，紧凑无衬线大标题，胶囊按钮带圆形箭头。适合产品官网式介绍、工作室提案、发布开场。',
  ref: 'electric-blue studio landing pages',
  radius: 1.5,
  paper: { canvas: '#ffffff', letterbox: '#eeeff5', card: '#f2f2f7', panel: '#ebebf2', line: '#e6e6ee', lineStrong: '#d4d4df' },
}
