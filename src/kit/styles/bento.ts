import type { StylePreset } from '../theme'

// Phase 4 style preset `bento`. Owned by the bento work; theme.ts only imports it.
export const preset: StylePreset = {
  label: '格子',
  note: '浅灰底上排白色方块，大小不一，等宽小标签，圆角利落。适合产品概览、功能清单、一页说清全貌。',
  ref: 'bento-style product pages',
  radius: 1.15,
  paper: { canvas: '#efefed', letterbox: '#e2e2df', card: '#ffffff', panel: '#f6f6f4', line: '#e3e3df', lineStrong: '#cfcfca' },
}
