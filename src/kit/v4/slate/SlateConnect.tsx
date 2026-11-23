import { useState } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint } from '../../shared'
import { Dot, Tile, TileLine, type SlateIcon } from './parts'

export interface SlateConnectProps {
  dot?: string
  /** 2 lines × ≤ 9 字. */
  title: string[]
  /** ≤ 40 字. */
  lead?: string
  /** Accent button and a text link, each ≤ 8 字. */
  ctas?: [string, string?]
  /** Small line under the buttons, ≤ 24 字. */
  note?: string
  /** Icon in the hub. */
  hub?: SlateIcon
  /** 6–8 tools around the hub: name ≤ 8 个字符, mark one or two characters. */
  tools: { name: string; mark: string }[]
  hint?: string
}

/** A closing pitch beside a hub-and-spoke picture: your product in the middle, the tools it connects to around it; pointing at a tool lights its line and sends a pulse along it. */
export function SlateConnect({ dot, title, lead, ctas, note, hub = 'link', tools, hint }: SlateConnectProps) {
  const list = tools.slice(0, 8)
  const [on, setOn] = useState(0)
  const n = list.length
  const pos = list.map((_, i) => {
    const a = (-90 + (360 / n) * i) * (Math.PI / 180)
    return [300 + Math.cos(a) * 250, 300 + Math.sin(a) * 250] as const
  })
  return (
    <section className="slide sl">
      <Hint id="slateconnect">{hint}</Hint>
      <div className="sl-con__l">
        {dot && (
          <Reveal i={0}>
            <Dot>{dot}</Dot>
          </Reveal>
        )}
        <Reveal i={0.5}>
          <h2 className="sl-h2 is-left">
            {title.slice(0, 2).map((l, i) => (
              <span key={i}>
                <TileLine text={l} />
              </span>
            ))}
          </h2>
        </Reveal>
        {lead && (
          <Reveal i={1}>
            <p className="sl-lead">{lead}</p>
          </Reveal>
        )}
        {ctas && (
          <Reveal i={1.5} className="sl-ctas">
            <span className="sl-btn">{ctas[0]} →</span>
            {ctas[1] && <span className="sl-link">{ctas[1]} →</span>}
          </Reveal>
        )}
        {note && (
          <Reveal i={2} className="sl-note">
            {note}
          </Reveal>
        )}
      </div>
      <Reveal i={1} className="sl-hub">
        <svg viewBox="0 0 600 600" aria-hidden="true">
          <circle cx="300" cy="300" r="250" className="sl-hub__ring" />
          {pos.map(([x, y], i) => (
            <g key={i} className={i === on ? 'is-on' : ''}>
              <path d={`M300 300 L${x.toFixed(1)} ${y.toFixed(1)}`} className="sl-hub__spoke" />
              {i === on && <circle r="5" className="sl-hub__pulse" style={{ offsetPath: `path('M${x.toFixed(1)} ${y.toFixed(1)} L300 300')` }} />}
            </g>
          ))}
        </svg>
        <span className="sl-hub__core">
          <Tile icon={hub} />
        </span>
        {list.map((t, i) => (
          <button
            type="button"
            key={t.name}
            className={`sl-hub__tool${i === on ? ' is-on' : ''}`}
            style={{ left: `${(pos[i][0] / 600) * 100}%`, top: `${(pos[i][1] / 600) * 100}%`, animationDelay: `${0.6 + i * 0.07}s` }}
            onMouseEnter={() => setOn(i)}
            onClick={() => setOn(i)}
          >
            <i>{t.mark}</i>
            <span>{t.name}</span>
          </button>
        ))}
      </Reveal>
    </section>
  )
}
