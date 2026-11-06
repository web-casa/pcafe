import { createContext, useContext } from 'react'
import type { Source } from './types'

export interface TocEntry {
  id: string
  level: 1 | 2
  no: string
  text: string
  page: number
}

export interface PaperState {
  /** 'paper' = A4 sheets, 'read' = responsive article, 'measure' = off-screen pagination. */
  mode: 'paper' | 'read' | 'measure'
  /** Width of the text column on a sheet, in CSS pixels. Charts use it unless they are in the article view. */
  bodyW: number
  toc: TocEntry[]
  /** Citation key → number in the source list, by first use. */
  cites: Map<string, number>
  sources: Record<string, Source>
  title: string
  lang: 'zh' | 'en'
}

export const PaperContext = createContext<PaperState>({ mode: 'read', bodyW: 642, toc: [], cites: new Map(), sources: {}, title: '', lang: 'zh' })
export const usePaper = () => useContext(PaperContext)
