// Node-side static slide fingerprint probe.
// Loaded via Vite SSR by scripts/slide-fingerprints.mjs so `pcafe check --changed`
// can detect per-slide changes in milliseconds without opening Chromium to animate
// every slide first. Uses raw StaticSlide markup (NOT outline's reduce() text)
// so class names, structure and attributes are preserved.
import { createHash } from 'node:crypto'
import { renderToStaticMarkup } from 'react-dom/server'
import { StaticSlide } from '../deck/features/presenter'
import { DEFAULT_STYLE, themeVars, toneOf } from '../kit/theme'
import { creditOn } from './attribution'
import { deck as activeDeck } from '../decks/active'

const sha = (text: string) => createHash('sha256').update(text).digest('hex').slice(0, 20)

export interface NodeSlideFingerprint {
  n: number
  id: string
  occurrence: number
  hash: string | null
  ssrOk: boolean
}

export interface NodeDeckProbe {
  total: number
  ids: string[]
  settings: string
  slides: NodeSlideFingerprint[]
  allSsrOk: boolean
}

export function probeActiveDeck(): NodeDeckProbe {
  const style = activeDeck.style ?? DEFAULT_STYLE
  const total = activeDeck.slides.length
  const vars = themeVars(activeDeck.theme, style)
  const settingsObj = {
    title: activeDeck.title,
    style,
    theme: activeDeck.theme ?? null,
    vars,
    iconStyle: activeDeck.iconStyle ?? null,
    emojiStyle: activeDeck.emojiStyle ?? null,
    texture: activeDeck.texture ?? 'none',
    transition: activeDeck.transition ?? 'fade',
    backdrop: activeDeck.backdrop ?? 'none',
    attribution: activeDeck.attribution ?? null,
    credit: creditOn(activeDeck.attribution),
    lang: activeDeck.lang ?? 'zh-CN',
  }
  const seen = new Map<string, number>()
  const slides: NodeSlideFingerprint[] = []
  let allSsrOk = true

  for (let i = 0; i < total; i++) {
    const slide = activeDeck.slides[i]
    const id = slide.id || String(i + 1)
    const occurrence = (seen.get(id) ?? 0) + 1
    seen.set(id, occurrence)
    let html = ''
    let ssrOk = false
    try {
      html = renderToStaticMarkup(<StaticSlide slide={slide} style={style} u={1} index={i} total={total} />)
      ssrOk = html.trim().length > 0
    } catch {
      ssrOk = false
    }
    if (!ssrOk) allSsrOk = false
    const meta = JSON.stringify({
      n: i + 1,
      id,
      occurrence,
      label: slide.label,
      tone: toneOf(slide.tone, style) ?? null,
      build: slide.build ?? null,
      backdrop: slide.backdrop ?? null,
      notes: slide.notes ?? null,
      seconds: slide.seconds ?? null,
    })
    slides.push({
      n: i + 1,
      id,
      occurrence,
      hash: ssrOk ? sha(`${meta}\n${html}`) : null,
      ssrOk,
    })
  }

  return {
    total,
    ids: slides.map((s) => s.id),
    settings: sha(JSON.stringify(settingsObj)),
    slides,
    allSsrOk,
  }
}
