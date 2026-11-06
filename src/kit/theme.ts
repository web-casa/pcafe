// Accent palettes. A deck picks one with DeckDef.theme; everything accent-
// coloured (kickers, focus bars, washes, highlights) reads these variables,
// so a deck never sets colours itself.

import { preset as keynote } from './styles/keynote'
import { preset as bento } from './styles/bento'
import { preset as soft_saas } from './styles/soft-saas'
import { preset as warm_dark } from './styles/warm-dark'
import { preset as ribbon } from './styles/ribbon'
import { preset as desktop } from './styles/desktop'
import { preset as playful } from './styles/playful'
import { preset as float_ui } from './styles/float-ui'
import { preset as pop } from './styles/pop'
import { preset as gradient } from './styles/gradient'
import { preset as nuance } from './styles/nuance'
import { preset as agency } from './styles/agency'
import { preset as halo } from './styles/halo'
import { preset as electric } from './styles/electric'
import { preset as block_frame } from './styles/block-frame'
import { preset as cobalt_grid } from './styles/cobalt-grid'
import { preset as forest } from './styles/forest'
import { preset as emerald } from './styles/emerald'
import { preset as neo_grid } from './styles/neo-grid'
import { preset as platform } from './styles/platform'
import { preset as pink_script } from './styles/pink-script'
import { preset as broadside } from './styles/broadside'
import { preset as biennale } from './styles/biennale'
import { preset as stencil } from './styles/stencil'
import type { CSSProperties } from 'react'

export interface Theme {
  label: string
  /** Bars, numerals, dots, focus fills. */
  accent: string
  /** Accent text on light washes. */
  ink: string
  /** Pale background behind accent text and focused rows. */
  wash: string
  /** The accent as space-separated RGB, for rgb(var(--accent-rgb) / a). */
  rgb: string
  /** Light accent for text on dark (ink) surfaces, e.g. terminal prompts. */
  soft: string
  /** Neutral surfaces tinted toward the accent, so the accent never sits on a clashing grey. */
  paper: Paper
}

export interface Paper {
  /** Slide background. */
  canvas: string
  /** Bars around the 16:9 stage. */
  letterbox: string
  /** Cards and tiles. */
  card: string
  /** Recessed panels. */
  panel: string
  line: string
  lineStrong: string
}

const NEUTRAL: Paper = { canvas: '#f3f2f4', letterbox: '#e6e5e8', card: '#fbfafb', panel: '#f2f1f3', line: '#e4e3e5', lineStrong: '#d3d1d6' }

export const THEMES = {
  crimson: { label: '绯红', accent: '#e00052', ink: '#b8003f', wash: '#fbe8ee', rgb: '224 0 82', soft: '#ff5c93', paper: NEUTRAL },
  amber: {
    label: '橙',
    accent: '#eb5a0c',
    ink: '#b3430a',
    wash: '#fdeee3',
    rgb: '235 90 12',
    soft: '#ff9e5e',
    paper: { canvas: '#f5f2ee', letterbox: '#e8e3dc', card: '#fcfaf7', panel: '#f1ede7', line: '#e7e1d9', lineStrong: '#d7cfc5' },
  },
  cobalt: {
    label: '钴蓝',
    accent: '#2457f5',
    ink: '#1b40b8',
    wash: '#e7eefe',
    rgb: '36 87 245',
    soft: '#8aa6ff',
    paper: { canvas: '#f1f3f7', letterbox: '#e2e6ee', card: '#fafbfd', panel: '#edf0f5', line: '#e0e4eb', lineStrong: '#cdd3de' },
  },
  emerald: {
    label: '翠绿',
    accent: '#0c9366',
    ink: '#08704e',
    wash: '#e2f4ec',
    rgb: '12 147 102',
    soft: '#5fd6a8',
    paper: { canvas: '#f1f4f2', letterbox: '#e2e8e4', card: '#fafcfb', panel: '#edf1ee', line: '#dfe6e1', lineStrong: '#cbd5ce' },
  },
  violet: {
    label: '紫',
    accent: '#6c3cf0',
    ink: '#522bc0',
    wash: '#eee8fe',
    rgb: '108 60 240',
    soft: '#ad91ff',
    paper: { canvas: '#f3f2f7', letterbox: '#e5e3ed', card: '#fbfafd', panel: '#efedf4', line: '#e3e1ea', lineStrong: '#d1cedb' },
  },
} satisfies Record<string, Theme>

