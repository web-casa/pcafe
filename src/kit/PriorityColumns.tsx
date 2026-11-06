import { Kicker, Reveal } from '../deck/primitives'
import { Hint, Lines, SlideFoot, type Text } from './shared'

export interface PriorityColumnsProps {
  kicker: string
  /** Very large title, 1–2 lines of ≤ 8 CJK characters. */
  title: Text
  /** ≤ 50 CJK characters, beside the title. */
  lead?: string
  /** Exactly 3 columns. tag ≤ 6, title ≤ 10, body ≤ 40 CJK characters. */
  items: { tag: string; title: string; body: string }[]
  /** Which column is set in the accent colour. Default 1 (the middle). */
  focus?: number
  source?: string
  hint?: React.ReactNode
}

/** Three priorities as full-height columns with huge numbers, one in the accent colour. Made for `platform`, works in any style. */
export function PriorityColumns({ kicker, title, lead, items, focus = 1, source, hint }: PriorityColumnsProps) {
  return (
    <section className="slide">
      <Hint id="prioritycolumns">{hint}</Hint>
      <div className="frame s-pc">
        <div className="pc__head">
          <div>
            <Reveal i={0}><Kicker>{kicker}</Kicker></Reveal>
            <Reveal i={1}><h2 className="pc__title"><Lines text={title} /></h2></Reveal>
          </div>
          {lead && <Reveal i={2}><p className="pc__lead">{lead}</p></Reveal>}
        </div>
        <ol className="pc__cols">
          {items.map((it, i) => (
            <li key={it.title} className={i === focus ? 'is-focus' : undefined} data-build={i}>
              <Reveal i={3 + i * 0.5} y={24} className="pc__in">
                <span className="pc__n">{String(i + 1).padStart(2, '0')}</span>
                <span className="pc__tag">— {it.tag} —</span>
                <h3>{it.title}</h3>
                <p>{it.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
