import type { StylePreset } from '../theme'

// Phase 4 style preset `playful`. Owned by the playful work; theme.ts only imports it.
export const preset: StylePreset = {
  label: '糖果',
  note: '奶油底、糖果色软斑、超圆的粗体标题，配歪斜便签和聊天气泡。适合消费产品、社群活动、轻松的分享会。',
  ref: 'playful consumer app sites',
  radius: 1.6,
  paper: { canvas: '#fff8ee', letterbox: '#f6eadb', card: '#ffffff', panel: '#fdf0e0', line: '#f0e3d0', lineStrong: '#e2cfb4' },
}
