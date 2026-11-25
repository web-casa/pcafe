import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { clock } from './clock'
import type { FrameStore } from './context'
import { VideoView } from './Player'
import { PORTRAIT_SAFE, SIZES, buildTimeline, type VideoDef } from './types'

const time = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
const RATES = [0.5, 1, 1.5, 2] as const

/**
 * Browser preview: the same scenes, virtual clock and code path as the renderer, paced by the wall
 * clock. Backward seeks replay the scene, so what you see at any frame is what the MP4 will contain.
 */
export function Preview({ def, store, epoch, seek }: { def: VideoDef; store: FrameStore; epoch: number; seek: (f: number) => Promise<void> }) {
  const tl = useMemo(() => buildTimeline(def), [def])
  const { width, height } = SIZES[def.size]
  const f = useSyncExternalStore(store.subscribe, store.get)
  const [playing, setPlaying] = useState(true)
  const [safe, setSafe] = useState(false)
  const [rate, setRate] = useState<(typeof RATES)[number]>(1)
  const [scale, setScale] = useState(1)
  const [audioUrl, setAudioUrl] = useState<string | null>(() => new URLSearchParams(location.search).get('audio'))
  const [audioName, setAudioName] = useState<string>(() => (new URLSearchParams(location.search).get('audio') ? 'URL 音轨' : ''))
  const objectUrlRef = useRef<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const busy = useRef(false)
  const live = useRef({ playing, f, rate })
  live.current = { playing, f, rate }

  useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / width, (window.innerHeight - 64) / height))
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [width, height])

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    }
  }, [])

  const syncAudioToFrame = useCallback(
    (frame: number, shouldPlay: boolean, playbackRate: number) => {
      const a = audioRef.current
      if (!a || !audioUrl) return
      const sec = Math.max(0, frame) / tl.fps
      a.playbackRate = playbackRate
      if (a.readyState >= 1 && Math.abs(a.currentTime - sec) > 0.14) {
        try {
          a.currentTime = sec
        } catch {
          // ignore before audio metadata loads
        }
      }
      if (shouldPlay) {
        if (a.paused) void a.play().catch(() => {})
      } else if (!a.paused) {
        a.pause()
      }
    },
    [audioUrl, tl.fps],
  )

  useEffect(() => {
    syncAudioToFrame(live.current.f, playing, rate)
  }, [playing, rate, audioUrl, syncAudioToFrame])

  const jumpToFrame = useCallback(
    (target: number) => {
      const clamped = Math.max(0, Math.min(tl.total - 1, target))
      syncAudioToFrame(clamped, live.current.playing, live.current.rate)
      void seek(clamped)
    },
    [seek, syncAudioToFrame, tl.total],
  )

  const jumpScene = useCallback(
    (delta: 1 | -1) => {
      const curIdx = tl.scenes.findIndex((r) => live.current.f >= r.start && live.current.f < r.end)
      const base = curIdx >= 0 ? curIdx : 0
      const nextIdx = Math.max(0, Math.min(tl.scenes.length - 1, base + delta))
      jumpToFrame(tl.scenes[nextIdx].start)
    },
    [jumpToFrame, tl.scenes],
  )

  // Paced by the real clock; virtual time only moves through seek().
  useEffect(() => {
    let stop = false
    let last = clock.realNow()
    let lastDriftCheck = last
    let owed = 0
    const onVisibility = () => {
      last = clock.realNow()
      owed = 0
      if (document.hidden) {
        if (audioRef.current && !audioRef.current.paused) audioRef.current.pause()
      } else if (live.current.playing) {
        syncAudioToFrame(live.current.f, true, live.current.rate)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    const loop = () => {
      if (stop) return
      clock.realRaf(loop)
      const now = clock.realNow()
      const dtSec = Math.min(0.1, Math.max(0, (now - last) / 1000))
      last = now
      if (!live.current.playing || busy.current) return
      owed = Math.min(3, owed + dtSec * tl.fps * live.current.rate)
      if (owed < 1) return
      const skip = Math.floor(owed)
      owed -= skip
      busy.current = true
      const wrapped = live.current.f + skip >= tl.total
      const next = wrapped ? 0 : live.current.f + skip
      if (wrapped) {
        syncAudioToFrame(0, true, live.current.rate)
      } else if (now - lastDriftCheck >= 500) {
        lastDriftCheck = now
        syncAudioToFrame(next, true, live.current.rate)
      }
      void seek(next).finally(() => (busy.current = false))
    }
    clock.realRaf(loop)
    return () => {
      stop = true
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [seek, syncAudioToFrame, tl.fps, tl.total])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const el = e.target as HTMLElement | null
      const tag = el?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'BUTTON') return
      if (e.key === ' ') {
        e.preventDefault()
        setPlaying((p) => {
          const next = !p
          syncAudioToFrame(live.current.f, next, live.current.rate)
          return next
        })
      } else if (e.key.toLowerCase() === 's') {
        setSafe((v) => !v)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        if (e.shiftKey) jumpScene(1)
        else {
          setPlaying(false)
          jumpToFrame(live.current.f + 1)
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        if (e.shiftKey) jumpScene(-1)
        else {
          setPlaying(false)
          jumpToFrame(live.current.f - 1)
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [jumpScene, jumpToFrame, syncAudioToFrame])

  const scene = tl.scenes.find((r) => f >= r.start && f < r.end)

  return (
    <div className="v-shell">
      <div className="v-shell__screen">
        <div className="v-shell__fit" style={{ width, height, transform: `scale(${scale})` }}>
          <VideoView def={def} store={store} epoch={epoch} />
          {safe && def.size === '9:16' && <div className="v-safe" style={{ left: PORTRAIT_SAFE.left, top: PORTRAIT_SAFE.top, right: PORTRAIT_SAFE.right, bottom: PORTRAIT_SAFE.bottom }} />}
        </div>
      </div>
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          preload="auto"
          onLoadedMetadata={() => syncAudioToFrame(live.current.f, live.current.playing, live.current.rate)}
          onCanPlay={() => syncAudioToFrame(live.current.f, live.current.playing, live.current.rate)}
        />
      )}
      <div className="v-bar">
        <button
          type="button"
          onClick={(e) => {
            e.currentTarget.blur()
            setPlaying((p) => {
              const next = !p
              syncAudioToFrame(live.current.f, next, live.current.rate)
              return next
            })
          }}
        >
          {playing ? '暂停' : '播放'}
        </button>
        <button
          type="button"
          title="上一场景 (Shift+←)"
          onClick={(e) => {
            e.currentTarget.blur()
            jumpScene(-1)
          }}
        >
          ⏮
        </button>
        <button
          type="button"
          title="下一场景 (Shift+→)"
          onClick={(e) => {
            e.currentTarget.blur()
            jumpScene(1)
          }}
        >
          ⏭
        </button>
        <div className="v-bar__track">
          <input
            type="range"
            min={0}
            max={Math.max(0, tl.total - 1)}
            value={Math.max(0, f)}
            onChange={(e) => {
              const target = Number(e.target.value)
              setPlaying(false)
              syncAudioToFrame(target, false, rate)
              void seek(target)
            }}
          />
          <div className="v-bar__ticks">
            {tl.scenes.map((r) => (
              <button
                key={r.scene.id}
                type="button"
                className="v-bar__tick"
                style={{ left: `${(r.start / tl.total) * 100}%` }}
                title={`跳转场景：${r.scene.id}`}
                aria-label={`跳转场景 ${r.scene.id}`}
                onClick={(e) => {
                  e.currentTarget.blur()
                  jumpToFrame(r.start)
                }}
              />
            ))}
          </div>
        </div>
        <span className="v-bar__time">{time(Math.max(0, f) / tl.fps)} / {time(tl.total / tl.fps)}</span>
        <span className="v-bar__scene">{scene?.scene.id}</span>
        <button
          type="button"
          title="切换预览倍速"
          onClick={(e) => {
            e.currentTarget.blur()
            setRate((r) => RATES[(RATES.indexOf(r) + 1) % RATES.length])
          }}
        >
          {rate}×
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (!file) return
            if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
            const url = URL.createObjectURL(file)
            objectUrlRef.current = url
            setAudioUrl(url)
            setAudioName(file.name)
            e.target.value = ''
          }}
        />
        <button
          type="button"
          title={audioName ? `当前音轨：${audioName}（点击更换）` : '加载本地音轨同步试听'}
          onClick={(e) => {
            e.currentTarget.blur()
            fileInputRef.current?.click()
          }}
        >
          {audioUrl ? '换音轨' : '加载音频'}
        </button>
        {def.size === '9:16' && (
          <button
            type="button"
            onClick={(e) => {
              e.currentTarget.blur()
              setSafe((v) => !v)
            }}
          >
            {safe ? '隐藏安全区' : '安全区'}
          </button>
        )}
      </div>
    </div>
  )
}
