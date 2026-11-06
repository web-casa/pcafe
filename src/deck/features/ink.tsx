import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { DESIGN_H, DESIGN_W } from '../Stage'

/** Shared guard for feature hotkeys: same rules as the Deck key handler. */
export function hotkeyOk(e: KeyboardEvent) {
  if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return false
  const t = e.target as HTMLElement | null
  if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return false
  return true
}

export const stageEl = () => document.querySelector<HTMLElement>('.stage')

/** Pointer position in canvas units (0..1920, 0..1080). */
export function toUnits(e: { clientX: number; clientY: number }) {
  const r = stageEl()?.getBoundingClientRect()
  if (!r || !r.width) return { x: 0, y: 0 }
  return { x: ((e.clientX - r.left) / r.width) * DESIGN_W, y: ((e.clientY - r.top) / r.height) * DESIGN_H }
}

export function StatusPill({ children, slot = 'a' }: { children: string; slot?: 'a' | 'b' }) {
  return (
    <div className={`feat-pill feat-pill--${slot}`} role="status" aria-live="polite">
      <span className="feat-pill__dot" />
      {children}
    </div>
  )
}

type Mode = 'laser' | 'pen' | null
type Pt = { x: number; y: number }
type TrailPt = Pt & { t: number }

const accent = () => (stageEl() && getComputedStyle(stageEl()!).getPropertyValue('--accent').trim()) || '#e5484d'
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const PEN_W = 6
const TRAIL_MS = 260

/** Size a canvas to the stage at devicePixelRatio and map canvas units onto it. */
function fit(c: HTMLCanvasElement) {
  const r = c.getBoundingClientRect()
  const dpr = window.devicePixelRatio || 1
  const w = Math.max(1, Math.round(r.width * dpr))
  const h = Math.max(1, Math.round(r.height * dpr))
  if (c.width !== w || c.height !== h) {
    c.width = w
    c.height = h
  }
  const ctx = c.getContext('2d')!
  ctx.setTransform(w / DESIGN_W, 0, 0, h / DESIGN_H, 0, 0)
  return ctx
}

function drawStroke(ctx: CanvasRenderingContext2D, s: Pt[]) {
  if (!s.length) return
  ctx.beginPath()
  ctx.moveTo(s[0].x, s[0].y)
  if (s.length === 1) ctx.lineTo(s[0].x + 0.01, s[0].y)
  for (let i = 1; i < s.length - 1; i++) {
    const mx = (s[i].x + s[i + 1].x) / 2
    const my = (s[i].y + s[i + 1].y) / 2
    ctx.quadraticCurveTo(s[i].x, s[i].y, mx, my)
  }
  if (s.length > 1) ctx.lineTo(s[s.length - 1].x, s[s.length - 1].y)
  ctx.stroke()
}

/** Laser pointer (L) and pen (D, C clears) drawn over the slide. */
export function Ink({ overview, index }: { overview: boolean; index: number }) {
  const [mode, setMode] = useState<Mode>(null)
  const strokes = useRef<Pt[][]>([])
  const penRef = useRef<HTMLCanvasElement>(null)
  const laserRef = useRef<HTMLCanvasElement>(null)
  const trail = useRef<TrailPt[]>([])
  const raf = useRef(0)

  const redraw = () => {
    const c = penRef.current
    if (!c) return
    const ctx = fit(c)
    ctx.clearRect(0, 0, DESIGN_W, DESIGN_H)
    ctx.strokeStyle = accent()
    ctx.lineWidth = PEN_W
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    strokes.current.forEach((s) => drawStroke(ctx, s))
  }

  // Clear strokes on slide change; leave every mode when the overview opens.
  useLayoutEffect(() => {
    strokes.current = []
    redraw()
  }, [index])
  useEffect(() => {
    if (overview) setMode(null)
  }, [overview])

  useEffect(() => {
    const onResize = () => redraw()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (overview) return
    const onKey = (e: KeyboardEvent) => {
      if (!hotkeyOk(e)) return
      const k = e.key.toLowerCase()
      if (k === 'l') {
        e.preventDefault()
        setMode((m) => (m === 'laser' ? null : 'laser'))
      } else if (k === 'd') {
        e.preventDefault()
        setMode((m) => (m === 'pen' ? null : 'pen'))
      } else if (k === 'c' && strokes.current.length) {
        e.preventDefault()
        strokes.current = []
        redraw()
      } else if (e.key === 'Escape') {
        setMode((m) => {
          if (m) e.preventDefault()
          return null
        })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [overview])

  // Laser: hide the cursor over the stage and draw a glowing dot with a fading trail.
  useEffect(() => {
    if (mode !== 'laser') return
    const st = stageEl()
    st?.classList.add('is-laser')
    const c = laserRef.current!
    let last: TrailPt | null = null
    const tick = () => {
      const ctx = fit(c)
      ctx.clearRect(0, 0, DESIGN_W, DESIGN_H)
      const now = performance.now()
      const life = reduced() ? 0 : TRAIL_MS
      trail.current = trail.current.filter((p) => now - p.t < life)
      const col = accent()
      const pts = trail.current
      ctx.lineCap = 'round'
      ctx.strokeStyle = col
      for (let i = 1; i < pts.length; i++) {
        const a = 1 - (now - pts[i].t) / life
        ctx.globalAlpha = a * 0.55
        ctx.lineWidth = 4 + 8 * a
        ctx.beginPath()
        ctx.moveTo(pts[i - 1].x, pts[i - 1].y)
        ctx.lineTo(pts[i].x, pts[i].y)
        ctx.stroke()
      }
      if (last) {
        ctx.globalAlpha = 1
        ctx.shadowColor = col
        ctx.shadowBlur = 28
        ctx.fillStyle = col
        ctx.beginPath()
        ctx.arc(last.x, last.y, 11, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.fillStyle = 'rgba(255,255,255,0.85)'
        ctx.beginPath()
        ctx.arc(last.x, last.y, 4, 0, Math.PI * 2)
        ctx.fill()
      }
      raf.current = requestAnimationFrame(tick)
    }
    const onMove = (e: PointerEvent) => {
      last = { ...toUnits(e), t: performance.now() }
      trail.current.push(last)
    }
    window.addEventListener('pointermove', onMove)
    raf.current = requestAnimationFrame(tick)
    return () => {
      st?.classList.remove('is-laser')
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf.current)
      trail.current = []
      fit(c).clearRect(0, 0, DESIGN_W, DESIGN_H)
    }
  }, [mode])

  const drawing = useRef<Pt[] | null>(null)
  const onDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    drawing.current = [toUnits(e)]
    strokes.current.push(drawing.current)
    redraw()
  }
  const onMove = (e: React.PointerEvent) => {
    if (!drawing.current) return
    const events = e.nativeEvent.getCoalescedEvents?.() ?? [e.nativeEvent]
    for (const ev of events) drawing.current.push(toUnits(ev))
    redraw()
  }
  const onUp = () => {
    drawing.current = null
  }

  return (
    <>
      <canvas ref={penRef} className="ink-canvas" aria-hidden />
      <canvas ref={laserRef} className="ink-canvas" aria-hidden />
      {mode === 'pen' && (
        <div className="ink-capture" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onClick={(e) => e.stopPropagation()} />
      )}
      {mode === 'laser' && <StatusPill>激光笔 · L 关闭</StatusPill>}
      {mode === 'pen' && <StatusPill>画笔 · C 清除 · D 关闭</StatusPill>}
    </>
  )
}
