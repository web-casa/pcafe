import type { StylePreset } from '../theme'

// Phase 4 style preset `desktop`. Owned by the desktop work; theme.ts only imports it.
export const preset: StylePreset = {
  label: '复古',
  note: '米黄底，粗黑边框的老式系统窗口，条纹标题栏和硬投影，像素体小标签，信息排得密。适合开发者工具、更新日志、轻松的技术分享。',
  ref: 'retro-OS developer-tool sites',
  radius: 0.4,
  paper: { canvas: '#e8e3d3', letterbox: '#d8d2bf', card: '#fffdf5', panel: '#f3efe2', line: '#cfc8b2', lineStrong: '#1d1d1b' },
}
