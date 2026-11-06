import type { EmojiStyle } from '../emoji'
import type { ReactElement, ReactNode } from 'react'
import type { DeckStyle, ThemeName } from '../kit/theme'

export interface Source {
  /** Publisher or author, e.g. "Our World in Data". */
  org: string
  /** Document or dataset title. */
  title: string
  url?: string
  /** When it was read, or how the figure was derived. */
  note?: string
}

/** A Word-style report: A4 sheets, a reading view and a PDF from one source. */
export interface ReportDef {
  kind: 'report'
  title: string
  theme?: ThemeName
  /** Emoji set for any emoji typed in the text: fluent (default), flat or noto. */
  emojiStyle?: EmojiStyle
  /** 'editorial' uses a serif for headings; 'formal' stays in the sans for internal documents. */
  look?: 'editorial' | 'formal'
  lang?: 'zh' | 'en'
  /**
   * Which view opens first. 'read' makes a web report: a scrolling article for phone and
   * desktop, with a wider column and a larger opener. The A4 sheets and the PDF stay available.
   * Default: sheets on wide screens, article on narrow ones.
   */
  view?: 'read' | 'paper'
  /** Left of the page footer, e.g. the organisation. ≤ 24 CJK characters. */
  footer?: string
  /** Everything `[^key]` can cite. */
  sources?: Record<string, Source>
  /** The "Made with PCafe" credit in the last page footer and under the article. `false` hides it; needs PCafe Pro (LICENSE, Exhibit B). */
  attribution?: boolean
  blocks: ReactElement[]
}

export interface ResumeContact {
  /** Plain value, e.g. an email address. ≤ 28 characters. */
  value: string
  href?: string
}

export interface ResumeHighlight {
  /** ≤ 6 characters, e.g. "42%". */
  value: string
  /** ≤ 12 CJK characters. */
  label: string
  /** 4–12 points of real history. Draws a trend line; leave it out if you don't have the numbers. */
  trend?: number[]
}

/** Worn on a real kit Lanyard. Used by the `showcase` layout. */
export interface ResumeBadge {
  /** Top line of the badge, ≤ 12 CJK characters. */
  event: string
  /** 1–2 characters. */
  initials: string
  /** ≤ 14 CJK characters. */
  role: string
  /** ≤ 10 characters. */
  code?: string
  /** Woven on the strap, ≤ 16 characters. */
  strap?: string
}

/** A real kit Terminal. Used by the `console` layout. Keep it short: 2–3 commands, 1–2 output lines each. */
export interface ResumeTerminal {
  window: string
  prompt?: string
  steps: { cmd: string; out?: string[] }[]
}

export interface ResumeImpactRow {
  /** What changed, ≤ 10 CJK characters. */
  label: string
  before: number
  after: number
  /** ≤ 4 characters. */
  unit?: string
}

export interface ResumeProject {
  /** ≤ 16 CJK characters. */
  name: string
  /** ≤ 14 CJK characters. */
  role: string
  period: string
  /** One or two sentences, ≤ 70 CJK characters. Lead with the result. */
  text: string
  /** A real slide as the thumbnail. Only work you actually did. */
  shot?: { render: () => ReactNode; theme?: ThemeName; style?: DeckStyle }
}

export interface ResumeWork {
  /** Company or school. ≤ 18 CJK characters. */
  org: string
  /** Job title or degree. ≤ 18 CJK characters. */
  role: string
  /** e.g. "2022.03 – 至今". */
  period: string
  place?: string
  /** One line of context, ≤ 40 CJK characters. */
  context?: string
  /** 0–5 results, each ≤ 60 CJK characters. Lead with what changed. */
  points?: string[]
}

export type ResumeSection =
  | { type: 'work'; title: string; items: ResumeWork[]; side?: boolean; page?: 2 }
  /** Each group ≤ 10 tags. No skill bars: a percentage for a skill means nothing to a reader. */
  | { type: 'tags'; title: string; groups: { label?: string; items: string[] }[]; side?: boolean; page?: 2 }
  | { type: 'list'; title: string; items: string[]; side?: boolean; page?: 2 }
  /** Career on a time axis, drawn from every `work` section's period. Left out of the plain version: the work list says the same. */
  | { type: 'track'; title: string; side?: boolean; page?: 2 }
  /** 2–5 results as before and after. */
  | { type: 'impact'; title: string; rows: ResumeImpactRow[]; side?: boolean; page?: 2 }
  /** Which tools in which years, 3–7 rows. levels 0–3 mean unused, occasional, regular, daily. Honest where a skill percentage is not. */
  | { type: 'heat'; title: string; years: string[]; rows: { label: string; levels: number[] }[]; legend?: string; side?: boolean; page?: 2 }
  /** 2–3 dials for numbers with a natural maximum. */
  | { type: 'gauges'; title: string; items: { value: number; max: number; text: string; label: string }[]; side?: boolean; page?: 2 }
  /** 2–4 projects with real slide thumbnails. */
  | { type: 'projects'; title: string; items: ResumeProject[]; side?: boolean; page?: 2 }

/** One or two A4 pages. Nothing shrinks to fit: when QA reports overflow, cut content or move a section to page 2. */
export interface ResumeDef {
  kind: 'resume'
  /** The "Made with PCafe" credit at the foot of the last page. `false` hides it; needs PCafe Pro (LICENSE, Exhibit B). */
  attribution?: boolean
  /**
   * classic: one column. sidebar: tinted side panel. banner: colour band with highlights. ledger: dates in the margin.
   * showcase: a real lanyard badge, trends and a career track. console: a real terminal, dials and a tool heat grid.
   * portfolio: two pages with real slides as project thumbnails.
   * The last three also offer a plain one-column version from the same data, for upload forms.
   */
  layout: 'classic' | 'sidebar' | 'banner' | 'ledger' | 'showcase' | 'console' | 'portfolio'
  theme?: ThemeName
  /** Emoji set for any emoji typed in the text: fluent (default), flat or noto. */
  emojiStyle?: EmojiStyle
  lang?: 'zh' | 'en'
  name: string
  /** Target role, ≤ 20 CJK characters. */
  headline: string
  contact: ResumeContact[]
  /** Two or three sentences, ≤ 110 CJK characters. */
  summary: string
  /** 0–4 numbers. Only figures you can back up in an interview. */
  highlights?: ResumeHighlight[]
  sections: ResumeSection[]
  /** Small line at the page foot, e.g. to mark a sample. Omit on a real résumé. */
  note?: string
  badge?: ResumeBadge
  terminal?: ResumeTerminal
  /** "Today" on the career track, e.g. "2026.10", so the printed page does not change by itself. */
  asOf?: string
}

export type PaperDef = ReportDef | ResumeDef
