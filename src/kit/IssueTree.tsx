import { Reveal } from '../deck/primitives'
import { Hint, SlideFoot, SlideHead, type SlideBase } from './shared'

export interface IssueBranch {
  /** A sub-question or driver, ≤ 10 CJK characters. */
  title: string
  /** Muted line: how you would check it. ≤ 16 CJK characters. */
  note?: string
  /** 2–3 concrete causes or checks, ≤ 14 CJK characters each. */
  leaves: string[]
}

export interface IssueTreeProps extends SlideBase {
  /** The question being broken down, ≤ 12 CJK characters. */
  root: { title: string; note?: string }
  /** 2–4 branches. Together they should cover the question without overlapping (MECE). */
  branches: IssueBranch[]
  /** Branch to highlight: the one the data points to. */
  focus?: number
}

/** An issue tree: one question, its 2–4 drivers, and what to check under each. */
export function IssueTree({ kicker, title, lead, source, hint, root, branches, focus }: IssueTreeProps) {
  return (
    <section className="slide">
      <Hint id="tree">{hint}</Hint>
      <div className="frame s-tree">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="tree">
          <Reveal i={3} className="tree__root">
            <span className="tree__q">?</span>
            <h3>{root.title}</h3>
            {root.note && <p>{root.note}</p>}
          </Reveal>
          <ol className="tree__branches">
            {branches.map((b, i) => (
              <li key={b.title} className={`tree__branch${focus === i ? ' is-focus' : ''}`} data-build>
                <Reveal i={i * 0.8 + 4} className="tree__node">
                  <span className="tree__n">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h4>{b.title}</h4>
                    {b.note && <p>{b.note}</p>}
                  </div>
                </Reveal>
                <ul className="tree__leaves">
                  {b.leaves.map((l, k) => (
                    <li key={l}>
                      <Reveal i={i * 0.8 + k * 0.25 + 4.4}>{l}</Reveal>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
        <SlideFoot source={source} i={9} />
      </div>
    </section>
  )
}
