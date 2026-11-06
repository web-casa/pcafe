import { useEffect, type ReactNode } from 'react'
import type { Geometry, PageMode } from './geometry'
import type { PrintDef } from './types'

const MODES: { id: PageMode; label: string }[] = [
  { id: 'proof', label: '成品' },
  { id: 'bleed', label: '含出血' },
  { id: 'print', label: '含裁切线' },
]

/** Scales the sheets to the window on screen only. A real print or the export never takes this path. */
export function fitToWindow() {
  const set = document.querySelector<HTMLElement>('.pr-sheetset')
  if (!set) return
  const pages = [...set.querySelectorAll<HTMLElement>(':scope > .pr-page')]
  if (!pages.length) return
  const W = Math.max(...pages.map((p) => p.offsetWidth))
  const H = pages[0].offsetHeight
  const long = document.documentElement.dataset.print === 'long'
  const k = Math.min(1, (window.innerWidth - 32) / W, long ? 1 : (window.innerHeight - 88) / H)
  const total = pages.reduce((n, p) => n + p.offsetHeight + 24, 0)
  set.style.transform = `scale(${k})`
  set.style.transformOrigin = '0 0'
  set.style.width = `${W}px`
  const wrap = set.parentElement!
  wrap.style.width = `${W * k}px`
  wrap.style.height = `${total * k}px`
}

export function Viewer({ def, g, mode, exporting, guides, children }: { def: PrintDef; g: Geometry; mode: PageMode; exporting: boolean; guides: boolean; children: ReactNode }) {
  useEffect(() => {
    if (exporting) return
    window.addEventListener('resize', fitToWindow)
    return () => window.removeEventListener('resize', fitToWindow)
  }, [exporting])
  if (exporting) return <>{children}</>
  const link = (m: PageMode, gu = guides) => `?mode=${m}${gu ? '&guides=1' : ''}`
  return (
    <div className="pr-view">
      <nav className="pr-bar">
        <b>{def.title}</b>
        <span>{g.label}</span>
        {def.format !== 'long' && MODES.map((m) => <a key={m.id} href={link(m.id)} aria-current={m.id === mode ? 'true' : undefined}>{m.label}</a>)}
        <a href={link(mode, !guides)} aria-pressed={guides}>辅助线</a>
      </nav>
      <div className="pr-fit">{children}</div>
    </div>
  )
}
