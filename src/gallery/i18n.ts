// Gallery language: Chinese or English. The catalog stays Chinese at the source;
// English comes from src/kit/catalog.en.ts when it exists (loaded optionally, so
// the gallery still builds while that file is being written).
import { createContext, useContext } from 'react'
import type { RegisteredTemplate } from '../engine/registry'

export type Lang = 'zh' | 'en'

const KEY = 'pcafe-kit-lang'

export function initialLang(): Lang {
  const q = new URLSearchParams(location.search).get('lang')
  if (q === 'en' || q === 'zh') return q
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === 'en' || saved === 'zh') return saved
  } catch {
    /* storage blocked: fall through */
  }
  return navigator.language?.toLowerCase().startsWith('zh') ? 'zh' : 'en'
}

export function saveLang(lang: Lang) {
  try {
    localStorage.setItem(KEY, lang)
  } catch {
    /* per-viewer convenience only */
  }
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'
}

export const LangContext = createContext<Lang>('zh')
export const useLang = () => useContext(LangContext)

// ── English catalog (optional) ───────────────────────────────────────────────
type EnEntry = {
  name: string
  role: string
  summary: string
  useWhen: string[]
  avoidWhen: string[]
  limits: string[]
  props?: Record<string, string>
  interaction?: string
}
const mods = import.meta.glob<Record<string, unknown>>('../kit/catalog.en.ts', { eager: true })
const mod = Object.values(mods)[0] ?? {}
const isRecord = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v)
const EN: Record<string, EnEntry> = isRecord(mod.catalogEn) ? (mod.catalogEn as Record<string, EnEntry>) : {}
const SHARED_PROPS: Record<string, string> = isRecord(mod.sharedPropNotes) ? (mod.sharedPropNotes as Record<string, string>) : {}
export const hasEnglishCatalog = Object.keys(EN).length > 0

type ProFields = { nameEn?: string; summaryEn?: string }

/** The entry in the chosen language; fields without a translation stay Chinese. */
export function localize(entry: RegisteredTemplate, lang: Lang): RegisteredTemplate {
  if (lang === 'zh') return entry
  const en = EN[entry.id]
  if (en) {
    return {
      ...entry,
      name: en.name,
      role: en.role,
      summary: en.summary,
      useWhen: en.useWhen,
      avoidWhen: en.avoidWhen,
      limits: en.limits,
      interaction: entry.interaction ? (en.interaction ?? entry.interaction) : undefined,
      props: entry.props.map((p) => ({ ...p, note: en.props?.[p.name] ?? SHARED_PROPS[p.name] ?? (p.name.includes(' / ') ? 'Same as the shared fields' : p.note) })),
    }
  }
  const pro = entry as RegisteredTemplate & ProFields
  return { ...entry, name: pro.nameEn ?? entry.name, summary: pro.summaryEn ?? entry.summary }
}

