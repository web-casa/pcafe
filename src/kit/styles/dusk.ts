import type { StylePreset } from '../theme'

// Drawn from a developer-tool landing page prototype made for PCafe. Owned by the v4 dusk work; theme.ts only imports it.
export const preset: StylePreset = {
  label: '霞光面板',
  note: '暖白纸底、紧凑的无衬线大标题，日落渐变（橙到主题色再到紫）的大面板里嵌着半透明框住的深色小部件，代码放在白卡上，红绿两色标出删改。标签切换小部件、拖动光标读曲线、逐段点亮代码看人话解释。适合开发者工具、AI 编程助手、技术类 SaaS 发布。',
  ref: 'developer-tool landing pages with gradient panels',
  radius: 1.1,
  paper: { canvas: '#f6f3ef', letterbox: '#ece7e0', card: '#ffffff', panel: '#ebe6df', line: '#e8e2da', lineStrong: '#d6cfc5' },
}
