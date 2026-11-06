import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { hotkeyOk, stageEl } from './ink'

/** What the audience sees instead of the live slide. */
export type Blank = 'black' | 'white' | null
/** Where the audience picture stopped; null = live. */
export type Frozen = { index: number; step: number | null } | null

export interface Screen {
  blank: Blank
  frozen: Frozen
  toggleBlank: (b: 'black' | 'white') => void
  toggleFreeze: () => void
  /** Lift the freeze (the audience catches up to the live slide). */
  release: () => void
}

/**
 * B black screen, W white screen, H freeze the audience picture. Navigation keeps
 * working behind all three, so the speaker can move on and unveil when ready.
 */
export function useScreen({ index, step, overview }: { index: number; step: number | null; overview: boolean }): Screen {
  const [blank, setBlank] = useState<Blank>(null)
  const [frozen, setFrozen] = useState<Frozen>(null)
  const pos = useRef({ index, step })
  pos.current = { index, step }

  const toggleBlank = useCallback((b: 'black' | 'white') => setBlank((cur) => (cur === b ? null : b)), [])
  const toggleFreeze = useCallback(() => setFrozen((f) => (f ? null : { ...pos.current })), [])
  const release = useCallback(() => setFrozen(null), [])

  useEffect(() => {
    if (overview) setFrozen(null)
  }, [overview])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!hotkeyOk(e)) return
      const k = e.key.toLowerCase()
      if (k === 'b' || k === 'w') {
        e.preventDefault()
        toggleBlank(k === 'b' ? 'black' : 'white')
      } else if (k === 'h' && !overview) {
        e.preventDefault()
        toggleFreeze()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [overview, toggleBlank, toggleFreeze])

  return { blank, frozen, toggleBlank, toggleFreeze, release }
}

// Live-only layers that never belong in the frozen picture.
const LIVE_ONLY = '.controls, .feat-pill, .ink-capture, .zoom-capture, .key-help'
// Theme variables the frozen copy pins, so a later dark or accent slide cannot recolour it.
const PINNED = ['--canvas', '--letterbox', '--card', '--card-hover', '--panel', '--ink', '--ink-2', '--mute', '--faint', '--line', '--line-strong', '--accent', '--accent-base', '--accent-ink', '--accent-wash', '--accent-rgb', '--accent-soft']

/**
 * A static copy of the stage as it is right now: canvases keep their pixels,
 * ids are renamed so SVG gradients keep resolving after the live slide changes.
 */
function snapshot(stage: HTMLElement) {
  // Tag live elements so the copy can pair each animation with its source.
  const live = new Map<string, Element>()
  const mark = (el: Element, i: number) => {
    const key = String(i)
    el.setAttribute('data-freeze-key', key)
    live.set(key, el)
  }
  mark(stage, 0)
  let n = 0
  stage.querySelectorAll('*').forEach((el) => mark(el, ++n))
  const copy = stage.cloneNode(true) as HTMLElement
  live.forEach((el) => el.removeAttribute('data-freeze-key'))
  const from = stage.querySelectorAll('canvas')
  copy.querySelectorAll('canvas').forEach((c, i) => {
    try {
      if (from[i]?.width && from[i].height) c.getContext('2d')?.drawImage(from[i], 0, 0)
    } catch {
      /* tainted or WebGL canvas: leave it blank */
    }
  })
  copy.querySelectorAll(LIVE_ONLY).forEach((el) => el.remove())
  const ids = new Map<string, string>()
  copy.querySelectorAll<HTMLElement>('[id]').forEach((el) => {
    const id = `${el.id}--frozen`
    ids.set(el.id, id)
    el.id = id
  })
  if (ids.size)
    copy.querySelectorAll('*').forEach((el) => {
      for (const a of [...el.attributes]) {
        if (!a.value.includes('#')) continue
        let v = a.value.replace(/url\(\s*(['"]?)#([^'")\s]+)\1\s*\)/g, (m, q: string, id: string) => (ids.has(id) ? `url(${q}#${ids.get(id)}${q})` : m))
        if ((a.name === 'href' || a.name === 'xlink:href') && v.startsWith('#') && ids.has(v.slice(1))) v = `#${ids.get(v.slice(1))}`
        if (v !== a.value) el.setAttribute(a.name, v)
      }
    })
  copy.classList.add('p5-static')
  copy.removeAttribute('id')

  const layer = document.createElement('div')
  layer.className = 'viewport screen-frozen'
  layer.setAttribute('aria-hidden', 'true')
  layer.inert = true
  // The copy lives outside <body>, so the live slide's tone (set on body) cannot reach it.
  if (document.body.dataset.tone) layer.dataset.tone = document.body.dataset.tone
  const cs = getComputedStyle(document.body)
  const names = new Set(PINNED)
  for (let i = 0; i < cs.length; i++) if (cs[i].startsWith('--')) names.add(cs[i])
  names.forEach((n) => {
    const v = cs.getPropertyValue(n)
    if (v && n !== '--u') layer.style.setProperty(n, v)
  })
  layer.appendChild(copy)
  return { layer, live }
}

/**
 * The copy restarts its CSS animations when it enters the document. Pause each
 * of them at the live element's current time, so the frozen picture is a still
 * frame instead of a second, slowly drifting copy.
 */
function freezeCopy(layer: HTMLElement, live: Map<string, Element>) {
  const copy = layer.firstElementChild
  if (!copy) return
  for (const el of [copy, ...copy.querySelectorAll('*')]) {
    const key = el.getAttribute('data-freeze-key')
    if (key) el.removeAttribute('data-freeze-key')
    const animations = el.getAnimations()
    const source = key ? (live.get(key)?.getAnimations() ?? []) : []
    animations.forEach((a, i) => {
      const time = source[i]?.currentTime
      a.pause()
      if (typeof time === 'number') {
        try {
          a.currentTime = time
        } catch {
          /* an animation without a usable current time stays paused at its start */
        }
      }
    })
  }
}

/** The blank screen and the frozen picture, both above everything on the page. */
export function ScreenLayer({ blank, frozen }: { blank: Blank; frozen: Frozen }) {
  // Copy the stage the moment the freeze starts; drop it when the freeze ends.
  useLayoutEffect(() => {
    if (!frozen) return
    const stage = stageEl()
    if (!stage) return
    const { layer, live } = snapshot(stage)
    document.documentElement.appendChild(layer)
    freezeCopy(layer, live)
    return () => layer.remove()
  }, [frozen])

  if (!blank) return null
  return createPortal(<div className="screen-blank" data-blank={blank} aria-hidden />, document.body)
}
