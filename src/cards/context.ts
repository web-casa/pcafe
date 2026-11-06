import { createContext, useContext } from 'react'
import { metrics, type CardPreset } from './presets'

export interface CardCtx {
  preset: CardPreset
  m: ReturnType<typeof metrics>
}

export const CardContext = createContext<CardCtx | null>(null)

export function useCard() {
  const ctx = useContext(CardContext)
  if (!ctx) throw new Error('card templates render inside <CardFrame>')
  return ctx
}

const CJK = /[　-鿿＀-￯]/

/** Width of a string in em for the display faces. Slightly generous, so it errs towards fitting. */
export function emWidth(text: string) {
  let w = 0
  for (const c of text) {
    if (CJK.test(c)) w += 1
    else if (c === ' ') w += 0.26
    else if (/[0-9]/.test(c)) w += 0.62
    else if (/[A-Z]/.test(c)) w += 0.7
    else if (/[a-z]/.test(c)) w += 0.58
    else w += 0.38
  }
  return w
}

/** Font size in u that makes the longest line fill `width`, inside a range. */
export function fitLines(lines: string[], width: number, min: number, max: number) {
  const widest = Math.max(...lines.map(emWidth), 0.1)
  return Math.round(Math.min(max, Math.max(min, width / widest)))
}

/** The QA limit length: a CJK character counts 1, anything else 1/2. */
export const limitLength = (text: string) => [...text].reduce((n, c) => n + (CJK.test(c) ? 1 : 0.5), 0)
