import { Numeral, Reveal } from '../../../deck/primitives'
import { Hint, Lines, type Text } from '../../shared'
import { type PhotoImage } from '../../v2/p1/img'

export interface SunriseHeroProps {
  /** Product name in the mock nav, ≤ 10 个字符. */
  brand: string
  /** Mock nav links, up to 4, each ≤ 4 字. */
  links?: string[]
  /** Nav button, ≤ 6 字. */
  navCta?: string
  /** ≤ 2 lines × 12 字. */
  title: Text
  /** ≤ 30 字. */
  lead?: string
  /** Primary and secondary buttons, each ≤ 6 字. */
  ctas?: [string, string?]
  /** Two collaborator cursors floating in the margins, names ≤ 4 字. */
  cursors?: [string, string]
  /** The dashboard rising from the bottom edge. */
  dash: {
    /** Gauge card: label ≤ 8 字, value 0–100. */
    gauge: { label: string; value: number }
    /** Bar chart card: label ≤ 8 字, 6–12 values 0–100. */
    trend: { label: string; values: number[] }
    /** Team card: label ≤ 4 字, up to 5 faces, 2 tasks (title ≤ 8 字, status ≤ 3 字). */
    team: { label: string; faces: PhotoImage[]; tasks: { title: string; status: string }[] }
  }
  hint?: string
}

/** A SaaS launch opening in a sunrise glow: mock nav, centred promise, two teammates' cursors drifting in the margins, and a live dashboard rising from the bottom edge. Made for `sunrise`, works in any style. */
export function SunriseHero({ brand, links = [], navCta, title, lead, ctas, cursors, dash, hint }: SunriseHeroProps) {
  const g = Math.max(0, Math.min(100, dash.gauge.value))
  return (
    <section className="slide sr-hero">
      <Hint id="sunrisehero">{hint}</Hint>
      <div className="sr-sun" aria-hidden="true" />
      <div className="frame sr-hero__frame">
        <Reveal i={0} y={-16} className="sr-nav">
          <span className="sr-logo">
            <i aria-hidden="true">
              <b />
              <b />
              <b />
              <b />
            </i>
            {brand}
          </span>
          <ul>
            {links.slice(0, 4).map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
          {navCta && <b className="sr-nav__cta">{navCta}</b>}
        </Reveal>
        <div className="sr-hero__c">
          <Reveal i={1}>
            <h1 className="sr-title sr-hero__title">
              <Lines text={title} />
            </h1>
          </Reveal>
          {lead && (
            <Reveal i={2}>
              <p className="sr-lead">{lead}</p>
            </Reveal>
          )}
          {ctas && (
            <Reveal i={3} className="sr-ctas">
              <span className="sr-btn is-main">{ctas[0]}</span>
              {ctas[1] && <span className="sr-btn">{ctas[1]}</span>}
            </Reveal>
          )}
        </div>
      </div>
      {cursors && (
        <>
          <span className="sr-cur is-a" aria-hidden="true">
            <i />
            <span>{cursors[0]}</span>
          </span>
          <span className="sr-cur is-b" aria-hidden="true">
            <i />
            <span>{cursors[1]}</span>
          </span>
        </>
      )}
      <div className="sr-dash" data-crop>
        <div className="sr-w">
          <small>{dash.gauge.label}</small>
          <b>
            <Numeral text={`${g}%`} delay={1.1} />
          </b>
          <svg className="sr-gauge" viewBox="0 0 200 104" aria-hidden="true">
            <path d="M14 100 A86 86 0 0 1 186 100" pathLength={100} />
            <path d="M14 100 A86 86 0 0 1 186 100" pathLength={100} style={{ strokeDasharray: `${g} 100` }} />
          </svg>
        </div>
        <div className="sr-w">
          <small>{dash.trend.label}</small>
          <div className="sr-bars">
            {dash.trend.values.slice(0, 12).map((v, i) => (
              <i key={i} style={{ height: `${Math.max(6, Math.min(100, v))}%`, animationDelay: `${1 + i * 0.06}s` }} />
            ))}
          </div>
        </div>
        <div className="sr-w">
          <small>{dash.team.label}</small>
          <div className="sr-faces">
            {dash.team.faces.slice(0, 5).map((f, i) => (
              <img key={i} src={f.src} alt={f.alt} />
            ))}
          </div>
          {dash.team.tasks.slice(0, 2).map((t) => (
            <div key={t.title} className="sr-task">
              {t.title}
              <em>{t.status}</em>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
