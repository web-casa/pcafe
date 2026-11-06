import type { ReactElement } from 'react'
import type { EmojiStyle } from '../emoji'
import type { IconStyle } from '../kit/Icon'
import type { DeckStyle, ThemeName } from '../kit/theme'

export type PrintFormat = 'poster' | 'rollup' | 'trifold' | 'long'
export type PrintTone = 'light' | 'dark' | 'accent'
/**
 * How far away a piece of text has to work. QA measures real glyphs against these.
 * head: read from `distanceM`. read: read standing at `readM`. fine: sources, read up close at `nearM`.
 */
export type TextTier = 'head' | 'read' | 'fine'

/** Where a poster or roll-up is read from. Text floors are computed from it. See plans/research-print.md §5. */
export interface Viewing {
  /** Farthest distance the headline has to work at, in metres. */
  distanceM: number
  /** Distance for ordinary text, in metres. Default 1.5. */
  readM?: number
  /** Distance for sources and small labels, in metres. Default 0.8. */
  nearM?: number
  /** Height of the headline's baseline above the floor, in metres. Poster default 1.4. A roll-up is measured from its real position. */
  baselineM?: number
}

interface Common {
  title: string
  /** Name from src/print/presets.ts. */
  preset: string
  theme?: ThemeName
  /** Headings face, same names as DeckDef.style. */
  style?: DeckStyle
  iconStyle?: IconStyle
  /** Emoji set for any emoji typed in text. Print defaults to noto, which stays vector in the PDF. */
  emojiStyle?: EmojiStyle
  lang?: 'zh' | 'en'
  /** Default page tone. */
  tone?: PrintTone
  /** Shown on every page at text size, e.g. '示例内容 · 虚构活动'. Required for invented content. */
  sample?: string
  /** Effective resolution required of every raster in the PDF. Default comes from the preset. */
  targetDpi?: number
  /** "Made with PCafe · p.cafe" after the sources (on a trifold: the back panel). `false` hides it; needs PCafe Pro (LICENSE, Exhibit B). */
  attribution?: boolean
}

export interface PosterDef extends Common {
  format: 'poster'
  viewing: Viewing
  render: () => ReactElement
}

export interface RollupDef extends Common {
  format: 'rollup'
  viewing: Viewing
  /** The bottom part that goes into the cassette. Default from the preset; ask your printer. */
  hiddenBottomMm?: number
  /** The top part that goes into the top bar. Default from the preset; ask your printer. */
  topBarMm?: number
  render: () => ReactElement
}

export interface TrifoldPanel {
  tone?: PrintTone
  /** Ground of this panel, for a colour change that lands on the fold. */
  fill?: 'wash' | 'panel' | 'card'
  render: () => ReactElement
}

export interface TrifoldDef extends Common {
  format: 'trifold'
  /** The sheet as it lies with the cover up: fold-in panel, back panel, front cover (left to right). */
  outside: { flap: TrifoldPanel; back: TrifoldPanel; cover: TrifoldPanel }
  /** The other side, left to right: inside left, inside middle, inside right (the fold-in panel's other face). */
  inside: { left: TrifoldPanel; middle: TrifoldPanel; right: TrifoldPanel }
}

export interface LongSection {
  /** Unique, stable. QA names it when it reports a cut. */
  id: string
  tone?: PrintTone
  /** Printed small at the foot of this section. Slices get posted alone, so a fact's source stays with it. */
  source?: string | null
  render: () => ReactElement
}

export interface LongDef extends Common {
  format: 'long'
  /** Which sets of slices to write beside the full image. */
  slices?: SliceName[]
  sections: LongSection[]
}

export type SliceName = 'wechat' | 'xhs'

export type PrintDef = PosterDef | RollupDef | TrifoldDef | LongDef

export const definePrint = <T extends PrintDef>(def: T): T => def
