import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { Icon, type IconName } from '../Icon'
import type { PhotoImage } from '../v2/p1/img'

export interface SocialProfile {
  /** ≤ 6 字. */
  name: string
  /** ≤ 10 字. */
  role: string
  avatar: PhotoImage
}

export interface SocialMenuItem {
  icon: IconName
  /** ≤ 5 字. */
  label: string
}

export interface SocialClock {
  /** ≤ 4 字, e.g. "上海". */
  city: string
  /** Fixed "HH:MM"; leave out for a live clock. */
  time?: string
  /** Fixed [month label, day], e.g. ["11 月", "08"]; leave out for today. */
  date?: [string, string]
}

export function Avatar({ image, size = 52, ring, className }: { image: PhotoImage; size?: number; ring?: boolean; className?: string }) {
  return (
    <img
      className={`so-ava${ring ? ' is-ring' : ''}${className ? ` ${className}` : ''}`}
      src={image.src}
      alt={image.alt}
      draggable={false}
      style={{ '--s': size, objectPosition: image.focus ?? 'center' } as CSSProperties}
    />
  )
}

export function Verified() {
  return (
    <svg className="so-tick" viewBox="0 0 24 24" aria-label="已认证">
      <path d="M12 1.5l2.6 1.9 3.2-.1 1 3 2.6 1.9-1 3 1 3-2.6 1.9-1 3-3.2-.1L12 22.5l-2.6-1.9-3.2.1-1-3L2.6 15.8l1-3-1-3 2.6-1.9 1-3 3.2.1z" />
      <path d="M8 12.2l2.7 2.6L16.2 9.4" fill="none" stroke="var(--canvas)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** "12.8k" → 12800; plain numbers parse as is. */
function parseCount(s: string) {
  const m = s.trim().match(/^([\d.,]+)\s*([kKwW万]?)$/)
  if (!m) return null
  const n = parseFloat(m[1].replace(/,/g, ''))
  const mul = /[kK]/.test(m[2]) ? 1000 : /[wW万]/.test(m[2]) ? 10000 : 1
  return { n: n * mul, unit: m[2], dec: m[1].includes('.') ? m[1].split('.')[1].length : 0, mul }
}

function formatCount(base: string, add: number) {
  const p = parseCount(base)
  if (!p) return base
  if (p.mul === 1) return String(Math.round(p.n + add))
  return `${((p.n + add) / p.mul).toFixed(Math.max(p.dec, 1))}${p.unit}`
}

/** Like button: click to toggle; the heart fills with a pop and the count steps by one. */
export function Like({ count }: { count?: string }) {
  const [on, setOn] = useState(false)
  return (
    <button type="button" className={on ? 'so-act so-like is-on' : 'so-act so-like'} aria-pressed={on} onClick={() => setOn((x) => !x)}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 20.5s-7.5-4.6-9.2-9.4C1.6 7.6 3.9 4.5 7.2 4.5c2 0 3.6 1.1 4.8 2.8 1.2-1.7 2.8-2.8 4.8-2.8 3.3 0 5.6 3.1 4.4 6.6-1.7 4.8-9.2 9.4-9.2 9.4z" />
      </svg>
      <span>{count ? formatCount(count, on ? 1 : 0) : '喜欢'}</span>
    </button>
  )
}

export function Act({ kind, children }: { kind: 'comment' | 'share'; children: ReactNode }) {
  return (
    <span className="so-act">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        {kind === 'comment' ? <path d="M4 5.5h16v10H9l-5 4z" /> : <path d="M12 3.5v12M7 8.5l5-5 5 5M5 13.5v6h14v-6" />}
      </svg>
      <span>{children}</span>
    </span>
  )
}

function useNow(fixed: boolean) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    if (fixed) return
    const t = window.setInterval(() => setNow(new Date()), 15000)
    return () => window.clearInterval(t)
  }, [fixed])
  return now
}

/** Left column shared by the social templates: profile, a menu whose items highlight on click, and a clock tile. */
export function SoSide({ profile, menu, active = 0, clock }: { profile: SocialProfile; menu: SocialMenuItem[]; active?: number; clock?: SocialClock }) {
  const [on, setOn] = useState(active)
  const now = useNow(!!(clock?.time && clock?.date))
  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')
  const time = clock?.time ?? `${hh}:${mm}`
  const date = clock?.date ?? [`${now.getMonth() + 1} 月`, String(now.getDate()).padStart(2, '0')]
  const [h, m] = time.split(':')
  return (
    <aside className="so-side">
      <div className="so-me">
        <Avatar image={profile.avatar} size={60} />
        <span>
          <b>{profile.name}</b>
          <small>{profile.role}</small>
        </span>
      </div>
      <nav className="so-menu">
        {menu.slice(0, 6).map((it, i) => (
          <button key={it.label} type="button" className={i === on ? 'is-on' : undefined} onClick={() => setOn(i)} style={{ '--i': i } as CSSProperties}>
            <Icon name={it.icon} size={24} tone={i === on ? 'accent' : 'ink'} />
            {it.label}
          </button>
        ))}
      </nav>
      {clock && (
        <div className="so-clock">
          <div>
            <b>
              {h}
              <i>:</i>
              {m}
            </b>
            <small>{clock.city}</small>
          </div>
          <div className="so-clock__d">
            <small>{date[0]}</small>
            <b>{date[1]}</b>
          </div>
        </div>
      )}
    </aside>
  )
}
