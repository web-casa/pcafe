import type { StylePreset } from '../theme'

// Drawn from a private photo-album app prototype made for PCafe. Owned by the v4 album work; theme.ts only imports it.
export const preset: StylePreset = {
  label: '相册',
  note: '白底加一团暖黄晨光，照片做成宽底边的拍立得，标题里一个词换成斜体衬线，带橙到玫红到紫的渐变。拍立得会扇形发牌、挂在绳上晃、翻到背面看留言。适合相册、日记、家庭与生活方式产品、温暖的消费品发布。',
  ref: 'warm consumer photo app sites',
  radius: 1.4,
  paper: { canvas: '#ffffff', letterbox: '#f6f1ea', card: '#fbf8f4', panel: '#f3eee7', line: '#eee8df', lineStrong: '#dcd4c8' },
}
