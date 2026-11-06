// Phase 3 parts: CSS-drawn 3D objects for the toy3d style and the system
// chrome (window, toggle, dock, menu clock) for the wallpaper style. Not slides
// on their own; templates place them. None of them carries facts.

import { useState, type CSSProperties, type ReactNode } from 'react'
import type { IconName } from './Icon'
import { IconTile, type Spot } from './parts'
import { vars } from './shared'

export type ShapeKind = 'sphere' | 'cube' | 'torus' | 'capsule'

export interface ShapeSpec {
  kind: ShapeKind
  spot?: Spot
  /** Edge length in u. */
  size?: number
  /** Position of the shape centre in % of its positioned parent. */
  x: number
  y: number
  /** Tilt in degrees (capsule and torus only). */
  rot?: number
}

/**
 * A glossy toy object drawn in CSS: lit from the top left, a soft contact
 * shadow underneath, a slow float. The cube is a real CSS 3D box.
 */
export function Shape3D({ kind, spot = 1, size = 140, x, y, rot = 0 }: ShapeSpec) {
  return (
    <span className={`shape shape--${kind}`} style={vars({ '--c': `var(--spot-${spot})`, '--sz': size, left: `${x}%`, top: `${y}%`, '--rot': `${rot}deg`, '--delay': `${-((x + y) % 6)}s` })} aria-hidden>
      <span className="shape__body">
        {kind === 'cube' && (
          <span className="shape__box">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </span>
        )}
      </span>
      <span className="shape__shadow" />
    </span>
  )
}

/** A line of giant text sliding sideways forever. Decorative: repeats a word already on the slide. */
export function Marquee({ text, className }: { text: string; className?: string }) {
  const run = (
    <span>
      {Array.from({ length: 4 }, (_, i) => (
        <b key={i}>
          {text}
          <i>✦</i>
        </b>
      ))}
    </span>
  )
  return (
    <div className={`marquee${className ? ` ${className}` : ''}`} aria-hidden data-crop>
      <div className="marquee__track">
        {run}
        {run}
      </div>
    </div>
  )
}

/** A system window: three dots and a title in the bar, anything in the body. */
export function Window({ title, children, className, style }: { title: string; children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div className={`win${className ? ` ${className}` : ''}`} style={style}>
      <div className="win__bar">
        <i aria-hidden />
        <i aria-hidden />
        <i aria-hidden />
        <span>{title}</span>
      </div>
      <div className="win__body">{children}</div>
    </div>
  )
}

/** An on/off switch the presenter can click. */
export function Toggle({ on: initial, label }: { on: boolean; label: string }) {
  const [on, setOn] = useState(initial)
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} className="toggle" onClick={() => setOn((v) => !v)}>
      <i />
    </button>
  )
}

export interface DockApp {
  icon: IconName
  label: string
  spot?: Spot
}

/** A row of app icons on a frosted shelf, like the bottom of a desktop. */
export function Dock({ apps }: { apps: DockApp[] }) {
  return (
    <ul className="dock">
      {apps.map((a, i) => (
        <li key={a.label} title={a.label}>
          <IconTile icon={a.icon} spot={a.spot ?? (((i % 5) + 1) as Spot)} size={72} />
        </li>
      ))}
    </ul>
  )
}

/** A desktop shortcut: big icon tile with its name below. */
export function AppIcon({ icon, label, spot = 1 }: DockApp) {
  return (
    <div className="appicon">
      <IconTile icon={icon} spot={spot} size={96} />
      <span>{label}</span>
    </div>
  )
}
