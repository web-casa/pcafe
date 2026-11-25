import { useCallback, useEffect, useRef, useState } from 'react'
import { Reveal } from '../deck/primitives'
import { Hint, SlideFoot, SlideHead, type SlideBase } from './shared'

export interface VideoStop {
  /** Second in the video where this part ends. Ascending. */
  at: number
  /** ≤ 8 CJK characters. */
  title: string
  /** ≤ 30 CJK characters. */
  body: string
}

export interface StepVideoProps extends SlideBase {
  /** Imported video file. Keep it short and small: it is inlined into the single HTML file. */
  src: string
  /** Describes what the video shows, for screen readers. */
  label: string
  /** Optional poster image shown while the video loads. */
  poster?: string
  /** Second shown before the first press. Default 0. */
  start?: number
  /** Start muted (recommended for reliable autoplay). Users can toggle audio via the overlay button. Default true. */
  muted?: boolean
  /** Playback speed multiplier for segment transitions. Default 1. */
  playbackRate?: number
  /** 2–4 stops; each → plays to the next one and pauses there. */
  stops: VideoStop[]
}

type VideoWithRVFC = HTMLVideoElement & {
  requestVideoFrameCallback?: (cb: () => void) => number
  cancelVideoFrameCallback?: (id: number) => void
}

/**
 * A video that plays one segment per press (with `build: 'reveal'`), pausing at each stop while its note appears.
 * Jumping to the slide, printing and reduced motion show the frame at the last stop.
 */
