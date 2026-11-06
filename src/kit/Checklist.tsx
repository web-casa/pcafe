import { useState } from 'react'
import { motion } from 'motion/react'
import { Reveal } from '../deck/primitives'
import { EASE_OUT } from '../deck/motion'
import { Hint, SlideFoot, SlideHead, type SlideBase } from './shared'

export interface ChecklistItem {
  /** ≤ 18 CJK characters. */
  title: string
  /** One command or path, ≤ 56 monospace characters. */
  cmd?: string
  /** Why it matters, ≤ 30 CJK characters. */
  note: string
}

export interface ChecklistProps extends Omit<SlideBase, 'lead'> {
  /** 6 or 8 items in two columns, read left-to-right then down. */
  items: ChecklistItem[]
  /** Text after the live counter, e.g. '已确认'. */
  countLabel?: string
}

/** Interactive pre-flight list. The presenter ticks items live; the counter follows. */
export function Checklist({ kicker, title, source, hint = '点击条目可以逐项勾选', items, countLabel = '已确认' }: ChecklistProps) {
  const [done, setDone] = useState<Set<number>>(() => new Set())
  const toggle = (i: number) =>
    setDone((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })

  return (
    <section className="slide">
      <Hint id="checklist">{hint}</Hint>
      <div className="frame s-prep">
        <SlideHead
          kicker={kicker}
          title={title}
          aside={
            <div className="prep__count">
              <b>{done.size}</b>
              <span>
                / {items.length} {countLabel}
              </span>
            </div>
          }
        />
        <div className="prep__grid">
          {items.map((c, i) => (
            <Reveal key={c.title} build i={i * 0.6 + 3} className="prep__cell">
              <button type="button" role="checkbox" aria-checked={done.has(i)} className={`prep__item${done.has(i) ? ' is-done' : ''}`} onClick={() => toggle(i)}>
                <span className="prep__box" aria-hidden>
                  <svg viewBox="0 0 24 24">
                    <motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={false} animate={{ pathLength: done.has(i) ? 1 : 0 }} transition={{ duration: 0.32, ease: EASE_OUT }} />
                  </svg>
                </span>
                <span className="prep__idx">{String(i + 1).padStart(2, '0')}</span>
                <span className="prep__body">
                  <b>{c.title}</b>
                  {c.cmd && <code>{c.cmd}</code>}
                  <span>{c.note}</span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
        <SlideFoot source={source} i={9} />
      </div>
    </section>
  )
}
