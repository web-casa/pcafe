import { motion } from 'motion/react'
import { Kicker, Numeral, Reveal, usePointerDrift } from '../deck/primitives'
import { pad2 } from '../deck/motion'
import { Icon, type IconName } from './Icon'
import { Hint, Lines, type SlideBase } from './shared'

export interface SectionBreakProps extends Omit<SlideBase, 'source'> {
  /** Chapter number, shown as the plate's numeral. */
  index: number
  /** The chapter's emblem; drawn large in accent. */
  icon: IconName
  /** What the chapter covers: 2–4 slide titles, each ≤ 12 CJK characters. */
  contents: string[]
}

/** Chapter divider: a large title, the chapter's emblem, and what comes in it. */
export function SectionBreak({ kicker, title, lead, hint, index, icon, contents }: SectionBreakProps) {
  const { drift, lean, settle } = usePointerDrift(26, 20)
  return (
    <section className="slide s-break" onPointerMove={lean} onPointerLeave={settle}>
      <Hint id="section">{hint}</Hint>
      <div className="frame break__frame">
        <div className="break__copy">
          <Reveal i={0}>
            <Kicker>{kicker}</Kicker>
          </Reveal>
          <Reveal i={1}>
            <h2 className="break__title">
              <Lines text={title} />
            </h2>
          </Reveal>
          {lead && (
            <Reveal i={2}>
              <p className="s-lead">{lead}</p>
            </Reveal>
          )}
          <ol className="break__contents" style={{ gridTemplateColumns: `repeat(${contents.length}, minmax(0, 1fr))` }}>
            {contents.map((c, i) => (
              <li key={c}>
                <Reveal i={i + 4}>
                  <span>{pad2(i + 1)}</span>
                  <p>{c}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
        <Reveal i={1} className="break__plate">
          <div className="break__rings" aria-hidden>
            <i />
            <i />
            <i />
          </div>
          <motion.div className="break__emblem" style={drift}>
            <Icon name={icon} size={210} tone="accent" />
          </motion.div>
          <div className="numeral break__num" aria-hidden>
            <Numeral text={pad2(index)} delay={0.25} morph={`chapter-${index}`} />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
