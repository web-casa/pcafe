import { Reveal } from '../deck/primitives'
import { Window } from './shapes'
import { Hint, SlideFoot, SlideHead, type SlideBase } from './shared'

export interface StackWindow {
  /** Title bar text, ≤ 16 characters. */
  title: string
  /** ≤ 14 CJK characters. */
  heading: string
  /** 1–3 lines, each ≤ 26 CJK characters. */
  lines: string[]
}

export interface WindowStackProps extends SlideBase {
  /** 2–3 windows, front last. */
  windows: StackWindow[]
}

/** Two or three system windows cascading over each other; build brings each to the front in turn. */
export function WindowStack({ kicker, title, lead, source, hint, windows }: WindowStackProps) {
  return (
    <section className="slide">
      <Hint id="windowstack">{hint}</Hint>
      <div className="frame frame--split s-winstack">
        <div>
          <SlideHead kicker={kicker} title={title} lead={lead} />
          <SlideFoot source={source} i={8} />
        </div>
        <div className="winstack">
          {windows.map((w, i) => (
            <Reveal key={w.title} build i={3 + i * 0.6} className={`winstack__slot winstack__slot--${i + 1}`}>
              <Window title={w.title}>
                <b className="winstack__heading">{w.heading}</b>
                {w.lines.map((l) => (
                  <p key={l}>{l}</p>
                ))}
              </Window>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
