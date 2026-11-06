import { Kicker, Numeral, Reveal, Source, usePointerDrift } from '../deck/primitives'
import { Icon, type IconName } from './Icon'
import { Hint, Lines, vars, type SlideBase } from './shared'

export interface TeaserProps extends SlideBase {
  /** Outlined display figure on the left: 1–3 characters (a version, a year's last digits). */
  numeral: string
  /** Serif-italic word above the numeral, e.g. a codename. ≤ 10 characters. */
  word?: string
  /** 2–4 short notes: key ≤ 16 characters, text ≤ 34 CJK characters. Optional icon before the key. */
  notes: { key: string; text: string; icon?: IconName }[]
}

/** "What comes next": a quiet outlined figure and a few forward-looking notes. */
export function Teaser({ kicker, title, lead, source, hint, numeral, word, notes }: TeaserProps) {
  const { drift, lean, settle } = usePointerDrift(30, 18)
  return (
    <section className="slide s-forky" onPointerMove={lean} onPointerLeave={settle}>
      <Hint id="teaser">{hint}</Hint>
      <div className="numeral forky__num" style={vars({ '--len': Math.max(2, [...numeral].length) })} aria-hidden>
        <Numeral text={numeral} drift={drift} delay={0.15} />
      </div>
      {word && (
        <Reveal i={2} className="forky__code">
          <em>“{word}”</em>
        </Reveal>
      )}
      <div className="forky__copy">
        <Reveal i={0}>
          <Kicker>{kicker}</Kicker>
        </Reveal>
        <Reveal i={1}>
          <h2 className="s-title">
            <Lines text={title} />
          </h2>
        </Reveal>
        {lead && (
          <Reveal i={2}>
            <p className="s-lead">{lead}</p>
          </Reveal>
        )}
        <dl className="dv-notes forky__notes">
          {notes.map((a, i) => (
            <Reveal key={a.key} build i={i + 3}>
              <dt>
                {a.icon && <Icon name={a.icon} size={26} />}
                {a.key}
              </dt>
              <dd>{a.text}</dd>
            </Reveal>
          ))}
        </dl>
        {source && (
          <Reveal i={7} className="s-foot">
            <Source>{source}</Source>
          </Reveal>
        )}
      </div>
    </section>
  )
}
