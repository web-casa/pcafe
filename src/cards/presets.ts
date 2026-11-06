// Platform sizes. Evidence for every value is in plans/research-cards.md: no Chinese platform
// publishes these in a form that could be read, so `status` says how far to trust each one.

export type Evidence = 'official' | 'community' | 'conflict' | 'unconfirmed'

export interface Insets {
  top: number
  right: number
  bottom: number
  left: number
}

export interface CardPreset {
  /** Platform and placement, as shown in the gallery. */
  label: string
  /** Export size in pixels. */
  w: number
  h: number
  ratio: string
  status: Evidence
  /** One line on where the size and safe zone come from. */
  basis: string
  /** Pixels at each edge no text may enter (platform overlays and a margin). */
  safe: Insets
  /** Corners or strips covered by platform figures. No text may touch them. */
  blocked?: { x: number; y: number; w: number; h: number; label: string }[]
  /** Centred crop the headline must survive, as width / height. */
  crop?: { ratio: number; label: string }
  /** How the cover is really shown in the feed. */
  feed: { w: number; where: string; minPx: number }
  /** Width in CSS px when opened full screen on a phone. Drives the minimum text size. */
  view: number
  /** Too small for a source line or kicker: headline only. The set must still declare its source. */
  compact?: boolean
  /** Every card on this preset is a cover, so each one takes the feed check. */
  coverOnly?: boolean
  /** Also write a PDF when exporting (LinkedIn documents are uploaded as PDF). */
  pdf?: boolean
}

const m = (top: number, right = top, bottom = top, left = right): Insets => ({ top, right, bottom, left })

/** Chinese glyphs under this size in the feed turn to smudges. Judgement, see the research notes. */
const MIN_FEED = 16

export const PRESETS = {
  'xhs-portrait': {
    label: '小红书 竖版',
    w: 1080, h: 1440, ratio: '3:4', status: 'community',
    basis: '第三方指南一致，未见官方页面。首图比例决定整组。',
    safe: m(64, 60), feed: { w: 180, where: '双列信息流（估算）', minPx: MIN_FEED }, view: 390,
  },
  'xhs-square': {
    label: '小红书 方形',
    w: 1080, h: 1080, ratio: '1:1', status: 'community',
    basis: '第三方指南一致，未见官方页面。',
    safe: m(60), feed: { w: 180, where: '双列信息流（估算）', minPx: MIN_FEED }, view: 390,
  },
  'xhs-landscape': {
    label: '小红书 横版',
    w: 1440, h: 1080, ratio: '4:3', status: 'community',
    basis: '第三方指南列出 4:3，像素值为换算。',
    safe: m(60, 80), feed: { w: 180, where: '双列信息流（估算）', minPx: MIN_FEED }, view: 390, coverOnly: true,
  },
  'bili-wide': {
    label: 'B站 封面 16:9',
    w: 1920, h: 1080, ratio: '16:9', status: 'conflict',
    basis: '来源矛盾（16:9、16:10、4:3 都有）。标题留在中央 4:3，手机裁切后还在。底部数据条为本人观察。',
    safe: m(60, 80, 150, 80),
    blocked: [{ x: 0, y: 940, w: 1920, h: 140, label: '播放量与时长' }],
    crop: { ratio: 4 / 3, label: '手机端居中裁切 4:3（未确认）' },
    feed: { w: 180, where: '手机双列（估算）', minPx: MIN_FEED }, view: 390, coverOnly: true,
  },
  'bili-mobile': {
    label: 'B站 封面 4:3',
    w: 1200, h: 900, ratio: '4:3', status: 'unconfirmed',
    basis: '只有一篇 2023 年 11 月的 UP 主经验帖。底部数据条为本人观察。',
    safe: m(50, 60, 125, 60),
    blocked: [{ x: 0, y: 783, w: 1200, h: 117, label: '播放量与时长' }],
    feed: { w: 180, where: '手机双列（估算）', minPx: MIN_FEED }, view: 390, coverOnly: true,
  },
  'douyin-cover': {
    label: '抖音 封面',
    w: 1080, h: 1920, ratio: '9:16', status: 'community',
    basis: '第三方指南给 1080×1920 与上下 150。底部 320、右侧 150 是本人估算。主页宫格 3:4 只有一篇创作者帖子。',
    safe: m(150, 150, 320, 60),
    crop: { ratio: 3 / 4, label: '主页宫格居中 3:4（未确认）' },
    feed: { w: 128, where: '主页三列宫格（估算）', minPx: MIN_FEED }, view: 390, coverOnly: true,
  },
  'channels-portrait': {
    label: '视频号 竖版封面',
    w: 1080, h: 1260, ratio: '6:7', status: 'community',
    basis: 'Canva 中文站称为官方规格但未给链接，另有一篇汇总一致。',
    safe: m(60), feed: { w: 128, where: '主页三列（估算）', minPx: MIN_FEED }, view: 390, coverOnly: true,
  },
  'channels-wide': {
    label: '视频号 横版封面',
    w: 1080, h: 608, ratio: '16:9', status: 'community',
    basis: '同竖版来源。',
    safe: m(36, 48), feed: { w: 128, where: '主页三列（估算）', minPx: MIN_FEED }, view: 390, coverOnly: true,
  },
  'wechat-head': {
    label: '公众号 头条',
    w: 900, h: 383, ratio: '2.35:1', status: 'community',
    basis: '第三方一致，微信文档未读到。转发可能裁成居中 1:1，也未确认。',
    safe: m(18, 24),
    crop: { ratio: 1, label: '转发居中裁切 1:1（未确认）' },
    feed: { w: 350, where: '订阅号列表（估算）', minPx: MIN_FEED }, view: 390, coverOnly: true,
  },
  'wechat-thumb': {
    label: '公众号 次条',
    w: 200, h: 200, ratio: '1:1', status: 'community',
    basis: '第三方一致。后台也可从一张图裁切。只放 2–4 个字。',
    safe: m(10), feed: { w: 60, where: '次条小图（估算）', minPx: 14 }, view: 60, compact: true, coverOnly: true,
  },
  'weibo-square': {
    label: '微博 九宫格',
    w: 1080, h: 1080, ratio: '1:1', status: 'community',
    basis: 'KAWO 2022 与 PixPipe 2026：多图一律 1:1。',
    safe: m(60), feed: { w: 120, where: '九宫格（估算）', minPx: MIN_FEED }, view: 390,
  },
  'weibo-article': {
    label: '微博 文章头图',
    w: 980, h: 550, ratio: '16:9', status: 'community',
    basis: 'KAWO 2022 给 980×550，Canva 给 980×560，资料偏旧。',
    safe: m(32, 44), feed: { w: 350, where: '信息流（估算）', minPx: MIN_FEED }, view: 390, coverOnly: true,
  },
  'ig-portrait': {
    label: 'Instagram carousel 4:5',
    w: 1080, h: 1350, ratio: '4:5', status: 'community',
    basis: 'Most 2026 guides. All slides crop to the first slide.',
    safe: m(64, 60), feed: { w: 128, where: 'profile grid (estimate)', minPx: MIN_FEED }, view: 390,
  },
  'ig-tall': {
    label: 'Instagram carousel 3:4',
    w: 1080, h: 1440, ratio: '3:4', status: 'community',
    basis: '3:4 announced by Mosseri in May 2025. 1080×1440 is arithmetic.',
    safe: m(64, 60), feed: { w: 128, where: 'profile grid (estimate)', minPx: MIN_FEED }, view: 390,
  },
  'linkedin-doc': {
    label: 'LinkedIn document',
    w: 1080, h: 1350, ratio: '4:5', status: 'community',
    basis: 'Help page gives 100 MB, 300 pages, one page size. 1080×1350 is from third parties.',
    safe: m(64, 60), feed: { w: 360, where: 'feed, full width (estimate)', minPx: MIN_FEED }, view: 390, pdf: true,
  },
  'yt-thumb': {
    label: 'YouTube thumbnail',
    w: 1280, h: 720, ratio: '16:9', status: 'official',
    basis: 'Help page: 16:9, min width 640. 1280×720 is the common floor. Duration corner is community knowledge.',
    safe: m(40, 54),
    blocked: [{ x: 1040, y: 630, w: 240, h: 90, label: 'duration' }],
    feed: { w: 168, where: 'suggested rail (estimate)', minPx: MIN_FEED }, view: 390, coverOnly: true,
  },
  'og-image': {
    label: 'Open Graph',
    w: 1200, h: 630, ratio: '1.91:1', status: 'official',
    basis: 'Meta docs: at least 1200×630, close to 1.91:1, under 8 MB.',
    safe: m(40, 54), feed: { w: 360, where: 'link preview (estimate)', minPx: MIN_FEED }, view: 390, coverOnly: true,
  },
  'x-card': {
    label: 'X link card',
    w: 1200, h: 628, ratio: '1.91:1', status: 'conflict',
    basis: 'Guides give 2:1, 1.91:1 and 16:9. Official docs were unreachable.',
    safe: m(40, 54), feed: { w: 360, where: 'timeline (estimate)', minPx: MIN_FEED }, view: 390, coverOnly: true,
  },
} satisfies Record<string, CardPreset>

