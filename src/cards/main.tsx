import { setEmojiStyle } from '../emoji'
import { createRoot } from 'react-dom/client'
import { IconStyleProvider } from '../kit/Icon'
import { DEFAULT_THEME, THEMES, themeVars, type DeckStyle, type ThemeName } from '../kit/theme'
import { set as activeSet } from '../cardsets/active'
import { ExportStack, Gallery } from './Gallery'
import { place } from './CardFrame'
import { PRESETS } from './presets'
import type { CardSetDef } from './types'
import '../styles/fonts.css'
import '../styles/deck.css'
import '../styles/presets.css'
import '../styles/cards.css'

// Dev only: `?set=<folder>` previews any card set without touching active.ts.
const devSets = import.meta.env.DEV ? import.meta.glob<{ set: CardSetDef }>(['../cardsets/*/index.tsx', '!../cardsets/_*/index.tsx']) : {}
const q = new URLSearchParams(location.search)

const lum = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const contrast = (a: string, b: string) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m)
  return (x + 0.05) / (y + 0.05)
}

async function start() {
  const param = q.get('set')
  const loader = param ? devSets[`../cardsets/${param}/index.tsx`] : undefined
  const def: CardSetDef = loader ? (await loader()).set : activeSet
  const theme = (q.get('theme') as ThemeName | null) ?? def.theme ?? DEFAULT_THEME
  const style: DeckStyle = def.style ?? 'standard'
  const html = document.documentElement
  for (const [k, v] of Object.entries(themeVars(theme, style))) html.style.setProperty(k, String(v))
  // Whichever of ink or white reads better on this theme's accent, so a light accent still has a legible card.
  const t = THEMES[theme]
  const darkOn = contrast(t.accent, '#17171b') > contrast(t.accent, '#ffffff')
  html.dataset.onAccent = darkOn ? 'ink' : 'white'
  html.dataset.cards = q.has('export') ? 'export' : 'gallery'
  html.dataset.style = style
  html.lang = def.lang === 'en' ? 'en' : 'zh-CN'
  document.title = def.title
  setEmojiStyle(def.emojiStyle)
  const root = createRoot(document.getElementById('root')!)
  root.render(
    <IconStyleProvider value={def.iconStyle}>
      {q.has('export') ? <ExportStack set={def} only={q.get('only')} /> : <Gallery set={def} />}
    </IconStyleProvider>,
  )
  // Fonts load only once text uses them, and charts measure after layout: both have to settle first.
  await new Promise(requestAnimationFrame)
  await document.fonts.ready
  await new Promise(requestAnimationFrame)
  // What the export and QA scripts need, without parsing the page.
  ;(window as unknown as { __cards: unknown }).__cards = {
    title: def.title,
    cards: place(def).map((p) => ({ index: p.index, preset: p.name, cover: p.cover, t: p.card.t, source: p.card.source, ...PRESETS[p.name] })),
  }
  html.dataset.ready = 'true'
}

void start()
