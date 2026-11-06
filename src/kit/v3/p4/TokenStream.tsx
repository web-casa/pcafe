import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot, SlideHead, type SlideBase } from '../../shared'

export interface TokenStreamProps extends SlideBase {
  /** 2–5 groups of tokens; each group is one build step. 6–40 tokens in total, each ≤ 8 characters. */
  groups: string[][]
  /** Label in the strip above the tokens, ≤ 16 CJK characters, e.g. '示意：切分方式仅作演示'. */
  label?: string
  /** One note per group, ≤ 22 CJK characters, shown under the stream. */
  notes?: string[]
}

/** A sentence cut into numbered token chips that arrive group by group, with a running count. */
export function TokenStream({ kicker, title, lead, source, hint, groups, label, notes }: TokenStreamProps) {
  const total = groups.reduce((n, g) => n + g.length, 0)
  let at = 0
  return (
    <section className="slide">
      <Hint id="tokens">{hint}</Hint>
      <div className="frame s-chart">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className="tokst">
          <div className="tokst__bar">
            <span>{label}</span>
            <b>
              {total} <small>tokens</small>
            </b>
          </div>
          <div className="tokst__flow">
            {groups.map((g, gi) =>
              g.map((t, ti) => {
                const n = at++
                return (
                  <span key={`${gi}-${ti}`} className={`tokst__tok tokst__tok--${gi % 4}`} data-build={`tok-${gi}`}>
                    <span className="tokst__txt">{t.replace(/ /g, '·')}</span>
                    <span className="tokst__id">{n + 1}</span>
                  </span>
                )
              }),
            )}
          </div>
          {notes && (
            <ol className="tokst__notes">
              {notes.map((n, i) => (
                <li key={i} data-build={`tok-${i}`}>
                  <i className={`tokst__sw tokst__tok--${i % 4}`} aria-hidden />
                  {n}
                </li>
              ))}
            </ol>
          )}
        </Reveal>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
