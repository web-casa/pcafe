import { useEffect, useRef, useState } from 'react'
import { Credit } from '../engine/attribution'

const AUTO_MS = 8000
const IDLE_MS = 2400

const paths = {
  prev: 'M15 5l-7 7 7 7',
  next: 'M9 5l7 7-7 7',
  play: 'M8 5.5v13l10.5-6.5z',
  pause: 'M8 5v14M16 5v14',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  full: 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5',
}

function Glyph({ d, fill }: { d: string; fill?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d={d} fill={fill ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={fill ? 0 : 1.7} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/**
 * Presenter controls, bottom-right. Hidden until the pointer moves, so they never
 * show in screenshots or on a projector left alone. Key: P toggles autoplay.
 * `paused` holds autoplay (overview open, audience screen blanked or frozen) and
 * restarts the 8-second wait when it lifts; `hidden` removes the bar but keeps its state.
 */
export function Controls({
  onPrev,
  onNext,
  onOverview,
  atEnd,
  hidden = false,
  paused = false,
  credit = true,
}: {
  onPrev: () => void
  onNext: () => void
  onOverview: () => void
  atEnd: boolean
  hidden?: boolean
  paused?: boolean
  credit?: boolean
}) {
  const [shown, setShown] = useState(false)
  const [auto, setAuto] = useState(false)
  const [full, setFull] = useState(false)
  const idle = useRef(0)
  const next = useRef(onNext)
  next.current = onNext

  useEffect(() => {
    const wake = () => {
      setShown(true)
      window.clearTimeout(idle.current)
      idle.current = window.setTimeout(() => setShown(false), IDLE_MS)
    }
    const onFull = () => setFull(Boolean(document.fullscreenElement))
    window.addEventListener('pointermove', wake)
    document.addEventListener('fullscreenchange', onFull)
    return () => {
      window.removeEventListener('pointermove', wake)
      document.removeEventListener('fullscreenchange', onFull)
      window.clearTimeout(idle.current)
    }
  }, [])

  useEffect(() => {
    if (!auto || paused) return
    const t = window.setInterval(() => next.current(), AUTO_MS)
    return () => window.clearInterval(t)
  }, [auto, paused])

  useEffect(() => {
    if (atEnd) setAuto(false)
  }, [atEnd])

  const toggleFull = () => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()).catch(() => {})

  useEffect(() => {
    if (hidden) return
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return
      const t = e.target as HTMLElement
      if (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return
      // F (fullscreen) is handled globally in main.tsx.
      if (e.key.toLowerCase() === 'p') setAuto((a) => !a)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [hidden])

  if (hidden) return null
  return (
    <div className={`controls${shown || auto ? ' is-shown' : ''}`} role="toolbar" aria-label="播放控制">
      <button type="button" tabIndex={-1} onClick={onPrev} aria-label="上一步">
        <Glyph d={paths.prev} />
      </button>
      <button type="button" tabIndex={-1} onClick={() => setAuto((a) => !a)} aria-label={auto ? '暂停自动播放 (P)' : '自动播放 (P)'} aria-pressed={auto} className={auto ? 'is-on' : undefined}>
        <Glyph d={auto ? paths.pause : paths.play} fill={!auto} />
        {auto && !paused && <i className="controls__timer" style={{ animationDuration: `${AUTO_MS}ms` }} />}
      </button>
      <button type="button" tabIndex={-1} onClick={onNext} aria-label="下一步">
        <Glyph d={paths.next} />
      </button>
      <span className="controls__sep" aria-hidden />
      <button type="button" tabIndex={-1} onClick={onOverview} aria-label="总览 (G)">
        <Glyph d={paths.grid} />
      </button>
      <button type="button" tabIndex={-1} onClick={toggleFull} aria-label={full ? '退出全屏 (F)' : '全屏 (F)'} aria-pressed={full}>
        <Glyph d={paths.full} />
      </button>
      {credit && (
        <>
          <span className="controls__sep" aria-hidden />
          <Credit className="controls__credit" />
        </>
      )}
    </div>
  )
}