// ── UI strings ───────────────────────────────────────────────────────────────
export const UI = {
  zh: {
    docTitle: 'PCafe · 幻灯片组件库',
    open: '打开当前演示',
    eyebrow: (n: number) => `幻灯片组件库 · ${n} 个模板`,
    h1: ['挑一个模板，', '填进内容，就是一页'],
    lead: '每个模板都有固定的版式、动效和内容上限。按“适合 / 避免 / 内容上限”挑选模板，照着示例填写 props，最后用 npm run qa 检查排版。完整的写作流程见',
    guide: 'docs/zh-CN/guide.md',
    facts: { templates: '模板', canvas: '画布', decks: '参考演示', pages: (n: number) => `${n} 页`, icons: '图标' },
    nav: '模板目录',
    resources: '资源',
    wall: '风格样张墙',
    iconIndex: '图标索引',
    emojiIndex: 'Emoji 索引',
    footAdd: '新增模板时：在 src/kit 写组件，在 catalog.ts 登记，然后运行 npm run docs 生成 docs/components.md。',
    footIcons: ['图标：', ' by 480 Design，以 ', ' 授权使用。'],
    wallRole: (n: number) => `同一页内容 · ${n} 种风格`,
    wallSummary: '风格只改外观：标题字体、圆角系数、底色和卡片质感。字段、内容上限和出处都不变，所以选风格只需要比较这面墙。',
    wallPick: '样张',
    samples: ['封面', '一句话', '面板卡片', '数据页', '章节页'],
    iconSeries: '图标系列',
    accent: '强调色',
    style: '风格',
    byDeck: '随演示',
    iconRole: (n: number, cur: string) => `${n} 个精选图标 · 6 个系列 · 当前 ${cur}`,
    iconSummary: ['图标来自 Solar（480 Design）。整份演示用同一个系列：在 DeckDef 里写 ', '，默认 Line Duotone。双色系列里，副色层默认是半透明墨色；', ' 把副色层换成强调色，每页只给一个焦点图标用。点击图标复制名称。'],
    iconCode: ['// 跟随 iconStyle', '// 焦点图标', '// 单个图标改用其他系列'],
    copyIcon: (n: string) => `复制图标名 ${n}`,
    copied: '已复制',
    copy: '复制',
    openInDeck: (n: number) => `在演示中打开第 ${n} 页 →`,
    good: '适合',
    avoid: '避免',
    limits: '内容上限',
    required: '必填',
    example: '示例',
    replay: '重播',
    replayLabel: '重播入场动画',
    zhOnly: '',
    emojiCode: '直接在文字里打 emoji',
    emojiRole: (n: number | string, cur: string, copied: string) => `${n} 个 · 3 个系列 · 当前 ${cur}${copied ? ` · 已复制 ${copied}` : ''}`,
    emojiSummary: ['任何格式的任何文字字段都可以直接打 emoji。整份作品的系列写在 ', '。不含国旗和肤色变体。点击复制。'],
    emojiDevOnly: ' 完整列表只在开发预览里显示：构建只打包用到的 emoji。',
    emojiSeries: '系列',
    emojiSearch: '英文搜索，如 fire',
    emojiSearchLabel: '搜索 emoji',
  },
  en: {
    docTitle: 'PCafe · Slide template library',
    open: 'Open the current deck',
    eyebrow: (n: number) => `Slide template library · ${n} templates`,
    h1: ['Pick a template,', 'fill in the content, get a slide'],
    lead: 'Every template has a fixed layout, motion and content limits. Choose by “Good for / Avoid / Content limits”, fill in the props from the example, then run npm run qa to check the layout. The full writing guide is in',
    guide: 'docs/en/guide.md',
    facts: { templates: 'Templates', canvas: 'Canvas', decks: 'Reference decks', pages: (n: number) => `${n} slides`, icons: 'Icons' },
    nav: 'Template index',
    resources: 'Resources',
    wall: 'Style wall',
    iconIndex: 'Icon index',
    emojiIndex: 'Emoji index',
    footAdd: 'To add a template: write the component in src/kit, register it in catalog.ts and catalog.en.ts, then run npm run docs to regenerate docs/components.md.',
    footIcons: ['Icons: ', ' by 480 Design, used under ', '.'],
    wallRole: (n: number) => `One slide · ${n} styles`,
    wallSummary: 'A style changes only the look: heading face, corner radius, background and card finish. Fields, content limits and sources stay the same, so comparing styles only takes this wall.',
    wallPick: 'Sample',
    samples: ['Cover', 'Statement', 'Panels', 'Data', 'Section break'],
    iconSeries: 'Icon series',
    accent: 'Accent',
    style: 'Style',
    byDeck: 'Per deck',
    iconRole: (n: number, cur: string) => `${n} curated icons · 6 series · now ${cur}`,
    iconSummary: ['Icons are from Solar (480 Design). Use one series per deck: set ', ' in the DeckDef (default Line Duotone). In the duotone series the second layer is a translucent ink; ', ' turns it into the accent colour, for one focus icon per slide. Click an icon to copy its name.'],
    iconCode: ['// follows iconStyle', '// focus icon', '// one icon in another series'],
    copyIcon: (n: string) => `Copy icon name ${n}`,
    copied: 'Copied',
    copy: 'Copy',
    openInDeck: (n: number) => `Open slide ${n} in the deck →`,
    good: 'Good for',
    avoid: 'Avoid',
    limits: 'Content limits',
    required: 'required',
    example: 'Example',
    replay: 'Replay',
    replayLabel: 'Replay the entrance',
    zhOnly: 'Template descriptions are in Chinese until the English catalog is added.',
    emojiCode: 'type emoji straight into text',
    emojiRole: (n: number | string, cur: string, copied: string) => `${n} · 3 series · now ${cur}${copied ? ` · copied ${copied}` : ''}`,
    emojiSummary: ['Any text field in any format can hold emoji. Set the series for the whole piece in ', '. No flags or skin-tone variants. Click to copy.'],
    emojiDevOnly: ' The full list shows only in the dev preview: a build bundles just the emoji it uses.',
    emojiSeries: 'Series',
    emojiSearch: 'Search in English, e.g. fire',
    emojiSearchLabel: 'Search emoji',
  },
} as const

