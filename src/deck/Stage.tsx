import { createContext, useContext, useLayoutEffect, useState, type ReactNode } from 'react'

export const DESIGN_W = 1920
export const DESIGN_H = 1080

const UnitContext = createContext(1)

/** Pixels per design unit. Use it for values Motion must scale-correct (border radius). */
export const useUnit = () => useContext(UnitContext)

/** Renders children at a different scale, e.g. a slide thumbnail. Pair with a `--u` style on the container. */
export function UnitScope({ u, children }: { u: number; children: ReactNode }) {
  return <UnitContext.Provider value={u}>{children}</UnitContext.Provider>
}

export const fitUnit = () => Math.min(window.innerWidth / DESIGN_W, window.innerHeight / DESIGN_H)

export function applyUnit(u: number) {
  document.documentElement.style.setProperty('--u', `${u}px`)
}

/** Fixed 16:9 canvas, letterboxed. Sized through --u rather than a transform. */
export function Stage({ children }: { children: ReactNode }) {
  const [u, setU] = useState(fitUnit)

  useLayoutEffect(() => {
    const update = () => setU(fitUnit())
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useLayoutEffect(() => applyUnit(u), [u])

  return (
    <UnitContext.Provider value={u}>
      <div className="viewport">
        <main className="stage">{children}</main>
      </div>
    </UnitContext.Provider>
  )
}
