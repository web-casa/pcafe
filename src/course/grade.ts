// Pure scoring. No React here: QA compares what these say with what the screen says.
import type { Exercise, Response } from './types'

export interface Blank {
  answers: string[]
}
export type ClozePart = { text: string } | { blank: number; answers: string[] }

const BLANK = /\{\{(.+?)\}\}/g

export function parseCloze(text: string): ClozePart[] {
  const parts: ClozePart[] = []
  let at = 0
  let n = 0
  for (const m of text.matchAll(BLANK)) {
    if (m.index > at) parts.push({ text: text.slice(at, m.index) })
    parts.push({ blank: n++, answers: m[1].split('|').map((s) => s.trim()) })
    at = m.index + m[0].length
  }
  if (at < text.length) parts.push({ text: text.slice(at) })
  return parts
}

export const clozeBlanks = (text: string) => parseCloze(text).filter((p): p is { blank: number; answers: string[] } => 'blank' in p)

/** Full-width forms typed on a Chinese keyboard count, as do case and outer spaces. */
export function normalize(s: string) {
  return s
    .normalize('NFKC')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
}

export interface Grade {
  ok: boolean
  /** One entry per option, item, pair or blank: was this part right? */
  parts: boolean[]
}

export function grade(ex: Exercise, r: Response): Grade {
  switch (ex.type) {
    case 'single': {
      const picked = r.type === 'single' ? r.option : -1
      const parts = ex.options.map((o, i) => (i === picked) === !!o.correct)
      return { ok: !!ex.options[picked]?.correct, parts }
    }
    case 'multi': {
      const picked = new Set(r.type === 'multi' ? r.options : [])
      const parts = ex.options.map((o, i) => picked.has(i) === !!o.correct)
      return { ok: parts.every(Boolean), parts }
    }
    case 'truefalse': {
      const ok = r.type === 'truefalse' && r.value === ex.answer
      return { ok, parts: [ok] }
    }
    case 'order': {
      const order = r.type === 'order' ? r.order : []
      const parts = ex.items.map((_, i) => order[i] === i)
      return { ok: parts.every(Boolean), parts }
    }
    case 'match': {
      const chips = r.type === 'match' ? r.chips : []
      const parts = ex.pairs.map((p, i) => chipText(ex, chips[i]) === p.right)
      return { ok: parts.every(Boolean), parts }
    }
    case 'cloze': {
      const blanks = r.type === 'cloze' ? r.blanks : []
      const parts = clozeBlanks(ex.text).map((b, i) => b.answers.some((a) => normalize(a) === normalize(blanks[i] ?? '')))
      return { ok: parts.every(Boolean), parts }
    }
    case 'flashcards':
      return { ok: true, parts: [] }
  }
}

export function matchChips(ex: Extract<Exercise, { type: 'match' }>): string[] {
  return [...ex.pairs.map((p) => p.right), ...(ex.decoys ?? [])]
}

function chipText(ex: Extract<Exercise, { type: 'match' }>, i: number | undefined) {
  return i === undefined ? undefined : matchChips(ex)[i]
}

/** Does this stored response still fit the exercise? Anything else is dropped, never trusted. */
export function fits(ex: Exercise, r: unknown): r is Response {
  if (!r || typeof r !== 'object') return false
  const a = r as Record<string, unknown>
  if (a.type !== ex.type) return false
  const idx = (v: unknown, n: number) => Number.isInteger(v) && (v as number) >= 0 && (v as number) < n
  switch (ex.type) {
    case 'single':
      return idx(a.option, ex.options.length)
    case 'multi':
      return Array.isArray(a.options) && a.options.every((v) => idx(v, ex.options.length))
    case 'truefalse':
      return typeof a.value === 'boolean'
    case 'order':
      return Array.isArray(a.order) && a.order.length === ex.items.length && new Set(a.order).size === ex.items.length && a.order.every((v) => idx(v, ex.items.length))
    case 'match':
      return Array.isArray(a.chips) && a.chips.length === ex.pairs.length && a.chips.every((v) => v === -1 || idx(v, matchChips(ex).length))
    case 'cloze':
      return Array.isArray(a.blanks) && a.blanks.length === clozeBlanks(ex.text).length && a.blanks.every((v) => typeof v === 'string')
    case 'flashcards':
      return false
  }
}

/** Small stable hash: option order must survive a reload, and differ between retry rounds. */
export function hash(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function shuffled<T>(items: T[], seed: string): T[] {
  const out = [...items]
  let h = hash(seed) || 1
  for (let i = out.length - 1; i > 0; i--) {
    h ^= h << 13
    h ^= h >>> 17
    h ^= h << 5
    h >>>= 0
    const j = h % (i + 1)
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/** A shuffle of 0..n-1 that is never already the correct order. */
export function shuffledOrder(n: number, seed: string): number[] {
  const base = Array.from({ length: n }, (_, i) => i)
  for (let k = 0; k < 8; k++) {
    const s = shuffled(base, `${seed}:${k}`)
    if (s.some((v, i) => v !== i)) return s
  }
  return [...base.slice(1), 0]
}
