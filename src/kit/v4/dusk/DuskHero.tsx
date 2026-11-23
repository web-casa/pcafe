import { useState } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint } from '../../shared'
import { CodeLines, DUSK_INK, Panel, Widget } from './parts'

export interface DuskTab {
  /** Tab name, ≤ 4 字. */
  label: string
  /** Small grey heading in the widget, ≤ 8 字. */
  head: string
  /** Big number and the words after it, e.g. "24" + "个运行周期". */
  stat: string
  unit: string
  /** 2–5 segments; values are relative. Each label ≤ 4 字. */
  bars: { label: string; value: number }[]
  /** File-style name under the widget, ≤ 18 个字符. */
  file: string
}

export interface DuskHeroProps {
  /** Announcement pill and its link, e.g. ["完成 A 轮融资", "阅读全文"]; ≤ 20 字 + ≤ 4 字. */
  ann?: [string, string?]
  /** 2 lines × ≤ 8 字. */
  title: string[]
  /** ≤ 30 字. */
  lead?: string
  /** Dark button and a light one, each ≤ 6 字. */
  ctas?: [string, string?]
  /** 2–5 tabs on the gradient panel; click one to swap the widget. */
  tabs: DuskTab[]
  /** 6–12 code lines on the right. Start a line with "- " (removed), "+ " (added) or "# " (comment). Each ≤ 34 个字符. */
  code: string[]
  hint?: string
}

/** A developer-tool opening: a centred headline, a sunset gradient panel with tabs that swap a dark widget, and a code diff whose lines arrive one by one. */
export function DuskHero({ ann, title, lead, ctas, tabs, code, hint }: DuskHeroProps) {
  const [on, setOn] = useState(0)
  const t = tabs[on] ?? tabs[0]
  const sum = t.bars.reduce((s, b) => s + b.value, 0) || 1
  return (
    <section className="slide du">
      <Hint id="duskhero">{hint}</Hint>
      <div className="du-hero">
        {ann && (
          <Reveal i={0}>
            <span className="du-ann">
              {ann[0]}
              {ann[1] && <u>{ann[1]}</u>}
            </span>
          </Reveal>
        )}
        <Reveal i={0.4}>
          <h1 className="du-h1">
            {title.slice(0, 2).map((l, i) => (
              <span key={i}>{l}</span>
            ))}
          </h1>
        </Reveal>
        {lead && (
          <Reveal i={0.8}>
            <p className="du-lead">{lead}</p>
          </Reveal>
        )}
        {ctas && (
          <Reveal i={1.1}>
            <div className="du-ctas">
              <span className="du-btn">{ctas[0]} →</span>
              {ctas[1] && <span className="du-btn is-soft">{ctas[1]}</span>}
            </div>
          </Reveal>
        )}
      </div>
      <Reveal i={1.3} className="du-hero__panel">
        <Panel>
          <div className="du-tabs" role="tablist">
            {tabs.slice(0, 5).map((x, i) => (
              <button type="button" role="tab" key={x.label} aria-selected={i === on} className={i === on ? 'is-on' : undefined} onClick={() => setOn(i)}>
                {x.label}
              </button>
            ))}
          </div>
          <Widget name={t.file} className="du-hero__wd" key={on}>
            <div className="du-wd__h">◷ {t.head}</div>
            <div className="du-wd__stat">
              <b>{t.stat}</b> {t.unit}
            </div>
            <div className="du-wd__bars">
              {t.bars.slice(0, 5).map((b, i) => (
                <i key={b.label} style={{ flexGrow: b.value / sum, background: DUSK_INK[i % DUSK_INK.length] }} />
              ))}
            </div>
            <div className="du-legend">
              {t.bars.slice(0, 5).map((b, i) => (
                <span key={b.label} style={{ ['--c' as string]: DUSK_INK[i % DUSK_INK.length] }}>
                  {b.label}
                </span>
              ))}
            </div>
          </Widget>
        </Panel>
      </Reveal>
      <Reveal i={1.6} className="du-hero__code">
        <div className="du-code" data-crop>
          <CodeLines lines={code.slice(0, 12)} delay={1500} />
        </div>
      </Reveal>
    </section>
  )
}
