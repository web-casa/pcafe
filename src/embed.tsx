// Runs real decks inside an <iframe> on the website.
//   embed.html?deck=v3-p3&theme=crimson#/4   the whole deck, playable
//   embed.html?deck=v3-p3&n=4&part=main&fit=cover&ax=0&ay=.5&pad=24&bg=none
//     one block of one slide, filling the frame at real scale
// The parent can restyle it live: postMessage({ theme, style }) or press keys: postMessage({ key }).
// steps=1 opens a slide with its build steps pending; postMessage({ replay: true }) starts it over.
import { StrictMode, useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import { Stage, UnitScope, applyUnit, fitUnit } from './deck/Stage'
import { Deck } from './deck/Deck'
import type { DeckDef } from './kit'
import './styles'
import './styles/embed.css'

const q = new URLSearchParams(location.search)
const decks = import.meta.glob<{ deck: DeckDef }>('./decks/*/index.tsx')

const num = (name: string, fallback: number) => {
  const v = Number(q.get(name))
  return q.has(name) && Number.isFinite(v) ? v : fallback
}

/** The frame's main block, skipping its title and source; or a selector. */
function findPart(part: string): Element | null {
  if (part !== 'main') return document.querySelector(part)
  const frame = document.querySelector('.slide .frame')
  return [...(frame?.children ?? [])].find((c): c is HTMLElement => c instanceof HTMLElement && !c.matches('.s-head,.s-foot,[class*="__head"]') && c.offsetHeight > 80) ?? null
}

/** Hides everything on the slide except this part, so nothing leaks in beside it. */
function isolate(el: Element) {
  for (let n: Element | null = el; n && !n.classList.contains('slide-frame'); n = n.parentElement) {
    for (const sib of n.parentElement?.children ?? []) if (sib !== n) sib.setAttribute('data-embed-off', '')
  }
}

/** Position inside the stage, read from layout so entrance animations don't skew it. */
function layoutBox(el: Element) {
  if (!(el instanceof HTMLElement)) {
    const stage = document.querySelector('.stage')!.getBoundingClientRect()
    const r = el.getBoundingClientRect()
    return { x: r.x - stage.x, y: r.y - stage.y, w: r.width, h: r.height }
  }
  let x = 0
  let y = 0
  let n: HTMLElement | null = el
  while (n && !n.classList.contains('stage')) {
    x += n.offsetLeft
    y += n.offsetTop
    n = n.offsetParent as HTMLElement | null
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight }
}

/** One part of a slide, sized through --u so it stays sharp and interactive. */
function Part({ deck, part }: { deck: DeckDef; part: string }) {
  const [view, setView] = useState({ u: 1, x: 0, y: 0, ready: false })
  const fit = q.get('fit') ?? 'contain'
  const pad = num('pad', 0)
  const ax = num('ax', 0.5)
  const ay = num('ay', 0.5)

  const measure = useCallback(() => {
    const el = findPart(part)
    if (!el) return false
    isolate(el)
    const cur = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--u')) || 1
    const b = layoutBox(el)
    const box = { x: b.x / cur, y: b.y / cur, w: b.w / cur, h: b.h / cur }
    const W = window.innerWidth
    const H = window.innerHeight
    const sx = W / (box.w + pad * 2)
    const sy = H / (box.h + pad * 2)
    const u = fit === 'cover' ? Math.max(sx, sy) : Math.min(sx, sy)
    applyUnit(u)
    setView({ u, x: (W - box.w * u) * ax - box.x * u, y: (H - box.h * u) * ay - box.y * u, ready: true })
    return true
  }, [part, fit, pad, ax, ay])

  useLayoutEffect(() => {
    applyUnit(1)
    let raf = 0
    const tick = () => { if (!measure()) raf = requestAnimationFrame(tick) }
    tick()
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', measure)
    }
  }, [measure])

  return (
    <UnitScope u={view.u}>
      <div className="viewport" style={{ display: 'block', opacity: view.ready ? 1 : 0 }}>
        <main className="stage" style={{ position: 'absolute', left: view.x, top: view.y }}>
          <Deck {...deck} />
        </main>
      </div>
    </UnitScope>
  )
}

function App({ initial }: { initial: DeckDef }) {
  const [deck, setDeck] = useState(initial)
  const [run, setRun] = useState(0)
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== location.origin || typeof e.data !== 'object' || !e.data) return
      const { theme, style, key, replay } = e.data as { theme?: DeckDef['theme']; style?: DeckDef['style']; key?: string; replay?: boolean }
      if (replay) setRun((r) => r + 1)
      if (key) document.body.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
      if (theme || style) setDeck((d) => ({ ...d, ...(theme ? { theme } : {}), ...(style ? { style } : {}) }))
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])
  const part = q.get('part')
  if (part) return <Part deck={deck} part={part} />
  return <Stage><Deck key={run} {...deck} steps={q.get('steps') === '1'} /></Stage>
}

const root = document.documentElement
root.dataset.embed = q.has('part') ? 'part' : 'page'
if (q.get('bg') === 'none') root.dataset.bg = 'none'
applyUnit(fitUnit())

const load = decks[`./decks/${q.get('deck')}/index.tsx`]
const faces = ['500 1em Geist', '400 1em "Geist Mono"', 'italic 400 1em "Instrument Serif"', '400 1em "Deck Sans SC"', '500 1em "Deck Sans SC"']
void Promise.all([load?.(), ...faces.map((f) => document.fonts.load(f, 'Lumen 中文'))]).then(([m]) => {
  if (!m) return
  const n = num('n', 0)
  const base = m.deck
  const deck: DeckDef = {
    ...base,
    ...(n ? { slides: [base.slides[n - 1]].filter(Boolean) } : {}),
    ...(q.get('theme') ? { theme: q.get('theme') as DeckDef['theme'] } : {}),
    ...(q.get('style') ? { style: q.get('style') as DeckDef['style'] } : {}),
  }
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <MotionConfig reducedMotion="user">
        <App initial={deck} />
      </MotionConfig>
    </StrictMode>,
  )
})
