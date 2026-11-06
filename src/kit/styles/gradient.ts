import type { StylePreset } from '../theme'

// Phase 4 style preset `gradient`. Owned by the gradient work; theme.ts only imports it.
export const preset: StylePreset = {
  label: '流彩',
  note: '白底上铺几团鲜艳的弥散渐变光斑，卡片是半透明毛玻璃大圆角，标题圆润粗体。适合创意工作室、品牌介绍、产品功能发布。',
  ref: 'gradient creative templates',
  radius: 1.6,
  paper: { canvas: '#fbfaff', letterbox: '#efedf8', card: 'rgb(255 255 255 / 0.66)', panel: 'rgb(255 255 255 / 0.5)', line: 'rgb(40 30 90 / 0.09)', lineStrong: 'rgb(40 30 90 / 0.17)' },
}
