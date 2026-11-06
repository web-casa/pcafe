import { memo, useContext, useLayoutEffect, useMemo, useSyncExternalStore, type CSSProperties, type ReactNode } from 'react'
import { creditOn, creditText } from '../engine/attribution'
import { DeckContext } from '../deck/context'
import type { BuildMode } from '../deck/Deck'
import { UnitScope } from '../deck/Stage'
import { IconStyleProvider } from '../kit/Icon'
import { DEFAULT_STYLE, toneOf, type DeckStyle } from '../kit/theme'
import { easeInOut, span } from './anim'
import { SceneContext, type FrameStore } from './context'
import { SIZES, buildTimeline, type SceneDef, type TimedCaption, type TimelineScene, type VideoDef, type VideoTransition } from './types'

/** A kit slide is 1920 design units wide. With a caption band it shrinks through --u, so text stays sharp. */
const SLIDE_U_WITH_CAPTION = 0.9

/** Same grouping as the deck: a bare `data-build` is a step, equal values step together. */
function applyBuild(root: HTMLElement, revealed: number | null, mode: BuildMode) {
  const items = [...root.querySelectorAll<HTMLElement>('[data-build]')]
  const ids: string[] = []
  items.forEach((el, k) => {
    const id = el.dataset.build || `#${k}`
    if (!ids.includes(id)) ids.push(id)
    const i = ids.indexOf(id)
    let state = ''
    if (revealed !== null) {
      if (i >= revealed) state = 'pending'
      else if (mode === 'focus') state = i === revealed - 1 ? 'current' : 'past'
    }
    if (state) el.dataset.buildState = state
    else delete el.dataset.buildState
  })
  return ids.length
}

export const captionList = (s: SceneDef): TimedCaption[] => {
  if (!s.caption) return []
  if (typeof s.caption === 'string') return [{ at: 0.15, to: s.duration, text: s.caption }]
  return s.caption.map((c, i, all) => ({ ...c, to: c.to ?? all[i + 1]?.at ?? s.duration }))
}

function Caption({ scene }: { scene: SceneDef }) {
  const c = useContext(SceneContext)
  const f = useSyncExternalStore(c.store.subscribe, c.store.get)
  const t = (f - c.start) / c.fps
  const now = captionList(scene).find((x) => t >= x.at && t < x.to!)
  // Rounded so a held caption does not re-render on every frame.
  const opacity = now ? Math.round(span(t, now.at, 0.2) * 100) / 100 : 0
  if (!now) return null
  return (
    <div className="v-cap" data-v-caption style={{ opacity }}>
      <span>{now.text}</span>
    </div>
  )
}

function SourceLine({ text }: { text: string }) {
  const c = useContext(SceneContext)
  const f = useSyncExternalStore(c.store.subscribe, c.store.get)
  return (
    <p className="v-source" data-v-source style={{ opacity: Math.round(span((f - c.start) / c.fps, 0.5, 0.4) * 100) / 100 }}>
      来源：{text}
    </p>
  )
}

function layerStyle(kind: VideoTransition, p: number, role: 'in' | 'out', vertical: boolean): CSSProperties {
  const e = easeInOut(p)
  const axis = vertical ? 'Y' : 'X'
  switch (kind) {
    // Dip through the canvas: old fades out, then new fades in, so two sets of text never overlap.
    case 'fade':
      return { opacity: role === 'in' ? easeInOut(span(p, 0.5, 0.5)) : 1 - easeInOut(span(p, 0, 0.5)) }
    case 'push':
      return { transform: `translate${axis}(${(role === 'in' ? 1 - e : -e) * 100}%)` }
    case 'wipe':
      return role === 'in' ? { clipPath: vertical ? `inset(${(1 - e) * 100}% 0 0 0)` : `inset(0 0 0 ${(1 - e) * 100}%)` } : {}
    case 'rise':
      return role === 'in'
        ? { opacity: easeInOut(span(p, 0.4, 0.6)), transform: `translateY(${(1 - e) * 5}%)` }
        : { opacity: 1 - easeInOut(span(p, 0, 0.45)) }
    default:
      return {}
  }
}

/** Slide content, memoised: the frame store never re-renders a kit template. */
const Content = memo(function Content({ render }: { render: () => ReactNode }) {
  return <>{render()}</>
})

