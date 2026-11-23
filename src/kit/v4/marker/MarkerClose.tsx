import { useState } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint } from '../../shared'
import { Corners, Glyph, Mark, type MarkerCorners } from './parts'

export interface MarkerCloseProps {
  /** Closing sentence, ==…== to mark, ≤ 2 lines × 12 字. */
  say: string
  /** Address that copies on click, ≤ 24 个字符. */
  mail: string
  /** Shown after copying, ≤ 6 字. Default "已复制". */
  copied?: string
  /** 2–4 mono links, each ≤ 10 个字符. */
  links?: string[]
  corners?: MarkerCorners
  hint?: string
}

/** A quiet sign-off: the mark, one marked sentence, an address you can click to copy, and a row of mono links. */
export function MarkerClose({ say, mail, copied = '已复制', links = [], corners, hint }: MarkerCloseProps) {
  const [done, setDone] = useState(false)
  const copy = () => {
    navigator.clipboard?.writeText(mail).catch(() => undefined)
    setDone(true)
    window.setTimeout(() => setDone(false), 1600)
  }
  return (
    <section className="slide mr">
      <Hint id="markerclose">{hint}</Hint>
      <div className="mr-col mr-close">
        <Reveal i={0}>
          <Glyph />
        </Reveal>
        <Reveal i={1}>
          <p className="mr-say">
            <Mark text={say} from={0.7} />
          </p>
        </Reveal>
        <Reveal i={2}>
          <button type="button" className={`mr-mail${done ? ' is-done' : ''}`} onClick={copy}>
            <span>{mail}</span>
            <small>{done ? copied : '⧉'}</small>
          </button>
        </Reveal>
        {links.length > 0 && (
          <Reveal i={3} className="mr-links">
            {links.slice(0, 4).map((l) => (
              <span key={l}>
                {l} <i>↗</i>
              </span>
            ))}
          </Reveal>
        )}
      </div>
      {corners && <Corners {...corners} />}
    </section>
  )
}
