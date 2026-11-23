import type { ReactNode } from 'react'
import { Photo, type PhotoImage } from '../../v2/p1/img'

/** One framed picture on the right-hand rail. */
export interface FolioFrame {
  image: PhotoImage
  /** Mono chip on the frame, e.g. "01", ≤ 4 个字符. */
  tag?: string
  /** Caption chip beside the tag, ≤ 14 字. */
  caption?: string
}

export interface FolioRailProps {
  frames: FolioFrame[]
  /** Which frame is in focus. */
  focus: number
  /** Called when a tick or a peeking frame is clicked. */
  onFocus?: (i: number) => void
  /** Frame height in px at 1920 wide. */
  height?: number
  /** 'center' keeps the focus frame mid-slide; 'top' pins it to the top of the rail window. */
  align?: 'center' | 'top'
  /** Replaces the picture of the focus frame (a card, a slot…). */
  children?: ReactNode
  /** Extra frame drawn in place of frame `slotAt` instead of a picture. */
  slotAt?: number
}

const GAP = 16
/** Height of the rail window: between the slide header (92) and the progress bar (1020). */
const WINDOW = 928

/** A column of white-framed pictures that slides so the focus frame sits in view; neighbours peek in above and below. */
export function FolioRail({ frames, focus, onFocus, height = 720, align = 'center', children, slotAt }: FolioRailProps) {
  const top = align === 'top' ? 24 : WINDOW / 2 - height / 2
  const shift = top - focus * (height + GAP)
  const count = frames.length + (slotAt === undefined ? 0 : 1)
  return (
    <div className="fo-rail" data-crop>
      <div className="fo-rail__track" style={{ transform: `translateY(calc(${shift} * var(--u)))` }}>
        {Array.from({ length: count }, (_, i) => {
          const isSlot = slotAt === i
          const f = isSlot ? undefined : frames[slotAt !== undefined && i > slotAt ? i - 1 : i]
          const on = i === focus
          return (
            <div
              key={i}
              className={`fo-frame${on ? ' is-on' : ''}${isSlot ? ' is-slot' : ''}`}
              style={{
                height: `calc(${height} * var(--u))`,
                animationDelay: `${0.15 + Math.abs(i - focus) * 0.12}s`,
              }}
              onClick={on || !onFocus ? undefined : () => onFocus(i)}
              aria-hidden={on ? undefined : true}
            >
              <div className="fo-frame__in">
                {isSlot ? children : f && <Photo image={f.image} />}
                {on && f && (f.tag || f.caption) && (
                  <div className="fo-cap">
                    {f.tag && <span className="is-tag">{f.tag}</span>}
                    {f.caption && <span>{f.caption}</span>}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      {count > 1 && (
        <div className="fo-ticks">
          {Array.from({ length: count }, (_, i) => (
            <button type="button" key={i} aria-label={`第 ${i + 1} 张`} className={i === focus ? 'is-on' : ''} onClick={() => onFocus?.(i)} />
          ))}
        </div>
      )}
    </div>
  )
}
