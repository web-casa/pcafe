import { useEffect, useState } from 'react'
import { hotkeyOk, stageEl, StatusPill, toUnits } from './ink'

type State = { kind: 'off' } | { kind: 'armed' } | { kind: 'zoomed'; x: number; y: number }

const NAV = new Set(['ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'Home', 'End', ' '])

/** Z then click: magnify the slide 2x around the clicked point; Z, Esc, navigation or slide change returns. */
export function Zoom({ overview, index }: { overview: boolean; index: number }) {
  const [z, setZ] = useState<State>({ kind: 'off' })

  useEffect(() => setZ({ kind: 'off' }), [index, overview])

  useEffect(() => {
    if (overview) return
    const onKey = (e: KeyboardEvent) => {
      if (NAV.has(e.key)) {
        setZ({ kind: 'off' })
        return
      }
      if (!hotkeyOk(e)) return
      if (e.key.toLowerCase() === 'z') {
        e.preventDefault()
        setZ((s) => (s.kind === 'off' ? { kind: 'armed' } : { kind: 'off' }))
      } else if (e.key === 'Escape') {
        setZ((s) => {
          if (s.kind !== 'off') e.preventDefault()
          return { kind: 'off' }
        })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [overview])

  // The stage carries the zoom as CSS variables; slide frames read them through the
  // independent `translate` / `scale` properties so Motion's own transform still composes.
  useEffect(() => {
    const st = stageEl()
    if (!st) return
    st.classList.toggle('is-zoom-armed', z.kind === 'armed')
    if (z.kind === 'zoomed') {
      st.style.setProperty('--zoom-x', String(z.x))
      st.style.setProperty('--zoom-y', String(z.y))
      st.classList.add('is-zoomed')
    } else st.classList.remove('is-zoomed')
  }, [z])
  useEffect(
    () => () => {
      stageEl()?.classList.remove('is-zoomed', 'is-zoom-armed')
    },
    [],
  )

  return (
    <>
      {z.kind === 'armed' && (
        <div
          className="zoom-capture"
          onClick={(e) => {
            e.stopPropagation()
            setZ({ kind: 'zoomed', ...toUnits(e) })
          }}
        />
      )}
      {z.kind === 'armed' && <StatusPill slot="b">放大 · 点击位置 · Z 取消</StatusPill>}
      {z.kind === 'zoomed' && <StatusPill slot="b">放大 2× · Z / Esc 还原</StatusPill>}
    </>
  )
}
