import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, type MotionValue } from 'motion/react'
import { useUnit } from './Stage'
import { EASE_OUT } from './motion'
import { useDeck } from './context'

/**
 * Staggered entrance. `i` orders siblings; nothing appears all at once.
 * `build` marks the element as one step of a SlideDef.build sequence; elements
 * given the same string step together.
 */
export function Reveal({
  i = 0,
  y = 22,
  delay = 0.14,
  build,
  className,
  style,
  children,
}: {
  i?: number
  y?: number
  delay?: number
  build?: boolean | string
  className?: string
  style?: CSSProperties
  children: ReactNode
}) {
  const u = useUnit()
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      style={style}
      data-build={build === true ? '' : build || undefined}
      initial={{ opacity: 0, y: reduce ? 0 : y * u }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduce ? { duration: 0.15 } : { duration: 0.9, ease: EASE_OUT, delay: delay + i * 0.075 }}
    >
      {children}
    </motion.div>
  )
}

export function Kicker({ children }: { children: ReactNode }) {
  return <p className="kicker">{children}</p>
}

export function Source({ children }: { children: ReactNode }) {
  return <p className="s-source">来源 · {children}</p>
}

export type Drift = { x: MotionValue<number>; y: MotionValue<number> }

const DRIFT_SPRING = { stiffness: 140, damping: 18, mass: 0.5 }

/** A display element that leans a few design units toward the mouse. */
export function usePointerDrift(rangeX = 22, rangeY = 14) {
  const u = useUnit()
  const reduce = useReducedMotion()
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const drift: Drift = { x: useSpring(px, DRIFT_SPRING), y: useSpring(py, DRIFT_SPRING) }
  const lean = (e: ReactPointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    px.set(((e.clientX - r.left) / r.width - 0.5) * rangeX * u)
    py.set(((e.clientY - r.top) / r.height - 0.5) * rangeY * u)
  }
  const settle = () => {
    px.set(0)
    py.set(0)
  }
  return { drift, lean, settle }
}

/**
 * Display numerals whose digits rise out of a mask on entry. With `morph`, the
 * numeral flies in from the previous slide's element of the same key instead.
 */
export function Numeral({ text, intro = true, drift, delay = 0.3, morph }: { text: string; intro?: boolean; drift?: Drift; delay?: number; morph?: string }) {
  const { arriving } = useDeck()
  if (morph && arriving.includes(morph)) intro = false
  return (
    <motion.span className="numeral__drift" style={drift} data-morph={morph}>
      {[...text].map((d, i) => (
        <span className="numeral__mask" key={i}>
          <motion.span
            className="numeral__digit"
            initial={intro ? { y: '105%' } : false}
            animate={{ y: '0%' }}
            transition={{ duration: 1.1, ease: EASE_OUT, delay: delay + i * 0.09 }}
          >
            {d}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}

export function Cmd({ children }: { children: ReactNode }) {
  return (
    <code className="cmd">
      <span className="t-prompt">#</span>
      {children}
    </code>
  )
}
