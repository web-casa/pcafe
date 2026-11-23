import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'

/** Fixed palette for the small dark widgets (legend dots, bars, lines). */
export const DUSK_INK = ['#8fd19e', '#c9b6ff', '#f5b84b', '#e9e4dc', '#ef6f6f', '#7cc4f2']

export function Tag({ icon, children }: { icon?: string; children: ReactNode }) {
  return (
    <span className="du-tag">
      {icon && <i aria-hidden="true">{icon}</i>}
      {children}
    </span>
  )
}

/** The sunset gradient panel. `tone` "pink" is the softer, lighter variant. */
export function Panel({ tone = 'warm', className, children }: { tone?: 'warm' | 'pink'; className?: string; children: ReactNode }) {
  return (
    <div className={`du-panel is-${tone}${className ? ` ${className}` : ''}`} data-crop>
      {children}
    </div>
  )
}

/** A frosted frame holding a dark card, with a file-style name under it. */
export function Widget({ name, className, children }: { name?: string; className?: string; children: ReactNode }) {
  return (
    <div className={`du-wd${className ? ` ${className}` : ''}`}>
      <div className="du-wd__in">{children}</div>
      {name && <div className="du-wd__name">{name}</div>}
    </div>
  )
}

/** "- " lines are removed, "+ " added, "# " comments. */
export function lineKind(l: string) {
  if (l.startsWith('- ')) return 'is-del'
  if (l.startsWith('+ ')) return 'is-add'
  if (l.startsWith('# ') || l.startsWith('// ')) return 'is-cm'
  return ''
}

/** Numbered code lines that slide in one at a time (CSS only, so static exports show them all). */
export function CodeLines({ lines, delay = 900, step = 110 }: { lines: string[]; delay?: number; step?: number }) {
  return (
    <div className="du-code__lines" style={{ '--d0': `${delay}ms`, '--step': `${step}ms` } as CSSProperties}>
      {lines.map((l, i) => (
        <div key={i} className={lineKind(l)} style={{ '--i': i } as CSSProperties}>
          <em>{String(i + 1).padStart(2, '0')}</em>
          <span>{l || ' '}</span>
        </div>
      ))}
    </div>
  )
}

/** Counts the number inside a string like "3.2×" or "48%" up from zero. */
export function Count({ value, delay = 600 }: { value: string; delay?: number }) {
  const m = value.match(/^(\D*)([\d.,]+)(.*)$/)
  const raw = m ? m[2].replace(/,/g, '') : '0'
  const target = parseFloat(raw)
  const dec = raw.includes('.') ? raw.split('.')[1].length : 0
  const comma = !!m && m[2].includes(',')
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!m) return
    let raf = 0
    const t0 = performance.now() + delay
    const tick = (t: number) => {
      const p = Math.min(1, Math.max(0, (t - t0) / 1300))
      setV(target * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, delay]) // eslint-disable-line react-hooks/exhaustive-deps
  if (!m) return <>{value}</>
  const s = comma ? Math.round(v).toLocaleString('en-US') : v.toFixed(dec)
  return (
    <>
      {m[1]}
      {s}
      {m[3]}
    </>
  )
}

/** Smooth SVG path through points (Catmull-Rom → cubic Bézier). */
export function smooth(pts: [number, number][]) {
  if (pts.length < 2) return ''
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] ?? p2
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)}, ${c2[0].toFixed(1)} ${c2[1].toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
  }
  return d
}
