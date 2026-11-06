import { createContext, useContext, useMemo, useSyncExternalStore } from 'react'
import { agendaState, createClock, partsOf, type Clock, type Parts } from './time'
import type { AgendaState, Orientation, ScreenDef, Session } from './types'
import type { Feed } from './feed'

export type LogKind = 'scene' | 'async' | 'data' | 'layout' | 'stall' | 'reload' | 'memory' | 'wake' | 'player'

export interface LogEntry {
  at: number
  kind: LogKind
  scene?: string
  message: string
}

const MAX_LOG = 200

/** A ring buffer, so a scene that fails forever cannot grow memory. Survives a reload through localStorage. */
export class Log {
  entries: LogEntry[] = []
  counts: Partial<Record<LogKind, number>> = {}
  private key: string
  private dirty = false
  private clock: Clock

  constructor(key: string, clock: Clock) {
    this.key = key
    this.clock = clock
    try {
      const old = JSON.parse(localStorage.getItem(key) ?? '[]') as LogEntry[]
      if (Array.isArray(old)) this.entries = old.slice(-MAX_LOG)
    } catch { /* storage may be blocked or corrupt: the log is a convenience */ }
  }

  record(kind: LogKind, message: string, scene?: string) {
    this.entries.push({ at: this.clock.now(), kind, scene, message: message.slice(0, 240) })
    if (this.entries.length > MAX_LOG) this.entries.splice(0, this.entries.length - MAX_LOG)
    this.counts[kind] = (this.counts[kind] ?? 0) + 1
    this.dirty = true
  }

  flush() {
    if (!this.dirty) return
    this.dirty = false
    try {
      localStorage.setItem(this.key, JSON.stringify(this.entries.slice(-40)))
    } catch { /* full or blocked */ }
  }
}

export type Fault = 'render' | 'effect' | 'blank'

export interface Params {
  now: string | null
  speed: number
  rotate: 0 | 90 | 270
  pin: string | null
  data: string | null
  qa: boolean
  memlimit: number | null
}

export function readParams(): Params {
  const q = new URLSearchParams(location.search)
  const speed = Number(q.get('speed'))
  const rotate = Number(q.get('rotate'))
  const memlimit = Number(q.get('memlimit'))
  return {
    now: q.get('now'),
    speed: speed > 0 ? speed : 1,
    rotate: rotate === 90 || rotate === 270 ? rotate : 0,
    pin: q.get('pin'),
    data: q.get('data'),
    qa: q.has('qa'),
    memlimit: memlimit > 0 ? memlimit : null,
  }
}

/** Everything one running screen shares. Module scope would survive nothing, and the page never remounts this. */
export interface Runtime {
  def: ScreenDef<never>
  clock: Clock
  params: Params
  log: Log
  feed: Feed<unknown> | null
  orientation: () => Orientation
  faults: Map<string, Fault>
  subscribeTick: (fn: () => void) => () => void
  emitTick: () => void
  bootAt: number
  wake: { state: string }
}

export function createRuntime(def: ScreenDef<never>, startAt: number | null, params: Params, orientation: () => Orientation): Runtime {
  const clock = createClock(startAt, params.speed)
  const listeners = new Set<() => void>()
  return {
    def,
    clock,
    params,
    log: new Log(`screen:${def.title}:log`, clock),
    feed: null,
    orientation,
    faults: new Map(),
    subscribeTick(fn) {
      listeners.add(fn)
      return () => { listeners.delete(fn) }
    },
    emitTick() {
      for (const fn of listeners) fn()
    },
    bootAt: performance.now(),
    wake: { state: 'not requested' },
  }
}

export const RuntimeContext = createContext<Runtime>(null as unknown as Runtime)
export const useRuntime = () => useContext(RuntimeContext)

/** The clock, re-rendering only when the minute (or second) changes. */
export function useParts(every: 'minute' | 'second' = 'minute'): Parts {
  const rt = useRuntime()
  const div = every === 'minute' ? 60000 : 1000
  const key = useSyncExternalStore(rt.subscribeTick, () => Math.floor(rt.clock.now() / div))
  return useMemo(() => partsOf(key * div, rt.def.timezone), [key, div, rt])
}

const noFeed = () => () => {}

/** Current value of the data feed, or the built-in value. */
export function useData<T>(): T {
  const rt = useRuntime()
  const feed = rt.feed
  const snap = useSyncExternalStore(feed ? feed.subscribe : noFeed, feed ? feed.getSnapshot : () => null)
  return (snap ? snap.value : rt.def.data?.initial) as T
}

export function useAgenda(): AgendaState {
  const rt = useRuntime()
  const data = useData<never>()
  const parts = useParts('minute')
  const sessions: Session[] = useMemo(() => rt.def.agenda?.(data) ?? [], [rt, data])
  return useMemo(() => agendaState(sessions, parts, 0), [sessions, parts])
}
