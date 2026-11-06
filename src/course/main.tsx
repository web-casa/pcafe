import { setEmojiStyle } from '../emoji'
import { createRoot } from 'react-dom/client'
import { MotionGlobalConfig } from 'motion/react'
import { IconStyleProvider } from '../kit/Icon'
import { themeVars, DEFAULT_THEME, type ThemeName } from '../kit/theme'
import { course as activeCourse } from '../courses/active'
import { Course } from './Course'
import { UI, UiContext } from './i18n'
import { validate } from './validate'
import { manifest } from './manifest'
import type { CourseDef } from './types'
import '../styles'
import '../styles/course.css'

// Dev only: `?course=<folder>` previews any course without touching active.ts.
const devCourses = import.meta.env.DEV ? import.meta.glob<{ course: CourseDef }>('../courses/*/index.tsx') : {}
const q = new URLSearchParams(location.search)
const param = q.get('course')

declare global {
  interface Window {
    __course?: { problems: string[]; manifest: unknown }
  }
}

async function start() {
  const loader = param ? devCourses[`../courses/${param}/index.tsx`] : undefined
  const def: CourseDef = loader ? (await loader()).course : activeCourse
  const theme = (q.get('theme') as ThemeName | null) ?? def.theme ?? DEFAULT_THEME
  const html = document.documentElement
  for (const [k, v] of Object.entries(themeVars(theme, 'standard'))) html.style.setProperty(k, String(v))
  html.dataset.course = def.id
  html.dataset.style = 'standard'
  html.dataset.look = def.look ?? 'editorial'
  html.lang = def.lang === 'en' ? 'en' : 'zh-CN'
  document.title = def.title
  MotionGlobalConfig.skipAnimations = true

  const problems = validate(def)
  for (const p of problems) console.error(`course: ${p}`)
  // Read by scripts/course-qa.mjs. The answers are in this file anyway: it works offline.
  window.__course = { problems, manifest: manifest(def) }

  setEmojiStyle(def.emojiStyle)
  createRoot(document.getElementById('root')!).render(
    <UiContext.Provider value={UI[def.lang ?? 'zh']}>
      <IconStyleProvider value={def.iconStyle}>
        <Course course={def} />
      </IconStyleProvider>
    </UiContext.Provider>,
  )
  await document.fonts.ready
  html.dataset.ready = 'true'
}

void start()
