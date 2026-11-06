import type { StylePreset } from '../theme'

// Phase 4 style preset `float-ui`. Owned by the float-ui work; theme.ts only imports it.
export const preset: StylePreset = {
  label: '浮窗',
  note: '安静的大标题，周围漂着略微倾斜的小卡片、标签和声波，阴影很轻。适合 AI、语音、工具类产品的介绍与发布。',
  ref: 'AI voice product pages',
  radius: 1.6,
  paper: { canvas: '#f8f8f6', letterbox: '#ececea', card: '#ffffff', panel: '#f2f2ef', line: '#e8e8e4', lineStrong: '#d6d6d0' },
}
