import type { EmojiStyle } from '../emoji'
import type { IconName } from '../kit/icon-set'
import type { IconStyle } from '../kit/Icon'
import type { DeckStyle, ThemeName } from '../kit/theme'
import type { PresetName } from './presets'

// Content limits are in CJK characters; a Latin letter or digit counts as half.
// QA enforces them: `PCafe`-style "shrink to fit" does not exist here, cut the words instead.

/**
 * paper: light neutral. ink: near-black. accent: full theme colour. wash: pale tint of the theme.
 * Covers look strongest in accent or ink. Inner cards usually read best in paper.
 */
export type CardTone = 'paper' | 'ink' | 'accent' | 'wash'

interface CardBase {
  /** Overrides the set's preset, for sets holding several sizes of one story. */
  preset?: PresetName
  /** Takes the feed-size check. Default: the first card, and every card on a cover-only preset. */
  cover?: boolean
  tone?: CardTone
  /**
   * The small line on the card, ≤ 44 chars. Name the publisher and mark calculations.
   * null only when the card states no fact: QA fails a null source on a card containing a number.
   */
  source: string | null
  /** Small label above the title, ≤ 14 chars. */
  kicker?: string
}

/** Data behind a cover. Real series only: bars must be the numbers the card talks about. */
export type Motif =
  | {
      kind: 'bars'
      values: number[]
      /** Captions under the first and last bar, ≤ 6 chars, e.g. ['2015', '2025']. */
      ends?: [string, string]
    }
  | { kind: 'icon'; icon: IconName }
  /** One big emoji as the picture, with up to 3 small ones around it. */
  | { kind: 'emoji'; e: string; around?: string[] }

/**
 * Big-word cover for portrait, tall and square. Type size comes from the longest line.
 * The longest line must keep the headline over the feed minimum: about 6 CJK chars on 小红书,
 * about 5 on 抖音 and other three-column grids, 2–4 on 公众号次条.
 */
export interface CoverCard extends CardBase {
  t: 'cover'
  /** 1–3 lines, you choose every break. 3–5 words in all reads best. */
  lines: string[]
  /** Line indexes in the mark colour. Mark the words that carry the hook, one line at most is best. */
  mark?: number[]
  /** One line under the headline, ≤ 24 chars. Do not repeat the post title. */
  sub?: string
  motif?: Motif
  /** Swipe hint, ≤ 8 chars. */
  hint?: string
}

// Wide ratios: number, chart, compare and quote work on 4:3 and wider, list on 4:3. Others are portrait
// and square only, and QA reports it by name: a chart suits a landscape card, a paragraph does not.

/**
 * Cover for 4:3, 16:9, 1.91:1 and 2.35:1: B站, YouTube, 公众号 头条, OG.
 * Centred by default, so it survives a central crop. Left-aligned puts the motif on the right.
 */
export interface WideCard extends CardBase {
  t: 'wide'
  /** 1–2 lines, each ≤ 8 chars on 16:9, ≤ 4 chars on 公众号 头条. */
  lines: string[]
  mark?: number[]
  /** ≤ 20 chars. Omit on 公众号 头条, there is no room. */
  sub?: string
  motif?: Motif
  align?: 'center' | 'left'
}

/** One number that is the whole point. Works as a cover or an inner card. */
export interface NumberCard extends CardBase {
  t: 'number'
  /** ≤ 7 chars, e.g. "2,779". */
  value: string
  /** ≤ 6 chars, e.g. "TWh". */
  unit?: string
  /** What the number is, ≤ 22 chars. Set it as the headline of the card. */
  label: string
  /** Context, ≤ 40 chars. */
  note?: string
  bars?: { values: number[]; ends?: [string, string] }
}

export type CardChart =
  /** 1–3 series on one axis, labelled at the line ends. */
  | {
      type: 'line'
      x: string[]
      series: { name: string; values: number[]; focus?: boolean; labels?: boolean }[]
      /** Printed in the axis corner, ≤ 6 chars. */
      unit?: string
    }
  /** Vertical bars. Labels first and last by default, ≤ 12 bars. */
  | { type: 'bars'; x: string[]; values: number[]; unit?: string; focus?: number; every?: number }
  /** Ranked rows. ≤ 8 on portrait, ≤ 5 on square or wide. Names ≤ 6 chars. */
  | { type: 'rank'; rows: { name: string; value: number; focus?: boolean }[]; unit?: string; decimals?: number; gapBefore?: number }

