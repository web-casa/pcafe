// What an item is written with. Sizes are in mm, colours come from the theme, and text sizes come
// from the viewing distance through the tier variables, so an item has no font-size to get wrong.
import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { PrintContext, usePrint } from './context'
import type { PrintTone, TextTier } from './types'

const mm = (n: number | undefined) => (n === undefined ? undefined : `${n}mm`)

export type Fill = 'accent' | 'ink' | 'wash' | 'panel' | 'card' | 'canvas'

/** Art that runs off the edge. Anything left unset goes to the bleed. Nothing in here is checked as text. */
export function Bleed({ top, bottom, left, right, height, width, fill, tone, children }: { top?: number; bottom?: number; left?: number; right?: number; height?: number; width?: number; fill?: Fill; tone?: PrintTone; children?: ReactNode }) {
  const edge = (v: number | undefined, opposite: number | undefined, size: number | undefined) => (v !== undefined ? `${v}mm` : opposite !== undefined && size !== undefined ? undefined : 'calc(var(--bleed) * -1)')
  const style: CSSProperties = {
    top: edge(top, bottom, height),
    bottom: edge(bottom, top, height),
    left: edge(left, right, width),
    right: edge(right, left, width),
    height: mm(height),
    width: mm(width),
  }
  return <div className="pr-bleed" data-tone={tone} data-fill={fill} aria-hidden style={style}>{children}</div>
}

/** A block whose text sits on a different tone, e.g. over a `Bleed` band. */
export function Tone({ tone, children, grow }: { tone: PrintTone; children: ReactNode; grow?: boolean }) {
  const ctx = usePrint()
  return (
    <PrintContext.Provider value={{ ...ctx, tone }}>
      <div className="pr-tone" data-tone={tone} data-grow={grow ? '' : undefined}>{children}</div>
    </PrintContext.Provider>
  )
}

export function Stack({ gap = 0, grow, justify, align, children }: { gap?: number; grow?: boolean; justify?: CSSProperties['justifyContent']; align?: CSSProperties['alignItems']; children: ReactNode }) {
  return <div className="pr-stack" data-grow={grow ? '' : undefined} style={{ gap: mm(gap), justifyContent: justify, alignItems: align }}>{children}</div>
}

/** Columns. `cols` are shares of the width, e.g. [2, 1]. */
export function Row({ gap = 0, cols, align, grow, children }: { gap?: number; cols?: number[]; align?: CSSProperties['alignItems']; grow?: boolean; children: ReactNode }) {
  const n = Array.isArray(children) ? children.filter(Boolean).length : 1
  const tpl = (cols ?? Array.from({ length: n }, () => 1)).map((c) => `minmax(0, ${c}fr)`).join(' ')
  return <div className="pr-row" data-grow={grow ? '' : undefined} style={{ gap: mm(gap), gridTemplateColumns: tpl, alignItems: align }}>{children}</div>
}

/** Pushes what follows to the bottom of a Stack. */
export const Spring = () => <div className="pr-spring" aria-hidden />

export function Rule({ strong }: { strong?: boolean }) {
  return <hr className={`pr-rule${strong ? ' is-strong' : ''}`} />
}

/**
 * The headline, one array item per line. `fit` scales it until the longest line fills the width.
 * Without `fit` it sits at the distance floor. `mark` lists lines in the accent colour.
 * `tier` sets which distance rule it is held to.
 */
export function Title({ lines, mark = [], fit, scale = 1, tier = 'head', latin, align, face = 'display' }: { lines: string[]; mark?: number[]; fit?: boolean; scale?: number; tier?: TextTier; latin?: boolean; align?: 'left' | 'center' | 'right'; face?: 'display' | 'sans' }) {
  const ref = useRef<HTMLHeadingElement>(null)
  const [size, setSize] = useState<number | null>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || !fit) return
    const measure = () => {
      const spans = [...el.querySelectorAll<HTMLElement>(':scope > span')]
      const cur = parseFloat(getComputedStyle(el).fontSize)
      const widest = Math.max(...spans.map((s) => s.getBoundingClientRect().width), 1)
      const parent = el.parentElement ?? el
      const pad = getComputedStyle(parent)
      const box = parent.clientWidth - parseFloat(pad.paddingLeft) - parseFloat(pad.paddingRight)
      const next = (cur * box * 0.995) / widest
      if (Math.abs(next - cur) > 0.25) setSize(next)
    }
    measure()
  }, [fit, size, lines])
  const base = tier === 'head' ? (latin ? 'var(--tier-head-latin)' : 'var(--tier-head)') : `var(--tier-${tier})`
  const style: CSSProperties = { fontSize: size ? `${size}px` : `calc(${base} * ${scale})`, textAlign: align }
  return (
    <h1 ref={ref} className="pr-title" data-tier={tier} data-face={face} style={style}>
      {lines.map((l, i) => <span key={i} className={mark.includes(i) ? 'is-mark' : undefined}>{l}</span>)}
    </h1>
  )
}

/** A heading for a block, sized off the reading tier. */
export function Heading({ children, scale = 1.5, tier = 'read' }: { children: ReactNode; scale?: number; tier?: TextTier }) {
  return <h2 className="pr-heading" data-tier={tier} style={{ fontSize: `calc(var(--tier-${tier}) * ${scale})` }}>{children}</h2>
}

export function Kicker({ children, tier = 'read' }: { children: ReactNode; tier?: TextTier }) {
  return <p className="pr-kicker" data-tier={tier}>{children}</p>
}

/** Ordinary text. `scale` only goes up: the floor comes from the viewing distance. */
export function Text({ children, scale = 1, tier = 'read', strong }: { children: ReactNode; scale?: number; tier?: TextTier; strong?: boolean }) {
  return <p className={`pr-text${strong ? ' is-strong' : ''}`} data-tier={tier} style={{ fontSize: `calc(var(--tier-${tier}) * ${Math.max(1, scale)})` }}>{children}</p>
}

/** Where the facts come from. Required: QA fails a page with numbers and no source. */
export function Sources({ children }: { children: ReactNode }) {
  const { credit } = usePrint()
  return (
    <>
      <p className="pr-source" data-source data-tier="fine">{children}</p>
      {credit ? <p className="pr-source pr-imprint" data-pcafe-credit="" data-tier="fine">{credit}</p> : null}
    </>
  )
}

/** Credit for an image or a marked illustration. */
export function Credit({ children }: { children: ReactNode }) {
  return <p className="pr-source pr-credit" data-tier="fine">{children}</p>
}

/** A big value made from the headings face. For a number that carries a page, prefer a kit part. */
export function Keep({ label, children }: { label: string; children: ReactNode }) {
  return <div className="pr-keep" data-keep={label}>{children}</div>
}
