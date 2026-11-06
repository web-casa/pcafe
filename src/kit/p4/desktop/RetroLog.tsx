import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot, SlideHead, type SlideBase } from '../../shared'
import { RetroWin } from './RetroWin'

export interface LogEntry {
  /** ≤ 10 characters, e.g. a phase or version. */
  ver: string
  /** ≤ 6 CJK characters. */
  tag: string
  /** ≤ 30 CJK characters. */
  text: string
}

export interface RetroLogProps extends SlideBase {
  /** Log window title, ≤ 20 characters. */
  file: string
  /** 4–6 entries, newest first; the first is highlighted. */
  entries: LogEntry[]
  /** Sticky-note window: title ≤ 10 characters, 2–3 lines ≤ 16 CJK characters each. */
  note: { title: string; lines: string[] }
}

/** A changelog in a chunky retro window with a sticky-note window pinned beside it: versions, phases, what changed. */
export function RetroLog({ kicker, title, lead, source, hint, file, entries, note }: RetroLogProps) {
  return (
    <section className="slide">
      <Hint id="retrolog">{hint}</Hint>
      <div className="frame rlog">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="rlog__body">
          <Reveal i={3} className="rlog__main">
            <RetroWin title={file}>
              <ol className="rlog__list">
                {entries.map((e, i) => (
                  <Reveal key={e.ver} build i={4 + i * 0.5} className={`rlog__row${i === 0 ? ' is-new' : ''}`}>
                    <code>{e.ver}</code>
                    <span className="rlog__tag">{e.tag}</span>
                    <p>{e.text}</p>
                  </Reveal>
                ))}
              </ol>
            </RetroWin>
          </Reveal>
          <Reveal i={6} className="rlog__side">
            <div className="rlog__tilt">
              <RetroWin title={note.title} className="rw--note">
                <ul>
                  {note.lines.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              </RetroWin>
            </div>
          </Reveal>
        </div>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