export type ThemeName = keyof typeof THEMES

export const DEFAULT_THEME: ThemeName = 'crimson'

/**
 * Spot colours for small multicolour tiles (icon squares, chips, legend dots).
 * Spot 1 is always the theme accent; the rest are fixed so tiles stay distinct
 * whichever theme is active. Templates read --spot-1 … --spot-6, never hex.
 */
const SPOTS = ['#16b364', '#ff6a1f', '#7c5cff', '#b9e82b', '#18181b']

export function themeVars(name: ThemeName = DEFAULT_THEME, style: DeckStyle = DEFAULT_STYLE): CSSProperties {
  const t: Theme = THEMES[name]
  const st: StylePreset = stylePreset(style)
  const paper = { ...t.paper, ...st.paper }
  return {
    '--rs': st.radius ?? 1,
    '--spot-1': t.accent,
    ...Object.fromEntries(SPOTS.map((c, i) => [`--spot-${i + 2}`, c])),
    '--accent': t.accent,
    '--accent-base': t.accent,
    '--accent-ink': t.ink,
    '--accent-wash': t.wash,
    '--accent-rgb': t.rgb,
    '--accent-soft': t.soft,
    '--canvas': paper.canvas,
    '--letterbox': paper.letterbox,
    '--card': paper.card,
    '--panel': paper.panel,
    '--line': paper.line,
    '--line-strong': paper.lineStrong,
  } as CSSProperties
}

/**
 * Style presets: the look around the content. A preset sets the display face,
 * corner rounding and neutral surfaces; CSS under [data-style='…'] (styles/presets.css)
 * adds anything a variable cannot express. The accent (theme) stays independent,
 * so any palette pairs with any preset, except where a preset pins `accent`.
 */
export interface StylePreset {
  label: string
  /** One line for the picker tooltip and docs: what it looks like, when to use it. */
  note: string
  /** Where the look comes from, for the docs. Never a brand name in the UI. */
  ref?: string
  /** Multiplies every card and panel radius. 1 = the kit default. */
  radius?: number
  /** Overrides the theme's neutral surfaces. */
  paper?: Partial<Paper>
  /** Default tone for every slide; a slide's own `tone` wins ('light' opts back out). */
  tone?: 'dark'
}

