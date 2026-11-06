import { Kicker, Reveal } from '../deck/primitives'
import type { Spot } from './parts'
import { AppIcon, Dock, Window, type DockApp } from './shapes'
import { Hint, Lines, SlideFoot, type SlideBase } from './shared'

export interface DesktopProps extends SlideBase {
  /** Window title bar text, ≤ 16 characters (a file or app name). */
  file: string
  /** 4–8 desktop shortcuts down the left edge: chapters, tools, files. */
  apps: DockApp[]
  /** 4–7 icons in the dock. */
  dock: DockApp[]
  /** Optional clock widget, e.g. the talk date. */
  clock?: { time: string; date: string }
}

/** A computer desktop as a cover or agenda: shortcuts down the side, a dock at the bottom, the message in a window. */
export function Desktop({ kicker, title, lead, source, hint, file, apps, dock, clock }: DesktopProps) {
  return (
    <section className="slide">
      <Hint id="desktop">{hint}</Hint>
      <div className="frame s-desktop">
        <ul className="desktop__apps">
          {apps.map((a, i) => (
            <Reveal key={a.label} i={0.5 + i * 0.15}>
              <AppIcon {...a} spot={a.spot ?? (((i % 5) + 1) as Spot)} />
            </Reveal>
          ))}
        </ul>
        <Reveal i={1} className="desktop__main">
          <Window title={file}>
            <Kicker>{kicker}</Kicker>
            <h1 className="desktop__title">
              <Lines text={title} />
            </h1>
            {lead && <p className="desktop__lead">{lead}</p>}
          </Window>
        </Reveal>
        {clock && (
          <Reveal i={2} className="desktop__clock">
            <b>{clock.time}</b>
            <span>{clock.date}</span>
          </Reveal>
        )}
        <Reveal i={3} className="desktop__dock">
          <Dock apps={dock} />
        </Reveal>
        <SlideFoot source={source} i={6} />
      </div>
    </section>
  )
}
