import type { StylePreset } from '../theme'

// Phase 4 style preset `soft-saas`. Owned by the soft-saas work; theme.ts only imports it.
export const preset: StylePreset = {
  label: '轻柔',
  note: '白底配淡蓝光晕，圆角卡片带柔和阴影，页面里放日历、时间段这类小界面。适合 SaaS 产品、流程说明、预约与协作类主题。',
  ref: 'scheduling SaaS sites',
  radius: 1.4,
  paper: { canvas: '#ffffff', letterbox: '#eef2f8', card: '#ffffff', panel: '#f4f7fc', line: '#e6ebf3', lineStrong: '#d3dbe8' },
}
