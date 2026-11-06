import type { StylePreset } from '../theme'

// Phase 4 style preset `halo`. Owned by the halo work; theme.ts only imports it.
export const preset: StylePreset = {
  label: '晕光',
  note: '近白底、深石板色细体大标题，个别词换成斜体衬线，背后一团柔和的多色晕光；列表是细线分隔的行。适合产品主页、创意机构、品牌介绍。',
  ref: 'minimal creative agency templates',
  radius: 0.9,
  paper: { canvas: '#fbfbfa', letterbox: '#efefed', card: '#f2f2f0', panel: '#ececea', line: '#e3e4e2', lineStrong: '#c9cccb' },
}
