import { useCallback, useEffect, useRef, useState } from 'react'
import { Reveal } from '../deck/primitives'
import { Hint, SlideFoot, SlideHead, type SlideBase } from './shared'

export interface VideoStageProps extends SlideBase {
  /** Imported video file or same-origin media URL. */
  src: string
  /** Describes what the video shows, for screen readers. */
  label: string
  /** Optional poster image shown before playback starts. */
  poster?: string
  /** Optional caption shown below the player frame (≤ 36 CJK chars). */
  caption?: string
  /** Autoplay when the slide opens (automatically mutes unless explicitly overridden). Default false. */
  autoplay?: boolean
  /** Loop playback continuously. Default false. */
  loop?: boolean
  /** Start muted. Defaults to `true` when `autoplay` is enabled, otherwise `false`. */
  muted?: boolean
  /** Show custom editorial playback controls. Default true. */
  controls?: boolean
  /** Initial playback rate. Default 1. */
  playbackRate?: number
}

const RATES = [0.75, 1, 1.25, 1.5, 2]

/**
 * Full-width editorial video stage for product walkthroughs, narrated demos,
 * or ambient loops with built-in play/pause, scrub bar, audio toggle, speed, and fullscreen.
 */
export function VideoStage({
  kicker,
  title,
  lead,
  source,
  hint = '点击画面播放/暂停 · 支持倍速与全屏',
  src,
  label,
  poster,
  caption,
  autoplay = false,
  loop = false,
  muted: mutedProp,
  controls = true,
  playbackRate: initialRate = 1,
}: VideoStageProps) {
  const vidRef = useRef<HTMLVideoElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [muted, setMuted] = useState(() => mutedProp ?? autoplay)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [rate, setRate] = useState(initialRate)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const v = vidRef.current
    if (!v) return
    v.muted = muted
  }, [muted])

  useEffect(() => {
    const v = vidRef.current
    if (!v) return
    v.playbackRate = rate
  }, [rate])

  useEffect(() => {
    setFailed(false)
    setCurrentTime(0)
    setDuration(0)
  }, [src])

  useEffect(() => {
    const v = vidRef.current
    const wrap = wrapRef.current
    if (!v) return
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches

    if (autoplay && !reduced) {
      v.muted = muted
      v.play().then(
        () => setPlaying(true),
        () => setPlaying(false),
      )
    }

    const onVisibility = () => {
      if (document.hidden && !v.paused) {
        v.pause()
        setPlaying(false)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    let io: IntersectionObserver | null = null
    if (wrap && typeof IntersectionObserver === 'function') {
      io = new IntersectionObserver(
        (entries) => {
          const visible = entries.some((entry) => entry.isIntersecting)
          if (!visible && !v.paused) {
            v.pause()
            setPlaying(false)
          }
        },
        { threshold: 0.05 },
      )
      io.observe(wrap)
    }

    return () => {
      io?.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      v.pause()
    }
    // Run once on mount for slide entry autoplay and cleanup on slide exit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const togglePlay = useCallback(() => {
    const v = vidRef.current
    if (!v || failed) return
    if (v.paused || v.ended) {
      if (v.ended) v.currentTime = 0
      v.playbackRate = rate
      v.play().then(
        () => setPlaying(true),
        () => setPlaying(false),
      )
    } else {
      v.pause()
      setPlaying(false)
    }
  }, [failed, rate])

  const cycleRate = () => {
    const idx = RATES.indexOf(rate)
    setRate(RATES[(idx + 1) % RATES.length])
  }

  const toggleFullscreen = () => {
    const el = wrapRef.current as (HTMLDivElement & { webkitRequestFullscreen?: () => Promise<void> | void }) | null
    const v = vidRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null
    const doc = document as Document & {
      webkitFullscreenElement?: Element | null
      webkitExitFullscreen?: () => Promise<void> | void
    }
    const activeFs = doc.fullscreenElement ?? doc.webkitFullscreenElement
    if (activeFs) {
      if (doc.exitFullscreen) void doc.exitFullscreen().catch(() => {})
      else doc.webkitExitFullscreen?.()
      return
    }
    if (el?.requestFullscreen) {
      void el.requestFullscreen().catch(() => {
        v?.webkitEnterFullscreen?.()
      })
    } else if (el?.webkitRequestFullscreen) {
      el.webkitRequestFullscreen()
    } else if (v?.webkitEnterFullscreen) {
      v.webkitEnterFullscreen()
    }
  }

  return (
    <section className="slide">
      <Hint id="videostage">{hint}</Hint>
      <div className="frame s-vs">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={2} y={20} className="vs__body">
          <div
            ref={wrapRef}
            className="vs__player"
            tabIndex={0}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              const target = e.target as HTMLElement | null
              const isControl =
                target !== null &&
                target !== e.currentTarget &&
                target.tagName !== 'VIDEO'
              if (isControl) {
                if (e.key === ' ' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                  e.stopPropagation()
                }
                return
              }
              if (e.key === ' ' || e.key.toLowerCase() === 'k') {
                e.preventDefault()
                e.stopPropagation()
                togglePlay()
              } else if (e.key.toLowerCase() === 'm') {
                e.preventDefault()
                e.stopPropagation()
                setMuted((m) => !m)
              }
            }}
          >
            {failed ? (
              <div className="vs__fallback" role="alert">
                <span>视频加载失败，请确认文件编码为浏览器兼容的 H.264 MP4 或 WebM</span>
              </div>
            ) : (
              <video
                ref={vidRef}
                src={src}
                poster={poster}
                loop={loop}
                muted={muted}
                playsInline
                preload="metadata"
                aria-label={label}
                onClick={togglePlay}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onEnded={() => setPlaying(false)}
                onLoadedMetadata={(e) => {
                  const d = e.currentTarget.duration
                  if (Number.isFinite(d)) setDuration(d)
                }}
                onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                onError={() => setFailed(true)}
              />
            )}

            {!failed && !playing && (
              <button
                type="button"
                className="vs__bigplay"
                onClick={togglePlay}
                aria-label="播放视频"
              >
                <span aria-hidden="true">▶</span>
              </button>
            )}

            {!failed && controls && (
              <div className="vs__bar">
                <button
                  type="button"
                  className="vs__btn"
                  onClick={togglePlay}
                  aria-label={playing ? '暂停' : '播放'}
                >
                  {playing ? '暂停' : '播放'}
                </button>
                <input
                  type="range"
                  className="vs__scrub"
                  min={0}
                  max={duration || 1}
                  step={0.05}
                  value={Math.min(currentTime, duration || 1)}
                  aria-label="视频进度"
                  onChange={(e) => {
                    const next = Number(e.target.value)
                    if (vidRef.current) vidRef.current.currentTime = next
                    setCurrentTime(next)
                  }}
                />
                <span className="vs__time">
                  {fmtTime(currentTime)} / {fmtTime(duration)}
                </span>
                <button
                  type="button"
                  className="vs__btn"
                  onClick={cycleRate}
                  aria-label="切换播放倍速"
                >
                  {rate}×
                </button>
                <button
                  type="button"
                  className="vs__btn"
                  onClick={() => setMuted((m) => !m)}
                  aria-label={muted ? '取消静音' : '静音'}
                >
                  {muted ? '静音' : '有声'}
                </button>
                <button
                  type="button"
                  className="vs__btn"
                  onClick={toggleFullscreen}
                  aria-label="全屏"
                >
                  全屏
                </button>
              </div>
            )}
          </div>
          {caption && <p className="vs__caption">{caption}</p>}
        </Reveal>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}

function fmtTime(sec: number) {
  const safe = Math.max(0, Number.isFinite(sec) ? sec : 0)
  const m = Math.floor(safe / 60)
  const s = String(Math.floor(safe % 60)).padStart(2, '0')
  return `${m}:${s}`
}
