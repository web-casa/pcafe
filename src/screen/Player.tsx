import { Component, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ErrorInfo, type ReactNode } from 'react'
import { inWindow, partsOf, type Parts } from './time'
import { useRuntime, type Fault, type Runtime } from './runtime'
import { Chrome, HoldingCard, StatusPanel } from './Chrome'
import { startGuards, type Guards } from './guard'
import type { SceneDef } from './types'

const FADE_MS = 900
const PATH: [number, number][] = [[0, 0], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]]
const REST_BASE_MS = 5 * 60 * 1000
const REST_MAX_MS = 60 * 60 * 1000
const AUTO_RESUME_MS = 10 * 60 * 1000
const STALL_MS = 30000

function pickScene(scenes: SceneDef[], from: number, dir: 1 | -1, parts: Parts, rests: Map<string, number>, mono: number) {
  const n = scenes.length
  for (let k = 1; k <= n; k++) {
    const i = (from + dir * k + n * k) % n
    const s = scenes[i]
    if (inWindow(s.when, parts) && (rests.get(s.id) ?? 0) <= mono) return i
  }
  return null
}

interface BoundaryProps {
  onError: (e: Error) => void
  children: ReactNode
}

/** One scene's failure stays inside its layer. */
class SceneBoundary extends Component<BoundaryProps, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(error: Error, _info: ErrorInfo) { this.props.onError(error) }
  render() { return this.state.failed ? null : this.props.children }
}

function SceneRender({ scene, fault }: { scene: SceneDef; fault: Fault | undefined }) {
  if (fault === 'render') throw new Error(`qa fault in render of ${scene.id}`)
  useEffect(() => {
    if (fault === 'effect') throw new Error(`qa fault in effect of ${scene.id}`)
  }, [fault, scene.id])
  if (fault === 'blank') return null
  return scene.render()
}

interface LayerProps {
  seq: number
  scene: SceneDef
  out: boolean
  rt: Runtime
  onReady: (seq: number) => void
  onFail: (seq: number, scene: SceneDef, e: Error) => void
}

