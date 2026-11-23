import type { ReactNode } from 'react'

export type SlateIcon = 'bolt' | 'up' | 'spark' | 'chart' | 'link' | 'shield' | 'clock' | 'check'

const PATHS: Record<SlateIcon, ReactNode> = {
  bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7z" fill="currentColor" />,
  up: <path d="M3 17l6-6 4 4 8-8M15 7h6v6" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />,
  spark: <path d="M12 2l2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2z" fill="currentColor" />,
  chart: <path d="M5 20V11M12 20V4M19 20v-6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />,
  link: (
    <path
      d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
  ),
  shield: <path d="M12 2 4 5v6c0 5 3.4 9.3 8 11 4.6-1.7 8-6 8-11V5z" fill="currentColor" />,
  clock: <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 4v5l3.5 2" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />,
  check: <path d="M4 12.5 9.5 18 20 6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />,
}

/** A small tilted gradient tile with a white glyph; sits inline in a headline at 0.9em. */
export function Tile({ icon, className = '' }: { icon: SlateIcon; className?: string }) {
  return (
    <span className={`sl-tile ${className}`} aria-hidden="true">
      <svg viewBox="0 0 24 24">{PATHS[icon]}</svg>
    </span>
  )
}

/** Renders `{icon}` tokens in a line as inline tiles, e.g. "用 {bolt} 数衡". */
export function TileLine({ text }: { text: string }) {
  const parts = text.split(/\{(\w+)\}/)
  return <>{parts.map((p, i) => (i % 2 ? <Tile key={i} icon={p as SlateIcon} /> : p))}</>
}

/** Small dot label above a title. */
export function Dot({ children }: { children: ReactNode }) {
  return <span className="sl-dot">{children}</span>
}
