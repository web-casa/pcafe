import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { clock } from './clock'
import type { FrameStore } from './context'
import { VideoView } from './Player'
import { PORTRAIT_SAFE, SIZES, buildTimeline, type VideoDef } from './types'

const time = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

/**
 * Browser preview: the same scenes, virtual clock and code path as the renderer, paced by the wall
 * clock. Backward seeks replay the scene, so what you see at any frame is what the MP4 will contain.
 */
export function Preview({ def, store, epoch, seek }: { def: VideoDef; store: FrameStore; epoch: number; seek: (f: number) => Promise<void> }) {
  const tl = buildTimeline(def)
  const { width, height } = SIZES[def.size]
  const f = useSyncExternalStore(store.subscribe, store.get)
  const [playing, setPlaying] = useState(true)
  const [safe, setSafe] = useState(false)
  const [scale, setScale] = useState(1)
  const busy = useRef(false)
  const live = useRef({ playing, f })
  live.current = { playing, f }

  useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / width, (window.innerHeight - 64) / height))
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [width, height])

  // Paced by the real clock; virtual time only moves through seek().
  useEffect(() => {
    let stop = false
    let last = clock.realNow()
    let owed = 0
    const loop = () => {
      if (stop) return
      clock.realRaf(loop)
      const now = clock.realNow()
      owed += ((now - last) / 1000) * tl.fps
      last = now
      if (!live.current.playing || busy.current) return
      if (owed < 1) return
      const skip = Math.floor(owed)
      owed -= skip
      busy.current = true
      const next = live.current.f + skip >= tl.total ? 0 : live.current.f + skip
      void seek(next).finally(() => (busy.current = false))
    }
    clock.realRaf(loop)
    return () => void (stop = true)
  }, [seek, tl.fps, tl.total])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault()
        setPlaying((p) => !p)
      }
      if (e.key.toLowerCase() === 's') setSafe((v) => !v)
      if (e.key === 'ArrowRight') void seek(live.current.f + 1)
      if (e.key === 'ArrowLeft') void seek(live.current.f - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [seek])

  const scene = tl.scenes.find((r) => f >= r.start && f < r.end)
  return (
    <div className="v-shell">
      <div className="v-shell__screen">
        <div className="v-shell__fit" style={{ width, height, transform: `scale(${scale})` }}>
          <VideoView def={def} store={store} epoch={epoch} />
          {safe && def.size === '9:16' && <div className="v-safe" style={{ left: PORTRAIT_SAFE.left, top: PORTRAIT_SAFE.top, right: PORTRAIT_SAFE.right, bottom: PORTRAIT_SAFE.bottom }} />}
        </div>
      </div>
      <div className="v-bar">
        <button type="button" onClick={() => setPlaying((p) => !p)}>{playing ? '暂停' : '播放'}</button>
        <div className="v-bar__track">
          <input
            type="range"
            min={0}
            max={tl.total - 1}
            value={Math.max(0, f)}
            onChange={(e) => {
              setPlaying(false)
              void seek(Number(e.target.value))
            }}
          />
          <div className="v-bar__ticks" aria-hidden>
            {tl.scenes.map((r) => (
              <i key={r.scene.id} style={{ left: `${(r.start / tl.total) * 100}%` }} />
            ))}
          </div>
        </div>
        <span className="v-bar__time">{time(Math.max(0, f) / tl.fps)} / {time(tl.total / tl.fps)}</span>
        <span className="v-bar__scene">{scene?.scene.id}</span>
        {def.size === '9:16' && (
          <button type="button" onClick={() => setSafe((v) => !v)}>{safe ? '隐藏安全区' : '安全区'}</button>
        )}
      </div>
    </div>
  )
}
