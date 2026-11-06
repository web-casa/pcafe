// Virtual time for frame-accurate capture. Importing this file replaces every clock the page can
// read, so it must be the FIRST import of the entry: React's scheduler and Motion's frame loop
// capture requestAnimationFrame, setTimeout and setImmediate when their modules load.
//
// Nothing moves unless step() is called. One step:
//   1. fires timers that came due, in time order
//   2. fires requestAnimationFrame once, with the frame's time as its timestamp
//   3. drains React's scheduler (it uses our setImmediate) and microtasks
//   4. seeks every WAAPI animation, CSS animation and CSS transition to the same time
//   5. waits one real browser frame, so finish events and observers land before the capture
// CSS and WAAPI animations do not read any of the JS clocks, which is why step 4 has to exist.
// Playwright's page.clock alone would leave them on the wall clock.

const realPerfNow = performance.now.bind(performance)
const realRaf = window.requestAnimationFrame.bind(window)
const RealDate = Date

const EPOCH = RealDate.UTC(2026, 0, 1)
let vnow = 0

type Timer = { id: number; at: number; fn: (...a: unknown[]) => void; args: unknown[]; every?: number }
const timers = new Map<number, Timer>()
let rafs = new Map<number, FrameRequestCallback>()
const immediates = new Map<number, () => void>()
let seq = 1
let errors: string[] = []

const guard = (fn: () => void) => {
  try {
    fn()
  } catch (e) {
    errors.push(String((e as Error)?.stack ?? e).slice(0, 300))
    console.error(e)
  }
}

class VirtualDate extends RealDate {
  constructor(...a: unknown[]) {
    if (a.length === 0) super(EPOCH + vnow)
    else super(...(a as [number]))
  }
  static now() {
    return EPOCH + vnow
  }
}

const addTimer = (fn: unknown, delay: unknown, args: unknown[], every: boolean) => {
  const id = seq++
  const d = Math.max(0, Number(delay) || 0)
  if (typeof fn === 'function') timers.set(id, { id, at: vnow + d, fn: fn as Timer['fn'], args, every: every ? Math.max(1, d) : undefined })
  return id
}

const w = window as unknown as Record<string, unknown>
w.Date = VirtualDate
performance.now = () => vnow
w.setTimeout = (fn: unknown, d?: unknown, ...a: unknown[]) => addTimer(fn, d, a, false)
w.setInterval = (fn: unknown, d?: unknown, ...a: unknown[]) => addTimer(fn, d, a, true)
w.clearTimeout = w.clearInterval = (id: number) => void timers.delete(id)
w.requestAnimationFrame = (cb: FrameRequestCallback) => {
  const id = seq++
  rafs.set(id, cb)
  return id
}
w.cancelAnimationFrame = (id: number) => void rafs.delete(id)
w.requestIdleCallback = (cb: IdleRequestCallback) => addTimer(() => cb({ didTimeout: false, timeRemaining: () => 8 }), 1, [], false)
w.cancelIdleCallback = (id: number) => void timers.delete(id)
// React's scheduler prefers setImmediate over MessageChannel. Owning it means we can tell when React is idle.
w.setImmediate = (fn: () => void) => {
  const id = seq++
  immediates.set(id, fn)
  return id
}
w.clearImmediate = (id: number) => void immediates.delete(id)

