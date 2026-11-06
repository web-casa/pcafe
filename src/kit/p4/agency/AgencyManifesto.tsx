import { Fragment } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Icon, type IconName } from '../../Icon'
import { Hint, SlideFoot } from '../../shared'

export interface AgencyManifestoProps {
  /** Small grey pill above the paragraph, ≤ 8 CJK characters. */
  label: string
  icon?: IconName
  /** The point of view, ≤ 64 CJK characters. */
  text: string
  /** 0–2 substrings of `text` shown in the accent colour. */
  marks?: string[]
  source?: string
  hint?: string
}

function marked(text: string, marks: string[]) {
  if (!marks.length) return text
  const re = new RegExp(`(${marks.map((m) => m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`)
  return text.split(re).map((part, i) => (marks.includes(part) ? <em key={i}>{part}</em> : <Fragment key={i}>{part}</Fragment>))
}

/** Point-of-view paragraph: a small pill label, then one dense, very large paragraph set tight, indented from the left edge. */
export function AgencyManifesto({ label, icon = 'chat', text, marks = [], source, hint }: AgencyManifestoProps) {
  return (
    <section className="slide">
      <Hint id="agencymanifesto">{hint}</Hint>
      <div className="frame ag-pov">
        <div className="ag-pov__body">
          <Reveal i={0} className="ag-pill-soft">
            <Icon name={icon} size={24} tone="accent" />
            {label}
          </Reveal>
          <Reveal i={1} y={30}>
            <p className="ag-pov__text">{marked(text, marks)}</p>
          </Reveal>
        </div>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
