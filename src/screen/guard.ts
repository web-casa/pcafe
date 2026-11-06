import { minutesOf, partsOf } from './time'
import type { Runtime } from './runtime'

// Everything that keeps the page healthy over days. What a page cannot do for itself (a hung tab, a
// dead renderer) needs a supervisor outside the browser: docs/en/screen.md has the recipe.

const realNow = () => Date.now()
const MEMORY_RELOAD_GAP = 30 * 60 * 1000

interface PerformanceWithMemory extends Performance {
  memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number }
}

function storage(key: string, value?: string) {
  try {
    if (value === undefined) return localStorage.getItem(key)
    localStorage.setItem(key, value)
  } catch { /* blocked storage must not stop the show */ }
  return null
}

/** Reloads only if the page will come back: a dead web server would otherwise turn a loop into an error page. */
async function safeReload(rt: Runtime, reason: string) {
  rt.log.record('reload', reason)
  rt.log.flush()
  if (location.protocol.startsWith('http')) {
    try {
      const r = await fetch(location.href, { method: 'HEAD', cache: 'no-store' })
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
    } catch (e) {
      rt.log.record('reload', `skipped, server not reachable: ${e instanceof Error ? e.message : e}`)
      return false
    }
  }
  try { sessionStorage.setItem('screen:reloads', String(Number(sessionStorage.getItem('screen:reloads') ?? 0) + 1)) } catch { /* blocked */ }
  location.reload()
  return true
}

async function acquireWakeLock(rt: Runtime) {
  if (!('wakeLock' in navigator)) { rt.wake.state = 'not supported'; return }
  if (document.visibilityState !== 'visible') return
  try {
    const lock = await navigator.wakeLock.request('screen')
    rt.wake.state = 'held'
    lock.addEventListener('release', () => { rt.wake.state = 'released' }, { once: true })
  } catch (e) {
    rt.wake.state = `refused: ${e instanceof Error ? e.name : e}`
    rt.log.record('wake', rt.wake.state)
  }
}

export interface Guards {
  /** Set when a reload should happen at the next scene change, so it is never seen mid-scene. */
  wantsReload: () => string | null
  reloadNow: (reason: string) => void
}

export function startGuards(rt: Runtime): Guards {
  const { def, clock, params, log } = rt
  const titleKey = `screen:${def.title}`
  let pending: string | null = null

  const nightly = def.reloadAt ? minutesOf(def.reloadAt) : null
  const limitMb = params.memlimit ?? def.memoryLimitMb ?? 400

  void acquireWakeLock(rt)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && rt.wake.state !== 'held') void acquireWakeLock(rt)
  })

  const check = () => {
    log.flush()
    if (rt.wake.state === 'released' && document.visibilityState === 'visible') void acquireWakeLock(rt)
    const p = partsOf(clock.now(), def.timezone)
    if (nightly !== null && p.minutes >= nightly && p.minutes < nightly + 10) {
      if (storage(`${titleKey}:nightly`) !== p.date) {
        storage(`${titleKey}:nightly`, p.date)
        pending = `nightly reload at ${def.reloadAt}`
      }
    }
    const mem = (performance as PerformanceWithMemory).memory
    if (mem && mem.usedJSHeapSize > limitMb * 1048576) {
      const last = Number(storage(`${titleKey}:memreload`) ?? 0)
      if (realNow() - last > MEMORY_RELOAD_GAP) {
        storage(`${titleKey}:memreload`, String(realNow()))
        log.record('memory', `heap ${Math.round(mem.usedJSHeapSize / 1048576)} MB over the ${limitMb} MB limit`)
        pending = 'memory limit'
      }
    }
  }
  check()
  window.setInterval(check, Math.max(200, 30000 / clock.speed))

  return {
    wantsReload: () => pending,
    reloadNow(reason) {
      pending = null
      void safeReload(rt, reason)
    },
  }
}
