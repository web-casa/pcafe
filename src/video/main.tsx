import { setEmojiStyle } from '../emoji'
import { clock } from './clock' // must stay the first import, see clock.ts
import { createRoot } from 'react-dom/client'
import { flushSync } from 'react-dom'
import { MotionConfig } from 'motion/react'
import { DEFAULT_STYLE, themeVars } from '../kit/theme'
import { createFrameStore } from './context'
import { audit } from './audit'
import { VideoView } from './Player'
import { Preview } from './Preview'
import { SIZES, buildTimeline, type VideoDef } from './types'
import '../styles'
import './video.css'
import './portrait.css'

const modules = import.meta.glob<{ video: VideoDef }>('../videos/*/index.tsx', { eager: true })
const VIDEOS = Object.fromEntries(Object.entries(modules).map(([k, m]) => [k.split('/')[2], m.video]))

const q = new URLSearchParams(location.search)
const name = q.get('video')
const rendering = q.has('render')

function listVideos() {
  document.body.innerHTML = `<main class="v-list"><h1>PCafe video</h1>${Object.keys(VIDEOS)
    .filter((n) => !n.startsWith('_') && n !== 'clock-selftest')
    .map((n) => `<a href="?video=${n}">${n}</a>`)
    .join('')}</main>`
}

async function start() {
  const def = name ? VIDEOS[name] : undefined
  if (!def) return listVideos()
  document.title = def.title
  const html = document.documentElement
  const style = def.style ?? DEFAULT_STYLE
  for (const [k, v] of Object.entries(themeVars(def.theme, style))) html.style.setProperty(k, String(v))
  html.style.setProperty('--u', '1px')
  html.dataset.style = style
  html.dataset.video = def.size
  if (rendering) html.dataset.videoRender = ''

  const tl = buildTimeline(def)
  const dt = 1000 / tl.fps
  const store = createFrameStore(-tl.preroll)
  setEmojiStyle(def.emojiStyle)
  const reactRoot = createRoot(document.getElementById('root')!)
  await clock.preload()

  let epoch = 0
  function remount() {
    flushSync(() =>
      reactRoot.render(
        <MotionConfig reducedMotion="never">
          {rendering ? <VideoView def={def!} store={store} epoch={epoch} /> : <Preview def={def!} store={store} epoch={epoch} seek={seek} />}
        </MotionConfig>,
      ),
    )
  }

  /** Time of frame `f`. The preroll runs before frame 0. */
  const timeOf = (f: number) => (f + tl.preroll) * dt

  const seedFor = (f: number) => {
    for (const r of tl.scenes) if (r.start === f) clock.seed(r.index + 1)
  }

  /** Steps exactly one frame forward. */
  async function advance(f: number) {
    await clock.step(timeOf(f), () => {
      seedFor(f)
      flushSync(() => store.set(f))
    })
    await clock.decodeImages()
  }

  /** Any frame: forward by stepping, backward by re-mounting the earliest live scene and replaying it. */
  async function seek(target: number) {
    const cur = store.get()
    const t = Math.max(-tl.preroll, Math.min(tl.total - 1, target))
    if (t === cur) return
    if (t > cur && t - cur <= 1) return advance(t)
    const earliest = t < 0 ? undefined : tl.scenes.find((r) => t >= r.start && t < r.unmount)
    const from = earliest && earliest.index > 0 ? earliest.start : -tl.preroll
    if (t > cur && from <= cur) {
      for (let f = cur + 1; f <= t; f++) await advance(f)
      return
    }
    epoch++
    clock.jump(timeOf(from))
    if (earliest) clock.seed(earliest.index + 1)
    flushSync(() => store.set(from))
    remount()
    await clock.settle()
    for (let f = from + 1; f <= t; f++) await advance(f)
  }

  const api = {
    def: { title: def.title, size: def.size, fps: tl.fps, frames: tl.total, ...SIZES[def.size] },
    scenes: tl.scenes.map((r) => ({
      id: r.scene.id,
      start: r.start,
      end: r.end,
      inEnd: r.inEnd,
      noFacts: !!r.scene.noFacts,
      hasSource: !!r.scene.source,
      steps: r.scene.steps ?? null,
      maxHold: r.scene.maxHold ?? 3.5,
      minHold: r.scene.minHold ?? 0.8,
      captions: r.scene.caption ? (typeof r.scene.caption === 'string' ? [{ at: 0, to: r.scene.duration, text: r.scene.caption }] : r.scene.caption) : [],
      duration: r.scene.duration,
    })),
    seek,
    frame: () => store.get(),
    active: () => clock.activeAnimations(),
    errors: () => clock.takeErrors(),
    audit: () => audit(def),
  }
  ;(window as unknown as { __video: typeof api }).__video = api

  remount()
  clock.seed(1)
  await clock.settle()
  // Preroll: play the opening so frame 0 already shows something.
  for (let f = -tl.preroll + 1; f <= 0; f++) await advance(f)
  if (tl.preroll === 0) await clock.step(timeOf(0))
  html.dataset.ready = 'true'
}

void start()
