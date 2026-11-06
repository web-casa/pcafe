import type { EmojiStyle } from '../emoji'
import type { ReactElement } from 'react'
import type { ThemeName } from '../kit/theme'

export type Orientation = 'landscape' | 'portrait'
export type PanelKind = 'lcd' | 'oled' | 'led'

/**
 * Where the screen physically is. This is not decoration: text sizes are computed from it,
 * and the QA fails any text smaller than the rule for this distance (plans/research-screen.md §1).
 */
export interface Venue {
  /** Panel diagonal in inches, for a 16:9 panel. Give this or longEdgeMm. */
  diagonalIn?: number
  /** Long edge of the picture in mm. Use it for LED walls. */
  longEdgeMm?: number
  /** Farthest distance you want the main text read from, in metres. */
  distanceM: number
  /** Height of the text baseline above the floor, in metres. Default 1.4. Higher mounts need taller text. */
  baselineM?: number
  /** Distance for the small print (sources, credits), in metres. Default 1.5. */
  nearM?: number
  /** Default 'lcd'. 'oled' doubles the shift of static elements. */
  panel?: PanelKind
}

/** A time of day range. `from` > `to` crosses midnight. Weekdays use 0 = Sunday. Dates are YYYY-MM-DD. */
export interface TimeWindow {
  from: string
  to: string
  days?: number[]
  dates?: string[]
}

export interface SceneDef {
  /** Unique, stable. Appears in the error log. */
  id: string
  label: string
  /** How long it stays, in seconds. The QA fails it if this is too short for its word count. */
  seconds: number
  /** Only show during these times. Omit for always. */
  when?: TimeWindow | TimeWindow[]
  /** Returns one template from src/screen/scenes.tsx. */
  render: () => ReactElement
}

export interface Session {
  /** 'HH:MM' on the screen's clock. */
  start: string
  end: string
  /** ≤ 12 CJK characters for a screen read from far away. */
  title: string
  who?: string
  room?: string
  /** YYYY-MM-DD. Omit for a schedule that repeats every day. */
  date?: string
  /** Lunch, a coffee break: shown in the list, but "now" says so instead of naming a talk. */
  isBreak?: boolean
}

export interface TickerItem {
  /** ≤ 22 CJK characters on landscape, wraps to two lines on portrait. */
  text: string
  when?: TimeWindow | TimeWindow[]
}

export type AgendaPhase = 'empty' | 'before' | 'during' | 'gap' | 'after'

export interface AgendaState {
  phase: AgendaPhase
  now: Session | null
  next: Session | null
  /** Minutes until `next` starts. */
  toNext: number | null
  /** Minutes left in `now`. */
  left: number | null
  /** 0 to 1 through `now`. */
  progress: number
  /** Today's sessions in order. */
  today: Session[]
}

export interface DataDef<T> {
  /** Shown until a feed succeeds. Required so the screen can never start empty. */
  initial: T
  /** Throw on anything malformed: the last good value is kept. */
  parse: (raw: unknown) => T
  /**
   * Relative path to a local .js file that calls window.__screenData(value), or an http(s) URL of JSON.
   * A file:// page cannot fetch, only load scripts (plans/research-screen.md §6).
   * Overridden by ?data= in the page URL. Omit both for no polling.
   */
  source?: string
  /** Poll interval in seconds. Default 60. */
  everySec?: number
  /** After this long without a good poll the screen shows a stale notice. Default 5 × everySec. */
  staleAfterSec?: number
}

export interface TickerContext<T> {
  agenda: AgendaState
  data: T
}

/** A looping screen for a hall, a store window or an event. */
export interface ScreenDef<T = unknown> {
  title: string
  theme?: ThemeName
  /** Emoji set for any emoji typed in the text: fluent (default), flat or noto. */
  emojiStyle?: EmojiStyle
  /** editorial: serif headings, for museums and long-form. grotesk: neutral. heavy: event and retail. */
  face?: 'editorial' | 'grotesk' | 'heavy'
  /** Fixed background drawn behind every scene. Default 'none'. */
  atmosphere?: 'stars' | 'grid' | 'none'
  lang?: 'zh' | 'en'
  /** What this screen was written for. 'both' follows the display. */
  orientation: Orientation | 'both'
  venue: Venue
  /** IANA name. Omit to use the player's own time zone. Schedules and the clock follow it. */
  timezone?: string
  scenes: SceneDef[]
  clock?: { date?: boolean; seconds?: boolean } | false
  /** Shown on every scene in main-text size, e.g. '示例数据 · 虚构活动'. Required for invented data. */
  sample?: string
  agenda?: (data: T) => Session[]
  ticker?: { label?: string; seconds?: number; items: TickerItem[] | ((ctx: TickerContext<T>) => TickerItem[]) }
  data?: DataDef<T>
  /** 'HH:MM': reload once a day, between shows. Omit for no reload. */
  reloadAt?: string
  /** "Made with PCafe · p.cafe" next to the screen name. `false` hides it; needs PCafe Pro (LICENSE, Exhibit B). */
  attribution?: boolean
  /** Reload at the next scene change when the JS heap passes this many MB. Default 400. */
  memoryLimitMb?: number
  burnIn?: { flipMinutes?: number; shift?: number }
  /** Clock times the QA photographs, e.g. { at: '10:40', label: '茶歇' }. */
  states?: { at: string; label: string }[]
}

/** Keeps the data type checked between `data`, `agenda` and `ticker`. */
export const defineScreen = <T,>(def: ScreenDef<T>): ScreenDef<never> => def as unknown as ScreenDef<never>
