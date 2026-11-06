import { EASE_OUT } from '../motion'

export type Transition = 'fade' | 'slide' | 'zoom' | 'wipe' | 'none'

const reduced = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/**
 * Motion props for the slide frame. `dir` is 1 going forward, -1 going back.
 * Frames overlap while the morph layer measures shared elements, so exits stay short
 * and never move the outgoing frame far (morph reads its rects at exit start).
 * Exits never depend on `dir`: AnimatePresence has no `custom`, so a leaving frame
 * only knows the direction it arrived with.
 */
export function frameMotion(t: Transition, dir: 1 | -1) {
  const kind = reduced() && t !== 'none' ? 'fade' : t
  switch (kind) {
    case 'none':
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0 } },
        exit: { opacity: 0, transition: { duration: 0 } },
      }
    case 'slide':
      return {
        initial: { opacity: 0, x: `${dir * 6}%` },
        animate: { opacity: 1, x: '0%', transition: { duration: 0.5, ease: EASE_OUT, delay: 0.06 } },
        // No x on exit: without AnimatePresence `custom` the leaving frame would drift the way it arrived.
        exit: { opacity: 0, transition: { duration: 0.2, ease: EASE_OUT } },
      }
    case 'zoom':
      return {
        initial: { opacity: 0, scale: 0.96 },
        animate: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: EASE_OUT, delay: 0.08 } },
        exit: { opacity: 0, scale: 1.02, transition: { duration: 0.2, ease: EASE_OUT } },
      }
    case 'wipe':
      return {
        initial: { clipPath: dir > 0 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)' },
        animate: { clipPath: 'inset(0 0% 0 0%)', transition: { duration: 0.55, ease: EASE_OUT, delay: 0.04 } },
        exit: { opacity: 0, transition: { duration: 0.25, ease: EASE_OUT, delay: 0.3 } },
      }
    default:
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.32, ease: EASE_OUT, delay: 0.1 } },
        exit: { opacity: 0, transition: { duration: 0.2, ease: EASE_OUT } },
      }
  }
}
