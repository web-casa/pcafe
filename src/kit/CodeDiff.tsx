import { Reveal } from '../deck/primitives'
import { Hint, SlideFoot, SlideHead, type SlideBase } from './shared'

export interface CodePane {
  /** ≤ 12 CJK characters, e.g. 'Lumen 12 · 单行格式'. */
  label: string
  /** File path shown in the pane header. */
  file: string
  /** 2–8 lines, ≤ 52 characters each. */
  lines: string[]
  /** 0-based lines to highlight: struck in the old pane, washed in the new one. */
  mark?: number[]
}

export interface CodeDiffProps extends SlideBase {
  before: CodePane
  after: CodePane
  /** 2–3 notes under the panes: key ≤ 12 characters (mono), text ≤ 30 CJK characters. */
  notes?: { key: string; text: string }[]
}

function Pane({ pane, kind, i }: { pane: CodePane; kind: 'old' | 'new'; i: number }) {
  return (
    <Reveal i={i} className={`diff__pane is-${kind}`} y={16}>
      <div className="diff__head">
        <span>{pane.label}</span>
        <code>{pane.file}</code>
      </div>
      <pre>
        {pane.lines.map((l, k) => (
          <span key={k} className={pane.mark?.includes(k) ? 'is-mark' : undefined} style={{ animationDelay: `${700 + k * 60}ms` }}>
            <i>{k + 1}</i>
            {l || ' '}
          </span>
        ))}
      </pre>
    </Reveal>
  )
}

/** The same configuration before and after, side by side, with the changed lines marked. */
export function CodeDiff({ kicker, title, lead, source, hint, before, after, notes }: CodeDiffProps) {
  return (
    <section className="slide">
      <Hint id="diff">{hint}</Hint>
      <div className="frame s-diff">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="diff">
          <Pane pane={before} kind="old" i={3} />
          <span className="diff__arrow" aria-hidden />
          <Pane pane={after} kind="new" i={4} />
        </div>
        {notes && (
          <dl className="diff__notes" style={{ gridTemplateColumns: `repeat(${notes.length}, minmax(0, 1fr))` }}>
            {notes.map((n, k) => (
              <Reveal key={n.key} build i={k * 0.6 + 6}>
                <dt>{n.key}</dt>
                <dd>{n.text}</dd>
              </Reveal>
            ))}
          </dl>
        )}
        <SlideFoot source={source} i={9} />
      </div>
    </section>
  )
}
