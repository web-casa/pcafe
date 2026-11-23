import { Reveal } from '../../../deck/primitives'
import { Hint } from '../../shared'
import { Brackets, Corners, Iso, Mark, type MarkerCorners, type MarkerIcon } from './parts'

export interface MarkerSkillsProps {
  /** Mono label, ≤ 10 字. */
  kicker: string
  /** Exactly 3 things you do: name ≤ 5 字, no ≤ 4 个字符, note ≤ 8 字. */
  skills: { name: string; no?: string; note?: string; icon: MarkerIcon }[]
  /** Label over the "now" box, ≤ 6 字. */
  nowLabel?: string
  /** Mono line on the right of that label, ≤ 14 字. */
  updated?: string
  /** What you are on right now, ==…== to mark, ≤ 2 lines × 22 字. */
  now: string
  corners?: MarkerCorners
  hint?: string
}

/** What you do as three cards with line-drawn isometric icons whose layers lift apart on hover, and a bracketed "right now" note below. */
export function MarkerSkills({ kicker, skills, nowLabel, updated, now, corners, hint }: MarkerSkillsProps) {
  return (
    <section className="slide mr">
      <Hint id="markerskills">{hint}</Hint>
      <div className="mr-col mr-wide mr-skills">
        <Reveal i={0} className="mr-k">
          {kicker}
        </Reveal>
        <div className="mr-cards is-short">
          {skills.slice(0, 3).map((s, k) => (
            <Reveal i={1 + k * 0.5} y={24} key={s.name}>
              <article className="mr-card">
                <header>
                  {s.name}
                  {s.no && <span>{s.no}</span>}
                </header>
                <Brackets className="mr-card__fr">
                  <Iso icon={s.icon} />
                </Brackets>
                {s.note && <footer>{s.note}</footer>}
              </article>
            </Reveal>
          ))}
        </div>
        {(nowLabel || updated) && (
          <Reveal i={3} className="mr-nowhead">
            <span>{nowLabel}</span>
            <span>{updated}</span>
          </Reveal>
        )}
        <Reveal i={3.5}>
          <Brackets className="mr-now">
            <p>
              <Mark text={now} from={1.6} />
            </p>
          </Brackets>
        </Reveal>
      </div>
      {corners && <Corners {...corners} left={undefined} />}
    </section>
  )
}
