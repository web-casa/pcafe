import { setEmojiStyle } from '../emoji'
import { createRoot } from 'react-dom/client'
import { themeVars, DEFAULT_THEME } from '../kit/theme'
import { screen as activeScreen } from '../screens/active'
import { Feed } from './feed'
import { typeScale } from './legibility'
import { Player, PlayerBoundary } from './Player'
import { RuntimeContext, createRuntime, readParams, type Runtime } from './runtime'
import { instantOf } from './time'
import type { DataDef, Orientation, ScreenDef } from './types'
import '../styles/fonts.css'
import '../styles/screen.css'

// Dev only: `?screen=<folder>` previews any screen without touching active.ts.
const devScreens = import.meta.env.DEV ? import.meta.glob<{ screen: ScreenDef<never> }>('../screens/*/index.tsx') : {}

function applyGeometry(def: ScreenDef<never>, rotate: number, onLog: (m: string) => void) {
  const html = document.documentElement
  const turned = rotate === 90 || rotate === 270
  const W = turned ? window.innerHeight : window.innerWidth
  const H = turned ? window.innerWidth : window.innerHeight
  const fits: Orientation = H > W ? 'portrait' : 'landscape'
  const orientation: Orientation = def.orientation === 'both' ? fits : def.orientation
  if (orientation !== fits) onLog(`written for ${orientation}, shown on a ${fits} display: letterboxed`)
  const [dw, dh] = orientation === 'portrait' ? [1080, 1920] : [1920, 1080]
  const u = Math.min(W / dw, H / dh)
  // Inside its own orientation the canvas fills the display, so a 21:9 or 4:3 panel gets no bars.
  const cw = orientation === fits ? W : dw * u
  const ch = orientation === fits ? H : dh * u
  html.dataset.orient = orientation
  html.dataset.rotate = String(rotate)
  html.style.setProperty('--u', `${u}px`)
  html.style.setProperty('--cw', `${cw}px`)
  html.style.setProperty('--ch', `${ch}px`)
  html.style.setProperty('--vw', `${W}px`)
  html.style.setProperty('--vh', `${H}px`)
  return orientation
}

async function start() {
  const q = new URLSearchParams(location.search)
  const params = readParams()
  const name = q.get('screen')
  const loader = name ? devScreens[`../screens/${name}/index.tsx`] : undefined
  const def = loader ? (await loader()).screen : activeScreen
  const html = document.documentElement

  const vars = themeVars(def.theme ?? DEFAULT_THEME, 'standard') as Record<string, string | number>
  for (const [k, v] of Object.entries(vars)) html.style.setProperty(k, String(v))
  const scale = typeScale(def.venue)
  html.style.setProperty('--read', String(scale.read))
  html.style.setProperty('--read-latin', String(scale.readLatin))
  html.style.setProperty('--fine', String(scale.fine))
  html.style.setProperty('--speed', String(params.speed))
  html.dataset.screen = 'on'
  html.dataset.face = def.face ?? 'grotesk'
  html.dataset.atmosphere = def.atmosphere ?? 'none'
  html.dataset.flip = '0'
  html.dataset.ticker = def.ticker ? '1' : '0'
  html.dataset.sample = def.sample ? '1' : '0'
  html.lang = def.lang === 'en' ? 'en' : 'zh-CN'
  document.title = def.title

  const startAt = params.now ? instantOf(params.now, def.timezone) : null
  let orientation: Orientation = 'landscape'
  const rt: Runtime = createRuntime(def, startAt, params, () => orientation)
  orientation = applyGeometry(def, params.rotate, (m) => rt.log.record('layout', m))
  window.addEventListener('resize', () => { orientation = applyGeometry(def, params.rotate, () => {}) })

  const source = params.data ?? def.data?.source
  if (def.data && source) {
    rt.feed = new Feed(def.data as DataDef<unknown>, source, def.title, rt.clock, rt.log)
    rt.feed.start()
  }

  await document.fonts.ready.catch(() => {})
  setEmojiStyle(def.emojiStyle)
  const root = createRoot(document.getElementById('root')!, {
    // React would print these to the console. They are handled: scene errors skip the scene.
    onCaughtError: () => {},
    onUncaughtError: (e) => rt.log.record('player', e instanceof Error ? e.message : String(e)),
    onRecoverableError: () => {},
  })
  root.render(
    <RuntimeContext.Provider value={rt}>
      <div className="scr-root">
        <div className="scr-backdrop" />
        <PlayerBoundary rt={rt}>
          <Player />
        </PlayerBoundary>
      </div>
    </RuntimeContext.Provider>,
  )
  html.dataset.ready = 'true'
}

void start()