let randomState = 1
Math.random = () => {
  randomState = (randomState + 0x6d2b79f5) | 0
  let t = Math.imul(randomState ^ (randomState >>> 15), 1 | randomState)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

// A real macrotask: lets every microtask (and promise chain) finish.
const channel = new MessageChannel()
const waiting: (() => void)[] = []
channel.port1.onmessage = () => waiting.shift()?.()
const macrotask = () =>
  new Promise<void>((res) => {
    waiting.push(res)
    channel.port2.postMessage(0)
  })

/** One real rendering opportunity: animation events, observers, layout. */
const realFrame = () => new Promise<void>((res) => realRaf(() => void macrotask().then(res)))

const nextTimer = (limit: number) => {
  let best: Timer | null = null
  for (const t of timers.values()) if (t.at <= limit && (!best || t.at < best.at || (t.at === best.at && t.id < best.id))) best = t
  return best
}

const runTimer = (t: Timer) => {
  if (t.every !== undefined) t.at += t.every
  else timers.delete(t.id)
  guard(() => t.fn(...t.args))
}

/** Runs microtasks, React work and timers already due, until none is left. */
async function drain() {
  for (let i = 0; i < 4000; i++) {
    await macrotask()
    const batch = [...immediates.values()]
    immediates.clear()
    const due = nextTimer(vnow)
    if (!batch.length && !due) return
    for (const fn of batch) guard(fn)
    if (due) runTimer(due)
  }
  errors.push('virtual clock: tasks never went idle at ' + vnow)
}

// ---- WAAPI, CSS animations, CSS transitions ----
// The browser runs these on its own timeline. So every Animation is paused natively for its whole
// life, and the Animation API the page sees is replaced with one that answers in virtual time.
// Motion needs that: it sets startTime from performance.now() and encodes the delay of its grouped
// transforms in it, and setting startTime on a natively paused animation would start it for real.
const proto = Animation.prototype
const prop = (k: keyof Animation) => Object.getOwnPropertyDescriptor(proto, k)!
const native = {
  pause: proto.pause,
  play: proto.play,
  finish: proto.finish,
  cancel: proto.cancel,
  commitStyles: proto.commitStyles,
  currentTime: prop('currentTime'),
  playState: prop('playState'),
}
const nativePlayState = (a: Animation) => native.playState.get!.call(a) as AnimationPlayState

type Virtual = { start: number | null; hold: number | null; cancelled: boolean }
const virtual = new WeakMap<Animation, Virtual>()

const stateOf = (a: Animation) => {
  let v = virtual.get(a)
  if (!v) {
    v = { start: vnow, hold: null, cancelled: false }
    virtual.set(a, v)
    native.pause.call(a)
  }
  return v
}
const endOf = (a: Animation) => a.effect?.getComputedTiming().endTime as number | undefined
const timeOf = (a: Animation, v: Virtual) => {
  if (v.hold !== null) return v.hold
  if (v.start === null) return null
  const t = vnow - v.start
  const end = endOf(a)
  return end !== undefined && t > end ? end : t
}

Object.defineProperties(proto, {
  currentTime: {
    configurable: true,
    get(this: Animation) {
      return timeOf(this, stateOf(this))
    },
    set(this: Animation, t: number | null) {
      const v = stateOf(this)
      if (t === null) {
        v.start = v.hold = null
      } else if (v.hold !== null || v.start === null) {
        v.hold = t
        v.start = null
      } else {
        v.start = vnow - t
      }
    },
  },
  startTime: {
    configurable: true,
    get(this: Animation) {
      return stateOf(this).start
    },
    set(this: Animation, t: number | null) {
      const v = stateOf(this)
      v.hold = t === null ? timeOf(this, v) : null
      v.start = t
      v.cancelled = false
    },
  },
  playState: {
    configurable: true,
    get(this: Animation) {
      const v = stateOf(this)
      if (v.cancelled) return 'idle'
      if (v.hold !== null) return 'paused'
      const t = timeOf(this, v)
      const end = endOf(this)
      return t !== null && end !== undefined && t >= end ? 'finished' : 'running'
    },
  },
  pending: { configurable: true, get: () => false },
})
proto.pause = function (this: Animation) {
  const v = stateOf(this)
  v.hold = timeOf(this, v) ?? 0
  v.start = null
}
proto.play = function (this: Animation) {
  const v = stateOf(this)
  const end = endOf(this)
  const t = v.cancelled ? 0 : (timeOf(this, v) ?? 0)
  v.start = vnow - (end !== undefined && t >= end ? 0 : t)
  v.hold = null
  v.cancelled = false
}
proto.finish = function (this: Animation) {
  const v = stateOf(this)
  v.start = vnow - (endOf(this) ?? 0)
  v.hold = null
}
proto.cancel = function (this: Animation) {
  const v = stateOf(this)
  v.cancelled = true
  native.cancel.call(this)
}
proto.commitStyles = function (this: Animation) {
  syncOne(this)
  native.commitStyles.call(this)
}
const nativeAnimate = Element.prototype.animate
Element.prototype.animate = function (this: Element, ...args: Parameters<Element['animate']>) {
  const a = nativeAnimate.apply(this, args)
  stateOf(a)
  return a
}
Object.defineProperty(AnimationTimeline.prototype, 'currentTime', { configurable: true, get: () => vnow })

const finishing = new Set<Animation>()
let lastActive = 0

/** Puts one animation's real state where its virtual state says. Returns whether it is still moving. */
function syncOne(a: Animation) {
  const v = stateOf(a)
  if (v.cancelled) return false
  const t = timeOf(a, v)
  const end = endOf(a)
  const done = v.hold === null && t !== null && end !== undefined && Number.isFinite(end) && t >= end
  if (done) {
    // finish(), not a paused seek: Motion completes its value (and AnimatePresence its exit) in the finish event.
    if (nativePlayState(a) !== 'finished') {
      finishing.add(a)
      a.addEventListener('finish', () => finishing.delete(a), { once: true })
      a.addEventListener('cancel', () => finishing.delete(a), { once: true })
      native.finish.call(a)
    }
    return false
  }
  if (nativePlayState(a) !== 'paused') native.pause.call(a)
  native.currentTime.set!.call(a, t)
  return v.hold === null && end !== Infinity
}

function syncAnimations() {
  let active = 0
  for (const a of document.getAnimations()) if (syncOne(a)) active++
  lastActive = active
}

async function settle() {
  await drain()
  syncAnimations()
  for (let pass = 0; pass < 8; pass++) {
    await realFrame()
    await drain()
    syncAnimations()
    if (!finishing.size) break
  }
}

export const clock = {
  /** Current virtual time in ms. */
  now: () => vnow,
  /**
   * Moves to `t` ms: timers, then `commit` (the frame's React update, so what mounts on this frame
   * is born at `t`), then one animation frame, then everything that follows from them.
   */
  async step(t: number, commit?: () => void) {
    for (let due = nextTimer(t); due; due = nextTimer(t)) {
      vnow = Math.max(vnow, due.at)
      runTimer(due)
      await drain()
    }
    vnow = t
    if (commit) guard(commit)
    const batch = rafs
    rafs = new Map()
    for (const cb of batch.values()) guard(() => cb(t))
    await settle()
  },
  /** Jumps without running anything. Used to rewind when re-mounting a scene for a seek. */
  jump(t: number) {
    for (const timer of timers.values()) timer.at += t - vnow
    vnow = t
  },
  /** Same random sequence for the same scene, however it was reached. */
  seed(n: number) {
    randomState = (n * 2654435761) | 0
  },
  settle,
  /** Finite animations still running at the last sync. */
  activeAnimations: () => lastActive,
  takeErrors() {
    const e = errors
    errors = []
    return e
  },
  /** Decodes images and loads every font face now, so no swap can land on a frame. */
  async preload() {
    await Promise.all([...document.fonts].map((f) => f.load().catch(() => undefined)))
    await document.fonts.ready
  },
  async decodeImages() {
    await Promise.all(
      [...document.images].map(async (img) => {
        if (img.dataset.vDecoded) return
        await img.decode().catch(() => undefined)
        img.dataset.vDecoded = '1'
      }),
    )
  },
  /** Wall clock, for the preview player only. */
  realNow: realPerfNow,
  realRaf,
}