export const useT = () => UI[useLang()]

/** Reference-deck group names in English; Chinese names live in Gallery.tsx. */
export const GROUP_TITLES_EN: Record<string, string> = {
  release: 'Layout and tech', geo: 'Icons, charts and images', gtm: 'Business and operations', launch: 'Panels and pacing', studio: 'Studio', mono: 'Mono and charts', sticker: 'Stickers and charts', toy3d: 'Geometry and diagrams', wallpaper: 'Desktop and diagrams', keynote: 'Keynote type', gradient: 'Gradient', pop: 'Pop colour', bento: 'Bento', 'soft-saas': 'Soft SaaS', 'float-ui': 'Floating UI', desktop: 'Retro desktop', 'warm-dark': 'Warm dark', ribbon: 'Ribbon', playful: 'Candy', 'home-nuance': 'Artboard', 'home-northbound': 'Growth site', 'home-nutshell': 'Glow home', 'home-cobalt': 'Electric blue', 'v2-p1': 'Image layouts', 'v2-p4': 'Data and relations', 'v2-p5': 'Backdrops and filters', 'v2-p3': 'Cards and props', 'v2-p2': 'Text and number motion', 'v3-p5': 'Cards and galleries', 'v3-p4': 'AI and models', 'v3-p3': 'Networks, maps and light', 'v3-p1': 'Blocks and navigation', 'v3-p2': 'Tech diagrams and code', motion: 'Key-press motion', mockui: 'Realistic UI', 'sig-biennale': 'Biennale only', 'sig-stencil': 'Stencil only', 'sig-neo': 'Neo grid only', 'sig-block-frame': 'Block frame only', 'sig-cobalt-grid': 'Cobalt grid only', 'sig-forest': 'Forest only', 'sig-emerald': 'Emerald only', 'sig-platform': 'Platform only', 'sig-pink-script': 'Pink script only', 'sig-broadside': 'Broadside only', 'sig-atelier': 'Atelier only', 'sig-monograph': 'Monograph only', 'sig-nocturne': 'Nocturne only', 'sig-sunrise': 'Sunrise only',
}

export const ICON_GROUPS_EN: Record<string, string> = {
  '搜索与发现': 'Search and discovery', 'AI 与对话': 'AI and chat', '网络与技术': 'Network and tech', '系统与硬件': 'Systems and hardware', '内容与文档': 'Content and documents', '数据与度量': 'Data and metrics', '安全与合规': 'Security and compliance', '时间与流程': 'Time and process', '人与商业': 'People and business',
}
