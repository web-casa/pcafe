import { motion, useReducedMotion } from 'motion/react'
import { EASE_OUT } from '../../deck/motion'
import { useUnit } from '../../deck/Stage'

/** Split into display units: each CJK char alone, latin words / numbers kept whole, spaces kept. */
export function splitChars(text: string): string[] {
  const seg = typeof Intl !== 'undefined' && 'Segmenter' in Intl ? new Intl.Segmenter('zh', { granularity: 'grapheme' }) : null
  const graphemes = seg ? [...seg.segment(text)].map((s) => s.segment) : [...text]
  const out: string[] = []
  for (const g of graphemes) {
    const prev = out[out.length - 1]
    const latin = /^[\p{L}\p{N}'’.%-]$/u.test(g) && !/\p{Script=Han}|\p{Script=Hiragana}|\p{Script=Katakana}|\p{Script=Hangul}/u.test(g)
    if (latin && prev && /[\p{L}\p{N}'’.%-]$/u.test(prev) && !/\p{Script=Han}/u.test(prev)) out[out.length - 1] = prev + g
    else out.push(g)
  }
  return out
}

/**
 * Text that appears character by character: each char rises out of a mask and fades in.
 * CJK aware (one char per step; latin words step as a whole). Screen readers get the
 * full text through aria-label; the split chars are aria-hidden.
 */
export function CharReveal({
  text,
  delay = 0.2,
  stagger = 0.045,
  className,
  as: Tag = 'span',
}: {
  text: string
  delay?: number
  /** Seconds between chars. */
  stagger?: number
  className?: string
  as?: 'span' | 'h2' | 'p'
}) {
  const u = useUnit()
  const reduce = useReducedMotion()
  const chars = splitChars(text)
  return (
    <Tag className={['char-reveal', className].filter(Boolean).join(' ')} aria-label={text} role={Tag === 'span' ? 'text' : undefined}>
      {chars.map((c, i) =>
        c === ' ' ? (
          <span key={i} aria-hidden className="char-reveal__space">
            {' '}
          </span>
        ) : (
          <span key={i} aria-hidden className="char-reveal__mask">
            <motion.span
              className="char-reveal__char"
              initial={{ opacity: 0, y: reduce ? 0 : 0.6 * 100 * u }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduce ? { duration: 0.15 } : { duration: 0.7, ease: EASE_OUT, delay: delay + i * stagger }}
            >
              {c}
            </motion.span>
          </span>
        ),
      )}
    </Tag>
  )
}
