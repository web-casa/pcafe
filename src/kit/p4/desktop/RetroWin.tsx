import type { ReactNode } from 'react'

/** Chunky retro window chrome: striped title bar, square close box, bold black border, hard shadow. */
export function RetroWin({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={`rw${className ? ` ${className}` : ''}`}>
      <div className="rw__bar">
        <i className="rw__box" aria-hidden />
        <span className="rw__title">{title}</span>
        <i className="rw__box rw__box--max" aria-hidden />
      </div>
      <div className="rw__body">{children}</div>
    </div>
  )
}
