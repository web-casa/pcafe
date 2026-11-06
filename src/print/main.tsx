import { createRoot } from 'react-dom/client'
import { MotionGlobalConfig } from 'motion/react'
import { setEmojiStyle } from '../emoji'
import { IconStyleProvider } from '../kit/Icon'
import { DEFAULT_THEME, themeVars, type ThemeName } from '../kit/theme'
import { print as activePrint } from '../prints/active'
import { geometry, pageBox, type PageMode } from './geometry'
import { SLICES } from './presets'
import { Sheet } from './Sheet'
import type { LongDef, PrintDef, SliceName } from './types'
import { Viewer, fitToWindow } from './Viewer'
import '../styles'
import '../styles/print.css'

// Dev only: `?print=<folder>` previews any item without touching active.ts.
const devItems = import.meta.env.DEV ? import.meta.glob<{ print: PrintDef }>(['../prints/*/index.tsx', '!../prints/_*/index.tsx']) : {}
const q = new URLSearchParams(location.search)

function setPageRule(wMm: number, hMm: number) {
  let el = document.getElementById('pr-page-rule') as HTMLStyleElement | null
  if (!el) {
    el = document.createElement('style')
    el.id = 'pr-page-rule'
    document.head.append(el)
  }
  el.textContent = `@page{size:${wMm}mm ${hMm}mm;margin:0}`
}

/** Sections grouped so no group passes `maxH`. A section is never split. */
function sliceGroups(name: SliceName) {
  const secs = [...document.querySelectorAll<HTMLElement>('.pr-sec')].map((el) => ({ id: el.dataset.sec!, h: el.getBoundingClientRect().height }))
  const max = SLICES[name].maxH
  const groups: { ids: string[]; h: number }[] = []
  for (const s of secs) {
    const last = groups.at(-1)
    if (last && last.h + s.h <= max) {
      last.ids.push(s.id)
      last.h += s.h
    } else groups.push({ ids: [s.id], h: s.h })
  }
  return groups
}

async function start() {
  const param = q.get('print')
  const loader = param ? devItems[`../prints/${param}/index.tsx`] : undefined
  const def: PrintDef = loader ? (await loader()).print : activePrint
  const theme = (q.get('theme') as ThemeName | null) ?? def.theme ?? DEFAULT_THEME
  const style = def.style ?? 'standard'
  const html = document.documentElement
  for (const [k, v] of Object.entries(themeVars(theme, style))) html.style.setProperty(k, String(v))
  const g = geometry(def)
  const mode = (q.get('mode') as PageMode | null) ?? 'proof'
  const exporting = q.has('export')
  const guides = q.get('guides') === '1'
  html.dataset.print = def.format
  html.dataset.mode = mode
  html.dataset.style = style
  html.dataset.p5 = 'print'
  html.dataset.export = exporting ? '1' : '0'
  html.lang = def.lang === 'en' ? 'en' : 'zh-CN'
  html.style.setProperty('--bleed', `${g.bleed}mm`)
  html.style.setProperty('--tier-head', `${g.tiers.head}mm`)
  html.style.setProperty('--tier-head-latin', `${g.tiers.headLatin}mm`)
  html.style.setProperty('--tier-read', `${g.tiers.read}mm`)
  html.style.setProperty('--tier-fine', `${g.tiers.fine}mm`)
  document.title = def.title
  MotionGlobalConfig.skipAnimations = true
  setEmojiStyle(def.emojiStyle ?? 'noto')
  const box = pageBox(g, mode)
  if (def.format !== 'long') setPageRule(box.w, box.h)

  const root = createRoot(document.getElementById('root')!)
  const render = (key: number) => root.render(
    <IconStyleProvider value={def.iconStyle}>
      <Viewer def={def} g={g} mode={mode} exporting={exporting} guides={guides}>
        <div key={key} className="pr-sheetset"><Sheet def={def} g={g} mode={mode} guides={guides} /></div>
      </Viewer>
    </IconStyleProvider>,
  )
  render(0)
  // Fonts load only once text uses them. Parts and fitted titles measure text, so they render again after.
  await new Promise(requestAnimationFrame)
  await document.fonts.ready
  await new Promise(requestAnimationFrame)
  render(1)
  await new Promise(requestAnimationFrame)
  await document.fonts.ready
  await new Promise(requestAnimationFrame)
  await new Promise(requestAnimationFrame)
  await Promise.all([...document.images].map((i) => i.decode().catch(() => {})))

  const longH = () => document.querySelector('.pr-long')?.getBoundingClientRect().height ?? 0
  const describe = () => {
    const unscaled = (document.querySelector<HTMLElement>('.pr-long')?.offsetHeight ?? 0) * (25.4 / 96)
    return {
      title: def.title,
      theme,
      style,
      emojiStyle: def.emojiStyle ?? 'noto',
      sample: def.sample ?? null,
      ...g,
      trimH: def.format === 'long' ? unscaled : g.trimH,
      slices: def.format === 'long' ? ((def as LongDef).slices ?? []) : [],
      sections: def.format === 'long' ? (def as LongDef).sections.map((s) => ({ id: s.id, source: s.source ?? null })) : [],
    }
  }
  ;(window as unknown as { __print: unknown }).__print = {
    describe,
    longH,
    sliceGroups,
    /** One xhs slice: only these sections, stretched to the slice's exact height. */
    showSlice(ids: string[], heightPx: number) {
      html.dataset.slicing = '1'
      const long = document.querySelector<HTMLElement>('.pr-long')!
      long.style.height = `${heightPx}px`
      for (const s of document.querySelectorAll<HTMLElement>('.pr-sec')) s.style.display = ids.includes(s.dataset.sec!) ? '' : 'none'
    },
  }
  if (!exporting) fitToWindow()
  html.dataset.ready = 'true'
}

void start()
