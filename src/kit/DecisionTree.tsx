import { Reveal } from '../deck/primitives'
import { Hint, SlideFoot, SlideHead, type SlideBase } from './shared'

export type TreeNode =
  /** A question, ≤ 14 CJK characters, with two answers. */
  | { q: string; yes: TreeNode; no: TreeNode; yesLabel?: string; noLabel?: string }
  /** An outcome, ≤ 8 CJK characters, with an optional note ≤ 14. */
  | { leaf: string; note?: string }

export interface DecisionTreeProps extends SlideBase {
  /** At most two questions deep (≤ 4 outcomes). */
  root: TreeNode
}

function Node({ node, depth }: { node: TreeNode; depth: number }) {
  if ('leaf' in node)
    return (
      <Reveal build={`d${depth}`} i={3 + depth} className="dtree__leaf">
        <b>{node.leaf}</b>
        {node.note && <span>{node.note}</span>}
      </Reveal>
    )
  return (
    <div className="dtree__branch">
      <Reveal build={depth ? `d${depth}` : undefined} i={3 + depth} className="dtree__q">
        {node.q}
      </Reveal>
      <div className="dtree__kids">
        {(
          [
            [node.yesLabel ?? '是', node.yes],
            [node.noLabel ?? '否', node.no],
          ] as const
        ).map(([label, child]) => (
          <div key={label} className="dtree__kid">
            <span className="dtree__edge">{label}</span>
            <Node node={child} depth={depth + 1} />
          </div>
        ))}
      </div>
    </div>
  )
}

/** A yes/no decision tree read top-down, at most two questions deep: which option to choose when. */
export function DecisionTree({ kicker, title, lead, source, hint, root }: DecisionTreeProps) {
  return (
    <section className="slide">
      <Hint id="decisiontree">{hint}</Hint>
      <div className="frame s-dtree">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="dtree">
          <Node node={root} depth={0} />
        </div>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
