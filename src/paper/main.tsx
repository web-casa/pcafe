import { setEmojiStyle } from '../emoji'
import { createRoot } from 'react-dom/client'
import { MotionGlobalConfig } from 'motion/react'
import { themeVars, DEFAULT_THEME, type ThemeName } from '../kit/theme'
import { paper as activePaper } from '../papers/active'
import { loadFaces, paginate } from './paginate'
import { ReportView } from './Paper'
import { ResumeView } from './Resume'
import type { PaperDef } from './types'
import '../styles'
import '../styles/paper.css'

// Dev only: `?paper=<folder>` previews any paper without touching active.ts.
const devPapers = import.meta.env.DEV ? import.meta.glob<{ paper: PaperDef }>('../papers/*/index.tsx') : {}
const q = new URLSearchParams(location.search)
const param = q.get('paper')

async function start() {
  const loader = param ? devPapers[`../papers/${param}/index.tsx`] : undefined
  const def: PaperDef = loader ? (await loader()).paper : activePaper
  const theme = (q.get('theme') as ThemeName | null) ?? def.theme ?? DEFAULT_THEME
  const html = document.documentElement
  for (const [k, v] of Object.entries(themeVars(theme, 'standard'))) html.style.setProperty(k, String(v))
  html.dataset.paper = def.kind
  html.dataset.style = 'standard'
  html.dataset.p5 = 'print'
  html.lang = def.lang === 'en' ? 'en' : 'zh-CN'
  MotionGlobalConfig.skipAnimations = true
  setEmojiStyle(def.emojiStyle)
  const root = createRoot(document.getElementById('root')!)
  if (def.kind === 'resume') {
    document.title = `${def.name} · ${def.headline}`
    await loadFaces()
    root.render(<ResumeView def={def} />)
  } else {
    document.title = def.title
    html.dataset.look = def.look ?? 'editorial'
    const plan = await paginate(def)
    root.render(<ReportView def={def} plan={plan} />)
  }
  document.documentElement.dataset.ready = 'true'
}

void start()
