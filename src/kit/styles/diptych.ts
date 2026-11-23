import type { StylePreset } from '../theme'

// Drawn from a two-column portfolio prototype made for PCafe. Owned by the v4 diptych work; theme.ts only imports it.
export const preset: StylePreset = {
  label: '对页',
  note: '纯白底，每页像一本摊开的书：左边一整张高图卡带手写体签名，右边粗体标题里几个字变灰。右边点到什么，左边的图就换成什么。适合独立设计师、摄影与插画作品集、个人品牌。',
  ref: 'two-column personal portfolio sites',
  radius: 1.3,
  paper: { canvas: '#ffffff', letterbox: '#f1f1f3', card: '#f7f7f8', panel: '#f1f1f3', line: '#ececef', lineStrong: '#d6d6db' },
}
