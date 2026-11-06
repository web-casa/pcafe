import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot, SlideHead, type SlideBase } from '../../shared'
import { sqlLine } from './code'

export interface PlanNode {
  /** Plan operator, ≤ 18 Latin characters, e.g. "Hash Join". */
  op: string
  /** Second line: table, index or condition, ≤ 24 Latin characters. */
  detail?: string
  /** Small meta line, ≤ 16 characters, e.g. "rows=120". */
  meta?: string
  /** Draw in the accent (the expensive or interesting node). */
  hot?: boolean
  /** 0–3 children. */
  children?: PlanNode[]
}

export interface QueryPlanProps extends SlideBase {
  /** SQL shown above the tree, 1–3 lines × ≤ 56 characters. */
  sql?: string[]
  /** Root of the plan tree: ≤ 4 levels, ≤ 7 nodes, ≤ 3 leaves. */
  plan: PlanNode
  /** One reading below the tree, ≤ 50 CJK characters. */
  note?: string
}

function Node({ n, depth }: { n: PlanNode; depth: number }) {
  return (
    <li className="t3-qp__item" data-build={depth ? `d${depth}` : undefined}>
      <div className={`t3-qp__node${n.hot ? ' is-hot' : ''}`}>
        <b>{n.op}</b>
        {n.detail && <span>{n.detail}</span>}
        {n.meta && <small>{n.meta}</small>}
      </div>
      {n.children && n.children.length > 0 && (
        <ul className="t3-qp__kids">
          {n.children.map((c, i) => (
            <Node key={i} n={c} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  )
}

/** EXPLAIN output drawn as a top-down tree; with build, one level appears per step, root first. */
export function QueryPlan({ kicker, title, lead, source, hint, sql, plan, note }: QueryPlanProps) {
  return (
    <section className="slide">
      <Hint id="queryplan">{hint}</Hint>
      <div className="frame t3">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        {sql && (
          <Reveal i={3} className="t3-qp__sql">
            {sql.map((l, i) => (
              <code key={i}>{sqlLine(l)}</code>
            ))}
          </Reveal>
        )}
        <Reveal i={4} className="t3-qp__tree">
          <ul className="t3-qp__kids t3-qp__root">
            <Node n={plan} depth={0} />
          </ul>
        </Reveal>
        {note && (
          <Reveal i={5} className="t3-note">
            {note}
          </Reveal>
        )}
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
