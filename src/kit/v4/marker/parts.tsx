import { Fragment, useEffect, useState, type ReactNode } from 'react'

const TONES = ['y', 'g', 'p'] as const

/** Renders `==words==` as highlighter strokes that sweep in one after another; tones cycle yellow, green, purple from `start`. */
export function Mark({ text, from = 0.5, start = 0 }: { text: string; from?: number; start?: number }) {
  const parts = text.split(/==(.+?)==/)
  let n = 0
  return (
    <>
      {parts.map((p, i) => {
        if (i % 2 === 0) {
          const lines = p.split('\n')
          return (
            <Fragment key={i}>
              {lines.map((l, k) => (
                <Fragment key={k}>
                  {k > 0 && <br />}
                  {l}
                </Fragment>
              ))}
            </Fragment>
          )
        }
        const t = TONES[(n + start) % 3]
        const d = from + n * 0.35
        n += 1
        return (
          <mark key={i} className={`mr-hl is-${t}`} style={{ animationDelay: `${d}s` }}>
            {p}
          </mark>
        )
      })}
    </>
  )
}

/** A box with four bracket corners that open out on hover. */
export function Brackets({ className = '', children }: { className?: string; children?: ReactNode }) {
  return (
    <div className={`mr-br ${className}`}>
      <i className="mr-br__c is-tl" />
      <i className="mr-br__c is-tr" />
      <i className="mr-br__c is-bl" />
      <i className="mr-br__c is-br" />
      {children}
    </div>
  )
}

/** The small two-diamond mark. */
export function Glyph() {
  return (
    <span className="mr-glyph" aria-hidden="true">
      <i />
      <i />
    </span>
  )
}

function useClock(zone?: string) {
  const fmt = () => {
    try {
      return new Intl.DateTimeFormat('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: zone }).format(new Date())
    } catch {
      return new Date().toTimeString().slice(0, 8)
    }
  }
  const [t, setT] = useState(fmt)
  useEffect(() => {
    const id = window.setInterval(() => setT(fmt()), 1000)
    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zone])
  return t
}

/** Corner lines along the foot: a sign-off on the left, a city with a live clock on the right. */
export interface MarkerCorners {
  /** Left foot line, ≤ 20 字. */
  left?: string
  /** City before the clock, ≤ 6 字. */
  city?: string
  /** IANA time zone for the clock, e.g. "Asia/Shanghai". */
  zone?: string
}

export function Corners({ left, city, zone }: MarkerCorners) {
  const t = useClock(zone)
  return (
    <>
      {left && <div className="mr-corner is-l">{left}</div>}
      {city && (
        <div className="mr-corner is-r">
          {city} <b>{t}</b>
        </div>
      )}
    </>
  )
}

/** Line-drawn isometric icons for MarkerSkills. */
export type MarkerIcon = 'screen' | 'blocks' | 'type' | 'stack' | 'chart' | 'pen'

export function Iso({ icon }: { icon: MarkerIcon }) {
  const S = { fill: 'var(--card)', stroke: 'var(--ink)', strokeWidth: 1.5, strokeLinejoin: 'round' as const }
  const shadow = <ellipse className="mr-iso__shadow" cx="110" cy="152" rx="80" ry="18" fill="none" stroke="var(--line-strong)" strokeDasharray="3 4" />
  const body: Record<MarkerIcon, ReactNode> = {
    screen: (
      <>
        <path className="mr-iso__l1" d="M110 116 170 86 110 56 50 86Z" {...S} />
        <path className="mr-iso__l2" d="M110 102 170 72 110 42 50 72Z" {...S} />
        <g className="mr-iso__l3">
          <path d="M110 86 170 56 110 26 50 56Z" {...S} fill="var(--mr-y)" />
          <path d="M78 52 108 37M84 58 118 41" stroke="var(--ink)" strokeWidth="1.5" />
          <path d="M128 58l0 22 6-6 6 10 4-2-6-10 8-1z" {...S} />
        </g>
      </>
    ),
    blocks: (
      <>
        <g className="mr-iso__l1">
          <path d="M70 52v52l40 20V72Z" {...S} />
          <path d="M150 52v52l-40 20V72Z" {...S} />
        </g>
        <path className="mr-iso__l3" d="M110 72 150 52 110 32 70 52Z" {...S} fill="var(--mr-g)" />
        <g className="mr-iso__l2">
          <path d="M162 112 178 104 162 96 146 104Z" {...S} />
          <path d="M146 104v14l16 8v-14ZM178 104v14l-16 8" {...S} />
          <circle cx="56" cy="118" r="6" {...S} />
        </g>
      </>
    ),
    type: (
      <>
        <path className="mr-iso__l1" d="M110 122 180 88 110 54 40 88Z" {...S} />
        <path className="mr-iso__l1" d="M40 88v10l70 34 70-34V88" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
        <g className="mr-iso__l3">
          <path d="M84 98 112 58 124 104M96 86l26-6" fill="none" stroke="var(--mr-p)" strokeWidth="7" strokeLinecap="round" opacity=".45" />
          <path d="M84 98 112 58 124 104M96 86l26-6" fill="none" stroke="var(--ink)" strokeWidth="1.8" strokeLinecap="round" />
        </g>
      </>
    ),
    stack: (
      <>
        <path className="mr-iso__l1" d="M110 128 166 100 110 72 54 100Z" {...S} />
        <path className="mr-iso__l2" d="M110 108 166 80 110 52 54 80Z" {...S} fill="var(--mr-g)" />
        <path className="mr-iso__l3" d="M110 88 166 60 110 32 54 60Z" {...S} fill="var(--mr-y)" />
      </>
    ),
    chart: (
      <>
        <path className="mr-iso__l1" d="M110 126 176 94 110 62 44 94Z" {...S} />
        <g className="mr-iso__l2">
          <path d="M72 98V78l14-7v20Z" {...S} />
          <path d="M100 98V60l14-7v38Z" {...S} fill="var(--mr-g)" />
        </g>
        <path className="mr-iso__l3" d="M128 98V40l14-7v58Z" {...S} fill="var(--mr-y)" />
      </>
    ),
    pen: (
      <>
        <path className="mr-iso__l1" d="M110 124 172 94 110 64 48 94Z" {...S} />
        <path className="mr-iso__l1" d="M72 96c18-10 34 6 52-4s28-6 34-2" fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeDasharray="2 4" />
        <g className="mr-iso__l3">
          <path d="M126 30 146 40 112 96 100 104 100 90Z" {...S} fill="var(--mr-p)" />
          <path d="M100 90l12 6" stroke="var(--ink)" strokeWidth="1.5" />
        </g>
      </>
    ),
  }
  return (
    <svg className="mr-iso" viewBox="0 0 220 180" aria-hidden="true">
      {shadow}
      {body[icon]}
    </svg>
  )
}
