import type { CSSProperties } from 'react'
import { graphemes } from '../../../emoji/render'

/** Splits `text` into one span per character, each carrying its index as `--i` (for staggered CSS animations). The text stays real, selectable text. */
export function Chars({ text, start = 0, className = 'x2-ch' }: { text: string; start?: number; className?: string }) {
  return (
    <>
      {graphemes(text).map((c, k) => (
        <span key={k} className={className} style={{ '--i': start + k } as CSSProperties}>
          {c}
        </span>
      ))}
    </>
  )
}
