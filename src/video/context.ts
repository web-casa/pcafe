import { createContext, useContext, useSyncExternalStore } from 'react'

/** The current video frame. Everything frame-driven reads this and nothing else. */
export function createFrameStore(initial = 0) {
  let frame = initial
  const listeners = new Set<() => void>()
  return {
    get: () => frame,
    set(f: number) {
      if (f === frame) return
      frame = f
      for (const l of listeners) l()
    },
    subscribe(l: () => void) {
      listeners.add(l)
      return () => void listeners.delete(l)
    },
  }
}
export type FrameStore = ReturnType<typeof createFrameStore>

export interface SceneClock {
  store: FrameStore
  fps: number
  /** First frame of the scene. */
  start: number
  /** Frames from scene start to next scene start. */
  frames: number
}

const fallback = createFrameStore()
export const SceneContext = createContext<SceneClock>({ store: fallback, fps: 30, start: 0, frames: 1 })

/** Seconds since this scene began. Re-renders on every frame; use it in small leaf components. */
export function useSceneTime() {
  const c = useContext(SceneContext)
  const f = useSyncExternalStore(c.store.subscribe, c.store.get)
  return (f - c.start) / c.fps
}

/** Scene length in seconds. */
export function useSceneDuration() {
  const c = useContext(SceneContext)
  return c.frames / c.fps
}