export function StepVideo({
  kicker,
  title,
  lead,
  source,
  hint = '按 → 播放下一段 · 点击画面重播本段',
  src,
  label,
  poster,
  start = 0,
  muted: initialMuted = true,
  playbackRate = 1,
  stops,
}: StepVideoProps) {
  const ref = useRef<HTMLElement>(null)
  const vid = useRef<HTMLVideoElement>(null)
  const runIdRef = useRef(0)
  const watchHandleRef = useRef<{ id: number; usedRVFC: boolean }>({ id: 0, usedRVFC: false })
  const segmentRef = useRef<{ from: number; to: number }>({ from: start, to: stops[0]?.at ?? start })
  const [muted, setMuted] = useState(initialMuted)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(start)
  const [failed, setFailed] = useState(false)

  const cancelActiveWatch = useCallback(() => {
    const v = vid.current as VideoWithRVFC | null
    const h = watchHandleRef.current
    if (!h.id) return
    if (h.usedRVFC && v?.cancelVideoFrameCallback) v.cancelVideoFrameCallback(h.id)
    else cancelAnimationFrame(h.id)
    watchHandleRef.current = { id: 0, usedRVFC: false }
  }, [])

  useEffect(() => {
    setFailed(false)
  }, [src])

  const lastStop = stops.length > 0 ? stops[stops.length - 1].at : start
  const span = Math.max(0.01, lastStop - start)

  const playSegment = useCallback(
    (from: number, to: number) => {
      const v = vid.current as VideoWithRVFC | null
      if (!v || failed) return
      cancelActiveWatch()
      const myRun = ++runIdRef.current

      const seekExact = (t: number) => {
        cancelActiveWatch()
        v.pause()
        try {
          v.currentTime = t
        } catch {
          // ignore if metadata not yet loaded
        }
        setPlaying(false)
        setCurrentTime(t)
      }

      const watch = () => {
        if (runIdRef.current !== myRun) return
        const now = v.currentTime
        setCurrentTime(now)
        if (now >= to - 0.02 || v.ended) {
          seekExact(to)
          return
        }
        if (typeof v.requestVideoFrameCallback === 'function') {
          watchHandleRef.current = { id: v.requestVideoFrameCallback(watch), usedRVFC: true }
        } else {
          watchHandleRef.current = { id: requestAnimationFrame(watch), usedRVFC: false }
        }
      }

      if (Math.abs(v.currentTime - from) > 0.08) {
        try {
          v.currentTime = from
        } catch {
          // ignore before metadata
        }
      }
      v.playbackRate = playbackRate
      setPlaying(true)
      v.play().then(
        () => {
          // If superseded by a newer run/seek/unmount, never pause the newer run!
          if (runIdRef.current !== myRun) return
          watch()
        },
        () => {
          if (runIdRef.current === myRun) seekExact(to)
        },
      )
    },
    [cancelActiveWatch, failed, playbackRate],
  )

  useEffect(() => {
    const v = vid.current
    if (!v) return
    v.muted = muted
  }, [muted])

  useEffect(() => {
    const root = ref.current
    const v = vid.current as VideoWithRVFC | null
    if (!root || !v || stops.length === 0) return

    const last = stops[stops.length - 1].at
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches

    const seek = (t: number) => {
      cancelActiveWatch()
      runIdRef.current++
      v.pause()
      try {
        v.currentTime = t
      } catch {
        // ignore if metadata not yet ready
      }
      setPlaying(false)
      setCurrentTime(t)
    }

    const read = () => {
      const notes = [...root.querySelectorAll<HTMLElement>('.sv__stop')]
      if (notes.every((n) => !n.dataset.buildState)) {
        const prev = stops.length >= 2 ? stops[stops.length - 2].at : start
        segmentRef.current = { from: prev, to: last }
        return seek(last)
      }
      const k = notes.filter((n) => n.dataset.buildState !== 'pending').length - 1
      const to = k < 0 ? start : stops[Math.min(k, stops.length - 1)].at
      const from = k <= 0 ? start : stops[Math.min(k - 1, stops.length - 1)].at
      segmentRef.current = { from, to }

      // Forward by exactly one part: play it. Anything else (back, jumps): show the frame.
      if (!still && k >= 0 && to > v.currentTime && Math.abs(v.currentTime - from) < 0.35) {
        playSegment(from, to)
      } else {
        seek(to)
      }
    }

    const init = () => read()
    const onVisibility = () => {
      if (document.hidden) {
        cancelActiveWatch()
        runIdRef.current++
        v.pause()
        setPlaying(false)
      }
    }

    if (v.readyState >= 1) init()
    else v.addEventListener('loadedmetadata', init, { once: true })
    document.addEventListener('visibilitychange', onVisibility)

    const mo = new MutationObserver(read)
    mo.observe(root, { subtree: true, attributes: true, attributeFilter: ['data-build-state'] })

    return () => {
      cancelActiveWatch()
      runIdRef.current++
      mo.disconnect()
      v.pause()
      v.removeEventListener('loadedmetadata', init)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [stops, start, playSegment, cancelActiveWatch])

  const replayCurrent = () => {
    const { from, to } = segmentRef.current
    if (to > from) playSegment(from, to)
  }

  const pct = Math.max(0, Math.min(100, ((currentTime - start) / span) * 100))

  return (
    <section className="slide" ref={ref}>
      <Hint id="stepvideo">{hint}</Hint>
      <div className="frame s-sv">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="sv__body">
          <Reveal i={3} y={24} className="sv__screen">
            <div className="sv__player">
              {failed ? (
                <div className="sv__fallback" role="alert">
                  <span>视频加载失败，请检查编码格式（推荐 H.264 MP4）</span>
                </div>
              ) : (
                <video
                  ref={vid}
                  src={src}
                  poster={poster}
                  muted={muted}
                  playsInline
                  preload="auto"
                  aria-label={label}
                  onClick={(e) => {
                    e.stopPropagation()
                    replayCurrent()
                  }}
                  onError={() => setFailed(true)}
                />
              )}
              {!failed && stops.length > 0 && (
                <div
                  className="sv__hud"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                      e.stopPropagation()
                    }
                  }}
                >
                  <button
                    type="button"
                    className="sv__btn"
                    onClick={replayCurrent}
                    aria-label="重播当前片段"
                    title="重播当前片段"
                  >
                    {playing ? '播放中' : '重播本段'}
                  </button>
                  <div className="sv__bar" aria-hidden="true">
                    <div className="sv__fill" style={{ width: `${pct}%` }} />
                    {stops.map((s) => (
                      <i
                        key={`${s.at}-${s.title}`}
                        className="sv__mark"
                        style={{ left: `${Math.max(0, Math.min(100, ((s.at - start) / span) * 100))}%` }}
                      />
                    ))}
                  </div>
                  <span className="sv__clock">{fmt(currentTime)}</span>
                  <button
                    type="button"
                    className="sv__btn"
                    onClick={() => setMuted((m) => !m)}
                    aria-label={muted ? '取消静音' : '静音'}
                  >
                    {muted ? '静音' : '有声'}
                  </button>
                </div>
              )}
            </div>
          </Reveal>
          <ol className="sv__stops">
            {stops.map((s, i) => (
              <li key={s.title} className="sv__stop" data-build={i}>
                <span className="sv__time">{fmt(s.at)}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}

const fmt = (t: number) => {
  const safe = Math.max(0, Number.isFinite(t) ? t : 0)
  const m = Math.floor(safe / 60)
  const s = (safe % 60).toFixed(1).padStart(4, '0')
  return `${m}:${s}`
}
