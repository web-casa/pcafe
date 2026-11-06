import { Reveal } from '../../../deck/primitives'
import { Icon } from '../../Icon'
import type { IconName } from '../../icon-set'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from '../../shared'

export interface Note {
  icon: IconName
  /** ≤ 8 CJK characters. */
  title: string
  /** 20–40 CJK characters; keep the cards similar. */
  body: string
}

export interface NoteCardsProps extends SlideBase {
  /** 3 or 4 notes. */
  notes: Note[]
}

const TILT = [-3, 2.2, -1.6, 2.8]
const SPOT = [5, 4, 3, 2]

/**
 * Tips or rules as sticky notes in candy colours, each slightly tilted with a
 * strip of tape on top. title ≤ 1 line × 14 CJK characters.
 */
export function NoteCards({ kicker, title, lead, source, hint, notes }: NoteCardsProps) {
  return (
    <section className="slide">
      <Hint id="notecards">{hint}</Hint>
      <div className="frame pln">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="pln__row" style={vars({ '--n': notes.length })}>
          {notes.map((n, i) => (
            <Reveal key={n.title} build i={3 + i * 0.5} className="pln__slot">
              <div className="pln__card" style={vars({ '--tilt': `${TILT[i % 4]}deg`, '--c': `var(--spot-${SPOT[i % 4]})` })}>
                <span className="pln__tape" aria-hidden />
                <span className="pln__icon">
                  <Icon name={n.icon} size={40} />
                </span>
                <b>{n.title}</b>
                <p>{n.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
