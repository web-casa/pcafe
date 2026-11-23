import { useState } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint } from '../../shared'
import { TileLine } from './parts'

export interface SlateKpi {
  /** ≤ 6 字. */
  label: string
  /** ≤ 8 个字符. */
  value: string
  /** e.g. "+12.4%", ≤ 7 个字符. */
  delta?: string
  /** 6–12 values (any scale) drawn as bars when this card is picked. */
  series: number[]
}

export interface SlateHeroProps {
  /** Accent tag and the line after it, e.g. ["2.0 版", "更聪明，也更快"]; tag ≤ 6 个字符, line ≤ 12 字. */
  chip?: [string, string]
  /** 2 lines × ≤ 8 字. Put {bolt}, {up}, {spark}, {chart}, {link}, {shield}, {clock} or {check} where an icon tile should sit. */
  title: string[]
  /** ≤ 50 字. */
  lead?: string
  /** Accent button and a text link, each ≤ 8 字. */
  ctas?: [string, string?]
  /** 3–5 customer wordmarks, each ≤ 10 个字符. */
  logos?: string[]
  /** The tilted dashboard on the right. */
  dash: {
    /** 3–5 tab names, each ≤ 4 字. */
    tabs: string[]
    /** Greeting, ≤ 12 字. */
    hello: string
    /** Grey line under it, ≤ 24 字. */
    note?: string
    /** Exactly 3 KPI cards; click one to chart it. */
    kpis: SlateKpi[]
    /** Chart title prefix, ≤ 6 字. Default "趋势". */
    chart?: string
  }
  /** Floating accent chip near the dashboard, ≤ 8 字. */
  float?: string
  hint?: string
}

/** A SaaS opening: a headline with a small icon tile set into it, and a dashboard tilted in 3D whose KPI cards re-draw the chart when clicked. */
export function SlateHero({ chip, title, lead, ctas, logos = [], dash, float, hint }: SlateHeroProps) {
  const [on, setOn] = useState(0)
  const kpis = dash.kpis.slice(0, 3)
  const k = kpis[on]
  const max = Math.max(...k.series)
  const peak = k.series.indexOf(max)
  return (
    <section className="slide sl">
      <Hint id="slatehero">{hint}</Hint>
      <div className="sl-hero">
        {chip && (
          <Reveal i={0} className="sl-chip">
            <b>{chip[0]}</b>
            {chip[1]}
          </Reveal>
        )}
        <Reveal i={1}>
          <h1 className="sl-h1">
            {title.slice(0, 2).map((l, i) => (
              <span key={i}>
                <TileLine text={l} />
              </span>
            ))}
          </h1>
        </Reveal>
        {lead && (
          <Reveal i={2}>
            <p className="sl-lead">{lead}</p>
          </Reveal>
        )}
        {ctas && (
          <Reveal i={3} className="sl-ctas">
            <span className="sl-btn">{ctas[0]} →</span>
            {ctas[1] && <span className="sl-link">{ctas[1]} →</span>}
          </Reveal>
        )}
        {logos.length > 0 && (
          <Reveal i={4} className="sl-logos">
            {logos.slice(0, 5).map((l, i) => (
              <span key={l} className={`is-${i % 4}`}>
                {l}
              </span>
            ))}
          </Reveal>
        )}
      </div>
      <div className="sl-dash" data-crop>
        <div className="sl-dash__tabs">
          {dash.tabs.slice(0, 5).map((t, i) => (
            <span key={t} className={i === 0 ? 'is-on' : ''}>
              {t}
            </span>
          ))}
        </div>
        <div className="sl-dash__hi">
          {dash.hello}
          {dash.note && <small>{dash.note}</small>}
        </div>
        <div className="sl-kpis">
          {kpis.map((x, i) => (
            <button type="button" key={x.label} className={i === on ? 'is-on' : ''} onClick={() => setOn(i)}>
              {x.label}
              <b>{x.value}</b>
              {x.delta && <em>{x.delta}</em>}
            </button>
          ))}
        </div>
        <div className="sl-chart">
          <b>
            {k.label} · {dash.chart ?? '趋势'}
          </b>
          <div className="sl-bars">
            {k.series.slice(0, 12).map((v, i) => (
              <i key={i} className={i === peak ? 'is-on' : ''} style={{ height: `${(v / max) * 100}%`, transitionDelay: `${i * 30}ms` }} />
            ))}
          </div>
        </div>
      </div>
      {float && <span className="sl-float">✦ {float}</span>}
    </section>
  )
}
