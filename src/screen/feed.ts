import type { Clock } from './time'
import type { DataDef } from './types'
import type { Log } from './runtime'

export type FeedStatus = 'builtin' | 'live' | 'stale' | 'offline'

export interface FeedSnapshot<T> {
  value: T
  status: FeedStatus
  /** When the last good poll arrived, on the screen's clock. */
  fetchedAt: number | null
  error: string | null
  polls: number
  fails: number
}

const isScriptPath = (s: string) => /\.js(\?|$)/.test(s) && !/^[a-z]+:|^\/\//i.test(s)

declare global {
  interface Window { __screenData?: (v: unknown) => void }
}

// A file:// page can load a script but cannot fetch (research §6), so a local data file is a
// script that hands over a value. Only a relative path may run as a script: ?data= is in the URL,
// and a remote script would run in this page, so remote data has to be JSON.
function loadScript(path: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let has = false
    let got: unknown
    window.__screenData = (v) => { has = true; got = v }
    const el = document.createElement('script')
    const done = () => { clearTimeout(timer); el.remove(); delete window.__screenData }
    const timer = setTimeout(() => { done(); reject(new Error('data file timed out')) }, 15000)
    el.src = `${path}${path.includes('?') ? '&' : '?'}t=${Date.now()}`
    el.onload = () => { done(); if (has) resolve(got); else reject(new Error('data file did not call __screenData')) }
    el.onerror = () => { done(); reject(new Error('data file not found')) }
    document.head.append(el)
  })
}

async function loadJson(url: string): Promise<unknown> {
  const abort = new AbortController()
  const timer = setTimeout(() => abort.abort(), 15000)
  try {
    const r = await fetch(url, { cache: 'no-store', signal: abort.signal })
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    return await r.json()
  } finally {
    clearTimeout(timer)
  }
}

/** Polls a data source and never lets a bad poll replace good data. */
export class Feed<T> {
  private snap: FeedSnapshot<T>
  private listeners = new Set<() => void>()
  private timer = 0
  private stopped = false
  private readonly key: string
  private readonly everyMs: number
  private readonly staleMs: number

  constructor(private def: DataDef<T>, private source: string, title: string, private clock: Clock, private log: Log) {
    this.key = `screen:${title}:data`
    this.everyMs = (def.everySec ?? 60) * 1000
    this.staleMs = (def.staleAfterSec ?? (def.everySec ?? 60) * 5) * 1000
    this.snap = { value: def.initial, status: 'builtin', fetchedAt: null, error: null, polls: 0, fails: 0 }
    // The last good data survives a reload, so a nightly reload during an outage does not fall back to old defaults.
    try {
      const saved = JSON.parse(localStorage.getItem(this.key) ?? 'null') as { value: unknown; at: number } | null
      if (saved) this.snap = { ...this.snap, value: def.parse(saved.value), fetchedAt: saved.at, status: 'stale' }
    } catch { /* corrupt or old format: start from the built-in value */ }
  }

  subscribe = (fn: () => void) => {
    this.listeners.add(fn)
    return () => { this.listeners.delete(fn) }
  }

  getSnapshot = () => this.snap

  private set(patch: Partial<FeedSnapshot<T>>) {
    this.snap = { ...this.snap, ...patch }
    for (const fn of this.listeners) fn()
  }

  private async poll() {
    if (this.stopped) return
    const polls = this.snap.polls + 1
    try {
      const raw = await (isScriptPath(this.source) ? loadScript(this.source) : loadJson(this.source))
      const value = this.def.parse(raw)
      const at = this.clock.now()
      this.set({ value, fetchedAt: at, status: 'live', error: null, polls, fails: 0 })
      try { localStorage.setItem(this.key, JSON.stringify({ value: raw, at })) } catch { /* too big or blocked */ }
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      const fails = this.snap.fails + 1
      // One line per outage, not one per poll: a week offline must not fill the log.
      if (fails === 1) this.log.record('data', `${this.source}: ${message}`)
      this.set({ error: message, polls, fails })
    }
    this.refreshStatus()
    if (this.stopped) return
    // Back off to at most 10 minutes while the source is failing.
    const wait = Math.min(this.everyMs * 2 ** Math.min(this.snap.fails, 6), Math.max(this.everyMs, 600000))
    this.timer = window.setTimeout(() => void this.poll(), wait / this.clock.speed)
  }

  /** Called from the player's tick. Staleness depends on the clock, so it must change without a poll. */
  refreshStatus() {
    const { fetchedAt, status } = this.snap
    let next: FeedStatus = status
    if (fetchedAt === null) next = this.snap.fails ? 'offline' : 'builtin'
    else next = this.clock.now() - fetchedAt > this.staleMs ? 'stale' : 'live'
    if (next !== status) this.set({ status: next })
  }

  start() {
    void this.poll()
  }

  stop() {
    this.stopped = true
    clearTimeout(this.timer)
  }
}
