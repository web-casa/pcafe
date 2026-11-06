// Progress. Everything touching localStorage goes through `safe`: it can throw on read (blocked
// site data, some file: origins) and on write (quota). The course must work without it, and must
// say so instead of pretending. See plans/research-course.md §6.
import { useEffect, useRef, useState } from 'react'
import { fits } from './grade'
import { allSteps } from './validate'
import type { CourseDef, Response } from './types'

export interface Attempt {
  response: Response
  ok: boolean
  at: number
}

export interface Drill {
  kind: 'retry' | 'review'
  ids: string[]
  /** Round number: changes the option order, so a retry cannot be solved from position memory. */
  round: number
  answers: Record<string, Attempt>
  cards: Record<string, CardRun>
}

export interface CardRun {
  /** Card indices the learner has not yet rated in this run. */
  queue: number[]
  known: number[]
  again: number[]
  flipped?: boolean
}

export interface Progress {
  v: 1
  /** Route to come back to. */
  at: string
  seen: string[]
  /** The first answer: what the score reports. Never overwritten. */
  first: Record<string, Attempt>
  /** The latest answer, after any retry or review. */
  latest: Record<string, boolean>
  labs: Record<string, string[]>
  cards: Record<string, CardRun>
  drill?: Drill
  finishedAt?: number
  /** Retry and review rounds started so far. */
  rounds: number
  reviews: { at: number; right: number; total: number }[]
}

export const emptyProgress = (): Progress => ({ v: 1, at: '', seen: [], first: {}, latest: {}, labs: {}, cards: {}, rounds: 0, reviews: [] })

/** Whether anything the learner does will still be here after the tab closes. */
export type StorageState = 'saved' | 'memory'

const safe = {
  get(key: string): string | null {
    try {
      return window.localStorage.getItem(key)
    } catch {
      return null
    }
  },
  set(key: string, value: string): boolean {
    try {
      window.localStorage.setItem(key, value)
      return true
    } catch {
      return false
    }
  },
  remove(key: string) {
    try {
      window.localStorage.removeItem(key)
    } catch {
      /* nothing to clean */
    }
  },
  probe(): boolean {
    const key = '__course_probe__'
    const ok = safe.set(key, '1') && safe.get(key) === '1'
    safe.remove(key)
    return ok
  },
}

const keyOf = (c: CourseDef) => `pcafe.course.${c.id}`

/** Trust nothing from storage: an old version, a hand edit or corruption must not crash a lesson. */
export function load(c: CourseDef): Progress {
  const raw = safe.get(keyOf(c))
  const fresh = emptyProgress()
  if (!raw) return fresh
  let v: Partial<Progress>
  try {
    v = JSON.parse(raw)
  } catch {
    return fresh
  }
  if (!v || typeof v !== 'object' || v.v !== 1) return fresh
  const steps = new Map(allSteps(c).map((s) => [s.id, s]))
  const out = fresh
  out.at = typeof v.at === 'string' ? v.at : ''
  out.seen = Array.isArray(v.seen) ? v.seen.filter((id) => typeof id === 'string' && steps.has(id)) : []
  const cleanAttempts = (rec: unknown) => {
    const kept: Record<string, Attempt> = {}
    for (const [id, a] of Object.entries((rec as Record<string, Attempt>) ?? {})) {
      const s = steps.get(id)
      if (s?.kind === 'practice' && a && typeof a === 'object' && fits(s.exercise, a.response)) kept[id] = { response: a.response, ok: !!a.ok, at: Number(a.at) || 0 }
    }
    return kept
  }
  const cleanCards = (rec: unknown) => {
    const kept: Record<string, CardRun> = {}
    for (const [id, a] of Object.entries((rec as Record<string, CardRun>) ?? {})) {
      const s = steps.get(id)
      if (s?.kind !== 'practice' || s.exercise.type !== 'flashcards' || !a) continue
      const n = s.exercise.cards.length
      const list = (x: unknown) => (Array.isArray(x) ? x.filter((i) => Number.isInteger(i) && i >= 0 && i < n) : [])
      kept[id] = { queue: list(a.queue), known: list(a.known), again: list(a.again) }
    }
    return kept
  }
  out.first = cleanAttempts(v.first)
  out.cards = cleanCards(v.cards)
  for (const [id, ok] of Object.entries(v.latest ?? {})) if (id in out.first) out.latest[id] = !!ok
  for (const [id, done] of Object.entries(v.labs ?? {})) {
    const s = steps.get(id)
    if (s?.kind === 'lab' && Array.isArray(done)) out.labs[id] = done.filter((t) => s.tasks.some((k) => k.id === t))
  }
  if (typeof v.finishedAt === 'number') out.finishedAt = v.finishedAt
  out.rounds = Number(v.rounds) || 0
  if (Array.isArray(v.reviews)) out.reviews = v.reviews.filter((r) => r && typeof r.at === 'number')
  const d = v.drill
  if (d && Array.isArray(d.ids) && (d.kind === 'retry' || d.kind === 'review')) {
    const ids = d.ids.filter((id) => steps.has(id))
    if (ids.length) out.drill = { kind: d.kind, ids, round: Number(d.round) || 1, answers: cleanAttempts(d.answers), cards: cleanCards(d.cards) }
  }
  return out
}

export function useProgress(c: CourseDef) {
  const [progress, setProgress] = useState<Progress>(() => load(c))
  const [storage, setStorage] = useState<StorageState>(() => (safe.probe() ? 'saved' : 'memory'))
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    // A failed write (quota, blocked mid-session) flips the notice; it never interrupts the lesson.
    if (!safe.set(keyOf(c), JSON.stringify(progress))) setStorage('memory')
  }, [c, progress])
  const reset = () => {
    safe.remove(keyOf(c))
    setProgress(emptyProgress())
  }
  return { progress, setProgress, storage, reset }
}
