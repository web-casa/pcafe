import { useEffect, useState, type CSSProperties } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint } from '../../shared'
import { Panel, Widget } from './parts'

export interface DuskCloseProps {
  /** 2 lines × ≤ 10 字. */
  title: string[]
  /** ≤ 30 字. */
  lead?: string
  ctas?: [string, string?]
  /** The install or start command, ≤ 30 个字符. */
  command: string
  /** 2–4 output lines that print after the command, each ≤ 36 个字符. */
  output?: string[]
  /** Copy button text before and after copying. */
  labels?: { copy: string; copied: string }
  hint?: string
}

/** The last slide: a headline and buttons over a gradient panel holding a terminal; the command copies on click and its output prints line by line. */
export function DuskClose({ title, lead, ctas, command, output = [], labels, hint }: DuskCloseProps) {
  const L = labels ?? { copy: '复制', copied: '已复制 ✓' }
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!copied) return
    const t = window.setTimeout(() => setCopied(false), 1800)
    return () => window.clearTimeout(t)
  }, [copied])
  return (
    <section className="slide du">
      <Hint id="duskclose">{hint}</Hint>
      <div className="du-close">
        <Reveal i={0.2}>
          <h2 className="du-h1 is-close">
            {title.slice(0, 2).map((l, i) => (
              <span key={i}>{l}</span>
            ))}
          </h2>
        </Reveal>
        {lead && (
          <Reveal i={0.6}>
            <p className="du-lead">{lead}</p>
          </Reveal>
        )}
        {ctas && (
          <Reveal i={0.9}>
            <div className="du-ctas">
              <span className="du-btn">{ctas[0]} →</span>
              {ctas[1] && <span className="du-btn is-soft">{ctas[1]}</span>}
            </div>
          </Reveal>
        )}
      </div>
      <Reveal i={1.2} className="du-close__panel">
        <Panel>
          <Widget className="du-term">
            <div className="du-term__bar" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <div className="du-term__cmd">
              <span>
                <em>$</em> {command}
              </span>
              <button
                type="button"
                className={copied ? 'is-on' : undefined}
                onClick={() => {
                  navigator.clipboard?.writeText(command).catch(() => {})
                  setCopied(true)
                }}
              >
                {copied ? L.copied : L.copy}
              </button>
            </div>
            <div className="du-term__out">
              {output.slice(0, 4).map((l, i) => (
                <div key={i} style={{ '--i': i } as CSSProperties}>
                  {l}
                </div>
              ))}
            </div>
          </Widget>
        </Panel>
      </Reveal>
    </section>
  )
}
