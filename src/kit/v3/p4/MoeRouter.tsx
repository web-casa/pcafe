import { useRef } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from '../../shared'
import { useStepCount } from '../../v2/p4/util'

export interface MoeRoute {
  /** The token being routed, ≤ 6 characters. */
  token: string
  /** Indexes (0-based) of the routed experts it goes to. */
  picks: number[]
  /** ≤ 20 CJK characters. */
  note?: string
}

export interface MoeRouterProps extends SlideBase {
  /** Routed experts drawn as a grid of cells, 8–384. */
  experts: number
  /** Grid columns, default 24. */
  cols?: number
  /** Shared experts every token goes through, 0–2. */
  shared?: number
  /** 1–4 tokens; each is one build step and lights its picks. */
  routes: MoeRoute[]
  /** Caption under the grid, ≤ 30 CJK characters, e.g. '384 个路由专家，每个 token 选 6 个'. */
  caption?: string
}

/** Mixture-of-experts routing: tokens on the left, a router, and a grid of expert cells where each token's top-k light up. */
export function MoeRouter({ kicker, title, lead, source, hint, experts, cols = 24, shared = 0, routes, caption }: MoeRouterProps) {
  const ref = useRef<HTMLDivElement>(null)
  const k = Math.max(0, Math.min(routes.length, useStepCount(ref)) - 1)
  const on = new Set(routes[k]?.picks)
  return (
    <section className="slide">
      <Hint id="moe">{hint}</Hint>
      <div className="frame s-chart" ref={ref}>
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className="moe">
          <ol className="moe__tokens">
            {routes.map((r, i) => (
              <li key={i} className={i === k ? 'is-on' : undefined} data-build={`moe-${i}`} data-step="">
                <b>{r.token}</b>
                {r.note && <span>{r.note}</span>}
              </li>
            ))}
          </ol>
          <div className="moe__router" aria-hidden>
            <span>Router</span>
            <i />
          </div>
          <div className="moe__right">
            {shared > 0 && (
              <div className="moe__shared">
                {Array.from({ length: shared }, (_, i) => (
                  <span key={i}>共享专家</span>
                ))}
              </div>
            )}
            <div className="moe__grid" style={vars({ '--cols': cols })} aria-hidden>
              {Array.from({ length: experts }, (_, i) => (
                <i key={i} className={on.has(i) ? 'is-on' : undefined} />
              ))}
            </div>
            {caption && <p className="moe__cap">{caption}</p>}
          </div>
        </Reveal>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
