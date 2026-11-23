import type { StylePreset } from '../theme'

// Drawn from a quiet personal-site prototype made for PCafe. Owned by the v4 marker work; theme.ts only imports it.
export const preset: StylePreset = {
  label: '记号笔',
  note: '纯白底，用句子代替标题，关键词像荧光笔一样刷上黄、绿、紫三种底色；浅灰圆角卡配四角取景框，线描等轴小图标，页脚一只走动的时钟。适合个人主页、设计师与写作者、安静的产品介绍。',
  ref: 'quiet personal sites',
  radius: 1.3,
  paper: { canvas: '#ffffff', letterbox: '#f2f2f2', card: '#f3f3f3', panel: '#ececec', line: '#ebebeb', lineStrong: '#d5d5d5' },
}
