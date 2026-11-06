import type { EmojiStyle } from '../emoji'
import type { ReactNode } from 'react'
import type { DeckStyle, SlideTone, ThemeName } from '../kit/theme'
import type { IconStyle } from '../kit/Icon'
import type { BuildMode } from '../deck/Deck'

/** How a scene arrives. The scene before it stays underneath until the transition ends. */
export type VideoTransition = 'cut' | 'fade' | 'push' | 'wipe' | 'rise'

export interface TimedCaption {
  /** Seconds from the start of the scene. */
  at: number
  /** Seconds from the start of the scene. Defaults to the next caption, or the end of the scene. */
  to?: number
  /** One sentence. The QA limits are listed in docs/en/video.md. */
  text: string
}

export interface SceneDef {
  id: string
  /** Seconds on screen, counted from the start of this scene to the start of the next. */
  duration: number
  /** A kit template in a 16:9 video; a portrait scene from src/video/portrait in a 9:16 video. */
  render: () => ReactNode
  /** Burned-in text. A string stays for the whole scene. */
  caption?: string | TimedCaption[]
  /** Seconds from scene start at which each `data-build` group of the template appears. */
  steps?: number[]
  /** 'reveal' shows groups one by one; 'focus' also dims the earlier ones. Default 'reveal'. */
  build?: BuildMode
  /** How this scene arrives. Default: VideoDef.transition. */
  transition?: VideoTransition
  /** Transition length in seconds. Default 0.5. */
  transitionTime?: number
  /** Dark or accent stage, same rule as SlideDef.tone. */
  tone?: SlideTone
  /** Source line drawn by the player on a 9:16 scene. Kit templates show their own. Required for any scene with a fact. */
  source?: string
  /** Set on a scene that states no fact (a title card), so QA does not ask for a source. */
  noFacts?: boolean
  /** Longest allowed still at the end of the scene, in seconds. Default 3.5. */
  maxHold?: number
  /** Shortest still before the cut, so the viewer can read the end state. Default 0.8. */
  minHold?: number
}

export type VideoSize = '16:9' | '9:16'

export interface VideoDef {
  /** Used as the title of the preview page. */
  title: string
  size: VideoSize
  /** 24, 25, 30, 50 or 60. Default 30. */
  fps?: number
  theme?: ThemeName
  style?: DeckStyle
  iconStyle?: IconStyle
  /** Emoji set for any emoji typed in the text: fluent (default), flat or noto. */
  emojiStyle?: EmojiStyle
  /** Default transition between scenes. Default 'fade'. */
  transition?: VideoTransition
  /** Seconds of animation already played when frame 0 is drawn, so the first frame (often the cover) is not empty. */
  preroll?: number
  /** "Made with PCafe · p.cafe" on the first and last scene. `false` hides it; needs PCafe Pro (LICENSE, Exhibit B). */
  attribution?: boolean
  /** Language of the credit. Default 'zh'. */
  lang?: 'zh' | 'en'
  scenes: SceneDef[]
}

export const SIZES: Record<VideoSize, { width: number; height: number }> = {
  '16:9': { width: 1920, height: 1080 },
  '9:16': { width: 1080, height: 1920 },
}

export const DEFAULT_TRANSITION_TIME = 0.5

/**
 * Keep text inside this box on 9:16. No platform publishes a single number we could confirm,
 * so this is the conservative union described in plans/research-video.md.
 */
export const PORTRAIT_SAFE = { top: 270, right: 216, bottom: 500, left: 60 }

/** Scene start and end in frames, plus where its incoming transition ends. */
export interface TimelineScene {
  index: number
  scene: SceneDef
  start: number
  end: number
  /** First frame after the incoming transition. */
  inEnd: number
  /** The last frame this scene is mounted, including the outgoing overlap. */
  unmount: number
}

export function buildTimeline(def: VideoDef) {
  const fps = def.fps ?? 30
  const rows: TimelineScene[] = []
  let f = 0
  def.scenes.forEach((scene, index) => {
    const start = f
    const end = start + Math.round(scene.duration * fps)
    const kind = scene.transition ?? def.transition ?? 'fade'
    const tf = index === 0 || kind === 'cut' ? 0 : Math.round((scene.transitionTime ?? DEFAULT_TRANSITION_TIME) * fps)
    rows.push({ index, scene, start, end, inEnd: start + tf, unmount: end })
    f = end
  })
  rows.forEach((r, i) => {
    const next = rows[i + 1]
    r.unmount = next ? next.inEnd : r.end
  })
  return { fps, total: f, scenes: rows, preroll: Math.round((def.preroll ?? 0) * fps) }
}
