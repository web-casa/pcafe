import { useEffect, useState } from 'react'
import type { PhotoImage } from '../../v2/p1/img'

/** One picture on the big left-hand plate. */
export interface DiptychShot {
  image: PhotoImage
  /** Caption title, ≤ 8 字. */
  title?: string
  /** Caption line under it, e.g. "视觉设计 · 2026", ≤ 14 字. */
  meta?: string
}

export interface DiptychPlateProps {
  shots: DiptychShot[]
  /** Shot in view. */
  index: number
  onIndex: (i: number) => void
  /** Handwritten-style Latin signature in the top-left corner, ≤ 12 个字符. */
  signature?: string
  /** Advance on its own every N ms; 0 turns it off. */
  autoplay?: number
}

/** The tall picture card on the left: shots cross-fade with a slow push-in, the caption swaps, and the bars along the foot fill while each shot is on. */
export function DiptychPlate({ shots, index, onIndex, signature, autoplay = 0 }: DiptychPlateProps) {
  const n = shots.length
  const [tick, setTick] = useState(0)
  useEffect(() => {
    if (!autoplay || n < 2) return
    const t = window.setTimeout(() => onIndex((index + 1) % n), autoplay)
    return () => window.clearTimeout(t)
  }, [autoplay, index, n, onIndex, tick])
  const go = (i: number) => {
    setTick((k) => k + 1)
    onIndex(i)
  }
  const s = shots[index] ?? shots[0]
  return (
    <div className="dp-plate" data-crop>
      {shots.map((sh, i) => (
        <img
          key={sh.image.src + i}
          className={i === index ? 'is-on' : ''}
          src={sh.image.src}
          alt={i === index ? sh.image.alt : ''}
          aria-hidden={i === index ? undefined : true}
          draggable={false}
          style={{ objectPosition: sh.image.focus ?? 'center' }}
        />
      ))}
      <i className="dp-plate__veil" />
      {signature && (
        <span className="dp-sig" aria-hidden="true">
          {signature}
        </span>
      )}
      {s.image.credit && <span className="dp-credit">{s.image.credit}</span>}
      {(s.title || s.meta) && (
        <div className="dp-cap" key={index}>
          {s.title && <b>{s.title}</b>}
          {s.meta && <small>{s.meta}</small>}
        </div>
      )}
      {n > 1 && (
        <>
          <button type="button" className="dp-next" aria-label="下一张" onClick={() => go((index + 1) % n)}>
            →
          </button>
          <div className="dp-bars">
            {shots.map((_, i) => (
              <button type="button" key={i} aria-label={`第 ${i + 1} 张`} className={i === index ? 'is-on' : i < index ? 'is-done' : ''} onClick={() => go(i)}>
                <i key={i === index ? `${index}-${tick}` : 'x'} style={autoplay ? { animationDuration: `${autoplay}ms` } : { animation: 'none', transform: 'none' }} />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/** Splits a line so the words in `soft` come out grey. */
export function Soft({ line, soft }: { line: string; soft?: string }) {
  if (!soft || !line.includes(soft)) return <>{line}</>
  const [a, ...rest] = line.split(soft)
  return (
    <>
      {a}
      <span className="dp-soft">{soft}</span>
      {rest.join(soft)}
    </>
  )
}
