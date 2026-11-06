// Decorative pieces for the mono-studio and sticker styles. Not slides on
// their own; templates place them. None of them carries facts.

import type { ReactNode } from 'react'
import type { Spot } from './parts'
import { vars } from './shared'

/** Thin L-shaped marks at the four corners of whatever it wraps (a viewfinder). */
export function CornerFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={`cframe${className ? ` ${className}` : ''}`}>
      <i aria-hidden />
      <i aria-hidden />
      <i aria-hidden />
      <i aria-hidden />
      {children}
    </div>
  )
}

/** A row of names as greyscale pills: tools, partners, teams. Text only, never logos. */
export function NameStrip({ names }: { names: string[] }) {
  return (
    <ul className="names">
      {names.map((n) => (
        <li key={n}>{n}</li>
      ))}
    </ul>
  )
}

/** A small chat bubble with an initial avatar, e.g. an invitation to talk. */
export function ChatBubble({ name, text }: { name: string; text: string }) {
  return (
    <div className="chat">
      <span className="chat__avatar" aria-hidden>
        {name.slice(0, 1)}
      </span>
      <div className="chat__bubble">
        <b>{name}</b>
        <span>{text}</span>
      </div>
    </div>
  )
}

/** The selection box of a design tool around its child: outline plus four square handles. */
export function SelectBox({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <span className="sel">
      {children}
      <i aria-hidden />
      <i aria-hidden />
      <i aria-hidden />
      <i aria-hidden />
      {label && (
        <span className="sel__label" aria-hidden>
          {label}
        </span>
      )}
    </span>
  )
}

/** A mouse pointer, drawn as the usual arrow cursor. */
export function Cursor({ spot = 1 }: { spot?: Spot }) {
  return (
    <svg className="cursor" viewBox="0 0 20 28" style={vars({ '--c': `var(--spot-${spot})` })} aria-hidden>
      <path d="M2 2 L2 23 L7.5 17.5 L11.5 26 L15 24.4 L11 16 L18.5 16 Z" />
    </svg>
  )
}

/** A tilted sticker: bold label on a spot colour, black outline and hard shadow; optionally with a pointer. */
export function Sticker({ children, spot = 5, tilt = -4, pointer }: { children: ReactNode; spot?: Spot; tilt?: number; pointer?: boolean }) {
  return (
    <span className={`sticker sticker--s${spot}`} style={vars({ '--tilt': `${tilt}deg` })}>
      {children}
      {pointer && <Cursor spot={spot} />}
    </span>
  )
}

/** A handwritten-style note with a curved arrow pointing down-left at what it annotates. */
export function Scribble({ text }: { text: string }) {
  return (
    <span className="scribble">
      <span className="scribble__text">{text}</span>
      <svg className="scribble__arrow" viewBox="0 0 120 70" aria-hidden>
        <path d="M110 8 C 92 44, 54 60, 12 52" />
        <path d="M26 41 L12 52 L28 62" />
      </svg>
    </span>
  )
}

/** A file name tag for the corner of an image, e.g. 'KIT.WEBP'. */
export function FileTag({ name }: { name: string }) {
  return <span className="filetag">{name}</span>
}

/** An instant photo: white frame, a real screenshot, a caption in the wide bottom margin. */
export function Polaroid({ src, alt, caption, file, tilt = 4 }: { src: string; alt: string; caption?: string; file?: string; tilt?: number }) {
  return (
    <figure className="polaroid" style={vars({ '--tilt': `${tilt}deg` })}>
      <div className="polaroid__img" data-crop>
        <img src={src} alt={alt} draggable={false} />
        {file && <FileTag name={file} />}
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}