function Scene({ row, next, def, fps, preroll, store, style }: { row: TimelineScene; next?: TimelineScene; def: VideoDef; fps: number; preroll: number; store: FrameStore; style: DeckStyle }) {
  const { scene } = row
  const f = useSyncExternalStore(store.subscribe, store.get)
  const portrait = def.size === '9:16'
  const { width, height } = SIZES[def.size]
  // Scene time includes the preroll, so frame-driven parts are as far along as the kit's animations.
  const born = row.index === 0 ? row.start - preroll : row.start
  const clockValue = useMemo(() => ({ store, fps, start: born, frames: row.end - born }), [store, fps, born, row.end])
  const tone = toneOf(scene.tone, style) ?? 'light'

  // Transition styles: incoming on this scene's own start, outgoing on the next scene's.
  let tstyle: CSSProperties = {}
  const kindIn = scene.transition ?? def.transition ?? 'fade'
  if (row.inEnd > row.start && f < row.inEnd) tstyle = layerStyle(kindIn, (f - row.start) / (row.inEnd - row.start), 'in', portrait)
  if (next && next.inEnd > next.start && f >= next.start) tstyle = layerStyle(next.scene.transition ?? def.transition ?? 'fade', (f - next.start) / (next.inEnd - next.start), 'out', portrait)

  const t = (f - born) / fps
  const revealed = scene.steps ? scene.steps.filter((at) => t >= at).length : null
  const buildMode = scene.build ?? 'reveal'
  const stage = useMemo(() => ({ current: null as HTMLDivElement | null }), [])
  useLayoutEffect(() => {
    if (stage.current) applyBuild(stage.current, revealed, buildMode)
  }, [revealed, buildMode, stage])

  const hasCaption = !portrait && !!scene.caption
  const u = hasCaption ? SLIDE_U_WITH_CAPTION : 1
  const zIndex = row.index + 1
  const stageStyle = (portrait
    ? { width, height, '--u': '1px' }
    : { '--u': `${u}px`, position: 'absolute', left: (width - 1920 * u) / 2, top: 0 }) as unknown as CSSProperties

  return (
    <SceneContext.Provider value={clockValue}>
      <div className="v-scene" data-tone={tone} data-v-scene={scene.id} style={{ ...tstyle, zIndex }}>
        <UnitScope u={portrait ? 1 : u}>
          <DeckContext.Provider value={{ index: row.index, total: def.scenes.length, go: noop, hintSlot: null, arriving: [] }}>
            <div className="stage" ref={(el) => void (stage.current = el)} data-tone={tone} style={stageStyle}>
              <div className={portrait ? 'v-portrait' : 'slide-frame'}>
                <Content render={scene.render} />
              </div>
            </div>
          </DeckContext.Provider>
        </UnitScope>
        <Caption scene={scene} />
        {portrait && scene.source && <SourceLine text={scene.source} />}
        {(row.index === 0 || row.index === def.scenes.length - 1) && creditOn(def.attribution) && (
          <p className="v-credit" data-pcafe-credit="">{`${creditText(def.lang ?? 'zh')} · p.cafe`}</p>
        )}
      </div>
    </SceneContext.Provider>
  )
}
const noop = () => {}

/** All scenes mounted on the current frame. Pure function of the frame number. */
export function VideoView({ def, store, epoch }: { def: VideoDef; store: FrameStore; epoch: number }) {
  const tl = useMemo(() => buildTimeline(def), [def])
  const f = useSyncExternalStore(store.subscribe, store.get)
  const style = def.style ?? DEFAULT_STYLE
  // During the preroll (f < 0) the first scene is already playing.
  const live = tl.scenes.filter((r) => (r.index === 0 || f >= r.start) && f < r.unmount)
  const { width, height } = SIZES[def.size]
  return (
    <IconStyleProvider value={def.iconStyle}>
      {/* The canvas shows through a fade, so it takes the incoming scene's tone. The root keeps the theme's light paper. */}
      <div className={`v-canvas v-${def.size === '9:16' ? 'tall' : 'wide'}`} data-tone={toneOf(live.at(-1)?.scene.tone, style) ?? 'light'} style={{ width, height }}>
        {live.map((row) => (
          <Scene key={`${epoch}-${row.scene.id}`} row={row} next={tl.scenes[row.index + 1]} def={def} fps={tl.fps} preroll={tl.preroll} store={store} style={style} />
        ))}
      </div>
    </IconStyleProvider>
  )
}