/** One chart and the sentence it proves. */
export interface ChartCard extends CardBase {
  t: 'chart'
  /** The finding, not the topic. ≤ 22 chars, two lines, and ≤ 7 chars a line on 16:9. Use \n to choose the break. */
  title: string
  /** ≤ 40 chars. */
  takeaway?: string
  chart: CardChart
}

export interface CompareItem {
  /** ≤ 12 chars. */
  label: string
  /** ≤ 7 chars. */
  value: string
  unit?: string
  /** Drives the proportional bar. Omit it on every item when the two are not comparable. */
  num?: number
  /** ≤ 22 chars. */
  note?: string
  focus?: boolean
}

export interface CompareCard extends CardBase {
  t: 'compare'
  /** ≤ 22 chars. */
  title: string
  /** 2–3 items. */
  items: CompareItem[]
  /** The so-what, ≤ 36 chars. */
  verdict?: string
}

export interface ListItem {
  /** ≤ 14 chars. */
  head: string
  /** ≤ 40 chars. */
  body?: string
  icon?: IconName
}

export interface ListCard extends CardBase {
  t: 'list'
  /** ≤ 22 chars. */
  title: string
  /** 3–5 on portrait, 3 on square and 4:3. Not available on 16:9. Numbered unless every item has an icon. */
  items: ListItem[]
}

export interface StepsCard extends CardBase {
  t: 'steps'
  /** ≤ 22 chars. */
  title: string
  /** 3–4 on portrait, 3 on square. */
  steps: { head: string; body?: string }[]
}

/** A sentence worth stopping for. Attribution is required: never put words in someone's mouth. */
export interface QuoteCard extends CardBase {
  t: 'quote'
  /** ≤ 44 chars. Choose the breaks with \n: nothing stops a wrap splitting a Chinese word. */
  text: string
  /** Who said it, or "本文结论". ≤ 24 chars. */
  by: string
}

/** Text-led card, for points a chart cannot make. */
export interface TextCard extends CardBase {
  t: 'text'
  /** ≤ 22 chars. */
  title: string
  /** 1–3 paragraphs, ≤ 70 chars each. `**bold**` marks what a skimmer should catch. */
  paras: string[]
}

export type CardImage =
  /** Real screenshot of something you made. May serve as evidence. */
  | { kind: 'screenshot'; src: string; alt: string }
  /** `photo-` Unsplash file: atmosphere only, never your customer, team or product. Credit is printed. */
  | { kind: 'photo'; src: string; alt: string; credit: string }
  /** `decor-` generated illustration: decoration only, never evidence. */
  | { kind: 'decor'; src: string; alt: string }

export interface ImageCard extends CardBase {
  t: 'image'
  image: CardImage
  /** ≤ 22 chars. */
  title: string
  /** ≤ 40 chars. */
  caption?: string
}

/** Last card: what to remember, what to do next, and the full source list. */
export interface EndingCard extends CardBase {
  t: 'ending'
  /** 1–2 lines, ≤ 8 chars each. */
  lines: string[]
  mark?: number[]
  /** 0–3 things to remember, ≤ 24 chars each. */
  takeaways?: string[]
  /** The ask, ≤ 22 chars. One ask only. */
  cta: string
  /** Fuller sources than the per-card line, 0–3, ≤ 44 chars each. */
  sources?: string[]
}

export type CardDef = CoverCard | WideCard | NumberCard | ChartCard | CompareCard | ListCard | StepsCard | QuoteCard | TextCard | ImageCard | EndingCard

export interface CardSetDef {
  /** What the set is, for the gallery and file names. */
  title: string
  /** Size for every card, unless a card sets its own. */
  preset: PresetName
  theme?: ThemeName
  /**
   * Display face: 'standard' (heavy sans), 'editorial' (serif) or 'poster' (Anton and heavy sans)
   * make the clearest covers. Other names in STYLES work where they set a display face.
   */
  style?: DeckStyle
  iconStyle?: IconStyle
  /** Emoji set for any emoji typed in the text: fluent (default), flat or noto. */
  emojiStyle?: EmojiStyle
  lang?: 'zh' | 'en'
  /** Small name on each card, e.g. your account. ≤ 14 chars. */
  handle?: string
  /** Page numbers on inner cards. Default on when the set has more than one card of a size. */
  pages?: boolean
  /** "Made with PCafe · p.cafe" at the foot of the last card. `false` hides it; needs PCafe Pro (LICENSE, Exhibit B). */
  attribution?: boolean
  cards: CardDef[]
}
