import type { CSSProperties } from 'react'
import type { PhotoImage } from '../../v2/p1/img'

/** A photo with a short handwritten-style caption, shown as a print with a wide bottom border. */
export interface AlbumPrint {
  image: PhotoImage
  /** ≤ 8 字. */
  caption?: string
}

export function Print({ print, className = '', style, hideAlt }: { print: AlbumPrint; className?: string; style?: CSSProperties; hideAlt?: boolean }) {
  return (
    <figure className={`al-print ${className}`} style={style}>
      <img src={print.image.src} alt={hideAlt ? '' : print.image.alt} draggable={false} style={{ objectPosition: print.image.focus ?? 'center' }} />
      {print.caption && <figcaption>{print.caption}</figcaption>}
    </figure>
  )
}

/** Warm sunrise glow behind the content; `at` moves its centre. */
export function Glow({ at = 'top' }: { at?: 'top' | 'right' | 'center' }) {
  return <i className={`al-glow is-${at}`} aria-hidden="true" />
}

/** Splits `title` so the word `soft` is set in an italic serif with a warm gradient. */
export function Grad({ line, word }: { line: string; word?: string }) {
  if (!word || !line.includes(word)) return <>{line}</>
  const i = line.lastIndexOf(word)
  return (
    <>
      {line.slice(0, i)}
      <span className="al-grad">{word}</span>
      {line.slice(i + word.length)}
    </>
  )
}
