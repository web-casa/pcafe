import { createContext, useContext } from 'react'
import type { DeckStyle } from '../kit/theme'
import type { PrintFormat, PrintTone } from './types'

export interface PrintCtx {
  format: PrintFormat
  style: DeckStyle
  /** Tone of the page or panel this element sits on. */
  tone: PrintTone
  /** The attribution line to add after <Sources>, or '' for none. */
  credit?: string
}

export const PrintContext = createContext<PrintCtx>({ format: 'poster', style: 'standard', tone: 'light' })
export const usePrint = () => useContext(PrintContext)
