import { Reveal } from '../../../deck/primitives'
import { Hint } from '../../shared'
import { Corners, Glyph, Mark, type MarkerCorners } from './parts'

export interface MarkerIntroProps {
  /** The main sentence; wrap 1–3 phrases in ==…== to mark them. Use \n for a line break. ≤ 2 lines × 14 字. */
  say: string
  /** A second, grey sentence, same syntax, ≤ 2 lines × 12 字. */
  aside?: string
  /** 2–4 links along the foot of the column, each ≤ 6 字. */
  links?: string[]
  corners?: MarkerCorners
  hint?: string
}

/** A personal opening written as one or two sentences, with key phrases marked by highlighter strokes that sweep in one by one. */
export function MarkerIntro({ say, aside, links = [], corners, hint }: MarkerIntroProps) {
  return (
    <section className="slide mr">
      <Hint id="markerintro">{hint}</Hint>
      <div className="mr-col mr-intro">
        <Reveal i={0}>
          <Glyph />
        </Reveal>
        <Reveal i={1}>
          <p className="mr-say">
            <Mark text={say} from={0.7} />
          </p>
        </Reveal>
        {aside && (
          <Reveal i={2}>
            <p className="mr-say is-grey">
              <Mark text={aside} from={1.6} start={(say.match(/==/g)?.length ?? 0) / 2} />
            </p>
          </Reveal>
        )}
        {links.length > 0 && (
          <Reveal i={3} className="mr-links">
            {links.slice(0, 4).map((l) => (
              <span key={l}>
                {l} <i>→</i>
              </span>
            ))}
          </Reveal>
        )}
      </div>
      {corners && <Corners {...corners} />}
    </section>
  )
}
