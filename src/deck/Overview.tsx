import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'motion/react'
import { DeckContext } from './context'
import { EASE_OUT, pad2 } from './motion'
import { DESIGN_W, UnitScope } from './Stage'
import type { SlideDef } from './Deck'
import { themeVars, toneOf, type DeckStyle, type ThemeName } from '../kit/theme'

const noop = () => {}

/** G: every slide as a live thumbnail. Arrows move, Enter opens, Esc or G closes. */
export function Overview({
  title,
  slides,
  theme,
  style,
  current,
  onPick,
  onClose,
}: {
  title: string
  slides: SlideDef[]
  theme?: ThemeName
  style?: DeckStyle
  current: number
  onPick: (i: number) => void
  onClose: () => void
}) {
  const grid = useRef<HTMLOListElement>(null)
  const [u, setU] = useState(0)
  const [sel, setSel] = useState(current)
  const [cols, setCols] = useState(5)

  useLayoutEffect(() => {
    const el = grid.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      const first = el.querySelector<HTMLElement>('.ov__screen')
      if (first) setU(first.clientWidth / DESIGN_W)
      setCols(getComputedStyle(el).gridTemplateColumns.split(' ').length)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    grid.current?.querySelector<HTMLElement>(`[data-i="${current}"]`)?.scrollIntoView({ block: 'center' })
  }, [current])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key
      const move = (d: number) => {
        e.preventDefault()
        setSel((s) => {
          const n = Math.max(0, Math.min(slides.length - 1, s + d))
          grid.current?.querySelector<HTMLElement>(`[data-i="${n}"]`)?.scrollIntoView({ block: 'nearest' })
          return n
        })
      }
      if (k === 'Escape' || k.toLowerCase() === 'g') {
        e.preventDefault()
        onClose()
      } else if (k === 'Enter' || k === ' ') {
        e.preventDefault()
        onPick(sel)
      } else if (k === 'ArrowRight') move(1)
      else if (k === 'ArrowLeft') move(-1)
      else if (k === 'ArrowDown') move(cols)
      else if (k === 'ArrowUp') move(-cols)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [sel, cols, slides.length, onPick, onClose])

  return createPortal(
    <motion.div
      className="ov"
      data-tone="light"
      style={themeVars(theme, style)}
      role="dialog"
      aria-label="全部页面"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.24, ease: EASE_OUT }}
    >
      <div className="ov__bar">
        <span>
          <b>{title}</b> · 全部 {slides.length} 页
        </span>
        <span>
          <kbd>←</kbd>
          <kbd>→</kbd> 选择 · <kbd>Enter</kbd> 打开 · <kbd>Esc</kbd> 返回
        </span>
      </div>
      <DeckContext.Provider value={{ index: -1, total: slides.length, go: noop, hintSlot: null, arriving: [] }}>
        <ol className="ov__grid" ref={grid}>
          {slides.map((s, i) => (
            <motion.li key={s.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE_OUT, delay: Math.min(i, 20) * 0.02 }}>
              <div
                role="button"
                tabIndex={-1}
                data-i={i}
                className={`ov__item${i === current ? ' is-current' : ''}${i === sel ? ' is-sel' : ''}`}
                onClick={() => onPick(i)}
                onMouseEnter={() => setSel(i)}
              >
                <div className="ov__screen">
                  {u > 0 && (
                    <UnitScope u={u}>
                      <div className="stage ov__stage" data-tone={toneOf(s.tone, style) ?? 'light'} style={{ '--u': `${u}px` } as CSSProperties} inert>
                        <div className="slide-frame">{s.render()}</div>
                      </div>
                    </UnitScope>
                  )}
                </div>
                <span className="ov__label">
                  <b>{pad2(i + 1)}</b> {s.label}
                </span>
              </div>
            </motion.li>
          ))}
        </ol>
      </DeckContext.Provider>
    </motion.div>,
    document.body,
  )
}
