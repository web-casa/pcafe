import { Kicker, Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot } from '../../shared'

export interface KaraokeLinesProps {
  kicker: string
  /** 3–6 lines of a speech or script, each ≤ 14 CJK characters. Each → lights the next line. */
  lines: string[]
  /** Who said it / where, ≤ 24 CJK characters. */
  by?: string
  /** Original wording or a gloss in a side column, ≤ 120 Latin characters or 60 CJK characters. */
  aside?: string
  source?: string
  hint?: React.ReactNode
}

/** Script read-along: lines wait in grey; each build step lights the next one with a sweeping underline, earlier lines stay in ink. */
export function KaraokeLines({ kicker, lines, by, aside, source, hint }: KaraokeLinesProps) {
  return (
    <section className="slide">
      <Hint id="karaokelines">{hint}</Hint>
      <div className="frame x2-kl">
        <div className="x2-kl__main">
          <Reveal i={0}>
            <Kicker>{kicker}</Kicker>
          </Reveal>
          <ol className="x2-kl__lines">
            {lines.map((l, i) => (
              <li key={i} className="x2-kl__line" data-build>
                <span>{l}</span>
              </li>
            ))}
          </ol>
        </div>
        {(by || aside) && (
          <Reveal i={2} className="x2-kl__side">
            {aside && <p className="x2-kl__aside">{aside}</p>}
            {by && <p className="x2-kl__by">{by}</p>}
          </Reveal>
        )}
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
