import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot, SlideHead, type SlideBase } from '../../shared'

export interface BTreeIndexProps extends SlideBase {
  /** Levels from root to leaves (2–3). Each level is a list of pages; each page 1–4 keys of ≤ 5 characters. Root has 1 page; ≤ 4 pages per level. */
  levels: string[][][]
  /** Page index visited on each level (same length as levels). */
  path: number[]
  /** The key being looked up, ≤ 8 characters. */
  target: string
  /** Leaf caption, ≤ 24 CJK characters, e.g. "叶子页指向表中的行". */
  leafNote?: string
  /** Side notes, one per level, ≤ 30 CJK characters each. */
  notes?: string[]
}

/** B-tree index: pages by level with the lookup path for one key drawn in the accent. Build: one level per step. */
export function BTreeIndex({ kicker, title, lead, source, hint, levels, path, target, leafNote, notes }: BTreeIndexProps) {
  return (
    <section className="slide">
      <Hint id="btree">{hint}</Hint>
      <div className="frame t3">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className="t3-bt">
          <p className="t3-bt__find">
            查找 <code>{target}</code>
          </p>
          {levels.map((pages, d) => (
            <div key={d} className="t3-bt__level" data-build>
              {d > 0 && (
                <svg className="t3-bt__link" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden>
                  <line x1={((path[d - 1] + 0.5) / levels[d - 1].length) * 100} y1={0} x2={((path[d] + 0.5) / pages.length) * 100} y2={10} />
                </svg>
              )}
              <div className="t3-bt__pages">
                {pages.map((keys, p) => (
                  <div key={p} className={`t3-bt__page${path[d] === p ? ' is-path' : ''}`}>
                    {keys.map((k, j) => (
                      <span key={j} className={k === target ? 'is-hit' : undefined}>
                        {k}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
              {notes?.[d] && <p className="t3-bt__note">{notes[d]}</p>}
            </div>
          ))}
          {leafNote && <p className="t3-bt__leaf">{leafNote}</p>}
        </Reveal>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
