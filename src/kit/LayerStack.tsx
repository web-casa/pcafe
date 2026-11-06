import { Kicker, Reveal, Source } from '../deck/primitives'
import { pad2 } from '../deck/motion'
import { Icon, type IconName } from './Icon'
import { Hint, Lines, vars, type SlideBase } from './shared'

export interface Layer {
  icon: IconName
  /** ≤ 12 CJK characters. */
  name: string
  /** What to verify at this layer, one line, ≤ 30 CJK characters. */
  check: string
}

export interface LayerStackProps extends SlideBase {
  /** 4–6 layers, outermost first. Each one can block everything below it. */
  layers: Layer[]
  /** The result once every layer passes, ≤ 16 CJK characters. Rendered as the accent floor. */
  outcome?: { icon: IconName; text: string }
}

/** A descending stack of gates, each with the check that proves it is open. Hover isolates a layer. */
export function LayerStack({ kicker, title, lead, source, hint, layers, outcome }: LayerStackProps) {
  return (
    <section className="slide">
      <Hint id="layers">{hint}</Hint>
      <div className="frame frame--split">
        <div className="s-copy">
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
          {source && (
            <Reveal i={layers.length + 4} className="s-foot">
              <Source>{source}</Source>
            </Reveal>
          )}
        </div>
        <ol className="stack" style={vars({ '--n': layers.length })}>
          {layers.map((l, i) => (
            <li key={l.name} style={vars({ '--i': i })}>
              <Reveal build i={i * 0.7 + 2} className="stack__layer">
                <span className="stack__idx">{pad2(i + 1)}</span>
                <Icon name={l.icon} size={36} />
                <b>{l.name}</b>
                <span className="stack__check">{l.check}</span>
              </Reveal>
            </li>
          ))}
          {outcome && (
            <li style={vars({ '--i': layers.length })}>
              <Reveal i={layers.length * 0.7 + 2} className="stack__layer is-outcome">
                <span className="stack__idx">✓</span>
                <Icon name={outcome.icon} size={36} tone="accent" />
                <b>{outcome.text}</b>
              </Reveal>
            </li>
          )}
        </ol>
      </div>
    </section>
  )
}
