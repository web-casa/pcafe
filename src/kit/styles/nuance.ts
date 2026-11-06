import type { StylePreset } from '../theme'

// Style preset `nuance`. Owned by the nuance work; theme.ts only imports it.
export const preset: StylePreset = {
  label: '画板',
  note: '暖白纸底，窄衬线大标题，标题里一个词压在倾斜的橙色标签里；虹彩大圆角面板、点阵画板、红点胶囊和深色弧形卡片。适合产品主页、个人作品、设计与工具介绍。',
  ref: 'designer portfolio sites with a doodle canvas',
  radius: 1.5,
  paper: { canvas: '#f9f7f3', letterbox: '#eeeae3', card: '#ffffff', panel: '#f3f0ea', line: '#ebe6de', lineStrong: '#dcd5ca' },
}
