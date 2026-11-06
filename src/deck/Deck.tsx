import type { EmojiStyle } from '../emoji'
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { EASE_OUT, pad2 } from './motion'
import { DeckContext, useDeck } from './context'
import { morph } from './morph'
import { markUnsettled, settleEnabled, settleWhenIdle } from './settled'
import { Controls } from './Controls'
import { Credit, creditOn } from '../engine/attribution'
import { Overview } from './Overview'
import { DeckFeatures, frameMotion, type Texture, type Transition } from './features'
import { BackdropLayer, type Backdrop } from './features/backdrop'
import { IconStyleProvider, type IconStyle } from '../kit/Icon'
import { DEFAULT_STYLE, themeVars, toneOf, type DeckStyle, type SlideTone, type ThemeName } from '../kit/theme'

export { useDeck }

/**
 * How a slide's `data-build` items appear when you arrive with → or Space:
 * 'reveal' shows them one by one; 'focus' also dims the ones already covered.
 */
export type BuildMode = 'reveal' | 'focus'

export interface SlideDef {
  id: string
  /** Section name shown in the header and the progress tooltip. */
  label: string
  /** Returns one kit template (or any element rendering a `section.slide`). */
  render: () => ReactNode
  /** Step through the template's items with →. Jumps (hash, progress bar, agenda, overview) still open the slide fully built. */
  build?: BuildMode
  /** 'dark' turns the whole stage dark; 'accent' fills it with the theme colour; 'light' opts out of a dark style. Only for the templates listed in docs/README.md §13. */
  tone?: SlideTone
  /** Speaker notes, shown only in the presenter view (S). Plain text, any length. */
  notes?: string
  /** Planned speaking time for this slide in seconds. The presenter view's rehearsal timer compares it with the actual time. */
  seconds?: number
  /** Overrides DeckDef.backdrop for this slide; 'none' turns it off. */
  backdrop?: Backdrop
}

export interface DeckDef {
  /** Shown top-left on every slide. */
  title: string
  slides: SlideDef[]
  /** Solar icon series for every icon in the deck. Defaults to 'line-duotone'. */
  iconStyle?: IconStyle
  /** Emoji set for any emoji typed in the text: fluent (default), flat or noto. */
  emojiStyle?: EmojiStyle
  /** Accent palette from kit/theme.ts. Defaults to 'crimson'. */
  theme?: ThemeName
  /** Display face for headings and big numbers (kit/theme.ts STYLES). Defaults to 'standard'. */
  style?: DeckStyle
  /** Film texture laid over every slide. Defaults to 'none'. */
  texture?: Texture
  /** How one slide hands over to the next. Defaults to 'fade'. */
  transition?: Transition
  /** Decorative layer behind every slide: dots / mesh / paper / particles / grid. Defaults to 'none'. */
  backdrop?: Backdrop
  /** The "Made with PCafe" credit on the first and last slide and in the controls. `false` hides it; needs PCafe Pro (LICENSE, Exhibit B). */
  attribution?: boolean
}

