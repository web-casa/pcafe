// Small pieces shared by the panel-style templates (PanelCards, IndexStack,
// AskAnswer, HangingCover …). Not slides on their own.

import type { ReactNode } from 'react'
import { Icon, type IconName } from './Icon'
import { vars } from './shared'

/** 1–6: which --spot colour a tile uses. 1 is the theme accent. */
export type Spot = 1 | 2 | 3 | 4 | 5 | 6

/** A rounded colour square holding a white icon, the way app icons sit in a dock. */
export function IconTile({ icon, spot = 1, size = 56, className }: { icon: IconName; spot?: Spot; size?: number; className?: string }) {
  return (
    <span className={`tile${className ? ` ${className}` : ''}`} style={vars({ '--tile': `var(--spot-${spot})`, '--ts': size })} aria-hidden>
      <Icon name={icon} size={Math.round(size * 0.52)} variant="bold" />
    </span>
  )
}

/** Two laurel branches around a short title. Use only for awards, ratings or rankings you can cite. */
export function Laurel({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="laurel">
      <LaurelBranch />
      <div className="laurel__text">
        <b>{title}</b>
        {sub && <span>{sub}</span>}
      </div>
      <LaurelBranch flip />
    </div>
  )
}

// The stem is a quadratic curve bulging outwards; leaves grow upwards along it
// in pairs (outer and inner), shrinking towards the tip.
const STEM = [
  [40, 116],
  [-2, 66],
  [30, 6],
] as const
const LEAF = 'M0 0 C 5 -4.6, 13 -4.6, 18 0 C 13 4.6, 5 4.6, 0 0 Z'
const at = (t: number) => {
  const [p0, p1, p2] = STEM
  const m = 1 - t
  const x = m * m * p0[0] + 2 * m * t * p1[0] + t * t * p2[0]
  const y = m * m * p0[1] + 2 * m * t * p1[1] + t * t * p2[1]
  const dx = 2 * m * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0])
  const dy = 2 * m * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1])
  return { x, y, a: (Math.atan2(dy, dx) * 180) / Math.PI }
}
const LEAVES = Array.from({ length: 7 }, (_, i) => {
  const t = 0.1 + i * 0.13
  const { x, y, a } = at(t)
  const s = 1.05 - i * 0.07
  return [
    { x, y, r: a - 42, s },
    { x, y, r: a + 38, s: s * 0.82 },
  ]
}).flat()

function LaurelBranch({ flip }: { flip?: boolean }) {
  const [p0, p1, p2] = STEM
  const tip = at(1)
  return (
    <svg className="laurel__branch" viewBox="0 0 48 120" aria-hidden style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      <path d={`M${p0[0]} ${p0[1]} Q ${p1[0]} ${p1[1]}, ${p2[0]} ${p2[1]}`} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      {LEAVES.map((l, i) => (
        <path key={i} d={LEAF} fill="currentColor" transform={`translate(${l.x} ${l.y}) rotate(${l.r}) scale(${l.s})`} />
      ))}
      <path d={LEAF} fill="currentColor" transform={`translate(${tip.x} ${tip.y}) rotate(${tip.a}) scale(0.7)`} />
    </svg>
  )
}

/** A pill: the small rounded label used for tags, eyebrows and fake buttons. */
export function Pill({ children, tone = 'line', icon }: { children: ReactNode; tone?: 'line' | 'solid' | 'soft' | 'accent'; icon?: IconName }) {
  return (
    <span className={`pill pill--${tone}`}>
      {icon && <Icon name={icon} size={22} />}
      {children}
    </span>
  )
}

// ── Mini interfaces drawn inside a card ───────────────────────────────────

export type PanelUI =
  | { kind: 'list'; rows: { label: string; value: string; tone?: 'up' | 'down' }[] }
  | { kind: 'figure'; value: string; note?: string; delta?: string }
  | { kind: 'bars'; values: number[]; label?: string; value?: string }
  | { kind: 'progress'; rows: { label: string; value: number; max: number; display: string }[] }
  | { kind: 'convert'; from: { label: string; value: string; unit: string }; to: { label: string; value: string; unit: string } }
  | { kind: 'chips'; items: { icon: IconName; label: string; spot?: Spot }[] }

export function MiniUI({ ui }: { ui: PanelUI }) {
  switch (ui.kind) {
    case 'list':
      return (
        <ul className="mui mui-list">
          {ui.rows.map((r) => (
            <li key={r.label}>
              <span>{r.label}</span>
              <b className={r.tone ? `is-${r.tone}` : undefined}>{r.value}</b>
            </li>
          ))}
        </ul>
      )
    case 'figure':
      return (
        <div className="mui mui-figure">
          <b>{ui.value}</b>
          {ui.delta && <em>{ui.delta}</em>}
          {ui.note && <span>{ui.note}</span>}
        </div>
      )
    case 'bars': {
      const max = Math.max(...ui.values)
      // The tallest bar is the one worth pointing at (ties: the first).
      const top = ui.values.indexOf(max)
      return (
        <div className="mui mui-bars">
          {(ui.label || ui.value) && (
            <div className="mui-bars__head">
              {ui.label && <span>{ui.label}</span>}
              {ui.value && <b>{ui.value}</b>}
            </div>
          )}
          <div className="mui-bars__plot">
            {ui.values.map((v, i) => (
              <i key={i} className={i === top ? 'is-top' : undefined} style={vars({ '--h': v / max, '--k': i })} />
            ))}
          </div>
        </div>
      )
    }
    case 'progress':
      return (
        <ul className="mui mui-progress">
          {ui.rows.map((r, i) => (
            <li key={r.label}>
              <div>
                <span>{r.label}</span>
                <b>{r.display}</b>
              </div>
              <i style={vars({ '--p': Math.min(1, r.value / r.max), '--k': i })} />
            </li>
          ))}
        </ul>
      )
    case 'convert':
      return (
        <div className="mui mui-convert">
          {[ui.from, ui.to].map((side, i) => (
            <div key={i} className="mui-convert__side">
              <span>{side.label}</span>
              <b>{side.value}</b>
              <em>{side.unit}</em>
            </div>
          ))}
          <span className="mui-convert__swap" aria-hidden>
            <Icon name="transfer" size={22} />
          </span>
        </div>
      )
    case 'chips':
      return (
        <ul className="mui mui-chips">
          {ui.items.map((c, i) => (
            <li key={c.label}>
              <IconTile icon={c.icon} spot={c.spot ?? (((i % 6) + 1) as Spot)} size={34} />
              {c.label}
            </li>
          ))}
        </ul>
      )
  }
}