export type PresetName = keyof typeof PRESETS

/**
 * Layouts differ by shape, not by platform.
 * tall 9:16 · portrait up to 6:7 · square · landscape 4:3 · wide up to 2:1 · banner beyond that.
 * Nu is short side / 1080, so every shape shares one type scale. Inner cards on a wide shape
 * use width / 1080 instead: opened on a phone they are as wide as a portrait card, so their
 * text has to be the same size on screen.
 */
export type CardShape = 'tall' | 'portrait' | 'square' | 'landscape' | 'wide' | 'banner'

export function shapeOf(w: number, h: number): CardShape {
  const r = w / h
  if (r < 0.65) return 'tall'
  if (r < 0.95) return 'portrait'
  if (r <= 1.05) return 'square'
  if (r <= 1.5) return 'landscape'
  return r <= 2.1 ? 'wide' : 'banner'
}

/** The preset measured in design units: everything the templates need to lay out. */
export function metrics(preset: CardPreset & { crop?: CardPreset['crop'] }, byWidth = false) {
  const { w, h, safe } = preset
  const scale = (byWidth ? w : Math.min(w, h)) / 1080
  const unitW = w / scale
  const unitH = h / scale
  const inset = { top: safe.top / scale, right: safe.right / scale, bottom: safe.bottom / scale, left: safe.left / scale }
  const innerW = unitW - inset.left - inset.right
  const cropW = preset.crop ? Math.min(unitW, unitH * preset.crop.ratio) : unitW
  const cropH = preset.crop ? Math.min(unitH, unitW / preset.crop.ratio) : unitH
  // Width a centred headline may use once both the crop and the safe zone apply.
  const headW = Math.min(innerW, cropW - 2 * Math.max(inset.left, inset.right, 40))
  return { scale, unitW, unitH, inset, innerW, cropW, cropH, headW, shape: shapeOf(w, h) }
}
