import type { StylePreset } from '../theme'

// Ported from beautiful-html-templates · block-frame (MIT). Owned by the block-frame work; theme.ts only imports it.
export const preset: StylePreset = {
  label: '粗框',
  note: '暖黄底配米白卡片，粗黑描边加硬投影，粗体无衬线大写标题，标签像贴上去的小方块。适合产品介绍、活动、年轻品牌。',
  ref: 'beautiful-html-templates · block-frame (MIT)',
  radius: 0.3,
  paper: { canvas: '#ffdc8b', letterbox: '#f2c96c', card: '#fffdf5', panel: '#fff3d1', line: '#e7c272', lineStrong: '#000000' },
}