const BASE_STYLES = {
  standard: { label: '商务', note: 'Geist + 思源黑体，干净中性。默认，适合大多数汇报。' },
  editorial: { label: '编辑', note: '思源宋体标题，像杂志与报告。适合解读、观点、长文式演讲。' },
  poster: { label: '海报', note: 'Anton 窄体大写 + 思源黑体 Black。适合发布会、营销、口号式页面。' },
  calm: {
    label: '静谧',
    note: '纯白底、浅灰大圆角卡片、编号胶囊小标签，句子里嵌彩色小图标。适合产品、金融、SaaS 介绍。',
    ref: 'clean fintech landing pages',
    radius: 1.45,
    paper: { canvas: '#ffffff', letterbox: '#f2f2f4', card: '#f6f6f7', panel: '#efeff1', line: '#ebebed', lineStrong: '#dcdce0' },
  },
  'studio-dark': {
    label: '工作室',
    note: '白页与黑色大圆角主卡交替，几何无衬线标题，软件界面截图。适合工具、平台、设计系统发布。',
    ref: 'software studio sites',
    radius: 1.7,
    paper: { canvas: '#fbfbfb', letterbox: '#efefef', card: '#f4f4f4', panel: '#ededed', line: '#e8e8e8', lineStrong: '#d6d6d6' },
  },
  'mono-studio': {
    label: '等宽黑',
    note: '整份黑底，粗体标题配等宽小字，四角取景框，红色压条小标签。适合创意、品牌、作品提案。',
    ref: 'monospace agency portfolios',
    radius: 0.55,
    tone: 'dark',
  },
  sticker: {
    label: '贴纸',
    note: '网格纸底，像素体西文，贴纸式小标签，彩色词块和拍立得。适合个人介绍、团队分享、轻松的内部会。',
    ref: 'sticker-style personal portfolios',
    radius: 1.25,
    paper: { canvas: '#f6f5f0', letterbox: '#e9e7df', card: '#ffffff', panel: '#efede6', line: '#e2dfd5', lineStrong: '#cfcbbf' },
  },
  toy3d: {
    label: '几何',
    note: '白底超大黑字，彩色 3D 几何体漂浮在内容周围，跑马灯大字。适合品牌、创意机构、发布会开场。',
    ref: '3D geometric brand sites',
    radius: 1.3,
    paper: { canvas: '#fafaf8', letterbox: '#ededea', card: '#ffffff', panel: '#f1f1ee', line: '#e6e6e2', lineStrong: '#d4d4cf' },
  },
  wallpaper: {
    label: '桌面',
    note: '整页是一张柔和渐变壁纸，页眉变成菜单栏，内容放在半透明的系统窗口里。适合产品演示、个人作品、轻松的分享。',
    ref: 'desktop-OS style portfolios',
    radius: 1.5,
    paper: { canvas: '#e9e6f4', letterbox: '#d9d5ea', card: 'rgb(255 255 255 / 0.72)', panel: 'rgb(255 255 255 / 0.5)', line: 'rgb(30 20 60 / 0.09)', lineStrong: 'rgb(30 20 60 / 0.16)' },
  },
  'keynote': keynote,
  'bento': bento,
  'soft-saas': soft_saas,
  'warm-dark': warm_dark,
  'ribbon': ribbon,
  'desktop': desktop,
  'playful': playful,
  'float-ui': float_ui,
  'pop': pop,
  'gradient': gradient,
  'nuance': nuance,
  'agency': agency,
  'halo': halo,
  'electric': electric,
  'block-frame': block_frame,
  'cobalt-grid': cobalt_grid,
  'forest': forest,
  'emerald': emerald,
  'neo-grid': neo_grid,
  'platform': platform,
  'pink-script': pink_script,
  'broadside': broadside,
  'biennale': biennale,
  'stencil': stencil,
} satisfies Record<string, StylePreset>

/** Built-in presets plus any added later by `registerStyle`. */
export const STYLES: Record<string, StylePreset> = BASE_STYLES

/** Built-in names stay in autocomplete; registered third-party names still type-check. */
export type DeckStyle = keyof typeof BASE_STYLES | (string & {})

export const DEFAULT_STYLE: DeckStyle = 'standard'

const warnedStyles = new Set<string>()

/** Resolve a style name, warning once in dev when a deck names an unregistered style. */
export function stylePreset(name: DeckStyle = DEFAULT_STYLE): StylePreset {
  const preset = STYLES[name]
  if (preset) return preset
  const dev = Boolean((import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV)
  if (dev && !warnedStyles.has(name)) {
    warnedStyles.add(name)
    console.warn(`[pcafe] deck uses unknown style "${name}"; call registerStyle("${name}", preset) before rendering. Falling back to "${DEFAULT_STYLE}".`)
  }
  return STYLES[DEFAULT_STYLE]
}

/**
 * Add a style preset at import time. A third-party style's CSS must target
 * `:root[data-style='name']`, because the engine's own `:root` variables have
 * the same specificity.
 */
export function registerStyle(name: string, preset: StylePreset) {
  STYLES[name] = preset
}

/** The tone a slide renders in: its own, else the style's default. */
export function toneOf(tone: SlideTone | undefined, style: DeckStyle = DEFAULT_STYLE): SlideTone | undefined {
  return tone ?? stylePreset(style).tone
}

export type SlideTone = 'dark' | 'accent' | 'light'