function SceneLayer({ seq, scene, out, rt, onReady, onFail }: LayerProps) {
  const ref = useRef<HTMLDivElement>(null)
  // A fault is read once when the layer mounts, like a real bug in that render.
  const [fault] = useState(() => rt.faults.get(scene.id))
  useEffect(() => {
    const el = ref.current
    if (el && (el.textContent?.trim() || el.querySelector('img,svg'))) onReady(seq)
    else onFail(seq, scene, new Error('scene rendered nothing'))
    // Runs once per layer: seq never changes for a mounted layer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const style = { '--dwell': `${scene.seconds / rt.clock.speed}s` } as CSSProperties
  return (
    <div ref={ref} className={`scr-layer${out ? ' is-out' : ''}`} data-scene={scene.id} data-seq={seq} style={style}>
      <SceneBoundary onError={(e) => onFail(seq, scene, e)}>
        <SceneRender scene={scene} fault={fault} />
      </SceneBoundary>
    </div>
  )
}

interface Layer { seq: number; idx: number; out: boolean }

export function Player() {
  const rt = useRuntime()
  const { def, clock, params, log } = rt
  const scenes = def.scenes
  const tz = def.timezone
  const guards = useRef<Guards>(null as unknown as Guards)
  const S = useRef({
    seq: 0,
    idx: -1,
    visible: -1,
    endsAt: Number.POSITIVE_INFINITY,
    startedAt: 0,
    changes: 0,
    rests: new Map<string, number>(),
    fails: new Map<string, number>(),
    failedSeqs: new Set<number>(),
    pinned: null as string | null,
    paused: false,
    pausedAt: 0,
    idleUntil: 0,
    idleStep: 0,
    orbit: 0,
    flip: false,
    flippedAt: clock.now(),
    lastTick: performance.now(),
    fadeTimer: 0,
  })
  const [layers, setLayers] = useState<Layer[]>([])
  const [idle, setIdle] = useState(false)
  const [paused, setPaused] = useState(false)
  const [panel, setPanel] = useState(false)

  const stepBurnIn = useCallback(() => {
    const s = S.current
    const kind = def.venue.panel ?? 'lcd'
    const amp = def.burnIn?.shift ?? (kind === 'oled' ? 8 : kind === 'led' ? 0 : 4)
    s.orbit = (s.orbit + 1) % PATH.length
    const root = document.documentElement.style
    root.setProperty('--ox', String(PATH[s.orbit][0] * amp))
    root.setProperty('--oy', String(PATH[s.orbit][1] * amp))
    if (clock.now() - s.flippedAt >= (def.burnIn?.flipMinutes ?? 10) * 60000) {
      s.flip = !s.flip
      s.flippedAt = clock.now()
      document.documentElement.dataset.flip = s.flip ? '1' : '0'
    }
  }, [def, clock])

  const show = useCallback((idx: number) => {
    const s = S.current
    const mono = clock.mono()
    s.seq += 1
    s.idx = idx
    s.startedAt = mono
    s.endsAt = mono + scenes[idx].seconds * 1000
    s.changes += 1
    stepBurnIn()
    const seq = s.seq
    setLayers((ls) => [...ls.filter((l) => l.seq === s.visible), { seq, idx, out: false }])
  }, [clock, scenes, stepBurnIn])

  const go = useCallback((dir: 1 | -1 = 1) => {
    const s = S.current
    const want = guards.current?.wantsReload()
    if (want) guards.current.reloadNow(want)
    const i = pickScene(scenes, s.idx, dir, partsOf(clock.now(), tz), s.rests, clock.mono())
    if (i === null) {
      // Nothing is eligible now: hold a calm card rather than a black screen, and keep trying.
      s.endsAt = Number.POSITIVE_INFINITY
      s.idleUntil = clock.mono() + 30000
      // The holding card has no scene changes to move it, so each retry moves it instead.
      s.idleStep = (s.idleStep + 1) % PATH.length
      document.documentElement.style.setProperty('--idle-x', String(PATH[s.idleStep][0]))
      document.documentElement.style.setProperty('--idle-y', String(PATH[s.idleStep][1]))
      stepBurnIn()
      setIdle(true)
      setLayers([])
      s.visible = -1
      return
    }
    setIdle(false)
    show(i)
  }, [scenes, clock, tz, show, stepBurnIn])

  const onReady = useCallback((seq: number) => {
    const s = S.current
    if (seq !== s.seq) return
    s.visible = seq
    setLayers((ls) => ls.map((l) => (l.seq === seq ? l : { ...l, out: true })))
    clearTimeout(s.fadeTimer)
    s.fadeTimer = window.setTimeout(() => {
      setLayers((ls) => ls.filter((l) => l.seq === s.visible || l.seq === s.seq))
    }, FADE_MS / clock.speed)
  }, [clock])

  const onFail = useCallback((seq: number, scene: SceneDef, e: Error) => {
    const s = S.current
    if (s.failedSeqs.has(seq)) return
    if (s.failedSeqs.size > 32) s.failedSeqs.clear()
    s.failedSeqs.add(seq)
    log.record('scene', e.message, scene.id)
    const fails = (s.fails.get(scene.id) ?? 0) + 1
    s.fails.set(scene.id, fails)
    s.rests.set(scene.id, clock.mono() + Math.min(REST_BASE_MS * 2 ** (fails - 1), REST_MAX_MS))
    if (s.visible === seq) s.visible = -1
    setLayers((ls) => ls.filter((l) => l.seq !== seq))
    if (seq === s.seq) go(1)
  }, [log, clock, go])

  // First scene. A layout effect, so the screen is never painted empty.
  useLayoutEffect(() => {
    guards.current = startGuards(rt)
    const pin = params.pin ? scenes.findIndex((x) => x.id === params.pin) : -1
    if (pin >= 0) {
      S.current.pinned = scenes[pin].id
      show(pin)
    } else {
      go(1)
    }
    // Starts the engine once for the life of the page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // The one timer of the player. Everything is computed from the clock at each tick, so a throttled
  // or suspended page just catches up (research §6).
  useEffect(() => {
    const ms = Math.max(16, Math.min(250, 250 / clock.speed))
    const id = window.setInterval(() => {
      const s = S.current
      const real = performance.now()
      if (real - s.lastTick > STALL_MS) log.record('stall', `no tick for ${Math.round((real - s.lastTick) / 1000)} s`)
      s.lastTick = real
      rt.emitTick()
      rt.feed?.refreshStatus()
      const mono = clock.mono()
      if (s.paused) {
        if (mono - s.pausedAt > AUTO_RESUME_MS) {
          s.paused = false
          setPaused(false)
          s.endsAt = mono
        } else return
      }
      if (s.pinned) return
      if (s.idleUntil && mono >= s.idleUntil && s.endsAt === Number.POSITIVE_INFINITY) {
        s.idleUntil = 0
        go(1)
        return
      }
      if (mono >= s.endsAt) {
        // It finished without failing, so whatever was wrong with it has cleared.
        const id = scenes[s.idx]?.id
        if (id) s.fails.delete(id)
        go(1)
      }
    }, ms)
    return () => clearInterval(id)
  }, [rt, clock, log, scenes, go])

  // Operator keys. Nothing shows until one is pressed.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const s = S.current
      const k = e.key.toLowerCase()
      if (k === 'f') {
        if (document.fullscreenElement) void document.exitFullscreen()
        else void document.documentElement.requestFullscreen().catch(() => {})
      } else if (k === ' ') {
        e.preventDefault()
        s.paused = !s.paused
        s.pausedAt = clock.mono()
        if (!s.paused) s.endsAt = clock.mono() + 1000
        setPaused(s.paused)
      } else if (k === 'n' || k === 'arrowright') {
        go(1)
      } else if (k === 'p' || k === 'arrowleft') {
        go(-1)
      } else if (k === 'i') {
        setPanel((v) => !v)
      } else if (k === 'escape') {
        setPanel(false)
      } else if (k === 'r') {
        guards.current?.reloadNow('operator pressed R')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [clock, go])

  // Errors with no scene to blame: recorded, not fatal, and kept out of the console.
  useEffect(() => {
    const onError = (e: ErrorEvent) => {
      log.record('async', e.message || 'script error')
      e.preventDefault()
    }
    const onRejection = (e: PromiseRejectionEvent) => {
      log.record('async', e.reason instanceof Error ? e.reason.message : String(e.reason))
      e.preventDefault()
    }
    window.addEventListener('error', onError)
    window.addEventListener('unhandledrejection', onRejection)
    return () => {
      window.removeEventListener('error', onError)
      window.removeEventListener('unhandledrejection', onRejection)
    }
  }, [log])

  // The handle the QA and an operator's console use.
  useEffect(() => {
    const s = S.current
    const api = {
      describe: () => ({
        title: def.title,
        orientation: def.orientation,
        venue: def.venue,
        timezone: tz ?? null,
        sample: def.sample ?? null,
        reloadAt: def.reloadAt ?? null,
        hasData: !!def.data,
        hasAgenda: !!def.agenda,
        states: def.states ?? [],
        clock: def.clock ?? {},
        scenes: scenes.map((x) => ({ id: x.id, label: x.label, seconds: x.seconds, when: x.when ?? null })),
      }),
      state: () => ({
        scene: scenes[s.idx]?.id ?? null,
        seq: s.seq,
        changes: s.changes,
        idle: s.endsAt === Number.POSITIVE_INFINITY && !s.pinned,
        paused: s.paused,
        flip: s.flip,
        counts: { ...log.counts },
        wake: rt.wake.state,
        data: rt.feed ? { ...rt.feed.getSnapshot(), value: undefined } : null,
        now: clock.now(),
        reloads: Number(sessionStorage.getItem('screen:reloads') ?? 0),
      }),
      log: () => log.entries.slice(),
      eligible: () => {
        const p = partsOf(clock.now(), tz)
        return scenes.filter((x) => inWindow(x.when, p)).map((x) => x.id)
      },
      ...(params.qa
        ? {
            pin(id: string | null) {
              s.pinned = id
              if (id) {
                const i = scenes.findIndex((x) => x.id === id)
                if (i < 0) throw new Error(`no scene ${id}`)
                show(i)
              } else {
                s.endsAt = clock.mono()
              }
            },
            fault(id: string, kind: Fault) { rt.faults.set(id, kind) },
            clearFaults() { rt.faults.clear(); s.rests.clear(); s.fails.clear() },
            next: () => go(1),
          }
        : {}),
    }
    ;(window as unknown as { __screen: unknown }).__screen = api
  }, [def, rt, clock, log, params, scenes, tz, go, show])

  const rendered = useMemo(
    () =>
      layers.map((l) => (
        <SceneLayer key={l.seq} seq={l.seq} scene={scenes[l.idx]} out={l.out} rt={rt} onReady={onReady} onFail={onFail} />
      )),
    [layers, scenes, rt, onReady, onFail],
  )

  return (
    <>
      <div className="scr-stage">{rendered}{idle ? <HoldingCard /> : null}</div>
      <Chrome />
      {paused ? <div className="scr-paused">已暂停，10 分钟后自动继续</div> : null}
      {panel ? <StatusPanel scene={scenes[S.current.idx]?.id ?? null} changes={S.current.changes} /> : null}
    </>
  )
}

/** Last line of defence: the player itself threw. Show the title and reload after a minute. */
export class PlayerBoundary extends Component<{ rt: Runtime; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(error: Error) {
    this.props.rt.log.record('player', error.message)
    this.props.rt.log.flush()
    window.setTimeout(() => location.reload(), 60000 / this.props.rt.clock.speed)
  }
  render() {
    return this.state.failed ? <HoldingCard /> : this.props.children
  }
}
