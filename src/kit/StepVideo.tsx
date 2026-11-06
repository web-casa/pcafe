import { useEffect, useRef } from 'react'
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
  /** Second shown before the first press. Default 0. */
  start?: number
  /** 2–4 stops; each → plays to the next one and pauses there. */
  stops: VideoStop[]
}

/**
 * A video that plays one segment per press (with `build: 'reveal'`), pausing at each stop while its note appears.
 * Jumping to the slide, printing and reduced motion show the frame at the last stop.
 */
export function StepVideo({ kicker, title, lead, source, hint = '按 → 播放下一段', src, label, start = 0, stops }: StepVideoProps) {
  const ref = useRef<HTMLElement>(null)
  const vid = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const root = ref.current
    const v = vid.current
    if (!root || !v) return
    const last = stops[stops.length - 1].at
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches
    let target = -1
    let raf = 0
    const seek = (t: number) => {
      cancelAnimationFrame(raf)
      v.pause()
      v.currentTime = t
    }
    // Stop exactly at the mark: timeupdate fires too rarely, so watch every frame while playing.
    const watch = () => {
      if (v.currentTime >= target - 0.02 || v.ended) {
        v.pause()
        v.currentTime = target
        return
      }
      raf = requestAnimationFrame(watch)
    }
    const read = () => {
      const notes = [...root.querySelectorAll<HTMLElement>('.sv__stop')]
      if (notes.every((n) => !n.dataset.buildState)) return seek(last)
      const k = notes.filter((n) => n.dataset.buildState !== 'pending').length - 1
      const to = k < 0 ? start : stops[k].at
      // Forward by exactly one part: play it. Anything else (back, jumps): show the frame.
      const from = k <= 0 ? start : stops[k - 1].at
      if (!still && k >= 0 && to > v.currentTime && Math.abs(v.currentTime - from) < 0.3) {
        target = to
        cancelAnimationFrame(raf)
        v.play().then(() => (raf = requestAnimationFrame(watch)), () => seek(to))
      } else seek(to)
    }
    const init = () => read()
    if (v.readyState >= 1) init()
    else v.addEventListener('loadedmetadata', init, { once: true })
    const mo = new MutationObserver(read)
    mo.observe(root, { subtree: true, attributes: true, attributeFilter: ['data-build-state'] })
    return () => {
      mo.disconnect()
      cancelAnimationFrame(raf)
      v.removeEventListener('loadedmetadata', init)
    }
  }, [stops, start])
  return (
    <section className="slide" ref={ref}>
      <Hint id="stepvideo">{hint}</Hint>
      <div className="frame s-sv">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="sv__body">
          <Reveal i={3} y={24} className="sv__screen">
            <video ref={vid} src={src} muted playsInline preload="auto" aria-label={label} />
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

const fmt = (t: number) => `0:${t.toFixed(1).padStart(4, '0')}`
