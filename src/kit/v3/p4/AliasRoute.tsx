import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from '../../shared'

export interface AliasSource {
  /** API name, ≤ 30 monospace characters. */
  name: string
  /** Status tag, ≤ 6 CJK characters, e.g. '当前' or '旧名'. */
  tag?: string
  /** Mark legacy / retired names: drawn dimmer with a dashed line. */
  legacy?: boolean
}

export interface AliasRouteProps extends SlideBase {
  /** 2–5 names; each is a build step. */
  sources: AliasSource[]
  /** Where they all land. name ≤ 26 monospace characters, note ≤ 40 CJK characters. */
  target: { label: string; name: string; note?: string }
}

/** Several API names or aliases on the left, lines converging on the one model version they are served by. */
export function AliasRoute({ kicker, title, lead, source, hint, sources, target }: AliasRouteProps) {
  const n = sources.length
  return (
    <section className="slide">
      <Hint id="alias">{hint}</Hint>
      <div className="frame s-chart">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className="alias" style={vars({ '--n': n })}>
          <ol className="alias__src">
            {sources.map((s) => (
              <li key={s.name} className={s.legacy ? 'is-legacy' : undefined} data-build={`alias-${s.name}`}>
                <code>{s.name}</code>
                {s.tag && <span>{s.tag}</span>}
              </li>
            ))}
          </ol>
          <svg className="alias__lines" viewBox={`0 0 100 ${n * 100}`} preserveAspectRatio="none" aria-hidden>
            {sources.map((s, i) => (
              <path
                key={s.name}
                className={s.legacy ? 'is-legacy' : undefined}
                data-build={`alias-${s.name}`}
                d={`M0 ${i * 100 + 50} C55 ${i * 100 + 50} 45 ${n * 50} 100 ${n * 50}`}
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>
          <div className="alias__target">
            <p>{target.label}</p>
            <code>{target.name}</code>
            {target.note && <span>{target.note}</span>}
          </div>
        </Reveal>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