const readHash = (total: number) => {
  const n = Number(location.hash.match(/^#\/(\d+)/)?.[1])
  return Number.isInteger(n) && n >= 1 && n <= total ? n - 1 : 0
}

/**
 * Build steps in DOM order. A bare `data-build` is its own step; elements that
 * share a value (`data-build={row}`) step together, e.g. the cells of one row.
 */
function buildGroups(root: HTMLElement) {
  const items = [...root.querySelectorAll<HTMLElement>('[data-build]')]
  const ids: string[] = []
  const group = items.map((el, k) => {
    const id = el.dataset.build || `#${k}`
    if (!ids.includes(id)) ids.push(id)
    return ids.indexOf(id)
  })
  return { items, group, count: ids.length }
}

interface Pos {
  index: number
  /** Items revealed so far; null = fully built, no build styling. */
  step: number | null
  /** data-morph keys present on the slide we came from. */
  arriving: string[]
  /** 1 = moved forward, -1 = moved back; drives directional transitions. */
  dir: 1 | -1
}

/**
 * Sequential 16:9 deck. Keys: ←/→, PageUp/PageDown, Space, Home/End, G (overview).
 * A slide that owns the keyboard (e.g. an open Bento detail) calls
 * preventDefault() or stops propagation, and the deck leaves the event alone.
 */
/** `steps`: embed only — open with the first slide's build steps pending instead of finished. */
export function Deck({ title, slides, iconStyle, theme, style = DEFAULT_STYLE, texture = 'none', transition = 'fade', backdrop = 'none', attribution, steps = false }: DeckDef & { steps?: boolean }) {
  const total = slides.length
  const credit = creditOn(attribution)
  const [pos, setPos] = useState<Pos>(() => {
    const index = readHash(total)
    return { index, step: steps && slides[index]?.build ? 0 : null, arriving: [], dir: 1 }
  })
  const [hintSlot, setHintSlot] = useState<HTMLElement | null>(null)
  const [frame, setFrame] = useState<{ el: HTMLElement; id: string } | null>(null)
  const [builds, setBuilds] = useState(0)
  const [overview, setOverview] = useState(false)
  // True while the audience screen is blanked or frozen: autoplay waits.
  const [held, setHeld] = useState(false)
  const layer = useRef<HTMLDivElement>(null)
  const current = useRef<HTMLElement | null>(null)
  const { index, step } = pos
  // Count visits so a slide revisited while its old frame is still exiting gets a
  // new frame instead of reviving the exiting one (which skips frameRef: no
  // settle signal, build count or morph for the revived frame).
  const visit = useRef({ index, n: 0 })
  if (visit.current.index !== index) visit.current = { index, n: visit.current.n + 1 }
  const slide = slides[index]

  const go = useCallback(
    (i: number, from: 'start' | 'full' = 'full') => {
      const j = Math.max(0, Math.min(total - 1, i))
      if (j !== index) markUnsettled(current.current)
      const keys = [...(current.current?.querySelectorAll<HTMLElement>('[data-morph]') ?? [])].map((el) => el.dataset.morph!)
      setPos((p) => (p.index === j ? p : { index: j, step: from === 'start' && slides[j].build ? 0 : null, arriving: keys, dir: j > p.index ? 1 : -1 }))
    },
    [total, slides, index],
  )
  const jump = useCallback((i: number) => go(i), [go])

  // Each new frame: remember it, count its build items, and carry shared elements over from the old one.
  const frameRef = useCallback((el: HTMLDivElement | null) => {
    if (!el) return
    current.current = el
    markUnsettled(el)
    setFrame({ el, id: el.dataset.slide! })
    setBuilds(buildGroups(el).count)
    if (layer.current) morph(el, layer.current)
  }, [])

  // Publish `data-settled` on the current frame: tests wait for this instead of a fixed delay.
  useEffect(() => {
    const el = frame?.el
    if (!el || frame.id !== slide.id || !settleEnabled()) return
    return settleWhenIdle(el.parentElement ?? el, el)
  }, [frame, slide.id, step])

  useEffect(() => {
    history.replaceState(null, '', `#/${index + 1}`)
  }, [index])

  useEffect(() => {
    document.title = title
  }, [title])

  // The accent lives on the root so the letterbox and header pick it up too.
  useLayoutEffect(() => {
    const root = document.documentElement.style
    const v = Object.entries(themeVars(theme, style))
    for (const [k, val] of v) root.setProperty(k, String(val))
    return () => v.forEach(([k]) => root.removeProperty(k))
  }, [theme, style])

  useLayoutEffect(() => {
    document.documentElement.dataset.style = style
    return () => void delete document.documentElement.dataset.style
  }, [style])

  // Tone sits on <body> so it overrides the root's inline theme variables.
  useLayoutEffect(() => {
    const tone = toneOf(slide.tone, style)
    if (tone) document.body.dataset.tone = tone
    else delete document.body.dataset.tone
  }, [slide.tone, style])
  useEffect(() => () => void delete document.body.dataset.tone, [])

  // Build states, applied straight to the DOM so templates only need a data-build attribute.
  useLayoutEffect(() => {
    if (!frame || frame.id !== slide.id) return
    const { items, group } = buildGroups(frame.el)
    items.forEach((el, k) => {
      const i = group[k]
      let state = ''
      if (step !== null && slide.build) {
        if (i >= step) state = 'pending'
        else if (slide.build === 'focus') state = i === step - 1 ? 'current' : 'past'
      }
      if (state) el.dataset.buildState = state
      else delete el.dataset.buildState
    })
  }, [frame, step, slide])

  useEffect(() => {
    const onHash = () => {
      if (location.hash.startsWith('#/kit')) return
      const n = readHash(total)
      if (n !== index) go(n)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [total, index, go])

  const building = Boolean(slide.build) && step !== null
  const forward = useCallback(() => {
    if (building && step! < builds) {
      markUnsettled(current.current)
      setPos((p) => ({ ...p, step: step! + 1 }))
    } else go(index + 1, 'start')
  }, [building, step, builds, go, index])
  const back = useCallback(() => {
    if (building && step! > 0) {
      markUnsettled(current.current)
      setPos((p) => ({ ...p, step: step! - 1 }))
    } else go(index - 1)
  }, [building, step, go, index])

  useEffect(() => {
    if (overview) return
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return
      const t = e.target as HTMLElement
      if (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return
      const onControl = t.tagName === 'BUTTON' || t.getAttribute('role') === 'button'
      if (e.key.toLowerCase() === 'g') {
        e.preventDefault()
        setOverview(true)
        return
      }
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || (e.key === ' ' && !onControl)) {
        e.preventDefault()
        forward()
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        back()
      } else if (e.key === 'Home') {
        e.preventDefault()
        go(0)
      } else if (e.key === 'End') {
        e.preventDefault()
        go(total - 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [total, go, overview, forward, back])

  return (
    <IconStyleProvider value={iconStyle}>
      <DeckContext.Provider value={{ index, total, go: jump, hintSlot, arriving: pos.arriving }}>
        <header className="slide-header">
          <div className="slide-header__mark">
            <span className="slide-header__dot" />
            <span>{title}</span>
            <span className="slide-header__sep" />
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={slide.id}
                className="slide-header__muted"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: EASE_OUT }}
              >
                {slide.label}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="slide-header__hint" ref={setHintSlot} />
          <div className="slide-header__page" aria-live="polite">
            {slide.build && step !== null && builds > 0 && (
              <span className="slide-header__steps" aria-label={`第 ${step} / ${builds} 项`}>
                {Array.from({ length: builds }, (_, i) => (
                  <i key={i} className={i < step ? 'is-on' : undefined} />
                ))}
              </span>
            )}
            {credit && (index === 0 || index === total - 1) && (
              <>
                <Credit className="slide-header__credit" />
                <span className="slide-header__muted" aria-hidden>·</span>
              </>
            )}
            <span>{pad2(index + 1)}</span>
            <span className="slide-header__muted">/ {pad2(total)}</span>
          </div>
        </header>

        <BackdropLayer backdrop={slide.backdrop ?? backdrop} />
        {/* Frames overlap while one leaves and the next arrives, so shared elements can be measured in both. */}
        <AnimatePresence initial={false}>
          <motion.div
            key={`${slide.id}-${index}-${visit.current.n}`}
            ref={frameRef}
            className="slide-frame"
            data-slide={slide.id}
            data-slide-number={index + 1}
            {...frameMotion(transition, pos.dir)}
          >
            {slide.render()}
          </motion.div>
        </AnimatePresence>
        <div className="morph-layer" ref={layer} aria-hidden />

        <nav className="progress" aria-label="页面导航">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              tabIndex={-1}
              className={`progress__seg${i === index ? ' is-current' : ''}${i < index ? ' is-past' : ''}`}
              aria-label={`第 ${i + 1} 页：${s.label}`}
              aria-current={i === index ? 'page' : undefined}
              data-slide-id={s.id}
              data-notes={s.notes?.trim() ? '' : undefined}
              data-seconds={s.seconds}
              onClick={() => go(i)}
            >
              <span className="progress__tip">
                {pad2(i + 1)} {s.label}
              </span>
            </button>
          ))}
        </nav>
      </DeckContext.Provider>
      <DeckFeatures title={title} slides={slides} index={index} step={step} builds={builds} texture={texture} overview={overview} go={jump} onHold={setHeld} />
      {/* Stays mounted under the overview so autoplay pauses there instead of stopping. */}
      <Controls credit={credit} hidden={overview} paused={overview || held} onPrev={back} onNext={forward} onOverview={() => setOverview(true)} atEnd={index === total - 1 && !(building && step! < builds)} />
      {overview && (
        <Overview
          title={title}
          slides={slides}
          theme={theme}
          style={style}
          current={index}
          onPick={(i) => {
            setOverview(false)
            go(i)
          }}
          onClose={() => setOverview(false)}
        />
      )}
    </IconStyleProvider>
  )
}

/** Slide-specific instruction rendered in the header's centre slot. */
export function HeaderHint({ hintKey, children }: { hintKey: string; children: ReactNode }) {
  const { hintSlot } = useDeck()
  if (!hintSlot) return null
  return createPortal(
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={hintKey}
        className="slide-header__hint-inner"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.22, ease: EASE_OUT }}
      >
        {children}
      </motion.span>
    </AnimatePresence>,
    hintSlot,
  )
}
